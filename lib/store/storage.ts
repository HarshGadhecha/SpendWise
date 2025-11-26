import { MMKV } from 'react-native-mmkv';

// Main storage for app data
export const storage = new MMKV({
  id: 'spendwise-storage',
  encryptionKey: 'spendwise-secret-key-2024', // TODO: Generate secure key
});

// Secret wallet storage (encrypted)
export const secretStorage = new MMKV({
  id: 'spendwise-secret-storage',
  encryptionKey: 'spendwise-secret-wallet-key-2024', // TODO: Generate secure key
});

// Storage utility functions
export const storageUtils = {
  // Generic get/set
  set: (key: string, value: any) => {
    storage.set(key, JSON.stringify(value));
  },

  get: <T,>(key: string): T | null => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  },

  delete: (key: string) => {
    storage.delete(key);
  },

  clear: () => {
    storage.clearAll();
  },

  // Secret wallet specific
  setSecret: (key: string, value: any) => {
    secretStorage.set(key, JSON.stringify(value));
  },

  getSecret: <T,>(key: string): T | null => {
    const value = secretStorage.getString(key);
    return value ? JSON.parse(value) : null;
  },

  deleteSecret: (key: string) => {
    secretStorage.delete(key);
  },

  clearSecret: () => {
    secretStorage.clearAll();
  },
};

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
