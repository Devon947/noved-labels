'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { shippingProviderService } from '../services/ShippingProviderService';

export default function ProviderConfig() {
  const { animations } = useTheme();
  const [providers, setProviders] = useState({});
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    try {
      await shippingProviderService.init();
      const providerData = shippingProviderService.getProviders();
      setProviders(providerData);
    } catch (error) {
      console.error('Error loading providers:', error);
      setError('Failed to load shipping providers');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigure = (providerId) => {
    setConfiguring(providerId);
    setApiKey('');
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setError('');
    try {
      const result = await shippingProviderService.configureProvider(configuring, apiKey);
      
      if (result.success) {
        setSuccess(`${providers[configuring].name} configured successfully`);
        loadProviders();
        setTimeout(() => {
          setConfiguring(null);
          setSuccess('');
        }, 2000);
      } else {
        setError(result.error || 'Failed to configure provider');
      }
    } catch (error) {
      setError(`Failed to configure provider: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial="initial"
        animate="animate"
        variants={animations.pageTransition}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-white">Shipping Providers</h2>
        <p className="text-gray-400 mb-4">
          Configure your shipping providers to generate real shipping labels.
          {process.env.NODE_ENV !== 'production' && (
            <span className="text-yellow-400 ml-2">
              (In development mode, all providers are auto-configured for testing)
            </span>
          )}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(providers).map(([providerId, provider]) => (
            <motion.div
              key={providerId}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animations.listItem}
              className={`
                bg-gray-800 rounded-lg p-6 
                ${provider.configured ? 'border-2 border-green-500' : 'border border-gray-700'}
              `}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {provider.name}
              </h3>
              <div className="space-y-2 mb-4">
                {provider.features.map((feature) => (
                  <div key={feature} className="flex items-center text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="mt-2 mb-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${provider.configured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={provider.configured ? 'text-green-400' : 'text-red-400'}>
                    {provider.configured ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                {provider.configured ? (
                  <button
                    onClick={() => handleConfigure(providerId)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Reconfigure
                  </button>
                ) : (
                  <button
                    onClick={() => handleConfigure(providerId)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Configure
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Configuration Modal */}
        {configuring && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animations.modalTransition}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">
                Configure {providers[configuring].name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter API key"
                  />
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setConfiguring(null)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 