// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class WalletService {
  constructor() {
    this.STORAGE_KEY = 'user_wallet';
    this.DEFAULT_BALANCE = 50.00; // New users get $50 credit to start
    this.isDev = process.env.NODE_ENV !== 'production';
    
    // In-memory fallback for SSR or when localStorage is unavailable
    this.walletData = {
      balance: this.DEFAULT_BALANCE,
      transactions: [],
      savingsTotal: 0,
      labelCount: 0
    };
  }

  async init() {
    try {
      if (isBrowser) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
          // Initialize with default data for new users
          await this.saveWalletData(this.walletData);
        }
      }
      
      console.log('✅ Wallet service initialized');
    } catch (error) {
      console.error('❌ Error initializing wallet service:', error);
      
      // In development, populate with mock data
      if (this.isDev) {
        this.mockWalletData();
        console.log('🧪 Development mode: Using mock wallet data');
      }
    }
  }

  mockWalletData() {
    // Create some mock transactions
    const transactions = [];
    const now = new Date();
    
    // Deposit
    transactions.push({
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      type: 'deposit',
      amount: 100.00,
      description: 'Initial deposit',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    });
    
    // Some shipping label purchases
    for (let i = 0; i < 5; i++) {
      const baseRate = 7.50 + (Math.random() * 5).toFixed(2);
      const markupFee = 4.00;
      const retailRate = baseRate * 1.3; // 30% higher retail rate
      const savings = (retailRate - baseRate).toFixed(2);
      
      transactions.push({
        id: 'tx-' + Math.random().toString(36).substring(2, 9),
        type: 'shipping',
        amount: -markupFee,
        baseRate: baseRate.toFixed(2),
        retailRate: retailRate.toFixed(2),
        savings: savings,
        trackingNumber: 'MOCK' + (10000000 + Math.floor(Math.random() * 9000000)),
        description: 'Shipping label purchase',
        date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Calculate totals
    const balance = transactions.reduce((total, tx) => total + tx.amount, this.DEFAULT_BALANCE);
    const savingsTotal = transactions
      .filter(tx => tx.type === 'shipping' && tx.savings)
      .reduce((total, tx) => total + parseFloat(tx.savings), 0);
    const labelCount = transactions.filter(tx => tx.type === 'shipping').length;
    
    this.walletData = {
      balance: balance,
      transactions: transactions,
      savingsTotal: savingsTotal,
      labelCount: labelCount
    };
  }

  async getWalletData() {
    try {
      if (isBrowser) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
      
      // Return mock data in development if no stored data exists
      if (this.isDev && Object.keys(this.walletData.transactions || []).length === 0) {
        this.mockWalletData();
      }
      
      return this.walletData;
    } catch (error) {
      console.error('Error getting wallet data:', error);
      
      // Return default data on error
      return {
        balance: this.DEFAULT_BALANCE,
        transactions: [],
        savingsTotal: 0,
        labelCount: 0
      };
    }
  }

  async addTransaction(transactionData) {
    try {
      // Get current wallet data
      const walletData = await this.getWalletData();
      
      // Create transaction with ID and date
      const transaction = {
        id: 'tx-' + Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        ...transactionData
      };
      
      // Update wallet data
      walletData.transactions = [transaction, ...(walletData.transactions || [])];
      walletData.balance += transaction.amount;
      
      // Update savings statistics if this is a shipping transaction
      if (transaction.type === 'shipping' && transaction.savings) {
        walletData.savingsTotal = (walletData.savingsTotal || 0) + parseFloat(transaction.savings);
        walletData.labelCount = (walletData.labelCount || 0) + 1;
      }
      
      // Save updated wallet data
      await this.saveWalletData(walletData);
      
      return { success: true, transaction, newBalance: walletData.balance };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { success: false, error: error.message };
    }
  }

  async chargeForLabel(labelData, userPlan) {
    try {
      // Calculate the charge amount based on plan
      const fee = userPlan === 'PREMIUM' ? 3.00 : 4.00;
      const baseRate = parseFloat(labelData.baseRate);
      
      // Estimate retail rate (typically 20-40% higher)
      const retailRate = baseRate * 1.3; // 30% markup for retail
      const savings = (retailRate - baseRate).toFixed(2);
      
      // Create the transaction
      const transaction = {
        type: 'shipping',
        amount: -fee,
        baseRate: baseRate.toFixed(2),
        retailRate: retailRate.toFixed(2),
        savings: savings,
        trackingNumber: labelData.tracking_number,
        description: `Shipping label fee (${userPlan === 'PREMIUM' ? 'Premium' : 'Standard'} plan)`
      };
      
      // Add the transaction
      const result = await this.addTransaction(transaction);
      
      return result;
    } catch (error) {
      console.error('Error charging for label:', error);
      return { success: false, error: error.message };
    }
  }

  async addFunds(amount) {
    try {
      // Amount must be a positive number
      amount = parseFloat(amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }
      
      // Create the transaction
      const transaction = {
        type: 'deposit',
        amount: amount,
        description: 'Added funds'
      };
      
      // Add the transaction
      const result = await this.addTransaction(transaction);
      
      return result;
    } catch (error) {
      console.error('Error adding funds:', error);
      return { success: false, error: error.message };
    }
  }

  async getBalance() {
    try {
      const walletData = await this.getWalletData();
      return walletData.balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }
  
  async getSavingsStats() {
    try {
      const walletData = await this.getWalletData();
      return {
        savingsTotal: walletData.savingsTotal || 0,
        labelCount: walletData.labelCount || 0
      };
    } catch (error) {
      console.error('Error getting savings stats:', error);
      return { savingsTotal: 0, labelCount: 0 };
    }
  }

  async saveWalletData(walletData) {
    try {
      // Update in-memory data
      this.walletData = walletData;
      
      // Only try to use localStorage in browser environment
      if (isBrowser) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(walletData));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving wallet data:', error);
      return { success: false, error: error.message };
    }
  }

  async resetWallet() {
    // For development only
    if (!this.isDev) {
      return { success: false, error: 'Cannot reset wallet in production' };
    }
    
    try {
      this.walletData = {
        balance: this.DEFAULT_BALANCE,
        transactions: [],
        savingsTotal: 0,
        labelCount: 0
      };
      
      if (isBrowser) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.walletData));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting wallet:', error);
      return { success: false, error: error.message };
    }
  }
}

export const walletService = new WalletService(); 