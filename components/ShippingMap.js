'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ShippingMap = ({ orders }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neon-card p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Shipping Activity</h2>
      <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Map visualization coming soon</p>
      </div>
      <div className="mt-4 space-y-2">
        {orders?.slice(0, 3).map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 bg-gray-800 rounded"
          >
            <span className="text-sm">{order.id}</span>
            <span className="text-sm text-gray-400">{order.status}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShippingMap; 