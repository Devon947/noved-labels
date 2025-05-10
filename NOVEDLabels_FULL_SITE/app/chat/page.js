'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ChatPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Chat Support
      </h1>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-gray-400 mb-4">
          Get help from our support team 24/7!
        </p>
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <p className="text-white font-mono">COMING SOON</p>
        </div>
      </div>
    </motion.div>
  );
} 