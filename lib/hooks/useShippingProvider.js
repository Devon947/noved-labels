'use client';

import { useState, useCallback } from 'react';
import { ShippingProviderFactory } from '../shipping-providers/factory';

export function useShippingProvider() {
  const [provider, setProvider] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);

  const validateAndSetProvider = useCallback(async (newProviderId, newApiKey) => {
    setIsValidating(true);
    setError(null);

    try {
      const result = await ShippingProviderFactory.validateApiKey(newProviderId, newApiKey);
      
      if (result.valid) {
        const newProvider = ShippingProviderFactory.createProvider(newProviderId, newApiKey);
        setProvider(newProvider);
        setProviderId(newProviderId);
        setApiKey(newApiKey);
        return true;
      } else {
        setError(result.error || 'Invalid API key');
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearProvider = useCallback(() => {
    setProvider(null);
    setProviderId(null);
    setApiKey('');
    setError(null);
  }, []);

  return {
    provider,
    providerId,
    apiKey,
    isValidating,
    error,
    validateAndSetProvider,
    clearProvider
  };
} 