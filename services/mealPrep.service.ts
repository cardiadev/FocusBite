/**
 * Meal Prep Service
 * 
 * Handles all CRUD operations for meal prep entries and portion management.
 * Integrates with notifications service for expiration alerts.
 */

import { addDays, format, parseISO } from 'date-fns';
import { storageService, STORAGE_KEYS } from './storage.service';
import { notificationsService } from './notifications.service';
import type { MealPrep, MealPortion, StorageLocation, PortionStatus, ServiceResponse, StorageDefaults } from '@/types';

const DEFAULT_STORAGE_KEY = '@focusbite:storage_defaults';

// Default storage times
const DEFAULT_STORAGE_DEFAULTS: StorageDefaults = {
  refrigeratorDays: 2,
  freezerDays: 30,
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate expiration date based on storage location
 */
function calculateExpirationDate(prepDate: string, location: StorageLocation, defaults: StorageDefaults): string {
  const prep = parseISO(prepDate);
  const days = location === 'refrigerator' ? defaults.refrigeratorDays : defaults.freezerDays;
  const expiration = addDays(prep, days);
  return format(expiration, 'yyyy-MM-dd');
}

/**
 * Meal Prep Service Class
 */
class MealPrepService {
  /**
   * Get storage defaults
   */
  async getStorageDefaults(): Promise<StorageDefaults> {
    try {
      const result = await storageService.load<StorageDefaults>(DEFAULT_STORAGE_KEY);
      return result.data || DEFAULT_STORAGE_DEFAULTS;
    } catch (error) {
      return DEFAULT_STORAGE_DEFAULTS;
    }
  }

  /**
   * Save storage defaults
   */
  async saveStorageDefaults(defaults: StorageDefaults): Promise<ServiceResponse<StorageDefaults>> {
    return storageService.save(DEFAULT_STORAGE_KEY, defaults);
  }

  /**
   * Create a new meal prep entry
   */
  async createMealPrep(
    mealData: Omit<MealPrep, 'id' | 'createdAt' | 'updatedAt' | 'portions'> & {
      refrigeratorPortions: number;
      freezerPortions: number;
    }
  ): Promise<ServiceResponse<MealPrep>> {
    try {
      const now = new Date().toISOString();
      const defaults = await this.getStorageDefaults();

      // Create portions
      const portions: MealPortion[] = [];

      // Create refrigerator portions
      for (let i = 0; i < mealData.refrigeratorPortions; i++) {
        portions.push({
          id: generateId('portion'),
          location: 'refrigerator',
          expirationDate: calculateExpirationDate(mealData.prepDate, 'refrigerator', defaults),
          status: 'available',
        });
      }

      // Create freezer portions
      for (let i = 0; i < mealData.freezerPortions; i++) {
        portions.push({
          id: generateId('portion'),
          location: 'freezer',
          expirationDate: calculateExpirationDate(mealData.prepDate, 'freezer', defaults),
          status: 'available',
        });
      }

      const newMealPrep: MealPrep = {
        id: generateId('meal'),
        name: mealData.name,
        description: mealData.description,
        prepDate: mealData.prepDate,
        totalPortions: mealData.refrigeratorPortions + mealData.freezerPortions,
        portions,
        nutritionPerPortion: mealData.nutritionPerPortion,
        ingredients: mealData.ingredients,
        instructions: mealData.instructions,
        prepTime: mealData.prepTime,
        mealType: mealData.mealType,
        tags: mealData.tags,
        photoUri: mealData.photoUri,
        createdAt: now,
        updatedAt: now,
      };

      // Save to storage
      const existingMeals = await this.getAllMealPreps();
      const meals = existingMeals.data || [];
      meals.push(newMealPrep);

      const saveResult = await storageService.save(STORAGE_KEYS.MEAL_PREP_PLANS, meals);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      // Schedule notifications for all portions
      await notificationsService.scheduleNotificationsForPortions(newMealPrep.id, newMealPrep.name, portions);

      return { success: true, data: newMealPrep };
    } catch (error) {
      console.error('Error creating meal prep:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create meal prep',
      };
    }
  }

  /**
   * Get all meal preps
   */
  async getAllMealPreps(): Promise<ServiceResponse<MealPrep[]>> {
    try {
      const result = await storageService.load<MealPrep[]>(STORAGE_KEYS.MEAL_PREP_PLANS);
      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error getting meal preps:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get meal preps',
      };
    }
  }

  /**
   * Get meal prep by ID
   */
  async getMealPrepById(id: string): Promise<ServiceResponse<MealPrep>> {
    try {
      const result = await this.getAllMealPreps();
      const meals = result.data || [];
      const meal = meals.find((m) => m.id === id);

      if (!meal) {
        return { success: false, error: 'Meal prep not found' };
      }

      return { success: true, data: meal };
    } catch (error) {
      console.error('Error getting meal prep:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get meal prep',
      };
    }
  }

  /**
   * Update a meal prep
   */
  async updateMealPrep(id: string, updates: Partial<MealPrep>): Promise<ServiceResponse<MealPrep>> {
    try {
      const result = await this.getAllMealPreps();
      const meals = result.data || [];
      const index = meals.findIndex((m) => m.id === id);

      if (index === -1) {
        return { success: false, error: 'Meal prep not found' };
      }

      const updatedMeal: MealPrep = {
        ...meals[index],
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      };

      meals[index] = updatedMeal;

      const saveResult = await storageService.save(STORAGE_KEYS.MEAL_PREP_PLANS, meals);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedMeal };
    } catch (error) {
      console.error('Error updating meal prep:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update meal prep',
      };
    }
  }

  /**
   * Delete a meal prep
   */
  async deleteMealPrep(id: string): Promise<ServiceResponse<void>> {
    try {
      const result = await this.getAllMealPreps();
      const meals = result.data || [];
      const filteredMeals = meals.filter((m) => m.id !== id);

      if (meals.length === filteredMeals.length) {
        return { success: false, error: 'Meal prep not found' };
      }

      const saveResult = await storageService.save(STORAGE_KEYS.MEAL_PREP_PLANS, filteredMeals);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      // Cancel all notifications for this meal prep
      // (In a real implementation, you'd track notification IDs)

      return { success: true };
    } catch (error) {
      console.error('Error deleting meal prep:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete meal prep',
      };
    }
  }

  /**
   * Mark a portion as consumed
   */
  async consumePortion(mealPrepId: string, portionId: string): Promise<ServiceResponse<MealPrep>> {
    try {
      const result = await this.getMealPrepById(mealPrepId);
      if (!result.success || !result.data) {
        return { success: false, error: 'Meal prep not found' };
      }

      const meal = result.data;
      const portion = meal.portions.find((p) => p.id === portionId);

      if (!portion) {
        return { success: false, error: 'Portion not found' };
      }

      // Update portion status
      portion.status = 'consumed';
      portion.consumedAt = new Date().toISOString();

      return this.updateMealPrep(mealPrepId, { portions: meal.portions });
    } catch (error) {
      console.error('Error consuming portion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark portion as consumed',
      };
    }
  }

  /**
   * Move portion between storage locations
   */
  async movePortion(
    mealPrepId: string,
    portionId: string,
    newLocation: StorageLocation,
    newExpirationDate?: string
  ): Promise<ServiceResponse<MealPrep>> {
    try {
      const result = await this.getMealPrepById(mealPrepId);
      if (!result.success || !result.data) {
        return { success: false, error: 'Meal prep not found' };
      }

      const meal = result.data;
      const portion = meal.portions.find((p) => p.id === portionId);

      if (!portion) {
        return { success: false, error: 'Portion not found' };
      }

      // Update portion location
      portion.location = newLocation;

      // Calculate new expiration date if not provided
      if (!newExpirationDate) {
        const defaults = await this.getStorageDefaults();
        const moveDate = format(new Date(), 'yyyy-MM-dd');
        portion.expirationDate = calculateExpirationDate(moveDate, newLocation, defaults);
      } else {
        portion.expirationDate = newExpirationDate;
      }

      // Reschedule notification
      await notificationsService.scheduleExpirationNotification(
        mealPrepId,
        portionId,
        meal.name,
        portion.expirationDate,
        newLocation
      );

      return this.updateMealPrep(mealPrepId, { portions: meal.portions });
    } catch (error) {
      console.error('Error moving portion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to move portion',
      };
    }
  }

  /**
   * Update portion expiration date
   */
  async updatePortionExpiration(
    mealPrepId: string,
    portionId: string,
    newExpirationDate: string
  ): Promise<ServiceResponse<MealPrep>> {
    try {
      const result = await this.getMealPrepById(mealPrepId);
      if (!result.success || !result.data) {
        return { success: false, error: 'Meal prep not found' };
      }

      const meal = result.data;
      const portion = meal.portions.find((p) => p.id === portionId);

      if (!portion) {
        return { success: false, error: 'Portion not found' };
      }

      // Update expiration date
      portion.expirationDate = newExpirationDate;

      // Reschedule notification
      await notificationsService.scheduleExpirationNotification(
        mealPrepId,
        portionId,
        meal.name,
        newExpirationDate,
        portion.location
      );

      return this.updateMealPrep(mealPrepId, { portions: meal.portions });
    } catch (error) {
      console.error('Error updating portion expiration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update expiration date',
      };
    }
  }

  /**
   * Get available portions count by location
   */
  getAvailablePortionsByLocation(meal: MealPrep): { refrigerator: number; freezer: number; total: number } {
    const available = meal.portions.filter((p) => p.status === 'available');
    return {
      refrigerator: available.filter((p) => p.location === 'refrigerator').length,
      freezer: available.filter((p) => p.location === 'freezer').length,
      total: available.length,
    };
  }

  /**
   * Get expiring soon meal preps (within 48 hours)
   */
  async getExpiringSoon(): Promise<ServiceResponse<MealPrep[]>> {
    try {
      const result = await this.getAllMealPreps();
      const meals = result.data || [];
      const now = new Date();
      const fortyEightHoursFromNow = addDays(now, 2);

      const expiringSoon = meals.filter((meal) => {
        return meal.portions.some((portion) => {
          if (portion.status !== 'available') return false;
          const expiration = parseISO(portion.expirationDate);
          return expiration <= fortyEightHoursFromNow && expiration >= now;
        });
      });

      return { success: true, data: expiringSoon };
    } catch (error) {
      console.error('Error getting expiring soon meals:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get expiring meals',
      };
    }
  }
}

// Export singleton instance
export const mealPrepService = new MealPrepService();

/**
 * Usage Examples:
 * 
 * // Create meal prep
 * const meal = await mealPrepService.createMealPrep({
 *   name: 'Chicken Breast',
 *   prepDate: '2025-01-21',
 *   refrigeratorPortions: 3,
 *   freezerPortions: 7,
 *   totalPortions: 10,
 *   nutritionPerPortion: {
 *     calories: 350,
 *     protein: 35,
 *     carbs: 25,
 *     fats: 12,
 *   },
 * });
 * 
 * // Consume a portion
 * await mealPrepService.consumePortion('meal_123', 'portion_1');
 * 
 * // Move portion from fridge to freezer
 * await mealPrepService.movePortion('meal_123', 'portion_1', 'freezer');
 * 
 * // Update expiration date
 * await mealPrepService.updatePortionExpiration('meal_123', 'portion_1', '2025-02-01');
 * 
 * // Get expiring soon
 * const expiring = await mealPrepService.getExpiringSoon();
 */
