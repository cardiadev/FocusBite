/**
 * useGoals Hook
 * 
 * Custom hook for managing goals with loading states, error handling,
 * and automatic data refresh.
 */

import { useState, useEffect, useCallback } from 'react';
import { goalsService } from '@/services';
import type { Goal, GoalFilters, GoalType } from '@/types';

interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createGoal: (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Goal | null>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<Goal | null>;
  deleteGoal: (id: string) => Promise<boolean>;
  updateProgress: (id: string, value: number) => Promise<Goal | null>;
  completeGoal: (id: string) => Promise<Goal | null>;
  getProgress: (goal: Goal) => number;
}

/**
 * Hook for managing all goals
 */
export function useGoals(filters?: GoalFilters): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch goals from storage
   */
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (filters) {
        result = await goalsService.filterGoals(filters);
      } else {
        result = await goalsService.getAllGoals();
      }

      if (result.success && result.data) {
        // Sort by most recent first
        const sortedGoals = result.data.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setGoals(sortedGoals);
      } else {
        setError(result.error || 'Failed to load goals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Create a new goal
   */
  const createGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal | null> => {
    try {
      const result = await goalsService.createGoal(goalData);
      if (result.success && result.data) {
        await fetchGoals(); // Refresh list
        return result.data;
      }
      setError(result.error || 'Failed to create goal');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchGoals]);

  /**
   * Update an existing goal
   */
  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>): Promise<Goal | null> => {
    try {
      const result = await goalsService.updateGoal(id, updates);
      if (result.success && result.data) {
        await fetchGoals(); // Refresh list
        return result.data;
      }
      setError(result.error || 'Failed to update goal');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchGoals]);

  /**
   * Delete a goal
   */
  const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await goalsService.deleteGoal(id);
      if (result.success) {
        await fetchGoals(); // Refresh list
        return true;
      }
      setError(result.error || 'Failed to delete goal');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchGoals]);

  /**
   * Update goal progress
   */
  const updateProgress = useCallback(async (id: string, value: number): Promise<Goal | null> => {
    try {
      const result = await goalsService.updateProgress(id, value);
      if (result.success && result.data) {
        await fetchGoals(); // Refresh list
        return result.data;
      }
      setError(result.error || 'Failed to update progress');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchGoals]);

  /**
   * Mark goal as completed
   */
  const completeGoal = useCallback(async (id: string): Promise<Goal | null> => {
    try {
      const result = await goalsService.completeGoal(id);
      if (result.success && result.data) {
        await fetchGoals(); // Refresh list
        return result.data;
      }
      setError(result.error || 'Failed to complete goal');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchGoals]);

  /**
   * Calculate progress percentage
   */
  const getProgress = useCallback((goal: Goal): number => {
    return goalsService.calculateProgress(goal);
  }, []);

  // Load goals on mount and when filters change
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    completeGoal,
    getProgress,
  };
}

/**
 * Hook for a single goal
 */
export function useGoal(goalId: string) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoal = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await goalsService.getGoalById(goalId);
      if (result.success && result.data) {
        setGoal(result.data);
      } else {
        setError(result.error || 'Goal not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return { goal, loading, error, refetch: fetchGoal };
}

/**
 * Hook for active goals only
 */
export function useActiveGoals() {
  return useGoals({ status: 'active' });
}

/**
 * Hook for goals by type
 */
export function useGoalsByType(type: GoalType) {
  return useGoals({ type });
}

/**
 * Usage Examples:
 * 
 * // In a component
 * const { goals, loading, createGoal, updateProgress } = useGoals();
 * 
 * // Filter active goals
 * const { goals: activeGoals } = useActiveGoals();
 * 
 * // Get nutrition goals
 * const { goals: nutritionGoals } = useGoalsByType('nutrition');
 * 
 * // Create a goal
 * const handleCreate = async () => {
 *   const newGoal = await createGoal({
 *     title: 'Daily Calorie Limit',
 *     type: 'nutrition',
 *     status: 'active',
 *     frequency: 'daily',
 *     targetValue: 2000,
 *     currentValue: 0,
 *     unit: 'calories',
 *     startDate: new Date().toISOString(),
 *   });
 * };
 */
