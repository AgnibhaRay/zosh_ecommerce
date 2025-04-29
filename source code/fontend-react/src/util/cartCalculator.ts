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