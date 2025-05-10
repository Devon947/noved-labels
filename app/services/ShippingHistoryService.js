// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class ShippingHistoryService {
  constructor() {
    this.STORAGE_KEY = 'shipping_history';
    this.PLAN_STORAGE_KEY = 'user_subscription_plan';
    this.BILLING_CYCLE_KEY = 'user_billing_cycle';
    this.MAX_HISTORY_ITEMS = 100;
    this.isDev = process.env.NODE_ENV !== 'production';
    
    // In-memory fallback for SSR or when localStorage is unavailable
    this.memoryHistory = [];
    this.userPlan = 'STANDARD'; // Default to standard plan
    this.billingCycle = 'monthly'; // Default to monthly billing
    
    // Mock data for development
    if (this.isDev) {
      this.mockData = Array(5).fill(0).map((_, i) => {
        const baseRate = (5.99 + i).toFixed(2);
        const markup = '4.00'; // Standard plan markup
        const totalPrice = (parseFloat(baseRate) + parseFloat(markup)).toFixed(2);
        
        return {
          id: `mock-${i}`,
          provider: 'shippo',
          provider_name: 'Standard Service',
          baseRate,
          markup,
          totalPrice,
          rate: totalPrice, // Show the total price as the rate
          plan: 'Standard',
          tracking_number: `MOCK${100000 + i}`,
          label_url: 'https://dummyimage.com/400x600/000/fff&text=Mock+Shipping+Label',
          tracking_url: 'https://example.com/track',
          fromName: `Sender ${i}`,
          fromAddress: `${i} Main St`,
          fromCity: 'San Francisco',
          fromState: 'CA',
          fromZip: '94105',
          toName: `Recipient ${i}`,
          toAddress: `${i*10} Broadway`,
          toCity: 'New York',
          toState: 'NY',
          toZip: '10001',
          weight: 1 + i,
          createdAt: new Date(Date.now() - i * 86400000).toISOString()
        };
      });
    }
  }

  async init() {
    try {
      if (isBrowser) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
          await this.saveHistory([]);
        }
        
        // Load user plan
        const storedPlan = localStorage.getItem(this.PLAN_STORAGE_KEY);
        if (storedPlan) {
          this.userPlan = storedPlan;
        } else {
          // Default to standard plan if not found
          this.savePlan('STANDARD');
        }
        
        // Load billing cycle
        const storedBillingCycle = localStorage.getItem(this.BILLING_CYCLE_KEY);
        if (storedBillingCycle) {
          this.billingCycle = storedBillingCycle;
        } else {
          // Default to monthly billing if not found
          this.saveBillingCycle('monthly');
        }
      }
      
      console.log('✅ Shipping history service initialized');
    } catch (error) {
      console.error('❌ Error initializing shipping history:', error);
      
      // In development, populate with mock data
      if (this.isDev) {
        this.memoryHistory = [...this.mockData];
        console.log('🧪 Development mode: Using mock shipping history');
      }
    }
  }

  async getHistory() {
    try {
      if (isBrowser) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : this.memoryHistory;
      }
      
      // Return memory history if not in browser
      return this.isDev ? this.mockData : this.memoryHistory;
    } catch (error) {
      console.error('Error getting shipping history:', error);
      
      // Return mock data in development or empty array in production
      return this.isDev ? this.mockData : [];
    }
  }

  async addToHistory(labelData) {
    try {
      const history = await this.getHistory();
      const newEntry = {
        ...labelData,
        id: labelData.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: labelData.createdAt || new Date().toISOString()
      };

      // Add to beginning of array and limit size
      history.unshift(newEntry);
      if (history.length > this.MAX_HISTORY_ITEMS) {
        history.pop();
      }

      // Update memory history and persist if possible
      this.memoryHistory = history;
      await this.saveHistory(history);
      
      return { success: true, entry: newEntry };
    } catch (error) {
      console.error('Error adding to shipping history:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteFromHistory(labelId) {
    try {
      const history = await this.getHistory();
      const filtered = history.filter(item => item.id !== labelId);
      
      // Update memory history and persist if possible
      this.memoryHistory = filtered;
      await this.saveHistory(filtered);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting from shipping history:', error);
      return { success: false, error: error.message };
    }
  }

  async searchHistory(query) {
    try {
      if (!query) return this.getHistory();
      
      const history = await this.getHistory();
      return history.filter(item => {
        const searchString = JSON.stringify(item).toLowerCase();
        return searchString.includes(query.toLowerCase());
      });
    } catch (error) {
      console.error('Error searching shipping history:', error);
      return [];
    }
  }

  async saveHistory(history) {
    try {
      // Update in-memory history
      this.memoryHistory = history;
      
      // Only try to use localStorage in browser environment
      if (isBrowser) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving shipping history:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Clear history
  async clearHistory() {
    try {
      this.memoryHistory = [];
      
      if (isBrowser) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing shipping history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's current subscription plan
   * @returns {Promise<string>} - User's current plan (STANDARD or PREMIUM)
   */
  async getUserPlan() {
    try {
      if (isBrowser) {
        const storedPlan = localStorage.getItem(this.PLAN_STORAGE_KEY);
        if (storedPlan) {
          return storedPlan;
        }
      }
      
      return this.userPlan;
    } catch (error) {
      console.error('Error getting user plan:', error);
      return 'STANDARD'; // Default to standard plan on error
    }
  }

  /**
   * Get user's current billing cycle
   * @returns {Promise<string>} - User's current billing cycle (monthly or yearly)
   */
  async getBillingCycle() {
    try {
      if (isBrowser) {
        const storedCycle = localStorage.getItem(this.BILLING_CYCLE_KEY);
        if (storedCycle) {
          return storedCycle;
        }
      }
      
      return this.billingCycle;
    } catch (error) {
      console.error('Error getting billing cycle:', error);
      return 'monthly'; // Default to monthly billing on error
    }
  }

  /**
   * Get user's subscription details
   * @returns {Promise<Object>} - User's current plan and billing cycle
   */
  async getSubscriptionDetails() {
    try {
      const plan = await this.getUserPlan();
      const billingCycle = await this.getBillingCycle();
      
      return {
        plan,
        billingCycle,
        isStandard: plan === 'STANDARD',
        isPremium: plan === 'PREMIUM',
        isMonthly: billingCycle === 'monthly',
        isYearly: billingCycle === 'yearly'
      };
    } catch (error) {
      console.error('Error getting subscription details:', error);
      return {
        plan: 'STANDARD',
        billingCycle: 'monthly',
        isStandard: true,
        isPremium: false,
        isMonthly: true,
        isYearly: false
      };
    }
  }

  /**
   * Save user's subscription plan
   * @param {string} plan - STANDARD or PREMIUM
   * @param {Object} options - Additional options
   * @param {string} options.billingCycle - monthly or yearly
   * @returns {Promise<Object>} - Result of save operation
   */
  async savePlan(plan, options = {}) {
    try {
      // Update in-memory plan
      this.userPlan = plan;
      
      // Only try to use localStorage in browser environment
      if (isBrowser) {
        localStorage.setItem(this.PLAN_STORAGE_KEY, plan);
      }
      
      // If billing cycle is provided, save it too
      if (options.billingCycle) {
        await this.saveBillingCycle(options.billingCycle);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving user plan:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save user's billing cycle
   * @param {string} cycle - monthly or yearly
   * @returns {Promise<Object>} - Result of save operation
   */
  async saveBillingCycle(cycle) {
    try {
      // Validate cycle
      if (cycle !== 'monthly' && cycle !== 'yearly') {
        throw new Error('Invalid billing cycle. Must be "monthly" or "yearly"');
      }
      
      // Update in-memory billing cycle
      this.billingCycle = cycle;
      
      // Only try to use localStorage in browser environment
      if (isBrowser) {
        localStorage.setItem(this.BILLING_CYCLE_KEY, cycle);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving billing cycle:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cleanup old shipping history data
   * @param {Date} cutoffDate - Date before which records should be removed
   * @returns {Promise<Object>} - Result of cleanup operation
   */
  async cleanup(cutoffDate) {
    try {
      // Get current history
      const history = await this.getHistory();
      
      // Filter out old items
      const cutoffTimestamp = cutoffDate.getTime();
      const filtered = history.filter(item => {
        const itemDate = new Date(item.createdAt || item.created_at || Date.now());
        return itemDate.getTime() >= cutoffTimestamp;
      });
      
      // Save filtered history
      if (filtered.length !== history.length) {
        await this.saveHistory(filtered);
        return { success: true, removed: history.length - filtered.length };
      }
      
      return { success: true, removed: 0 };
    } catch (error) {
      console.error('Error cleaning up shipping history:', error);
      return { success: false, error: error.message };
    }
  }

  // -------------------- Development Helper Methods --------------------
  
  // Generate mock shipping history (for development purposes)
  generateMockHistoryEntries(count = 10) {
    // Only allow in development mode
    if (!this.isDev) {
      console.error('Cannot generate mock data in production mode');
      return [];
    }
    
    return Array(count).fill(0).map((_, i) => {
      const baseRate = (5.50 + Math.random() * 20).toFixed(2);
      const markup = Math.random() > 0.3 ? '4.00' : '3.00'; // Mix of standard and premium
      const totalPrice = (parseFloat(baseRate) + parseFloat(markup)).toFixed(2);
      
      const carriers = ['USPS', 'UPS', 'FedEx', 'DHL'];
      const services = ['Priority', 'Ground', 'Express', 'First Class', 'Standard'];
      const carrier = carriers[Math.floor(Math.random() * carriers.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      
      // Random date within last 30 days
      const date = new Date(Date.now() - Math.random() * 30 * 86400000);
      
      return {
        id: `mock-${Date.now()}-${i}`,
        provider: carrier.toLowerCase(),
        provider_name: `${carrier} ${service}`,
        baseRate,
        markup,
        totalPrice,
        rate: totalPrice,
        plan: markup === '3.00' ? 'Premium' : 'Standard',
        tracking_number: `MOCK${Math.floor(Math.random() * 1000000)}`,
        label_url: 'https://dummyimage.com/400x600/000/fff&text=Mock+Shipping+Label',
        tracking_url: 'https://example.com/track',
        fromName: `Sender ${i}`,
        fromAddress: `${i * 123} Main St`,
        fromCity: 'San Francisco',
        fromState: 'CA',
        fromZip: '94105',
        toName: `Recipient ${i}`,
        toAddress: `${i * 456} Broadway`,
        toCity: 'New York',
        toState: 'NY',
        toZip: '10001',
        weight: 1 + Math.random() * 10,
        status: this.getRandomStatus(),
        createdAt: date.toISOString()
      };
    });
  }
  
  // Generate random status for mock entries
  getRandomStatus() {
    const statuses = [
      'delivered',
      'in_transit',
      'out_for_delivery',
      'pending',
      'unknown'
    ];
    
    // Weight more towards in_transit and delivered
    const weights = [0.4, 0.3, 0.15, 0.1, 0.05];
    
    // Weighted random selection
    const random = Math.random();
    let weightSum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) {
        return statuses[i];
      }
    }
    
    return statuses[0];
  }
}

// Export a singleton instance
export const shippingHistoryService = new ShippingHistoryService(); 