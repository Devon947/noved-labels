'use client';

import React from 'react';

const TrustBadges = () => {
  return (
    <div className="bg-gray-800 p-4 flex justify-center space-x-8">
      <div className="flex items-center space-x-2">
        <span className="text-green-400">✓</span>
        <span className="text-gray-300">Secure Shipping</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-green-400">✓</span>
        <span className="text-gray-300">24/7 Support</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-green-400">✓</span>
        <span className="text-gray-300">Best Rates</span>
      </div>
    </div>
  );
};

export default TrustBadges;