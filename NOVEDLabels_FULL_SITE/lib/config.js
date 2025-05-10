/**
 * Configuration helper for managing environment variables with fallbacks
 */

const isDev = process.env.NODE_ENV !== 'production';

// Export config with fallbacks
export const config = {
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'development_key_min_32_chars_long_here',
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  easypost: {
    apiKey: process.env.EASYPOST_API_KEY,
  }
};

// Validation helper for required config values
export const validateConfig = () => {
  const missingVars = [];
  
  // Check encryption config
  if (!config.encryption.key) missingVars.push('ENCRYPTION_KEY');
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    if (!isDev) {
      throw new Error('Missing required environment variables');
    }
  }
};

// In development, we'll use mock data
export const useMockData = isDev; 