package com.zosh.controller;

import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.zosh.domain.PaymentMethod;
import com.zosh.exception.OrderException;
import com.zosh.exception.SellerException;
import com.zosh.exception.UserException;
import com.zosh.model.*;
import com.zosh.repository.PaymentOrderRepository;
import com.zosh.response.PaymentLinkResponse;
import com.zosh.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
	
	private final OrderService orderService;
	private final UserService userService;
	private final OrderItemService orderItemService;
	private final CartService cartService;
	private final PaymentService paymentService;
	private final PaymentOrderRepository paymentOrderRepository;
	private final SellerReportService sellerReportService;
	private final SellerService sellerService;

	
	@PostMapping()
	public ResponseEntity<PaymentLinkResponse> createOrderHandler(
	        @RequestBody Address shippingAddress,
	        @RequestParam PaymentMethod paymentMethod,
	        @RequestHeader("Authorization") String jwt)
	        throws UserException, RazorpayException, StripeException {
	    try {
	        User user = userService.findUserProfileByJwt(jwt);
	        Cart cart = cartService.findUserCart(user);
	        
	        // Validate cart is not empty
	        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
	            throw new UserException("Cart is empty");
	        }

	        // Create orders
	        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);
	        
	        // Calculate total amount including shipping
	        double cartTotal = cart.getTotalSellingPrice();
	        Long totalAmount = Math.round(cartTotal);
	        if (totalAmount < 1500) {
	            totalAmount += 79; // Add shipping if applicable
	        }

	        // Account for any coupon discounts
	        if (cart.getCouponPrice() > 0) {
	            totalAmount -= cart.getCouponPrice();
	        }

	        // Create payment order
	        PaymentOrder paymentOrder = paymentService.createOrder(user, orders);
	        paymentOrder.setAmount(totalAmount);
	        paymentOrder.setPaymentMethod(paymentMethod);
	        paymentOrderRepository.save(paymentOrder);

	        PaymentLinkResponse res = new PaymentLinkResponse();

	        try {
	            if (paymentMethod == PaymentMethod.RAZORPAY) {
	                PaymentLink payment = paymentService.createRazorpayPaymentLink(user, totalAmount, paymentOrder.getId());
	                res.setPayment_link_url(payment.get("short_url"));
	                paymentOrder.setPaymentLinkId(payment.get("id"));
	                paymentOrderRepository.save(paymentOrder);
	            } else if (paymentMethod == PaymentMethod.STRIPE) {
	                String paymentUrl = paymentService.createStripePaymentLink(user, totalAmount, paymentOrder.getId());
	                res.setPayment_link_url(paymentUrl);
	            } else {
	                throw new UserException("Invalid payment method");
	            }
	        } catch (Exception e) {
	            // Cleanup orders on payment creation failure
	            orderService.deleteOrder(paymentOrder.getId());
	            throw e;
	        }

	        return new ResponseEntity<>(res, HttpStatus.OK);
	    } catch (UserException | RazorpayException | StripeException e) {
	        throw e;
	    } catch (Exception e) {
	        throw new UserException("Failed to create order: " + e.getMessage());
	    }
	}
	
	@GetMapping("/user")
	public ResponseEntity<List<Order>> usersOrderHistoryHandler(
	        @RequestHeader("Authorization") String jwt) throws UserException {
	    User user = userService.findUserProfileByJwt(jwt);
	    List<Order> orders = orderService.usersOrderHistory(user.getId());
	    return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity<Order> getOrderById(
	        @PathVariable Long orderId,
	        @RequestHeader("Authorization") String jwt) throws OrderException, UserException {
	    // Validate user has access to this order
	    userService.findUserProfileByJwt(jwt);
	    Order order = orderService.findOrderById(orderId);
	    return new ResponseEntity<>(order, HttpStatus.ACCEPTED);
	}

	@GetMapping("/item/{orderItemId}")
	public ResponseEntity<OrderItem> getOrderItemById(
			@PathVariable Long orderItemId, @RequestHeader("Authorization")
	String jwt) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);
		OrderItem orderItem = orderItemService.getOrderItemById(orderItemId);
		
		// Validate that the order item belongs to the user
		if (!orderItem.getOrder().getUser().getId().equals(user.getId())) {
			throw new OrderException("Order item does not belong to the user");
		}
		
		return new ResponseEntity<>(orderItem, HttpStatus.ACCEPTED);
	}

	@PutMapping("/{orderId}/cancel")
	public ResponseEntity<Order> cancelOrder(
			@PathVariable Long orderId,
			@RequestHeader("Authorization") String jwt
	) throws UserException, OrderException, SellerException {
		User user=userService.findUserProfileByJwt(jwt);
		Order order=orderService.cancelOrder(orderId,user);

		Seller seller= sellerService.getSellerById(order.getSellerId());
		SellerReport report=sellerReportService.getSellerReport(seller);

		report.setCanceledOrders(report.getCanceledOrders()+1);
		report.setTotalRefunds(report.getTotalRefunds()+order.getTotalSellingPrice());
		sellerReportService.updateSellerReport(report);

		return ResponseEntity.ok(order);
	}

}
