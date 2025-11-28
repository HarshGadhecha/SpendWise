import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { storageUtils, STORAGE_KEYS } from '@/lib/store/storage';

class SecurityService {
  // Check if biometric authentication is available
  async isBiometricAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  // Get supported biometric types
  async getSupportedBiometricTypes(): Promise<LocalAuthentication.SecurityLevel[]> {
    return await LocalAuthentication.getEnrolledLevelAsync();
  }

  // Authenticate with biometrics
  async authenticateWithBiometrics(reason: string = 'Authenticate to access MintyFlow'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  // Set PIN
  async setPin(pin: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('user_pin', pin);
      storageUtils.set(STORAGE_KEYS.PIN, true);
    } catch (error) {
      throw new Error('Failed to set PIN');
    }
  }

  // Verify PIN
  async verifyPin(pin: string): Promise<boolean> {
    try {
      const storedPin = await SecureStore.getItemAsync('user_pin');
      return storedPin === pin;
    } catch (error) {
      console.error('PIN verification error:', error);
      return false;
    }
  }

  // Check if PIN is set
  async isPinSet(): Promise<boolean> {
    try {
      const pin = await SecureStore.getItemAsync('user_pin');
      return pin !== null;
    } catch (error) {
      return false;
    }
  }

  // Remove PIN
  async removePin(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('user_pin');
      storageUtils.delete(STORAGE_KEYS.PIN);
    } catch (error) {
      throw new Error('Failed to remove PIN');
    }
  }

  // Enable biometric authentication
  async enableBiometric(): Promise<void> {
    storageUtils.set(STORAGE_KEYS.BIOMETRIC_ENABLED, true);
  }

  // Disable biometric authentication
  async disableBiometric(): Promise<void> {
    storageUtils.set(STORAGE_KEYS.BIOMETRIC_ENABLED, false);
  }

  // Check if biometric is enabled
  isBiometricEnabled(): boolean {
    return storageUtils.get<boolean>(STORAGE_KEYS.BIOMETRIC_ENABLED) || false;
  }

  // Main authentication check (PIN or Biometric)
  async authenticate(): Promise<boolean> {
    const biometricEnabled = this.isBiometricEnabled();
    const biometricAvailable = await this.isBiometricAvailable();

    if (biometricEnabled && biometricAvailable) {
      return await this.authenticateWithBiometrics();
    }

    // If biometric fails or not available, fall back to PIN
    // This will be handled by the UI
    return false;
  }

  // Encrypt sensitive data (for secret wallet)
  async encryptData(key: string, data: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, data);
    } catch (error) {
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt sensitive data
  async decryptData(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
}

export const securityService = new SecurityService();
