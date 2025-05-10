'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoginCheck from '../components/LoginCheck';

export default function PartnerPage() {
  const benefits = [
    {
      title: 'Higher Commission Rates',
      description: 'Earn up to 30% commission on all referred customer shipments',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Priority Support',
      description: 'Get dedicated partner support and priority issue resolution',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: 'Marketing Resources',
      description: 'Access exclusive marketing materials and promotional tools',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      title: 'Early Access',
      description: 'Be the first to try new features and provide feedback',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const requirements = [
    'Active shipping business or e-commerce platform',
    'Minimum of 100 monthly shipments',
    'Valid business registration',
    'Strong online presence'
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
            Partner Program
          </h1>
          <p className="text-xl text-gray-300">
            Join our exclusive partnership program and grow your business
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            >
              <div className="text-blue-400 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
              <p className="text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-white">Partnership Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-3 text-gray-300">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{requirement}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Commission Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-white">Commission Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Standard</h3>
              <p className="text-3xl font-bold text-white mb-2">15%</p>
              <p className="text-gray-300">Base commission rate</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Premium</h3>
              <p className="text-3xl font-bold text-white mb-2">20%</p>
              <p className="text-gray-300">500+ monthly shipments</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
              <h3 className="text-lg font-semibold mb-2 text-green-400">Elite</h3>
              <p className="text-3xl font-bold text-white mb-2">30%</p>
              <p className="text-gray-300">1000+ monthly shipments</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-gray-700 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Ready to Partner With Us?</h2>
          <p className="text-gray-300 mb-6">Apply now to join our partner program and start earning higher commissions!</p>
          <Link 
            href="/waitlist"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Apply Now
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </LoginCheck>
  );
} 