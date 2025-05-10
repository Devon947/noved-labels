'use client';

import React from 'react';
import { motion } from 'framer-motion';

const StatsChart = ({ data, title }) => {
  const maxValue = Math.max(...data.values, 1);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neon-card p-6"
    >
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="h-64 flex items-end space-x-2">
        {data.values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
          />
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-400">
        {data.labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </motion.div>
  );
};

export default StatsChart; 