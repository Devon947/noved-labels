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
    YEARLY_FEE: 999.00, // $999 for yearly (equivalent to 10 months - 2 months free)
    YEARLY_SAVINGS: 198.00, // $198 saved compared to monthly
    YEARLY_SAVINGS_PERCENTAGE: 16.7, // Approximately 16.7% savings
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
 * @param {string} billingCycle - 'monthly' or 'yearly'
 * @returns {Object} - Cost comparison between plans
 */
export function calculatePlanComparison(estimatedMonthlyLabels, averageBaseRate = 8.00, billingCycle = 'monthly') {
  const standardTotal = (parseFloat(averageBaseRate) + PRICING.STANDARD.MARKUP_PER_LABEL) * estimatedMonthlyLabels;
  
  // Calculate premium cost based on billing cycle
  let premiumFee;
  if (billingCycle === 'yearly') {
    // For yearly billing, we prorate the yearly fee to a monthly equivalent
    premiumFee = PRICING.PREMIUM.YEARLY_FEE / 12;
  } else {
    premiumFee = PRICING.PREMIUM.MONTHLY_FEE;
  }
  
  const premiumTotal = (parseFloat(averageBaseRate) + PRICING.PREMIUM.MARKUP_PER_LABEL) * estimatedMonthlyLabels + premiumFee;
  
  const savings = standardTotal - premiumTotal;
  const breakEvenPoint = Math.ceil(premiumFee / (PRICING.STANDARD.MARKUP_PER_LABEL - PRICING.PREMIUM.MARKUP_PER_LABEL));
  
  let yearlyTotal, yearlySavings;
  if (billingCycle === 'monthly') {
    // Calculate what yearly would cost for comparison
    const yearlyPremiumFee = PRICING.PREMIUM.YEARLY_FEE / 12; // Monthly equivalent
    yearlyTotal = (parseFloat(averageBaseRate) + PRICING.PREMIUM.MARKUP_PER_LABEL) * estimatedMonthlyLabels + yearlyPremiumFee;
    yearlySavings = premiumTotal - yearlyTotal;
  }
  
  return {
    standardCost: standardTotal.toFixed(2),
    premiumCost: premiumTotal.toFixed(2),
    savings: savings.toFixed(2),
    isSavingWithPremium: savings > 0,
    breakEvenPoint,
    estimatedMonthlyLabels,
    averageBaseRate: parseFloat(averageBaseRate).toFixed(2),
    billingCycle,
    yearlyTotal: yearlyTotal ? yearlyTotal.toFixed(2) : undefined,
    yearlySavings: yearlySavings ? yearlySavings.toFixed(2) : undefined,
    isYearly: billingCycle === 'yearly'
  };
}

/**
 * Calculate yearly vs monthly cost comparison for premium plan
 * 
 * @returns {Object} - Cost comparison between billing cycles
 */
export function calculateBillingCycleComparison() {
  const monthlyAnnualCost = PRICING.PREMIUM.MONTHLY_FEE * 12;
  const yearlyCost = PRICING.PREMIUM.YEARLY_FEE;
  const savings = monthlyAnnualCost - yearlyCost;
  const savingsPercentage = (savings / monthlyAnnualCost) * 100;
  
  return {
    monthlyFee: PRICING.PREMIUM.MONTHLY_FEE.toFixed(2),
    yearlyFee: PRICING.PREMIUM.YEARLY_FEE.toFixed(2),
    monthlyAnnualCost: monthlyAnnualCost.toFixed(2),
    savings: savings.toFixed(2),
    savingsPercentage: savingsPercentage.toFixed(1),
    freeMonths: Math.round(savings / PRICING.PREMIUM.MONTHLY_FEE)
  };
}