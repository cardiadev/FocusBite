/**
 * useActivities Hooks
 * 
 * Custom hooks for managing nutrition and exercise logs with loading states,
 * error handling, and automatic data refresh.
 */

import { useState, useEffect, useCallback } from 'react';
import { nutritionLogsService, exerciseLogsService } from '@/services';
import type { NutritionLog, ExerciseLog } from '@/types';

// ============================================================================
// Nutrition Logs Hook
// ============================================================================

interface UseNutritionLogsReturn {
  logs: NutritionLog[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createLog: (logData: Omit<NutritionLog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<NutritionLog | null>;
  updateLog: (id: string, updates: Partial<NutritionLog>) => Promise<NutritionLog | null>;
  deleteLog: (id: string) => Promise<boolean>;
  getTotalCalories: (date: string) => Promise<number>;
  getMacros: (date: string) => Promise<{ protein: number; carbs: number; fats: number }>;
}

/**
 * Hook for managing nutrition logs
 */
export function useNutritionLogs(date?: string, goalId?: string): UseNutritionLogsReturn {
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch nutrition logs
   */
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (date) {
        result = await nutritionLogsService.getLogsByDate(date);
      } else if (goalId) {
        result = await nutritionLogsService.getLogsByGoalId(goalId);
      } else {
        result = await nutritionLogsService.getAllLogs();
      }

      if (result.success && result.data) {
        // Sort by time (most recent first)
        const sortedLogs = result.data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`).getTime();
          const dateB = new Date(`${b.date}T${b.time}`).getTime();
          return dateB - dateA;
        });
        setLogs(sortedLogs);
      } else {
        setError(result.error || 'Failed to load nutrition logs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [date, goalId]);

  /**
   * Create a new log
   */
  const createLog = useCallback(
    async (logData: Omit<NutritionLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<NutritionLog | null> => {
      try {
        const result = await nutritionLogsService.createLog(logData);
        if (result.success && result.data) {
          await fetchLogs(); // Refresh list
          return result.data;
        }
        setError(result.error || 'Failed to create log');
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return null;
      }
    },
    [fetchLogs]
  );

  /**
   * Update a log
   */
  const updateLog = useCallback(
    async (id: string, updates: Partial<NutritionLog>): Promise<NutritionLog | null> => {
      try {
        const result = await nutritionLogsService.updateLog(id, updates);
        if (result.success && result.data) {
          await fetchLogs(); // Refresh list
          return result.data;
        }
        setError(result.error || 'Failed to update log');
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return null;
      }
    },
    [fetchLogs]
  );

  /**
   * Delete a log
   */
  const deleteLog = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const result = await nutritionLogsService.deleteLog(id);
        if (result.success) {
          await fetchLogs(); // Refresh list
          return true;
        }
        setError(result.error || 'Failed to delete log');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return false;
      }
    },
    [fetchLogs]
  );

  /**
   * Get total calories for a date
   */
  const getTotalCalories = useCallback(async (dateStr: string): Promise<number> => {
    return nutritionLogsService.getTotalCaloriesForDate(dateStr);
  }, []);

  /**
   * Get macros for a date
   */
  const getMacros = useCallback(async (dateStr: string) => {
    return nutritionLogsService.getMacrosForDate(dateStr);
  }, []);

  // Load logs on mount and when filters change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
    createLog,
    updateLog,
    deleteLog,
    getTotalCalories,
    getMacros,
  };
}

// ============================================================================
// Exercise Logs Hook
// ============================================================================

interface UseExerciseLogsReturn {
  logs: ExerciseLog[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createLog: (logData: Omit<ExerciseLog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ExerciseLog | null>;
  updateLog: (id: string, updates: Partial<ExerciseLog>) => Promise<ExerciseLog | null>;
  deleteLog: (id: string) => Promise<boolean>;
  getTotalDuration: (date: string) => Promise<number>;
  getTotalCaloriesBurned: (date: string) => Promise<number>;
}

/**
 * Hook for managing exercise logs
 */
export function useExerciseLogs(date?: string, goalId?: string): UseExerciseLogsReturn {
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch exercise logs
   */
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (date) {
        result = await exerciseLogsService.getLogsByDate(date);
      } else if (goalId) {
        result = await exerciseLogsService.getLogsByGoalId(goalId);
      } else {
        result = await exerciseLogsService.getAllLogs();
      }

      if (result.success && result.data) {
        // Sort by time (most recent first)
        const sortedLogs = result.data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`).getTime();
          const dateB = new Date(`${b.date}T${b.time}`).getTime();
          return dateB - dateA;
        });
        setLogs(sortedLogs);
      } else {
        setError(result.error || 'Failed to load exercise logs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [date, goalId]);

  /**
   * Create a new log
   */
  const createLog = useCallback(
    async (logData: Omit<ExerciseLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExerciseLog | null> => {
      try {
        const result = await exerciseLogsService.createLog(logData);
        if (result.success && result.data) {
          await fetchLogs(); // Refresh list
          return result.data;
        }
        setError(result.error || 'Failed to create log');
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return null;
      }
    },
    [fetchLogs]
  );

  /**
   * Update a log
   */
  const updateLog = useCallback(
    async (id: string, updates: Partial<ExerciseLog>): Promise<ExerciseLog | null> => {
      try {
        const result = await exerciseLogsService.updateLog(id, updates);
        if (result.success && result.data) {
          await fetchLogs(); // Refresh list
          return result.data;
        }
        setError(result.error || 'Failed to update log');
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return null;
      }
    },
    [fetchLogs]
  );

  /**
   * Delete a log
   */
  const deleteLog = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const result = await exerciseLogsService.deleteLog(id);
        if (result.success) {
          await fetchLogs(); // Refresh list
          return true;
        }
        setError(result.error || 'Failed to delete log');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return false;
      }
    },
    [fetchLogs]
  );

  /**
   * Get total duration for a date
   */
  const getTotalDuration = useCallback(async (dateStr: string): Promise<number> => {
    return exerciseLogsService.getTotalDurationForDate(dateStr);
  }, []);

  /**
   * Get total calories burned for a date
   */
  const getTotalCaloriesBurned = useCallback(async (dateStr: string): Promise<number> => {
    return exerciseLogsService.getTotalCaloriesBurnedForDate(dateStr);
  }, []);

  // Load logs on mount and when filters change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
    createLog,
    updateLog,
    deleteLog,
    getTotalDuration,
    getTotalCaloriesBurned,
  };
}

/**
 * Usage Examples:
 * 
 * // Get today's nutrition logs
 * const { logs, createLog, getTotalCalories } = useNutritionLogs('2025-01-21');
 * 
 * // Get exercise logs for a goal
 * const { logs: exerciseLogs } = useExerciseLogs(undefined, 'goal_123');
 * 
 * // Log a meal
 * const handleLogMeal = async () => {
 *   await createLog({
 *     date: '2025-01-21',
 *     time: '12:30',
 *     mealType: 'lunch',
 *     foodName: 'Grilled Chicken',
 *     calories: 350,
 *     protein: 30,
 *     carbs: 10,
 *     fats: 20,
 *   });
 * };
 */
