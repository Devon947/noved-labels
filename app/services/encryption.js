// Simple encryption/decryption service with browser detection
import { config } from '../../lib/config';

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get encryption key from config or environment
const ENCRYPTION_KEY = config?.encryption?.key || process.env.ENCRYPTION_KEY || 'default-dev-key-change-in-prod';

// In non-browser environments or during SSR, provide mock implementations
const mockEncryptionFunctions = {
  encrypt: async (data) => {
    console.warn('Mock encryption used in non-browser environment');
    return `MOCK_ENCRYPTED:${JSON.stringify(data)}`;
  },
  decrypt: async (encryptedString) => {
    console.warn('Mock decryption used in non-browser environment');
    if (encryptedString.startsWith('MOCK_ENCRYPTED:')) {
      return JSON.parse(encryptedString.replace('MOCK_ENCRYPTED:', ''));
    }
    return {};
  }
};

// Browser implementation using the Web Crypto API
const browserEncryptionFunctions = {
  encrypt: async (data) => {
    try {
      // Convert the encryption key to a crypto key
      const key = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(ENCRYPTION_KEY.slice(0, 32)), // Ensure key is valid length
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      // Generate random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Encrypt the data
      const encodedData = new TextEncoder().encode(JSON.stringify(data));
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      // Combine IV and encrypted data
      const result = {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData))
      };

      return btoa(JSON.stringify(result));
    } catch (error) {
      console.error('Encryption error:', error);
      return mockEncryptionFunctions.encrypt(data);
    }
  },

  decrypt: async (encryptedString) => {
    try {
      // Handle mock-encrypted data for development
      if (encryptedString.startsWith('MOCK_ENCRYPTED:')) {
        return mockEncryptionFunctions.decrypt(encryptedString);
      }
      
      // Parse the encrypted data
      const { iv, data } = JSON.parse(atob(encryptedString));

      // Convert the encryption key to a crypto key
      const key = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(ENCRYPTION_KEY.slice(0, 32)), // Ensure key is valid length
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        key,
        new Uint8Array(data)
      );

      return JSON.parse(new TextDecoder().decode(decryptedData));
    } catch (error) {
      console.error('Decryption error:', error);
      // Return empty object on error
      return {};
    }
  }
};

// Export the appropriate functions based on environment
export const { encrypt, decrypt } = isBrowser ? browserEncryptionFunctions : mockEncryptionFunctions; 