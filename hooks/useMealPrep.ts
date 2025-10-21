/**
 * useMealPrep Hook
 * 
 * Custom hook for managing meal prep entries with portion tracking,
 * expiration management, and notifications.
 */

import { useState, useEffect, useCallback } from 'react';
import { mealPrepService, notificationsService } from '@/services';
import type { MealPrep, StorageLocation, StorageDefaults } from '@/types';

interface UseMealPrepReturn {
  mealPreps: MealPrep[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createMealPrep: (mealData: any) => Promise<MealPrep | null>;
  updateMealPrep: (id: string, updates: Partial<MealPrep>) => Promise<MealPrep | null>;
  deleteMealPrep: (id: string) => Promise<boolean>;
  consumePortion: (mealPrepId: string, portionId: string) => Promise<MealPrep | null>;
  movePortion: (mealPrepId: string, portionId: string, newLocation: StorageLocation) => Promise<MealPrep | null>;
  updatePortionExpiration: (mealPrepId: string, portionId: string, newDate: string) => Promise<MealPrep | null>;
  getExpiringSoon: () => Promise<MealPrep[]>;
  storageDefaults: StorageDefaults;
  updateStorageDefaults: (defaults: StorageDefaults) => Promise<void>;
}

/**
 * Hook for managing meal prep entries
 */
export function useMealPrep(): UseMealPrepReturn {
  const [mealPreps, setMealPreps] = useState<MealPrep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageDefaults, setStorageDefaults] = useState<StorageDefaults>({
    refrigeratorDays: 2,
    freezerDays: 30,
  });

  /**
   * Load storage defaults
   */
  const loadStorageDefaults = useCallback(async () => {
    const defaults = await mealPrepService.getStorageDefaults();
    setStorageDefaults(defaults);
  }, []);

  /**
   * Fetch meal preps from storage
   */
  const fetchMealPreps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await mealPrepService.getAllMealPreps();
      if (result.success && result.data) {
        // Sort by most recent first
        const sortedMeals = result.data.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setMealPreps(sortedMeals);
      } else {
        setError(result.error || 'Failed to load meal preps');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new meal prep
   */
  const createMealPrep = useCallback(async (mealData: any): Promise<MealPrep | null> => {
    try {
      const result = await mealPrepService.createMealPrep(mealData);
      if (result.success && result.data) {
        await fetchMealPreps(); // Refresh list
        return result.data;
      }
      setError(result.error || 'Failed to create meal prep');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchMealPreps]);

  /**
   * Update an existing meal prep
   */
  const updateMealPrep = useCallback(async (id: string, updates: Partial<MealPrep>): Promise<MealPrep | null> => {
    try {
      const result = await mealPrepService.updateMealPrep(id, updates);
      if (result.success && result.data) {
        await fetchMealPreps(); // Refresh list
        return result.data;
      }
      setError(result.error || 'Failed to update meal prep');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchMealPreps]);

  /**
   * Delete a meal prep
   */
  const deleteMealPrep = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await mealPrepService.deleteMealPrep(id);
      if (result.success) {
        await fetchMealPreps(); // Refresh list
        return true;
      }
      setError(result.error || 'Failed to delete meal prep');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchMealPreps]);

  /**
   * Mark a portion as consumed
   */
  const consumePortion = useCallback(async (mealPrepId: string, portionId: string): Promise<MealPrep | null> => {
    try {
      const result = await mealPrepService.consumePortion(mealPrepId, portionId);
      if (result.success && result.data) {
        await fetchMealPreps(); // Refresh list
        return result.data;
      }
      setError(result.error || 'Failed to consume portion');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchMealPreps]);

  /**
   * Move portion between storage locations
   */
  const movePortion = useCallback(
    async (mealPrepId: string, portionId: string, newLocation: StorageLocation): Promise<MealPrep | null> => {
      try {
        const result = await mealPrepService.movePortion(mealPrepId, portionId, newLocation);
        if (result.success && result.data) {
          await fetchMealPreps(); // Refresh list
          return result.data;
        }
        setError(result.error || 'Failed to move portion');
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return null;
      }
    },
    [fetchMealPreps]
  );

  /**
   * Update portion expiration date
   */
  const updatePortionExpiration = useCallback(
    async (mealPrepId: string, portionId: string, newDate: string): Promise<MealPrep | null> => {
      try {
        const result = await mealPrepService.updatePortionExpiration(mealPrepId, portionId, newDate);
        if (result.success && result.data) {
          await fetchMealPreps(); // Refresh list
          return result.data;
        }
        setError(result.error || 'Failed to update expiration date');
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return null;
      }
    },
    [fetchMealPreps]
  );

  /**
   * Get meal preps expiring soon
   */
  const getExpiringSoon = useCallback(async (): Promise<MealPrep[]> => {
    try {
      const result = await mealPrepService.getExpiringSoon();
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch (err) {
      console.error('Error getting expiring meals:', err);
      return [];
    }
  }, []);

  /**
   * Update storage defaults
   */
  const updateStorageDefaults = useCallback(async (defaults: StorageDefaults): Promise<void> => {
    try {
      const result = await mealPrepService.saveStorageDefaults(defaults);
      if (result.success) {
        setStorageDefaults(defaults);
      }
    } catch (err) {
      console.error('Error updating storage defaults:', err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadStorageDefaults();
    fetchMealPreps();
  }, [loadStorageDefaults, fetchMealPreps]);

  return {
    mealPreps,
    loading,
    error,
    refetch: fetchMealPreps,
    createMealPrep,
    updateMealPrep,
    deleteMealPrep,
    consumePortion,
    movePortion,
    updatePortionExpiration,
    getExpiringSoon,
    storageDefaults,
    updateStorageDefaults,
  };
}

/**
 * Hook for a single meal prep
 */
export function useMealPrepDetail(mealPrepId: string) {
  const [mealPrep, setMealPrep] = useState<MealPrep | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMealPrep = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await mealPrepService.getMealPrepById(mealPrepId);
      if (result.success && result.data) {
        setMealPrep(result.data);
      } else {
        setError(result.error || 'Meal prep not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [mealPrepId]);

  useEffect(() => {
    fetchMealPrep();
  }, [fetchMealPrep]);

  return { mealPrep, loading, error, refetch: fetchMealPrep };
}

/**
 * Hook for expiring items badge count
 */
export function useExpiringItemsCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateCount = useCallback(async () => {
    try {
      setLoading(true);
      const result = await mealPrepService.getExpiringSoon();
      if (result.success && result.data) {
        // Count total expiring portions
        const totalExpiring = result.data.reduce((total, meal) => {
          const expiringPortions = meal.portions.filter((p) => p.status === 'available').length;
          return total + expiringPortions;
        }, 0);
        setCount(totalExpiring);
      }
    } catch (err) {
      console.error('Error getting expiring items count:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateCount();
    // Update every 5 minutes
    const interval = setInterval(updateCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [updateCount]);

  return { count, loading, refetch: updateCount };
}

/**
 * Usage Examples:
 * 
 * // In a component
 * const { mealPreps, loading, createMealPrep, consumePortion } = useMealPrep();
 * 
 * // Create meal prep
 * const handleCreate = async () => {
 *   await createMealPrep({
 *     name: 'Chicken Breast',
 *     prepDate: '2025-01-21',
 *     refrigeratorPortions: 3,
 *     freezerPortions: 7,
 *   });
 * };
 * 
 * // Consume a portion
 * await consumePortion('meal_123', 'portion_1');
 * 
 * // Move portion to freezer
 * await movePortion('meal_123', 'portion_1', 'freezer');
 * 
 * // Badge count
 * const { count } = useExpiringItemsCount();
 */
