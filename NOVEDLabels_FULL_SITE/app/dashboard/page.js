'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoginCheck from '../components/LoginCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Package, Users, DollarSign, CreditCard, 
  Sparkles, ArrowRight, Award, Check
} from 'lucide-react';
import { shippingHistoryService } from '@/app/services/ShippingHistoryService';
import { calculatePlanComparison, PRICING } from '@/lib/pricing';
import { useSearchParams, useRouter } from 'next/navigation';
import { walletService } from '@/app/services/WalletService';

export default function DashboardPage() {
  const [userPlan, setUserPlan] = useState('STANDARD');
  const [planComparison, setPlanComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    async function loadUserData() {
      try {
        // Load user plan
        const plan = await shippingHistoryService.getUserPlan();
        setUserPlan(plan);
        
        // Calculate plan comparison if on standard plan
        if (plan === 'STANDARD') {
          // Estimate for 30 labels per month with average rate of $8
          const comparison = calculatePlanComparison(30, 8.00);
          setPlanComparison(comparison);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, []);
  
  useEffect(() => {
    // Check for deposit status from query params
    const depositStatus = searchParams.get('deposit');
    if (depositStatus === 'success') {
      const amount = searchParams.get('amount');
      
      // Show success message
      alert(`Successfully added $${amount} to your wallet!`);
      
      // Refresh wallet data
      walletService.getWalletData().then(data => {
        // Update wallet data in your component state if needed
      });
      
      // Remove the query params
      router.replace('/dashboard');
    } else if (depositStatus === 'cancelled') {
      alert('Deposit was cancelled.');
      
      // Remove the query params
      router.replace('/dashboard');
    }
    
    // Check for checkout status from subscription
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      const plan = searchParams.get('plan');
      alert(`Your subscription to the ${plan} plan was successful!`);
      
      // Remove the query params
      router.replace('/dashboard');
    }
  }, [searchParams, router]);
  
  // This would normally come from an API or database
  const mockData = {
    stats: {
      totalShipments: 47,
      activeReferrals: 8,
      totalEarnings: 520,
      pendingPayouts: 120
    },
    recentShipments: [
      {
        id: 'SH001',
        date: '2024-03-15',
        tracking: '1Z999AA1234567890',
        status: 'Delivered',
        baseRate: '8.99',
        markup: userPlan === 'PREMIUM' ? '3.00' : '4.00',
        amount: userPlan === 'PREMIUM' ? '11.99' : '12.99'
      },
      {
        id: 'SH002',
        date: '2024-03-14',
        tracking: '1Z999AA1234567891',
        status: 'In Transit',
        baseRate: '11.50',
        markup: userPlan === 'PREMIUM' ? '3.00' : '4.00',
        amount: userPlan === 'PREMIUM' ? '14.50' : '15.50'
      },
      {
        id: 'SH003',
        date: '2024-03-13',
        tracking: '1Z999AA1234567892',
        status: 'Processing',
        baseRate: '5.99',
        markup: userPlan === 'PREMIUM' ? '3.00' : '4.00',
        amount: userPlan === 'PREMIUM' ? '8.99' : '9.99'
      }
    ],
    recentReferrals: [
      {
        name: 'John D.',
        date: '2024-03-12',
        status: 'Active',
        earnings: 25
      },
      {
        name: 'Sarah M.',
        date: '2024-03-10',
        status: 'Pending',
        earnings: 0
      }
    ]
  };

  return (
    <LoginCheck>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4"
      >
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-300">Welcome back! Here's your shipping and earnings overview.</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Badge
              className={`px-3 py-1.5 text-sm ${
                userPlan === 'PREMIUM' 
                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {userPlan === 'PREMIUM' ? 'Premium Plan' : 'Standard Plan'}
            </Badge>
            
            {userPlan === 'STANDARD' && (
              <Link href="/pricing" className="ml-4">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Plan Info Card - Show if on Standard Plan */}
        {userPlan === 'STANDARD' && planComparison && planComparison.isSavingWithPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-600/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                      Upgrade to Premium and Save
                    </h3>
                    <p className="text-gray-300 mt-1">
                      You could save <span className="font-bold text-purple-300">${planComparison.savings}</span> per month with your current shipping volume
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-400">Standard Plan</p>
                        <p className="text-lg font-bold text-white">${PRICING.STANDARD.MARKUP_PER_LABEL.toFixed(2)}/label</p>
                        <p className="text-sm text-gray-400">No monthly fee</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Premium Plan</p>
                        <p className="text-lg font-bold text-white">${PRICING.PREMIUM.MARKUP_PER_LABEL.toFixed(2)}/label</p>
                        <p className="text-sm text-gray-400">${PRICING.PREMIUM.MONTHLY_FEE.toFixed(2)}/month</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-center mb-2">
                      <p className="text-gray-300">Break-even at</p>
                      <p className="text-2xl font-bold text-white">{PRICING.PREMIUM.BREAK_EVEN_LABELS}+ labels</p>
                      <p className="text-gray-300">per month</p>
                    </div>
                    <Link href="/pricing">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Premium Plan Info Card - Show if on Premium Plan */}
        {userPlan === 'PREMIUM' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-600/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Award className="h-5 w-5 mr-2 text-purple-400" />
                      Premium Plan Active
                    </h3>
                    <p className="text-gray-300 mt-1">
                      You're saving <span className="font-bold text-green-400">$1.00</span> on every shipping label
                    </p>
                    <div className="mt-4">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Only ${PRICING.PREMIUM.MARKUP_PER_LABEL.toFixed(2)} per label</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Premium customer support</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Bulk shipping capabilities</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 bg-purple-800/30 p-4 rounded-lg">
                    <p className="text-gray-300 text-center">Your subscription</p>
                    <p className="text-2xl font-bold text-white text-center">${PRICING.PREMIUM.MONTHLY_FEE.toFixed(2)}<span className="text-sm text-gray-400">/month</span></p>
                    <p className="text-center text-gray-400 text-sm mt-1">Next billing: April 15, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm font-medium">Total Shipments</h3>
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">{mockData.stats.totalShipments}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm font-medium">Active Referrals</h3>
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">{mockData.stats.activeReferrals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm font-medium">Total Earnings</h3>
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">${mockData.stats.totalEarnings}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm font-medium">Pending Payouts</h3>
              <CreditCard className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">${mockData.stats.pendingPayouts}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Shipments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Shipments</h2>
              <Link
                href="/ship"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Create New
              </Link>
            </div>
            <div className="space-y-4">
              {mockData.recentShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{shipment.tracking}</p>
                    <p className="text-sm text-gray-400">{shipment.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col">
                      <p className="text-white font-medium">${shipment.amount}</p>
                      <div className="flex text-xs space-x-1 text-gray-400">
                        <span>Base: ${shipment.baseRate}</span>
                        <span>+</span>
                        <span>Fee: ${shipment.markup}</span>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      shipment.status === 'Delivered' ? 'text-green-400' :
                      shipment.status === 'In Transit' ? 'text-blue-400' :
                      'text-yellow-400'
                    }`}>{shipment.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Referrals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Referrals</h2>
              <Link
                href="/referral"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Invite More
              </Link>
            </div>
            <div className="space-y-4">
              {mockData.recentReferrals.map((referral, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{referral.name}</p>
                    <p className="text-sm text-gray-400">{referral.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${referral.earnings}</p>
                    <p className={`text-sm ${
                      referral.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
                    }`}>{referral.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Link
            href="/ship"
            className="flex items-center justify-center p-4 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors"
          >
            Create New Shipment
          </Link>
          <Link
            href="/referral"
            className="flex items-center justify-center p-4 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-medium transition-colors"
          >
            Share Referral Code
          </Link>
          {userPlan === 'STANDARD' ? (
            <Link
              href="/pricing"
              className="flex items-center justify-center p-4 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-colors"
            >
              Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/partner"
              className="flex items-center justify-center p-4 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-colors"
            >
              Invite Partners
            </Link>
          )}
        </motion.div>
      </motion.div>
    </LoginCheck>
  );
}