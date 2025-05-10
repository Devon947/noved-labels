'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoginCheck from '../components/LoginCheck';

export default function ReferralPage() {
  const [referralCode] = useState('NOVED123'); // This would normally come from the user's profile
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralSteps = [
    {
      title: 'Share Your Code',
      description: 'Share your unique referral code with friends and business partners',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      title: 'They Sign Up',
      description: 'When they create an account using your code, both of you get rewarded',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    },
    {
      title: 'Track Progress',
      description: 'Monitor your referrals and earnings in real-time',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Get Paid',
      description: 'Receive your rewards automatically in your account',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
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
            Referral Program
          </h1>
          <p className="text-xl text-gray-300">
            Share NOVEDLabels and earn rewards for every successful referral
          </p>
        </div>

        {/* Referral Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 mb-12 text-center"
        >
          <h2 className="text-2xl font-bold mb-6 text-white">Your Referral Code</h2>
          <div className="flex items-center justify-center space-x-4">
            <code className="px-6 py-3 bg-gray-700/50 rounded-lg text-xl font-mono text-blue-400">
              {referralCode}
            </code>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {referralSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center"
              >
                <div className="text-blue-400 mb-4 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rewards Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Rewards Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-gray-700/50 border border-gray-600 text-center">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Basic Reward</h3>
              <p className="text-3xl font-bold text-white mb-2">$10</p>
              <p className="text-gray-300">Per successful referral</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-700/50 border border-gray-600 text-center">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Bonus Reward</h3>
              <p className="text-3xl font-bold text-white mb-2">5%</p>
              <p className="text-gray-300">Of referral's first month</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-700/50 border border-gray-600 text-center">
              <h3 className="text-lg font-semibold mb-2 text-green-400">Monthly Bonus</h3>
              <p className="text-3xl font-bold text-white mb-2">$100</p>
              <p className="text-gray-300">For 10+ referrals/month</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-gray-700 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Start Earning Today!</h2>
          <p className="text-gray-300 mb-6">Share your referral code and start earning rewards for every successful referral.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            View Your Earnings
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </LoginCheck>
  );
} 