// app/page.js

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ShippingForm from './components/ShippingForm';
import ShippingHistory from './components/ShippingHistory';
import ProviderConfig from './components/ProviderConfig';
import LoadingScreen from './components/LoadingScreen';
import AppDownloadBanner from './components/AppDownloadBanner';
import { configService } from './services/configService';

export default function Home() {
  const [activeTab, setActiveTab] = useState('create');
  const [isLoading, setIsLoading] = useState(true);
  const [serviceStatus, setServiceStatus] = useState('initializing');

  useEffect(() => {
    const initializeServices = async () => {
      try {
        await configService.initialize();
        setServiceStatus('ready');
      } catch (error) {
        console.error('Failed to initialize services:', error);
        setServiceStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeServices();
  }, []);

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />;
  }

  if (serviceStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Service Error</h1>
          <p className="text-gray-300 mb-6">
            We're having trouble connecting to our services. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="glass-card p-6 mb-8">
        <h1 className="text-4xl font-bold gradient-text text-center mb-2">
          NOVEDLabels
        </h1>
        <p className="text-center text-gray-400">
          Professional Shipping Label Generation
        </p>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <div className="glass-card p-6 mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                activeTab === 'create'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Create Label
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                activeTab === 'providers'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Providers
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'create' && <ShippingForm />}
            {activeTab === 'history' && <ShippingHistory />}
            {activeTab === 'providers' && <ProviderConfig />}
          </motion.div>
        </div>
      </main>

      <AppDownloadBanner />
    </div>
  );
}