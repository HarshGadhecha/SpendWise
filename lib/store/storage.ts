import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Main storage using AsyncStorage for app data
class Storage {
  // Generic get/set
  async set(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  // Secret wallet specific (using SecureStore for encryption)
  async setSecret(key: string, value: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (error) {
      console.error('Secret storage set error:', error);
    }
  }

  async getSecret<T>(key: string): Promise<T | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Secret storage get error:', error);
      return null;
    }
  }

  async deleteSecret(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Secret storage delete error:', error);
    }
  }

  async clearSecret(): Promise<void> {
    // SecureStore doesn't have a clearAll, so we need to track keys
    // For now, just clear known secret keys
    const secretKeys = ['secret_wallet_data', 'secret_transactions'];
    for (const key of secretKeys) {
      await this.deleteSecret(key);
    }
  }
}

const storageInstance = new Storage();

// Storage utility functions (backward compatible with sync-like API)
export const storageUtils = {
  set: (key: string, value: any) => {
    storageInstance.set(key, value);
  },

  get: <T,>(key: string): T | null => {
    // For backward compatibility, we'll need to make this async in actual usage
    // But for now, return null and use async methods directly
    return null;
  },

  delete: (key: string) => {
    storageInstance.delete(key);
  },

  clear: () => {
    storageInstance.clear();
  },

  setSecret: (key: string, value: any) => {
    storageInstance.setSecret(key, value);
  },

  getSecret: <T,>(key: string): T | null => {
    // For backward compatibility
    return null;
  },

  deleteSecret: (key: string) => {
    storageInstance.deleteSecret(key);
  },

  clearSecret: () => {
    storageInstance.clearSecret();
  },
};

// Export the storage instance for async usage
export const storage = storageInstance;

// Storage keys constants
export const STORAGE_KEYS = {
  USER: 'user',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  THEME: 'theme',
  CURRENCY: 'currency',
  PIN: 'pin',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_SYNC: 'last_sync',
  OFFLINE_QUEUE: 'offline_queue',
  STREAK_DATA: 'streak_data',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
};
