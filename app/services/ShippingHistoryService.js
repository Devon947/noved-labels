// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class ShippingHistoryService {
  constructor() {
    this.STORAGE_KEY = 'shipping_history';
    this.PLAN_STORAGE_KEY = 'user_subscription_plan';
    this.MAX_HISTORY_ITEMS = 100;
    this.isDev = process.env.NODE_ENV !== 'production';
    
    // In-memory fallback for SSR or when localStorage is unavailable
    this.memoryHistory = [];
    this.userPlan = 'STANDARD'; // Default to standard plan
    
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
   * Save user's subscription plan
   * @param {string} plan - STANDARD or PREMIUM
   * @returns {Promise<Object>} - Result of save operation
   */
  async savePlan(plan) {
    try {
      // Update in-memory plan
      this.userPlan = plan;
      
      // Only try to use localStorage in browser environment
      if (isBrowser) {
        localStorage.setItem(this.PLAN_STORAGE_KEY, plan);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving user plan:', error);
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
        return { 
          success: true, 
          message: `Removed ${history.length - filtered.length} old entries`,
          removed: history.length - filtered.length
        };
      }
      
      return { success: true, message: 'No old entries to remove', removed: 0 };
    } catch (error) {
      console.error('Error cleaning up shipping history:', error);
      return { success: false, error: error.message };
    }
  }

  // Example for mock history entries
  generateMockHistoryEntries(count = 10) {
    const entries = [];
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Randomly assign standard or premium plan for mock data
      const plan = Math.random() > 0.7 ? 'PREMIUM' : 'STANDARD';
      const baseRate = (Math.random() * 8 + 5).toFixed(2);
      const markup = plan === 'STANDARD' ? '4.00' : '3.00';
      const totalPrice = (parseFloat(baseRate) + parseFloat(markup)).toFixed(2);
      
      entries.push({
        id: `SH${i.toString().padStart(5, '0')}`,
        tracking_number: `TRK${Math.floor(Math.random() * 1000000)}`,
        provider: 'shippo',
        provider_name: 'Standard Service',
        baseRate,
        markup,
        totalPrice,
        rate: totalPrice,
        plan: plan === 'STANDARD' ? 'Standard' : 'Premium',
        label_url: 'https://dummyimage.com/400x600/000/fff&text=Mock+Shipping+Label',
        tracking_url: 'https://example.com/track',
        status: this.getRandomStatus(),
        created_at: date.toISOString(),
        to_name: 'John Doe',
        to_address: '123 Main St',
        to_city: 'Anytown',
        to_state: 'CA',
        to_zip: '90210',
        from_name: 'Jane Smith',
        from_address: '456 Oak Ave',
        from_city: 'Somewhere',
        from_state: 'NY',
        from_zip: '10001'
      });
    }
    return entries;
  }

  getRandomStatus() {
    const statuses = ['created', 'in_transit', 'delivered', 'returned', 'exception'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}

export const shippingHistoryService = new ShippingHistoryService(); 