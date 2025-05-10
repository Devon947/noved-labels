import { configService } from './ConfigService';
import { calculateLabelPrice, PRICING } from '@/lib/pricing';
import { walletService } from './WalletService';
import { shippingHistoryService } from './ShippingHistoryService';

// Default timeout for API requests (10 seconds)
const API_TIMEOUT = 10000;

// Maximum labels for standard plan
const STANDARD_PLAN_LABEL_LIMIT = 100;

// Helper to implement timeouts on fetch requests
const fetchWithTimeout = async (url, options, timeout = API_TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  
  clearTimeout(id);
  return response;
};

class ShippingProviderService {
  constructor() {
    this.providers = {
      easypost: {
        name: 'Premium Service',
        features: ['Address Validation', 'Rate Comparison', 'Label Generation', 'Tracking'],
        apiKeyRequired: true,
        configured: false,
        active: false
      },
      pirateship: {
        name: 'Standard Service',
        features: ['USPS Integration', 'Rate Comparison', 'Label Generation', 'Tracking'],
        apiKeyRequired: true,
        configured: false,
        active: false
      },
      stamps: {
        name: 'Express Service',
        features: ['USPS Integration', 'Label Generation', 'Tracking'],
        apiKeyRequired: true,
        configured: false,
        active: false
      },
      shippo: {
        name: 'Standard Service',
        features: ['Multi-carrier Support', 'Rate Comparison', 'Label Generation', 'Tracking'],
        apiKeyRequired: true,
        configured: false,
        active: true
      }
    };
    
    this.isDev = process.env.NODE_ENV !== 'production';
    
    // In development mode, configure all providers for demo
    if (this.isDev) {
      this.configureAllProvidersForDev();
    }
  }
  
  configureAllProvidersForDev() {
    for (const providerId of Object.keys(this.providers)) {
      if (this.providers[providerId].active) {
        this.providers[providerId].configured = true;
      }
    }
    console.log('🧪 Development mode: All active shipping providers configured for demo');
  }

  async init() {
    try {
      // Initialize provider configurations
      for (const providerId of Object.keys(this.providers)) {
        if (this.providers[providerId].active) {
          const apiKey = await configService.getApiKey(providerId);
          if (apiKey) {
            this.providers[providerId].configured = true;
          }
        }
      }
      console.log('✅ Shipping provider service initialized');
    } catch (error) {
      console.error('❌ Error initializing shipping providers:', error);
      // In development, don't fail - set up mock providers
      if (this.isDev) {
        this.configureAllProvidersForDev();
      }
    }
  }

  getProviders() {
    // Filter to return only active providers
    const activeProviders = {};
    for (const [id, provider] of Object.entries(this.providers)) {
      if (provider.active) {
        activeProviders[id] = provider;
      }
    }
    return activeProviders;
  }

  async configureProvider(providerId, apiKey) {
    if (!this.providers[providerId]) {
      throw new Error(`Unknown provider: ${providerId}`);
    }

    if (!this.providers[providerId].active) {
      throw new Error(`Provider ${providerId} is not currently active`);
    }

    try {
      // Validate API key
      await this.validateApiKey(providerId, apiKey);
      
      // Save API key if validation successful
      await configService.saveApiKey(providerId, apiKey);
      this.providers[providerId].configured = true;
      
      return { success: true };
    } catch (error) {
      console.error(`Error configuring provider ${providerId}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error configuring provider'
      };
    }
  }

  async validateApiKey(providerId, apiKey) {
    // In development mode, accept any key
    if (this.isDev) {
      return true;
    }

    if (!this.providers[providerId].active) {
      throw new Error(`Provider ${providerId} is not currently active`);
    }
    
    // Implementation would vary by provider
    switch (providerId) {
      case 'easypost':
        return this.validateEasyPostApiKey(apiKey);
      case 'pirateship':
        return this.validatePirateShipApiKey(apiKey);
      case 'stamps':
        return this.validateStampsApiKey(apiKey);
      case 'shippo':
        return this.validateShippoApiKey(apiKey);
      default:
        throw new Error(`Unknown provider: ${providerId}`);
    }
  }

  async validateEasyPostApiKey(apiKey) {
    try {
      const response = await fetchWithTimeout('https://api.easypost.com/v2/addresses', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating EasyPost API key:', error);
      throw new Error('Failed to validate EasyPost API key');
    }
  }

  async validatePirateShipApiKey(apiKey) {
    try {
      const response = await fetchWithTimeout('https://api.pirateship.com/v1/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating PirateShip API key:', error);
      throw new Error('Failed to validate PirateShip API key');
    }
  }

  async validateStampsApiKey(apiKey) {
    try {
      const response = await fetchWithTimeout('https://api.stamps.com/v1/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating Stamps.com API key:', error);
      throw new Error('Failed to validate Stamps.com API key');
    }
  }

  async validateShippoApiKey(apiKey) {
    try {
      // Using provided Shippo test API key for validation
      const response = await fetchWithTimeout('https://api.goshippo.com/addresses/', {
        method: 'GET',
        headers: {
          'Authorization': `ShippoToken ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Return true if the API response is successful
      return response.ok;
    } catch (error) {
      console.error('Error validating Shippo API key:', error);
      throw new Error('Failed to validate Shippo API key');
    }
  }

  async generateLabel(providerId, shipmentData) {
    try {
      if (!this.providers[providerId]) {
        throw new Error(`Unknown shipping provider: ${providerId}`);
      }

      if (!this.providers[providerId].active) {
        throw new Error(`Provider ${providerId} is not currently active`);
      }

      // Get API key for the provider
      const apiKey = await configService.getApiKey(providerId);
      
      // Get user's subscription plan (default to STANDARD if not found)
      const userPlan = shipmentData.userPlan || await configService.getUserPlan() || 'STANDARD';
      
      // Check if user has reached label limit for standard plan
      if (userPlan === 'STANDARD') {
        const history = await shippingHistoryService.getHistory();
        const currentMonthLabels = history.filter(item => {
          const itemDate = new Date(item.createdAt || item.created_at);
          const now = new Date();
          return itemDate.getMonth() === now.getMonth() && 
                 itemDate.getFullYear() === now.getFullYear();
        }).length;
        
        if (currentMonthLabels >= STANDARD_PLAN_LABEL_LIMIT) {
          throw new Error(`You've reached the ${STANDARD_PLAN_LABEL_LIMIT} label limit for the Standard plan. Please upgrade to Premium for unlimited labels.`);
        }
      }
      
      // Check if user has sufficient balance
      const balance = await walletService.getBalance();
      const planFee = userPlan === 'PREMIUM' ? PRICING.PREMIUM.MARKUP_PER_LABEL : PRICING.STANDARD.MARKUP_PER_LABEL;
      
      if (balance < planFee) {
        throw new Error(`Insufficient balance to generate label. Please add funds to your wallet.`);
      }
      
      // For development or testing, use the mock label generator
      if (this.isDev && !apiKey) {
        return this.generateMockLabel(providerId, shipmentData, userPlan);
      }

      // Generate the label based on provider
      let labelData;
      switch (providerId) {
        case 'easypost':
          labelData = await this.generateEasyPostLabel(apiKey, shipmentData);
          break;
        case 'pirateship':
          labelData = await this.generatePirateShipLabel(apiKey, shipmentData);
          break;
        case 'stamps':
          labelData = await this.generateStampsLabel(apiKey, shipmentData);
          break;
        case 'shippo':
          labelData = await this.generateShippoLabel(apiKey, shipmentData);
          break;
        default:
          throw new Error(`Unsupported provider: ${providerId}`);
      }
      
      // Apply pricing markup based on user's plan
      const pricing = calculateLabelPrice(labelData.rate, userPlan);
      labelData.baseRate = pricing.baseRate;
      labelData.markup = pricing.markup;
      labelData.totalPrice = pricing.totalPrice;
      labelData.rate = pricing.totalPrice; // Update the rate to include markup
      labelData.plan = pricing.plan;
      
      // Charge the user for the label
      const chargeResult = await walletService.chargeForLabel(labelData, userPlan);
      
      if (!chargeResult.success) {
        throw new Error(`Failed to process payment: ${chargeResult.error}`);
      }
      
      return labelData;
    } catch (error) {
      console.error(`Error generating label with ${providerId}:`, error);
      throw error;
    }
  }
  
  // Generate mock label data for development
  generateMockLabel(providerId, shipmentData, userPlan) {
    if (!this.providers[providerId].active) {
      throw new Error(`Provider ${providerId} is not currently active`);
    }

    const weight = shipmentData.weight || 1;
    const randomRate = (Math.random() * 10 + 5 + weight).toFixed(2);
    const trackingNumber = `MOCK${Date.now().toString().substring(5)}`;
    const id = `label-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Use the user's plan or default to STANDARD
    const planMarkup = PRICING[userPlan].MARKUP_PER_LABEL.toFixed(2);
    const totalPrice = (parseFloat(randomRate) + parseFloat(planMarkup)).toFixed(2);
    
    return {
      id: id, // Unique ID for retrieving the label
      provider: providerId,
      provider_name: this.providers[providerId].name,
      service: 'Ground Shipping',
      carrier: 'USPS',
      rate: totalPrice,
      baseRate: randomRate,
      markup: planMarkup,
      totalPrice: totalPrice,
      plan: PRICING[userPlan].NAME,
      tracking_number: trackingNumber,
      label_url: 'https://dummyimage.com/400x600/000/fff&text=Mock+Shipping+Label',
      tracking_url: `https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=${trackingNumber}`,
      // From address
      from_name: shipmentData.fromName,
      from_address: shipmentData.fromAddress,
      from_city: shipmentData.fromCity,
      from_state: shipmentData.fromState,
      from_zip: shipmentData.fromZip,
      from_country: 'US',
      // To address
      to_name: shipmentData.toName,
      to_address: shipmentData.toAddress,
      to_city: shipmentData.toCity,
      to_state: shipmentData.toState,
      to_zip: shipmentData.toZip,
      to_country: 'US',
      // Package details
      weight: shipmentData.weight,
      weight_unit: 'oz',
      dimensions: shipmentData.length && shipmentData.width && shipmentData.height 
        ? `${shipmentData.length}x${shipmentData.width}x${shipmentData.height} in` 
        : undefined,
      created_at: new Date().toISOString()
    };
  }

  // Provider-specific label generation methods
  async generateEasyPostLabel(apiKey, shipmentData) {
    try {
      const response = await fetchWithTimeout('https://api.easypost.com/v2/shipments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.formatShipmentForEasyPost(shipmentData))
      });
      
      if (!response.ok) {
        throw new Error(`EasyPost API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        provider: 'easypost',
        provider_name: 'EasyPost',
        rate: data.selected_rate?.rate || 0,
        tracking_number: data.tracking_code,
        label_url: data.postage_label?.label_url,
        tracking_url: `https://track.easypost.com/${data.tracking_code}`,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating EasyPost label:', error);
      throw error;
    }
  }
  
  // Format helper methods for each provider
  formatShipmentForEasyPost(shipmentData) {
    return {
      from_address: {
        name: shipmentData.fromName,
        street1: shipmentData.fromAddress,
        city: shipmentData.fromCity,
        state: shipmentData.fromState,
        zip: shipmentData.fromZip,
        country: 'US'
      },
      to_address: {
        name: shipmentData.toName,
        street1: shipmentData.toAddress,
        city: shipmentData.toCity,
        state: shipmentData.toState,
        zip: shipmentData.toZip,
        country: 'US'
      },
      parcel: {
        weight: shipmentData.weight
      }
    };
  }

  async generatePirateShipLabel(apiKey, shipmentData) {
    try {
      const response = await fetchWithTimeout('https://api.pirateship.com/v1/shipments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipmentData)
      });
      
      if (!response.ok) {
        throw new Error(`PirateShip API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        provider: 'pirateship',
        provider_name: 'PirateShip',
        rate: data.rate || 0,
        tracking_number: data.tracking_number,
        label_url: data.label_url,
        tracking_url: data.tracking_url,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating PirateShip label:', error);
      throw error;
    }
  }

  async generateStampsLabel(apiKey, shipmentData) {
    try {
      const response = await fetchWithTimeout('https://api.stamps.com/v1/shipments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipmentData)
      });
      
      if (!response.ok) {
        throw new Error(`Stamps.com API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        provider: 'stamps',
        provider_name: 'Stamps.com',
        rate: data.rate || 0,
        tracking_number: data.tracking_number,
        label_url: data.label_url,
        tracking_url: data.tracking_url,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating Stamps.com label:', error);
      throw error;
    }
  }

  async generateShippoLabel(apiKey, shipmentData) {
    try {
      // Format the shipment data for Shippo API
      const shippoShipment = {
        address_from: {
          name: shipmentData.fromName,
          street1: shipmentData.fromAddress,
          city: shipmentData.fromCity,
          state: shipmentData.fromState,
          zip: shipmentData.fromZip,
          country: 'US'
        },
        address_to: {
          name: shipmentData.toName,
          street1: shipmentData.toAddress,
          city: shipmentData.toCity,
          state: shipmentData.toState,
          zip: shipmentData.toZip,
          country: 'US'
        },
        parcels: [{
          length: shipmentData.length || 10,
          width: shipmentData.width || 8,
          height: shipmentData.height || 4,
          distance_unit: 'in',
          weight: shipmentData.weight,
          mass_unit: 'oz'
        }],
        async: false
      };

      // Create a shipment with Shippo API
      const response = await fetchWithTimeout('https://api.goshippo.com/shipments/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shippoShipment)
      });
      
      if (!response.ok) {
        throw new Error(`Shippo API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get the cheapest rate
      const cheapestRate = data.rates.reduce((prev, current) => {
        return (parseFloat(prev.amount) < parseFloat(current.amount)) ? prev : current;
      });
      
      // Create a transaction to generate the label
      const transactionResponse = await fetchWithTimeout('https://api.goshippo.com/transactions/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rate: cheapestRate.object_id,
          label_file_type: 'PDF',
          async: false
        })
      });
      
      if (!transactionResponse.ok) {
        throw new Error(`Shippo Transaction API error: ${transactionResponse.status}`);
      }
      
      const transactionData = await transactionResponse.json();
      const id = `label-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      
      return {
        id: id, // Unique ID for retrieving the label
        provider: 'shippo',
        provider_name: 'Standard Service',
        carrier: cheapestRate.provider,
        service: cheapestRate.servicelevel.name,
        rate: parseFloat(cheapestRate.amount),
        currency: cheapestRate.currency,
        tracking_number: transactionData.tracking_number,
        label_url: transactionData.label_url,
        tracking_url: `https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=${transactionData.tracking_number}`,
        // From address
        from_name: shipmentData.fromName,
        from_address: shipmentData.fromAddress,
        from_city: shipmentData.fromCity,
        from_state: shipmentData.fromState,
        from_zip: shipmentData.fromZip,
        from_country: 'US',
        // To address
        to_name: shipmentData.toName,
        to_address: shipmentData.toAddress,
        to_city: shipmentData.toCity,
        to_state: shipmentData.toState,
        to_zip: shipmentData.toZip,
        to_country: 'US',
        // Package details
        weight: shipmentData.weight,
        weight_unit: 'oz',
        dimensions: `${shipmentData.length || 10}x${shipmentData.width || 8}x${shipmentData.height || 4} in`,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating Shippo label:', error);
      throw error;
    }
  }
}

export const shippingProviderService = new ShippingProviderService(); 