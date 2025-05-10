import { useState, useCallback } from 'react';
import type { ShippingFormData, ValidationErrors, ShippingLabel } from '@/types/shipping';
import { validateShippingForm } from '@/utils/validation';
import { shippingProviderService } from '@/lib/services/ShippingProviderService';
import { shippingHistoryService } from '@/lib/services/ShippingHistoryService';

export const useShipping = () => {
  const [formData, setFormData] = useState<Partial<ShippingFormData>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleFormChange = useCallback((field: keyof ShippingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when field is changed
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [validationErrors]);

  const validateForm = useCallback(() => {
    const errors = validateShippingForm(formData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const generateLabel = useCallback(async () => {
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
          shippingProviderService.generateLabel(providerId, formData as ShippingFormData)
        )
      );

      // Find the cheapest rate
      const cheapestLabel = results.reduce((min, current) => {
        return (current.rate < min.rate) ? current : min;
      });

      // Save to history
      await shippingHistoryService.addToHistory({
        ...formData,
        provider: cheapestLabel.provider,
        rate: cheapestLabel.rate,
        labelUrl: cheapestLabel.labelUrl,
      } as ShippingLabel);

      setSuccess('Shipping label generated successfully!');
      setFormData({});
    } catch (err) {
      console.error('Error generating label:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate shipping label');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm]);

  return {
    formData,
    validationErrors,
    loading,
    success,
    error,
    handleFormChange,
    generateLabel,
  };
}; 