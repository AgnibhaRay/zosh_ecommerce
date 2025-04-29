import { CartItem } from "../types/cartTypes"

export const sumCartItemSellingPrice=(items:CartItem[]):number=>{
    return items.reduce((acc, item)=>{
        if (!item) return acc;
        const quantity = item.quantity || 1;
        return acc + (item.sellingPrice * quantity);
    }, 0)
}

export const sumCartItemMrpPrice=(items:CartItem[]):number=>{
    return items.reduce((acc, item)=>{
        if (!item) return acc;
        const quantity = item.quantity || 1;
        return acc + (item.mrpPrice * quantity);
    }, 0)
}

// Conversion rate: 1 USD = 83 INR (approximately)
const INR_TO_USD_RATE = 1/83;

export const convertINRtoUSD = (amountInINR: number): number => {
    if (typeof amountInINR !== 'number' || isNaN(amountInINR)) {
        return 0;
    }
    // Round to 2 decimal places for proper currency representation
    return Number((amountInINR * INR_TO_USD_RATE).toFixed(2));
}

export const formatUSD = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
}