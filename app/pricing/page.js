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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import analytics from '@/lib/analytics';

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userPlan, setUserPlan] = useState('STANDARD');
  const [planComparison, setPlanComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [labelCount, setLabelCount] = useState(30);
  const [averageRate, setAverageRate] = useState(8.00);
  const [calculatedComparison, setCalculatedComparison] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  // Track page view when component mounts
  useEffect(() => {
    // Track pricing page view
    analytics.trackPageView('/pricing', {
      title: 'Pricing Page',
      userPlan
    });
    
    // Track pricing page as a conversion funnel step
    analytics.trackConversion('view_pricing', {
      currentPlan: userPlan
    });
  }, [userPlan]);
  
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
      const cycle = searchParams.get('cycle');
      if (plan) {
        // Update the local state
        setUserPlan(plan);
        
        // Track successful subscription
        analytics.trackConversion('complete_subscription', {
          plan,
          billingCycle: cycle || 'monthly',
          value: plan === 'PREMIUM' ? 
            (cycle === 'yearly' ? PRICING.PREMIUM.YEARLY_FEE : PRICING.PREMIUM.MONTHLY_FEE) : 0,
          isNewSubscription: true
        });
        
        // Show success message
        alert(`Successfully upgraded to ${plan} plan with ${cycle || 'monthly'} billing!`);
        
        // Remove the query params
        router.replace('/pricing');
      }
    } else if (checkoutStatus === 'cancelled') {
      // Track cancelled checkout
      analytics.trackEvent('subscription', 'cancel_checkout', 'Abandoned Cart');
      
      alert('Checkout was cancelled. Your subscription was not activated.');
      
      // Remove the query params
      router.replace('/pricing');
    }
  }, [searchParams]);

  // Calculate comparison when volume or rate changes
  useEffect(() => {
    const newComparison = calculatePlanComparison(labelCount, averageRate, billingCycle);
    setCalculatedComparison(newComparison);
  }, [labelCount, averageRate, billingCycle]);
  
  const handleUpgrade = async () => {
    try {
      // Track upgrade attempt
      analytics.trackConversion('start_checkout', {
        from: userPlan,
        to: 'PREMIUM',
        billingCycle,
        estimatedValue: billingCycle === 'yearly' ? PRICING.PREMIUM.YEARLY_FEE : PRICING.PREMIUM.MONTHLY_FEE
      });
      
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
          billingCycle: billingCycle,
          origin: window.location.origin,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Track successful redirect to checkout
        analytics.trackEvent('subscription', 'redirect_to_checkout', 'Premium Plan', {
          billingCycle
        });
        
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      // Track checkout error
      analytics.trackEvent('subscription', 'checkout_error', error.message);
      
      console.error('Error upgrading plan:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };
  
  const handleDowngrade = async () => {
    try {
      // Track downgrade attempt
      analytics.trackConversion('downgrade_plan', {
        from: userPlan,
        to: 'STANDARD'
      });
      
      // For downgrading, we just update the plan without payment
      setLoading(true);
      
      // Update the user's plan
      await shippingHistoryService.savePlan('STANDARD');
      setUserPlan('STANDARD');
      
      // Track successful downgrade
      analytics.trackEvent('subscription', 'plan_changed', 'Downgraded to Standard');
      
      // Show success message
      alert('Successfully downgraded to Standard plan!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      // Track downgrade error
      analytics.trackEvent('subscription', 'downgrade_error', error.message);
      
      console.error('Error downgrading plan:', error);
      alert('Failed to downgrade plan. Please try again.');
      setLoading(false);
    }
  };
  
  const handleSliderChange = (value) => {
    setLabelCount(value[0]);
    
    // Track calculator usage after a small delay to avoid excessive events
    if (value[0] % 10 === 0) { // Only track when moving by increments of 10
      analytics.trackEvent('calculator', 'adjust_labels', 'Savings Calculator', {
        labelCount: value[0]
      });
    }
  };
  
  const handleLabelInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLabelCount(value);
      
      // Track manual entry
      analytics.trackEvent('calculator', 'manual_labels_entry', 'Savings Calculator', {
        labelCount: value
      });
    }
  };
  
  const handleRateInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setAverageRate(value);
      
      // Track manual entry
      analytics.trackEvent('calculator', 'manual_rate_entry', 'Savings Calculator', {
        averageRate: value
      });
    }
  };
  
  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
    
    // Track billing cycle selection
    analytics.trackEvent('subscription', 'select_billing_cycle', cycle, {
      previousCycle: billingCycle
    });
  };

  // Calculate yearly price with 2 months free
  const yearlyPrice = PRICING.PREMIUM.MONTHLY_FEE * 10; // 12 months - 2 months free = 10 months

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
              
              <div className="bg-gray-700/50 rounded-lg p-6">
                {loading ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-28 bg-gray-600 rounded mb-4"></div>
                    <div className="h-4 w-40 bg-gray-600 rounded"></div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-4">Cost Comparison</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Standard Plan</p>
                        <p className="text-xl font-bold text-white">${calculatedComparison.standardCost}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      
                      <div className="bg-gray-800 p-3 rounded-lg relative">
                        <p className="text-sm text-gray-400">Premium Plan</p>
                        <p className="text-xl font-bold text-white">${calculatedComparison.premiumCost}</p>
                        <p className="text-xs text-gray-500">per month</p>
                        
                        {calculatedComparison.isSavingWithPremium && (
                          <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">Better Value</Badge>
                        )}
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
                
                <div className="mt-4">
                  <Tabs 
                    defaultValue="monthly" 
                    onValueChange={handleBillingCycleChange} 
                    className="w-full"
                  >
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="yearly">Yearly (Save 16.7%)</TabsTrigger>
                    </TabsList>
                    <TabsContent value="monthly" className="mt-4">
                      <div>
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
                    </TabsContent>
                    <TabsContent value="yearly" className="mt-4">
                      <div>
                        <p className="text-gray-400">Label Fee</p>
                        <div className="flex items-end">
                          <span className="text-4xl font-bold text-white">${PRICING.PREMIUM.MARKUP_PER_LABEL.toFixed(2)}</span>
                          <span className="text-gray-400 ml-2 mb-1">per label</span>
                        </div>
                        <p className="text-gray-400 mt-1">Plus carrier rates</p>
                      </div>
                      
                      <div className="mt-6">
                        <p className="text-gray-400">Yearly Fee (2 months free)</p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold text-white">${yearlyPrice.toFixed(2)}</p>
                          <span className="ml-2 line-through text-gray-500 text-sm">${(PRICING.PREMIUM.MONTHLY_FEE * 12).toFixed(2)}</span>
                        </div>
                        <p className="text-green-400 text-sm mt-1">Save ${(PRICING.PREMIUM.MONTHLY_FEE * 2).toFixed(2)}</p>
                      </div>
                    </TabsContent>
                  </Tabs>
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
                      id="premium-upgrade-button" // Add ID for tracking
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
                    <span className="text-gray-300">Multi-carrier shipping options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Address validation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Tracking notifications</span>
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
                    <span className="text-gray-300">API access for integrations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Advanced analytics</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
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
                <h3 className="text-lg font-semibold text-white mb-2">How does billing work?</h3>
                <p className="text-gray-300">
                  The Standard plan has no monthly fee and you pay $4.00 per label. The Premium plan costs $99/month (or $999/year) and you pay $3.00 per label.
                  All charges for labels are deducted from your wallet balance.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a limit to how many labels I can create?</h3>
                <p className="text-gray-300">
                  Yes, the Standard plan is limited to 100 labels per month. The Premium plan offers unlimited label generation.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </LoginCheck>
  );
} 