'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shippingProviders } from '../lib/shipping-providers/config';
import NeonModal from './NeonModal';

export default function ShippingProviderSelect({ onSelect, selectedProvider }) {
  const [showDetails, setShowDetails] = useState(null);

  const providerCards = Object.entries(shippingProviders).map(([id, provider]) => ({
    id,
    ...provider,
    description: provider.features.join(' • ')
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providerCards.map((provider) => (
          <motion.div
            key={provider.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-6 rounded-xl cursor-pointer border transition-all duration-200
              ${selectedProvider === provider.id 
                ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'}
            `}
            onClick={() => onSelect(provider.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(provider.id);
                }}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Learn More
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {provider.supported_carriers.map((carrier) => (
                  <span
                    key={carrier}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300"
                  >
                    {carrier}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">
                {provider.description}
              </p>
            </div>

            {selectedProvider === provider.id && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showDetails && (
          <NeonModal
            isOpen={!!showDetails}
            onClose={() => setShowDetails(null)}
            title={shippingProviders[showDetails].name}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-blue-400">Features</h4>
                <ul className="space-y-2">
                  {shippingProviders[showDetails].features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center text-gray-300"
                    >
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-blue-400">Supported Carriers</h4>
                <div className="flex flex-wrap gap-2">
                  {shippingProviders[showDetails].supported_carriers.map((carrier) => (
                    <span
                      key={carrier}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-gray-700 text-gray-300"
                    >
                      {carrier}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <a
                  href={shippingProviders[showDetails].website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Visit Website →
                </a>
              </div>
            </div>
          </NeonModal>
        )}
      </AnimatePresence>
    </div>
  );
} 