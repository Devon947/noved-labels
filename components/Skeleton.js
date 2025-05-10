'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
  return (
    <motion.div
      className={`bg-gray-800 rounded-lg ${className}`}
      animate={{
        background: [
          'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
          'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

export const StatCardSkeleton = () => (
  <div className="neon-card animate-pulse">
    <div className="flex items-center justify-between p-6">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-700 rounded"></div>
        <div className="h-8 w-16 bg-gray-700 rounded"></div>
      </div>
      <div className="h-8 w-8 bg-gray-700 rounded"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 w-24 bg-gray-700 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-32 bg-gray-700 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-20 bg-gray-700 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
    </td>
  </tr>
);

export default Skeleton; 