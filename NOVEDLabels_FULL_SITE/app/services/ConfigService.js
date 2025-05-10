import { encrypt, decrypt } from './encryption';

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class ConfigService {
  constructor() {
    this.configs = new Map();
    this.encryptedFields = ['apiKeys'];
    this.isDev = process.env.NODE_ENV !== 'production';
    
    // In development mode, set up some mock API keys
    if (this.isDev) {
      this.devDefaults = {
        apiKeys: {
          easypost: 'PREMIUM_SERVICE_TEST_API_KEY', // Inactive
          pirateship: 'STANDARD_SERVICE_TEST_API_KEY', // Inactive
          stamps: 'EXPRESS_SERVICE_TEST_API_KEY', // Inactive
          shippo: 'shippo_test_a646c6a24331882d85e232063d3a137bbbcb35ff' // Active
        }
      };
    }
  }

  // Initialize configs from environment or stored values
  async init() {
    try {
      // Only attempt localStorage access in browser environment
      if (isBrowser) {
        const storedConfigs = localStorage.getItem('app_configs');
        if (storedConfigs) {
          const parsedConfigs = JSON.parse(storedConfigs);
          for (const [key, value] of Object.entries(parsedConfigs)) {
            if (this.encryptedFields.includes(key)) {
              this.configs.set(key, await decrypt(value));
            } else {
              this.configs.set(key, value);
            }
          }
        }
      }
      
      console.log('✅ Config service initialized');
    } catch (error) {
      console.error('❌ Error initializing configs:', error);
      
      // In development, use mock configs
      if (this.isDev) {
        this.setDevDefaults();
      }
    }
  }
  
  // Set development defaults for testing
  setDevDefaults() {
    if (this.isDev) {
      for (const [key, value] of Object.entries(this.devDefaults)) {
        this.configs.set(key, value);
      }
      console.log('🧪 Development mode: Using mock configuration');
    }
  }

  // Save API key for a specific provider
  async saveApiKey(provider, apiKey) {
    try {
      const apiKeys = this.configs.get('apiKeys') || {};
      apiKeys[provider] = apiKey;
      this.configs.set('apiKeys', apiKeys);
      
      // Only persist to storage in browser environment
      if (isBrowser) {
        await this.persistConfigs();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving API key:', error);
      return { success: false, error: error.message || 'Failed to save API key' };
    }
  }

  // Get API key for a specific provider
  getApiKey(provider) {
    try {
      const apiKeys = this.configs.get('apiKeys') || {};
      return apiKeys[provider];
    } catch (error) {
      console.error(`Error getting API key for ${provider}:`, error);
      
      // In development, return mock key
      if (this.isDev && this.devDefaults.apiKeys[provider]) {
        return this.devDefaults.apiKeys[provider];
      }
      
      return null;
    }
  }

  // Persist configs to storage
  async persistConfigs() {
    try {
      // Only attempt localStorage access in browser environment
      if (!isBrowser) return;
      
      const configsToStore = {};
      for (const [key, value] of this.configs.entries()) {
        if (this.encryptedFields.includes(key)) {
          configsToStore[key] = await encrypt(value);
        } else {
          configsToStore[key] = value;
        }
      }
      localStorage.setItem('app_configs', JSON.stringify(configsToStore));
    } catch (error) {
      console.error('Error persisting configs:', error);
    }
  }
  
  // Clear all configs (for logout, etc.)
  clearConfigs() {
    try {
      this.configs.clear();
      
      // Clear localStorage in browser environment
      if (isBrowser) {
        localStorage.removeItem('app_configs');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing configs:', error);
      return { success: false, error: error.message || 'Failed to clear configs' };
    }
  }
}

export const configService = new ConfigService(); 