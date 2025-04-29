import { Divider } from "@mui/material";
import React from "react";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../util/cartCalculator";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const PricingCard = () => {
  const { cart } = useAppSelector((store) => store);
  
  const cartItems = cart.cart?.cartItems || [];
  const subtotal = sumCartItemMrpPrice(cartItems);
  const discountedPrice = sumCartItemSellingPrice(cartItems);
  const discount = subtotal - discountedPrice;
  
  const isShippingFree = discountedPrice >= 1500;
  const shippingCharge = isShippingFree ? 0 : 79;
  const total = discountedPrice + shippingCharge;

  return (
    <div>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center">
          <span>Subtotal (MRP)</span>
          <span>₹ {subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span className="text-green-600">- ₹ {discount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>{isShippingFree ? (
            <span className="text-green-600">Free</span>
          ) : (
            `₹ ${shippingCharge}`
          )}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Platform fee</span>
          <span className="text-green-600">Free</span>
        </div>
      </div>
      <Divider />

      <div className="font-medium px-5 py-2 flex justify-between items-center">
        <span>Total Amount</span>
        <span>₹ {total}</span>
      </div>
    </div>
  );
};

export default PricingCard;
