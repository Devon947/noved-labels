'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This sitekey would typically be set in your .env file
const CLOUDFLARE_SITE_KEY = '1x00000000000000000000AB';

export default function SecurityVerification({ onVerified }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    // Load Cloudflare Turnstile script
    const loadTurnstile = () => {
      if (window.turnstile) {
        setLoading(false);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.onload = () => {
        setLoading(false);
      };
      script.onerror = () => {
        setError('Failed to load security verification. Please refresh the page.');
        setLoading(false);
      };
      
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };
    
    loadTurnstile();
  }, []);
  
  useEffect(() => {
    if (!loading && window.turnstile && !token) {
      try {
        window.turnstile.render('#turnstile-container', {
          sitekey: CLOUDFLARE_SITE_KEY,
          callback: function(token) {
            setToken(token);
            if (onVerified) {
              onVerified(token);
            }
          },
          'theme': 'dark'
        });
      } catch (error) {
        console.error('Error rendering turnstile:', error);
        setError('Failed to initialize security verification. Please refresh the page.');
      }
    }
  }, [loading, token, onVerified]);
  
  if (token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 text-center"
      >
        <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Verification Successful</h2>
        <p className="text-gray-300 mb-4">You're verified as human. Thank you!</p>
        <Button onClick={() => window.location.reload()}>Continue</Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 text-center"
    >
      <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
        <Shield className="h-8 w-8 text-blue-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Security Verification</h2>
      <p className="text-gray-300 mb-6">Please complete the verification to proceed</p>
      
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-400 mb-4">{error}</div>
      ) : (
        <div id="turnstile-container" className="mb-4"></div>
      )}
      
      <p className="text-sm text-gray-500 mt-4">
        Protected by Cloudflare Turnstile
      </p>
    </motion.div>
  );
} 