import { Divider } from "@mui/material";
import React from "react";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import { convertINRtoUSD, formatUSD } from "../../../util/cartCalculator";

const PricingCard = () => {
  const { cart } = useAppSelector((store) => store);
  
  const subtotal = cart.cart?.totalMrpPrice || 0;
  const discountedPrice = cart.cart?.totalSellingPrice || 0;
  const discount = subtotal - discountedPrice;
  
  const isShippingFree = discountedPrice >= 1500;
  const shippingCharge = isShippingFree ? 0 : 79;
  const total = discountedPrice + shippingCharge;

  // Convert amounts to USD
  const subtotalUSD = convertINRtoUSD(subtotal);
  const discountUSD = convertINRtoUSD(discount);
  const shippingChargeUSD = convertINRtoUSD(shippingCharge);
  const totalUSD = convertINRtoUSD(total);

  return (
    <div className="space-y-3 p-5 bg-white rounded-md">
      <div className="flex justify-between items-center">
        <span>Subtotal (MRP)</span>
        <div className="text-right">
          <div>₹{subtotal.toFixed(2)}</div>
          <div className="text-sm text-gray-500">{formatUSD(subtotalUSD)}</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span>Discount</span>
        <div className="text-right">
          <div className="text-green-600">- ₹{discount.toFixed(2)}</div>
          <div className="text-sm text-green-500">- {formatUSD(discountUSD)}</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span>Shipping</span>
        <div className="text-right">
          {isShippingFree ? (
            <span className="text-green-600">Free</span>
          ) : (
            <>
              <div>₹{shippingCharge.toFixed(2)}</div>
              <div className="text-sm text-gray-500">{formatUSD(shippingChargeUSD)}</div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span>Platform fee</span>
        <span className="text-green-600">Free</span>
      </div>
      <Divider />
      <div className="font-medium px-5 py-2 flex justify-between items-center">
        <span>Total Amount</span>
        <div className="text-right">
          <div>₹{total.toFixed(2)}</div>
          <div className="text-sm text-gray-500">{formatUSD(totalUSD)}</div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
