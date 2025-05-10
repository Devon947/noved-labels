// Pricing calculation for shipping labels

/**
 * Pricing constants
 */
export const PRICING = {
  STANDARD: {
    MARKUP_PER_LABEL: 4.00,
    MONTHLY_FEE: 0,
    NAME: 'Standard'
  },
  PREMIUM: {
    MARKUP_PER_LABEL: 3.00,
    MONTHLY_FEE: 99.00,
    NAME: 'Premium',
    BREAK_EVEN_LABELS: 100 // Number of labels where Premium becomes cheaper
  }
};

/**
 * Calculate the total price for a shipping label
 * Includes base shipping cost plus our markup
 * 
 * @param {number} baseRate - The base shipping rate from provider (in USD)
 * @param {string} plan - 'STANDARD' or 'PREMIUM' 
 * @returns {Object} - Contains total price and breakdown
 */
export function calculateLabelPrice(baseRate, plan = 'STANDARD') {
  // Get the pricing for the selected plan
  const pricing = PRICING[plan];
  if (!pricing) {
    throw new Error(`Invalid pricing plan: ${plan}`);
  }
  
  // Calculate total price
  const totalPrice = parseFloat(baseRate) + pricing.MARKUP_PER_LABEL;
  
  return {
    baseRate: parseFloat(baseRate).toFixed(2),
    markup: pricing.MARKUP_PER_LABEL.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    currency: 'USD',
    plan: pricing.NAME
  };
}

/**
 * Calculate bulk pricing with potential discounts
 * 
 * @param {number} baseRate - The base shipping rate from provider
 * @param {number} quantity - Number of labels
 * @param {string} plan - 'STANDARD' or 'PREMIUM'
 * @returns {Object} - Contains total price and breakdown
 */
export function calculateBulkPrice(baseRate, quantity, plan = 'STANDARD') {
  // Get the pricing for the selected plan
  const pricing = PRICING[plan];
  if (!pricing) {
    throw new Error(`Invalid pricing plan: ${plan}`);
  }
  
  // Apply discount based on volume (only for standard plan)
  let discountRate = 0;
  if (plan === 'STANDARD') {
    if (quantity >= 50) {
      discountRate = 0.15; // 15% discount for 50+ labels
    } else if (quantity >= 25) {
      discountRate = 0.10; // 10% discount for 25+ labels
    } else if (quantity >= 10) {
      discountRate = 0.05; // 5% discount for 10+ labels
    }
  }
  
  const baseTotal = parseFloat(baseRate) * quantity;
  const markupTotal = pricing.MARKUP_PER_LABEL * quantity;
  const discountAmount = (baseTotal + markupTotal) * discountRate;
  const totalPrice = baseTotal + markupTotal - discountAmount;
  
  // Calculate comparison with other plan
  const otherPlan = plan === 'STANDARD' ? 'PREMIUM' : 'STANDARD';
  const otherPricing = PRICING[otherPlan];
  const otherPlanTotal = (parseFloat(baseRate) * quantity) + (otherPricing.MARKUP_PER_LABEL * quantity);
  const premiumMonthlyFee = PRICING.PREMIUM.MONTHLY_FEE;
  const potentialSavings = plan === 'STANDARD' && quantity > PRICING.PREMIUM.BREAK_EVEN_LABELS ? 
    (totalPrice - (otherPlanTotal + premiumMonthlyFee)).toFixed(2) : 0;
  
  return {
    baseRate: parseFloat(baseRate).toFixed(2),
    quantity,
    baseTotal: baseTotal.toFixed(2),
    markup: pricing.MARKUP_PER_LABEL.toFixed(2),
    markupTotal: markupTotal.toFixed(2),
    discountRate: `${(discountRate * 100).toFixed(0)}%`,
    discountAmount: discountAmount.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    pricePerLabel: (totalPrice / quantity).toFixed(2),
    currency: 'USD',
    plan: pricing.NAME,
    comparisonPlan: otherPlan,
    potentialSavings
  };
}

/**
 * Calculate monthly cost comparison between standard and premium plans
 * 
 * @param {number} estimatedMonthlyLabels - Estimated number of labels per month
 * @param {number} averageBaseRate - Average base shipping rate
 * @returns {Object} - Cost comparison between plans
 */
export function calculatePlanComparison(estimatedMonthlyLabels, averageBaseRate = 8.00) {
  const standardTotal = (parseFloat(averageBaseRate) + PRICING.STANDARD.MARKUP_PER_LABEL) * estimatedMonthlyLabels;
  const premiumTotal = (parseFloat(averageBaseRate) + PRICING.PREMIUM.MARKUP_PER_LABEL) * estimatedMonthlyLabels + PRICING.PREMIUM.MONTHLY_FEE;
  
  const savings = standardTotal - premiumTotal;
  const breakEvenPoint = Math.ceil(PRICING.PREMIUM.MONTHLY_FEE / (PRICING.STANDARD.MARKUP_PER_LABEL - PRICING.PREMIUM.MARKUP_PER_LABEL));
  
  return {
    standardCost: standardTotal.toFixed(2),
    premiumCost: premiumTotal.toFixed(2),
    savings: savings.toFixed(2),
    isSavingWithPremium: savings > 0,
    breakEvenPoint,
    estimatedMonthlyLabels,
    averageBaseRate: parseFloat(averageBaseRate).toFixed(2)
  };
}