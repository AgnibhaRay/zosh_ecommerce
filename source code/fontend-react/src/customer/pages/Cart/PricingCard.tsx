import { Divider } from "@mui/material";
import React from "react";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../util/cartCalculator";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const PricingCard = () => {
  const { cart } = useAppSelector((store) => store);
  
  const isShippingFree = (cart.cart?.totalSellingPrice || 0) >= 1500;
  const shippingCharge = isShippingFree ? 0 : 79;
  const total = (cart.cart?.totalSellingPrice || 0) + shippingCharge;

  return (
    <div>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>₹ {cart.cart?.totalSellingPrice || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span>
            ₹{" "}
            {sumCartItemMrpPrice(cart.cart?.cartItems || []) -
              sumCartItemSellingPrice(cart.cart?.cartItems || [])}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>{isShippingFree ? 'Free' : `₹ ${shippingCharge}`}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Platform fee</span>
          <span className="text-teal-600">Free</span>
        </div>
      </div>
      <Divider />

      <div className="font-medium px-5 py-2 flex justify-between items-center">
        <span>Total</span>
        <span>₹ {total}</span>
      </div>
    </div>
  );
};

export default PricingCard;
