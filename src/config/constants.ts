export const APP_NAME = 'NOVEDLabels';

export const SHIPPING_PROVIDERS = {
  easypost: {
    name: 'EasyPost',
    apiUrl: 'https://api.easypost.com/v2',
    features: ['Address Validation', 'Rate Comparison', 'Label Generation', 'Tracking'],
  },
  pirateship: {
    name: 'PirateShip',
    apiUrl: 'https://api.pirateship.com/v1',
    features: ['USPS Integration', 'Rate Comparison', 'Label Generation', 'Tracking'],
  },
  stamps: {
    name: 'Stamps.com',
    apiUrl: 'https://api.stamps.com/v1',
    features: ['USPS Integration', 'Label Generation', 'Tracking'],
  },
  shippo: {
    name: 'Shippo',
    apiUrl: 'https://api.goshippo.com',
    features: ['Multi-carrier Support', 'Rate Comparison', 'Label Generation', 'Tracking'],
  },
} as const;

export const MAX_HISTORY_ITEMS = 100;

export const STORAGE_KEYS = {
  CONFIG: 'app_configs',
  HISTORY: 'shipping_history',
} as const;

export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  invalidZip: 'Please enter a valid ZIP code',
  invalidWeight: 'Weight must be a positive number',
  invalidDimension: 'Dimensions must be positive numbers',
} as const; 