export const convertINRtoUSD = (amountInINR: number): number => {
    // Using a fixed exchange rate of 1 USD = 83.23 INR (as of current date)
    const exchangeRate = 83.23;
    return Math.round((amountInINR / exchangeRate) * 100) / 100;
};