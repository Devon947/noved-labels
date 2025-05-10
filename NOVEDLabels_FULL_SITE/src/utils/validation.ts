import { VALIDATION_MESSAGES } from '@/config/constants';
import type { ValidationErrors, ShippingFormData } from '@/types/shipping';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateZip = (zip: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

export const validateShippingForm = (data: Partial<ShippingFormData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required fields
  const requiredFields: (keyof ShippingFormData)[] = [
    'fromName',
    'fromAddress',
    'fromCity',
    'fromState',
    'fromZip',
    'toName',
    'toAddress',
    'toCity',
    'toState',
    'toZip',
    'weight',
  ];

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors[field] = VALIDATION_MESSAGES.required;
    }
  });

  // ZIP code validation
  ['fromZip', 'toZip'].forEach(field => {
    if (data[field] && !validateZip(data[field] as string)) {
      errors[field] = VALIDATION_MESSAGES.invalidZip;
    }
  });

  // Weight validation
  if (data.weight && (isNaN(Number(data.weight)) || Number(data.weight) <= 0)) {
    errors.weight = VALIDATION_MESSAGES.invalidWeight;
  }

  // Dimensions validation
  if (data.dimensions) {
    ['length', 'width', 'height'].forEach(dim => {
      const value = data.dimensions?.[dim as keyof typeof data.dimensions];
      if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
        errors[`dimensions.${dim}`] = VALIDATION_MESSAGES.invalidDimension;
      }
    });
  }

  return errors;
}; 