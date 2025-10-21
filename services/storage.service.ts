/**
 * Storage Service
 * 
 * Centralized service for all AsyncStorage operations.
 * Provides type-safe CRUD operations for app data.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ServiceResponse } from '@/types';

// Storage keys
export const STORAGE_KEYS = {
  GOALS: '@focusbite:goals',
  NUTRITION_LOGS: '@focusbite:nutrition_logs',
  EXERCISE_LOGS: '@focusbite:exercise_logs',
  USER_PROFILE: '@focusbite:user_profile',
  MEAL_PREP_PLANS: '@focusbite:meal_prep_plans',
} as const;

/**
 * Generic storage operations
 */
class StorageService {
  /**
   * Save data to AsyncStorage
   */
  async save<T>(key: string, data: T): Promise<ServiceResponse<T>> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
      return { success: true, data };
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save data',
      };
    }
  }

  /**
   * Load data from AsyncStorage
   */
  async load<T>(key: string): Promise<ServiceResponse<T>> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return { success: true, data: undefined };
      }
      const data = JSON.parse(jsonValue) as T;
      return { success: true, data };
    } catch (error) {
      console.error(`Error loading from ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      };
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  async remove(key: string): Promise<ServiceResponse<void>> {
    try {
      await AsyncStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove data',
      };
    }
  }

  /**
   * Clear all app data (use with caution!)
   */
  async clearAll(): Promise<ServiceResponse<void>> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      return { success: true };
    } catch (error) {
      console.error('Error clearing storage:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear storage',
      };
    }
  }

  /**
   * Get multiple items at once
   */
  async loadMultiple<T>(keys: string[]): Promise<ServiceResponse<T[]>> {
    try {
      const results = await AsyncStorage.multiGet(keys);
      const data = results
        .filter(([, value]) => value !== null)
        .map(([, value]) => JSON.parse(value as string) as T);
      return { success: true, data };
    } catch (error) {
      console.error('Error loading multiple items:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      };
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
