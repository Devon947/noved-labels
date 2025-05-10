'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoginCheck from '../components/LoginCheck';

export default function EarnPage() {
  const rewardTiers = [
    {
      name: 'Bronze',
      shipments: '0-50',
      cashback: '1%',
      referralBonus: '$5',
      color: 'from-amber-700 to-amber-500'
    },
    {
      name: 'Silver',
      shipments: '51-200',
      cashback: '2%',
      referralBonus: '$10',
      color: 'from-gray-400 to-gray-200'
    },
    {
      name: 'Gold',
      shipments: '201-500',
      cashback: '3%',
      referralBonus: '$15',
      color: 'from-yellow-500 to-yellow-300'
    },
    {
      name: 'Platinum',
      shipments: '501+',
      cashback: '4%',
      referralBonus: '$20',
      color: 'from-blue-400 to-blue-200'
    }
  ];

  return (
    <LoginCheck>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Earn Rewards
          </h1>
          <p className="text-xl text-gray-300">
            Ship more, earn more with our tiered rewards program
          </p>
        </div>

        {/* Reward Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {rewardTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <span className="text-gray-400">Shipments:</span> {tier.shipments}
                  </p>
                  <p>
                    <span className="text-gray-400">Cashback:</span> {tier.cashback}
                  </p>
                  <p>
                    <span className="text-gray-400">Referral Bonus:</span> {tier.referralBonus}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ways to Earn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Ship & Earn</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Earn cashback on every shipment
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Higher tiers = Higher rewards
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Monthly bonus opportunities
              </li>
            </ul>
            <Link 
              href="/ship"
              className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Start Shipping
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Refer & Earn</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Get bonus for each referral
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Earn from referral's shipments
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Special promotions for top referrers
              </li>
            </ul>
            <Link 
              href="/referral"
              className="inline-block mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              Start Referring
            </Link>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-gray-700 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Ready to Start Earning?</h2>
          <p className="text-gray-300 mb-6">Join our rewards program today and start earning cashback on every shipment!</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            View Your Dashboard
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </LoginCheck>
  );
} 