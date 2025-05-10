'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, CreditCard, Sparkles, Shield, Package, Calculator, Info, CalculatorIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import LoginCheck from '../components/LoginCheck';
import { shippingHistoryService } from '@/app/services/ShippingHistoryService';
import { PRICING, calculatePlanComparison } from '@/lib/pricing';

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userPlan, setUserPlan] = useState('STANDARD');
  const [planComparison, setPlanComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [labelCount, setLabelCount] = useState(30);
  const [averageRate, setAverageRate] = useState(8.00);
  const [calculatedComparison, setCalculatedComparison] = useState(null);
  
  useEffect(() => {
    async function loadUserData() {
      try {
        // Load user plan
        const plan = await shippingHistoryService.getUserPlan();
        setUserPlan(plan);
        
        // Calculate plan comparison
        const comparison = calculatePlanComparison(30, 8.00);
        setPlanComparison(comparison);
        setCalculatedComparison(comparison);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
    
    // Check for checkout status from query params
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      const plan = searchParams.get('plan');
      if (plan) {
        // Update the local state
        setUserPlan(plan);
        
        // Show success message
        alert(`Successfully upgraded to ${plan} plan!`);
        
        // Remove the query params
        router.replace('/pricing');
      }
    } else if (checkoutStatus === 'cancelled') {
      alert('Checkout was cancelled. Your subscription was not activated.');
      
      // Remove the query params
      router.replace('/pricing');
    }
  }, [searchParams]);

  // Calculate comparison when volume or rate changes
  useEffect(() => {
    const newComparison = calculatePlanComparison(labelCount, averageRate);
    setCalculatedComparison(newComparison);
  }, [labelCount, averageRate]);
  
  const handleUpgrade = async () => {
    try {
      // Start the checkout process
      setLoading(true);
      
      // Call the Stripe checkout endpoint
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: 'PREMIUM',
          origin: window.location.origin,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };
  
  const handleDowngrade = async () => {
    try {
      // For downgrading, we just update the plan without payment
      setLoading(true);
      
      // Update the user's plan
      await shippingHistoryService.savePlan('STANDARD');
      setUserPlan('STANDARD');
      
      // Show success message
      alert('Successfully downgraded to Standard plan!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error downgrading plan:', error);
      alert('Failed to downgrade plan. Please try again.');
      setLoading(false);
    }
  };
  
  const handleSliderChange = (value) => {
    setLabelCount(value[0]);
  };
  
  const handleLabelInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLabelCount(value);
    }
  };
  
  const handleRateInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setAverageRate(value);
    }
  };

  return (
    <LoginCheck>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Shipping Label Pricing
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your shipping needs. Save money as your volume increases.
            </p>
          </div>
          
          {/* Usage Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <div className="flex items-center mb-6">
              <CalculatorIcon className="h-6 w-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Savings Calculator</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Monthly Shipping Labels</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-grow">
                      <Slider 
                        value={[labelCount]} 
                        min={1} 
                        max={300}
                        step={1}
                        onValueChange={handleSliderChange}
                        className="my-4"
                      />
                    </div>
                    <div className="w-20">
                      <Input 
                        type="number" 
                        value={labelCount} 
                        onChange={handleLabelInputChange}
                        min={1}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Average Base Shipping Rate ($)</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-grow">
                      <Slider 
                        value={[averageRate]} 
                        min={1} 
                        max={50}
                        step={0.50}
                        onValueChange={(value) => setAverageRate(value[0])}
                        className="my-4"
                      />
                    </div>
                    <div className="w-20">
                      <Input 
                        type="number" 
                        value={averageRate} 
                        onChange={handleRateInputChange}
                        min={1}
                        step={0.01}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Monthly Cost Comparison</h3>
                
                {calculatedComparison && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Standard Plan</span>
                          <span className="text-white font-medium">${calculatedComparison.standardCost}</span>
                        </div>
                        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, (parseFloat(calculatedComparison.standardCost) / Math.max(parseFloat(calculatedComparison.standardCost), parseFloat(calculatedComparison.premiumCost))) * 100)}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Premium Plan</span>
                          <span className="text-white font-medium">${calculatedComparison.premiumCost}</span>
                        </div>
                        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full" style={{ width: `${Math.min(100, (parseFloat(calculatedComparison.premiumCost) / Math.max(parseFloat(calculatedComparison.standardCost), parseFloat(calculatedComparison.premiumCost))) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      {calculatedComparison.isSavingWithPremium ? (
                        <div className="text-center">
                          <p className="text-gray-300 mb-2">You could save with Premium:</p>
                          <p className="text-3xl font-bold text-green-400">${calculatedComparison.savings}</p>
                          <p className="text-sm text-gray-400 mt-1">per month</p>
                          
                          {userPlan !== 'PREMIUM' && (
                            <Button 
                              onClick={handleUpgrade}
                              className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                            >
                              Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-300 mb-2">Recommended plan:</p>
                          <p className="text-2xl font-bold text-blue-400">Standard Plan</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Premium becomes cost-effective at {calculatedComparison.breakEvenPoint}+ labels/month
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700 text-sm text-gray-400 flex items-start">
              <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>
                This calculator helps you determine which plan is most cost-effective based on your shipping volume. 
                Premium plan includes additional features like bulk shipping, priority support, and API access.
              </p>
            </div>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <motion.div 
              className={`w-full lg:w-1/2 rounded-xl border ${
                userPlan === 'STANDARD' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 bg-gray-800/50'
              } overflow-hidden`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Standard</h2>
                    <p className="text-gray-300 mt-1">Pay only for what you use</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-400">Label Fee</p>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-white">${PRICING.STANDARD.MARKUP_PER_LABEL.toFixed(2)}</span>
                    <span className="text-gray-400 ml-2 mb-1">per label</span>
                  </div>
                  <p className="text-gray-400 mt-1">Plus carrier rates</p>
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-400">Monthly Fee</p>
                  <p className="text-2xl font-bold text-white">${PRICING.STANDARD.MONTHLY_FEE.toFixed(2)}</p>
                </div>
                
                <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    <strong>Note:</strong> Limited to 100 labels per month
                  </p>
                </div>
                
                <div className="mt-8">
                  {userPlan === 'STANDARD' ? (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleDowngrade}
                    >
                      Switch to Standard
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-700 p-6">
                <h3 className="font-semibold text-white mb-4">Included Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Multi-carrier shipping options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Address validation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Tracking notifications</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">Bulk label generation</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">Priority support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Premium Plan */}
            <motion.div 
              className={`w-full lg:w-1/2 rounded-xl border ${
                userPlan === 'PREMIUM' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-gray-700 bg-gray-800/50'
              } overflow-hidden`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {planComparison && planComparison.isSavingWithPremium && userPlan !== 'PREMIUM' && (
                <div className="bg-purple-700 text-white text-center py-2 font-medium">
                  <Sparkles className="h-4 w-4 inline mr-1" /> Save ${planComparison.savings} per month
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Premium</h2>
                    <p className="text-gray-300 mt-1">Best for high-volume shippers</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-400">Label Fee</p>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-white">${PRICING.PREMIUM.MARKUP_PER_LABEL.toFixed(2)}</span>
                    <span className="text-gray-400 ml-2 mb-1">per label</span>
                  </div>
                  <p className="text-gray-400 mt-1">Plus carrier rates</p>
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-400">Monthly Fee</p>
                  <p className="text-2xl font-bold text-white">${PRICING.PREMIUM.MONTHLY_FEE.toFixed(2)}</p>
                </div>
                
                <div className="mt-6 p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
                  <p className="text-purple-300 text-sm">
                    <strong>Upgrade:</strong> Unlimited labels per month
                  </p>
                </div>
                
                <div className="mt-8">
                  {userPlan === 'PREMIUM' ? (
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={handleUpgrade}
                    >
                      Upgrade to Premium <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-700 p-6">
                <h3 className="font-semibold text-white mb-4">Included Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Everything in Standard plan</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Save $1.00 on every label</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Bulk label generation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">API access</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
          {/* Break-even Calculation */}
          <motion.div
            className="mt-16 max-w-5xl mx-auto bg-gray-800/50 rounded-xl border border-gray-700 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">When does Premium make sense?</h2>
            <p className="text-gray-300 mb-6">
              Premium subscription pays for itself when you ship more than {PRICING.PREMIUM.BREAK_EVEN_LABELS} labels per month.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">10 labels per month</h3>
                <p className="text-gray-400">Standard: ${(10 * PRICING.STANDARD.MARKUP_PER_LABEL).toFixed(2)}</p>
                <p className="text-gray-400">Premium: ${(10 * PRICING.PREMIUM.MARKUP_PER_LABEL + PRICING.PREMIUM.MONTHLY_FEE).toFixed(2)}</p>
                <p className="text-red-400 mt-2 font-medium">Stay with Standard</p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">50 labels per month</h3>
                <p className="text-gray-400">Standard: ${(50 * PRICING.STANDARD.MARKUP_PER_LABEL).toFixed(2)}</p>
                <p className="text-gray-400">Premium: ${(50 * PRICING.PREMIUM.MARKUP_PER_LABEL + PRICING.PREMIUM.MONTHLY_FEE).toFixed(2)}</p>
                <p className="text-red-400 mt-2 font-medium">Stay with Standard</p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{PRICING.PREMIUM.BREAK_EVEN_LABELS}+ labels per month</h3>
                <p className="text-gray-400">Standard: ${(PRICING.PREMIUM.BREAK_EVEN_LABELS * PRICING.STANDARD.MARKUP_PER_LABEL).toFixed(2)}</p>
                <p className="text-gray-400">Premium: ${(PRICING.PREMIUM.BREAK_EVEN_LABELS * PRICING.PREMIUM.MARKUP_PER_LABEL + PRICING.PREMIUM.MONTHLY_FEE).toFixed(2)}</p>
                <p className="text-green-400 mt-2 font-medium">Upgrade to Premium</p>
              </div>
            </div>
          </motion.div>
          
          {/* FAQ Section */}
          <motion.div
            className="mt-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I change plans at any time?</h3>
                <p className="text-gray-300">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a contract for the Premium plan?</h3>
                <p className="text-gray-300">
                  No, both plans are month-to-month with no long-term commitment. Cancel anytime.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-300">
                  We accept all major credit cards including Visa, Mastercard, American Express, and Discover.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Do carrier fees change with plans?</h3>
                <p className="text-gray-300">
                  No, carrier rates remain the same across all plans. Only our service fee changes.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a limit to how many labels I can create?</h3>
                <p className="text-gray-300">
                  Yes, the Standard plan is limited to 100 labels per month. The Premium plan offers unlimited label generation.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How does the billing work?</h3>
                <p className="text-gray-300">
                  You deposit funds to your account balance. Each time you generate a label, the fee is deducted automatically. Premium subscribers are also billed the monthly subscription fee.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How much can I save compared to retail shipping rates?</h3>
                <p className="text-gray-300">
                  Our users typically save 20-40% compared to retail shipping rates, depending on the carrier and destination. Your actual savings are displayed on your dashboard.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </LoginCheck>
  );
} 