import { EasyPostProvider } from './easypost';
import { ShippoProvider } from './shippo';
// Import other providers as they are implemented

export class ShippingProviderFactory {
  static createProvider(providerId, apiKey) {
    switch (providerId) {
      case 'easypost':
        // Inactive provider
        throw new Error('Premium Service integration coming soon');
      case 'pirateship':
        // Inactive provider
        throw new Error('Standard Service integration coming soon');
      case 'stamps':
        // Inactive provider
        throw new Error('Express Service integration coming soon');
      case 'shippo':
        return new ShippoProvider(apiKey);
      default:
        throw new Error(`Unknown provider: ${providerId}`);
    }
  }

  static async validateApiKey(providerId, apiKey) {
    try {
      const provider = this.createProvider(providerId, apiKey);
      // Try to make a simple API call to validate the key
      await provider.validateAddress({
        name: 'Test User',
        street1: '123 Test St',
        city: 'Test City',
        state: 'CA',
        zip: '12345',
        country: 'US'
      });
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error.message 
      };
    }
  }
} 