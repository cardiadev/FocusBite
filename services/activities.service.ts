/**
 * Activities Service
 * 
 * Handles CRUD operations for nutrition and exercise logs.
 * Provides filtering, aggregation, and date-based queries.
 */

import { storageService, STORAGE_KEYS } from './storage.service';
import type { NutritionLog, ExerciseLog, ActivityFilters, ServiceResponse } from '@/types';

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Nutrition Logs Service
 */
class NutritionLogsService {
  /**
   * Create a new nutrition log
   */
  async createLog(logData: Omit<NutritionLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<NutritionLog>> {
    try {
      const now = new Date().toISOString();
      const newLog: NutritionLog = {
        ...logData,
        id: generateId('nutr'),
        createdAt: now,
        updatedAt: now,
      };

      const existingLogs = await this.getAllLogs();
      const logs = existingLogs.data || [];
      logs.push(newLog);

      const saveResult = await storageService.save(STORAGE_KEYS.NUTRITION_LOGS, logs);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: newLog };
    } catch (error) {
      console.error('Error creating nutrition log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create log',
      };
    }
  }

  /**
   * Get all nutrition logs
   */
  async getAllLogs(): Promise<ServiceResponse<NutritionLog[]>> {
    try {
      const result = await storageService.load<NutritionLog[]>(STORAGE_KEYS.NUTRITION_LOGS);
      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error getting nutrition logs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get logs',
      };
    }
  }

  /**
   * Get log by ID
   */
  async getLogById(id: string): Promise<ServiceResponse<NutritionLog>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const log = logs.find((l) => l.id === id);

      if (!log) {
        return { success: false, error: 'Log not found' };
      }

      return { success: true, data: log };
    } catch (error) {
      console.error('Error getting log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get log',
      };
    }
  }

  /**
   * Update a log
   */
  async updateLog(id: string, updates: Partial<NutritionLog>): Promise<ServiceResponse<NutritionLog>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const index = logs.findIndex((l) => l.id === id);

      if (index === -1) {
        return { success: false, error: 'Log not found' };
      }

      const updatedLog: NutritionLog = {
        ...logs[index],
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };

      logs[index] = updatedLog;

      const saveResult = await storageService.save(STORAGE_KEYS.NUTRITION_LOGS, logs);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedLog };
    } catch (error) {
      console.error('Error updating log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update log',
      };
    }
  }

  /**
   * Delete a log
   */
  async deleteLog(id: string): Promise<ServiceResponse<void>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const filteredLogs = logs.filter((l) => l.id !== id);

      if (logs.length === filteredLogs.length) {
        return { success: false, error: 'Log not found' };
      }

      const saveResult = await storageService.save(STORAGE_KEYS.NUTRITION_LOGS, filteredLogs);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete log',
      };
    }
  }

  /**
   * Get logs for a specific date
   */
  async getLogsByDate(date: string): Promise<ServiceResponse<NutritionLog[]>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const filteredLogs = logs.filter((l) => l.date === date);

      return { success: true, data: filteredLogs };
    } catch (error) {
      console.error('Error filtering logs by date:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to filter logs',
      };
    }
  }

  /**
   * Get logs by goal ID
   */
  async getLogsByGoalId(goalId: string): Promise<ServiceResponse<NutritionLog[]>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const filteredLogs = logs.filter((l) => l.goalId === goalId);

      return { success: true, data: filteredLogs };
    } catch (error) {
      console.error('Error filtering logs by goal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to filter logs',
      };
    }
  }

  /**
   * Calculate total calories for a date
   */
  async getTotalCaloriesForDate(date: string): Promise<number> {
    const result = await this.getLogsByDate(date);
    const logs = result.data || [];
    return logs.reduce((total, log) => total + log.calories, 0);
  }

  /**
   * Calculate total macros for a date
   */
  async getMacrosForDate(date: string): Promise<{ protein: number; carbs: number; fats: number }> {
    const result = await this.getLogsByDate(date);
    const logs = result.data || [];

    return logs.reduce(
      (totals, log) => ({
        protein: totals.protein + log.protein,
        carbs: totals.carbs + log.carbs,
        fats: totals.fats + log.fats,
      }),
      { protein: 0, carbs: 0, fats: 0 }
    );
  }
}

/**
 * Exercise Logs Service
 */
class ExerciseLogsService {
  /**
   * Create a new exercise log
   */
  async createLog(logData: Omit<ExerciseLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<ExerciseLog>> {
    try {
      const now = new Date().toISOString();
      const newLog: ExerciseLog = {
        ...logData,
        id: generateId('exer'),
        createdAt: now,
        updatedAt: now,
      };

      const existingLogs = await this.getAllLogs();
      const logs = existingLogs.data || [];
      logs.push(newLog);

      const saveResult = await storageService.save(STORAGE_KEYS.EXERCISE_LOGS, logs);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: newLog };
    } catch (error) {
      console.error('Error creating exercise log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create log',
      };
    }
  }

  /**
   * Get all exercise logs
   */
  async getAllLogs(): Promise<ServiceResponse<ExerciseLog[]>> {
    try {
      const result = await storageService.load<ExerciseLog[]>(STORAGE_KEYS.EXERCISE_LOGS);
      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error getting exercise logs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get logs',
      };
    }
  }

  /**
   * Get log by ID
   */
  async getLogById(id: string): Promise<ServiceResponse<ExerciseLog>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const log = logs.find((l) => l.id === id);

      if (!log) {
        return { success: false, error: 'Log not found' };
      }

      return { success: true, data: log };
    } catch (error) {
      console.error('Error getting log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get log',
      };
    }
  }

  /**
   * Update a log
   */
  async updateLog(id: string, updates: Partial<ExerciseLog>): Promise<ServiceResponse<ExerciseLog>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const index = logs.findIndex((l) => l.id === id);

      if (index === -1) {
        return { success: false, error: 'Log not found' };
      }

      const updatedLog: ExerciseLog = {
        ...logs[index],
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };

      logs[index] = updatedLog;

      const saveResult = await storageService.save(STORAGE_KEYS.EXERCISE_LOGS, logs);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedLog };
    } catch (error) {
      console.error('Error updating log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update log',
      };
    }
  }

  /**
   * Delete a log
   */
  async deleteLog(id: string): Promise<ServiceResponse<void>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const filteredLogs = logs.filter((l) => l.id !== id);

      if (logs.length === filteredLogs.length) {
        return { success: false, error: 'Log not found' };
      }

      const saveResult = await storageService.save(STORAGE_KEYS.EXERCISE_LOGS, filteredLogs);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete log',
      };
    }
  }

  /**
   * Get logs for a specific date
   */
  async getLogsByDate(date: string): Promise<ServiceResponse<ExerciseLog[]>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const filteredLogs = logs.filter((l) => l.date === date);

      return { success: true, data: filteredLogs };
    } catch (error) {
      console.error('Error filtering logs by date:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to filter logs',
      };
    }
  }

  /**
   * Get logs by goal ID
   */
  async getLogsByGoalId(goalId: string): Promise<ServiceResponse<ExerciseLog[]>> {
    try {
      const result = await this.getAllLogs();
      const logs = result.data || [];
      const filteredLogs = logs.filter((l) => l.goalId === goalId);

      return { success: true, data: filteredLogs };
    } catch (error) {
      console.error('Error filtering logs by goal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to filter logs',
      };
    }
  }

  /**
   * Calculate total duration for a date
   */
  async getTotalDurationForDate(date: string): Promise<number> {
    const result = await this.getLogsByDate(date);
    const logs = result.data || [];
    return logs.reduce((total, log) => total + log.duration, 0);
  }

  /**
   * Calculate total calories burned for a date
   */
  async getTotalCaloriesBurnedForDate(date: string): Promise<number> {
    const result = await this.getLogsByDate(date);
    const logs = result.data || [];
    return logs.reduce((total, log) => total + (log.caloriesBurned || 0), 0);
  }
}

// Export singleton instances
export const nutritionLogsService = new NutritionLogsService();
export const exerciseLogsService = new ExerciseLogsService();

/**
 * Usage Examples:
 * 
 * // Log nutrition
 * const nutritionResult = await nutritionLogsService.createLog({
 *   date: '2025-01-21',
 *   time: '12:30',
 *   mealType: 'lunch',
 *   foodName: 'Grilled Chicken Salad',
 *   calories: 450,
 *   protein: 35,
 *   carbs: 25,
 *   fats: 20,
 *   goalId: 'goal_123',
 * });
 * 
 * // Log exercise
 * const exerciseResult = await exerciseLogsService.createLog({
 *   date: '2025-01-21',
 *   time: '06:00',
 *   exerciseType: 'cardio',
 *   name: 'Morning Run',
 *   duration: 30,
 *   caloriesBurned: 320,
 *   goalId: 'goal_124',
 * });
 * 
 * // Get today's nutrition
 * const todayLogs = await nutritionLogsService.getLogsByDate('2025-01-21');
 * 
 * // Get total calories
 * const totalCalories = await nutritionLogsService.getTotalCaloriesForDate('2025-01-21');
 */
