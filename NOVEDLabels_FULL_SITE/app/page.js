// app/page.js

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './contexts/ThemeContext';
import ShippingForm from './components/ShippingForm';
import ShippingHistory from './components/ShippingHistory';
import ProviderConfig from './components/ProviderConfig';
import { shippingProviderService } from './services/ShippingProviderService';
import { shippingHistoryService } from './services/ShippingHistoryService';
import { configService } from './services/ConfigService';

export default function Home() {
  const { animations } = useTheme();
  const [activeTab, setActiveTab] = useState('shipping');
  const [formData, setFormData] = useState({
    dimensions: { length: '', width: '', height: '' }
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [serviceStatus, setServiceStatus] = useState({
    initialized: false,
    initializing: true,
    error: null
  });

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    setServiceStatus({ initialized: false, initializing: true, error: null });
    try {
      // Initialize services in parallel
      await Promise.all([
        configService.init(),
        shippingProviderService.init(),
        shippingHistoryService.init()
      ]);
      
      setServiceStatus({ initialized: true, initializing: false, error: null });
    } catch (error) {
      console.error('Error initializing services:', error);
      setServiceStatus({ 
        initialized: false, 
        initializing: false, 
        error: error.message || 'Failed to initialize services' 
      });
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when field is changed
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'fromName', 'fromAddress', 'fromCity', 'fromState', 'fromZip',
      'toName', 'toAddress', 'toCity', 'toState', 'toZip',
      'weight'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.weight && isNaN(formData.weight)) {
      errors.weight = 'Weight must be a number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Get configured providers
      const providers = shippingProviderService.getProviders();
      const configuredProviders = Object.entries(providers)
        .filter(([_, provider]) => provider.configured)
        .map(([id]) => id);

      if (configuredProviders.length === 0) {
        throw new Error('No shipping providers configured');
      }

      // Generate labels with all configured providers
      const results = await Promise.all(
        configuredProviders.map(providerId =>
          shippingProviderService.generateLabel(providerId, formData)
        )
      );

      // Find the cheapest rate
      const cheapestLabel = results.reduce((min, current) => {
        return (current.rate < min.rate) ? current : min;
      });

      // Save to history
      const historyResult = await shippingHistoryService.addToHistory({
        ...formData,
        provider: cheapestLabel.provider,
        provider_name: cheapestLabel.provider_name,
        rate: cheapestLabel.rate,
        label_url: cheapestLabel.label_url,
        tracking_number: cheapestLabel.tracking_number,
        tracking_url: cheapestLabel.tracking_url
      });

      if (historyResult.success) {
        setSuccess(`Shipping label generated successfully! Cost: $${cheapestLabel.rate.toFixed(2)}`);
        setFormData({
          dimensions: { length: '', width: '', height: '' }
        });
      } else {
        throw new Error(historyResult.error || 'Failed to save shipping history');
      }
    } catch (error) {
      console.error('Error generating label:', error);
      setError(error.message || 'Failed to generate shipping label');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'shipping', label: 'Create Label' },
    { id: 'history', label: 'History' },
    { id: 'providers', label: 'Providers' }
  ];

  if (serviceStatus.initializing) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-8"></div>
          <h2 className="text-2xl font-bold mb-4">Initializing Services</h2>
          <p className="text-gray-400">Please wait while we set up your shipping dashboard...</p>
        </div>
      </div>
    );
  }

  if (serviceStatus.error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-500/20 rounded-full p-4 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-400">Initialization Error</h2>
          <p className="text-gray-400 mb-6">{serviceStatus.error}</p>
          <button 
            onClick={initializeServices}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-blue-400">
            Shipping Label Service
          </h1>
          <p className="text-gray-400 mt-1">Generate shipping labels with the best rates</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Success/Error Messages */}
        {(success || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              success ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'
            }`}
          >
            {success || error}
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          key={activeTab}
          initial="initial"
          animate="animate"
          variants={animations.pageTransition}
        >
          {activeTab === 'shipping' && (
            <ShippingForm
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              isLoading={loading}
              validationErrors={validationErrors}
              submitLabel="Generate Label"
            />
          )}
          {activeTab === 'history' && <ShippingHistory />}
          {activeTab === 'providers' && <ProviderConfig />}
        </motion.div>
      </main>
    </div>
  );
}