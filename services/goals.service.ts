/**
 * Goals Service
 * 
 * Handles all CRUD operations for goals.
 * Provides filtering, sorting, and progress calculation utilities.
 */

import { storageService, STORAGE_KEYS } from './storage.service';
import type { Goal, GoalFilters, ServiceResponse, GoalType, GoalStatus, GoalFrequency } from '@/types';

/**
 * Generate unique ID for goals
 */
function generateId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Goals Service Class
 */
class GoalsService {
  /**
   * Create a new goal
   */
  async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<Goal>> {
    try {
      const now = new Date().toISOString();
      const newGoal: Goal = {
        ...goalData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      // Load existing goals
      const existingGoals = await this.getAllGoals();
      const goals = existingGoals.data || [];

      // Add new goal
      goals.push(newGoal);

      // Save back to storage
      const saveResult = await storageService.save(STORAGE_KEYS.GOALS, goals);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: newGoal };
    } catch (error) {
      console.error('Error creating goal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create goal',
      };
    }
  }

  /**
   * Get all goals
   */
  async getAllGoals(): Promise<ServiceResponse<Goal[]>> {
    try {
      const result = await storageService.load<Goal[]>(STORAGE_KEYS.GOALS);
      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error getting goals:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get goals',
      };
    }
  }

  /**
   * Get a single goal by ID
   */
  async getGoalById(id: string): Promise<ServiceResponse<Goal>> {
    try {
      const result = await this.getAllGoals();
      const goals = result.data || [];
      const goal = goals.find((g) => g.id === id);

      if (!goal) {
        return { success: false, error: 'Goal not found' };
      }

      return { success: true, data: goal };
    } catch (error) {
      console.error('Error getting goal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get goal',
      };
    }
  }

  /**
   * Update a goal
   */
  async updateGoal(id: string, updates: Partial<Goal>): Promise<ServiceResponse<Goal>> {
    try {
      const result = await this.getAllGoals();
      const goals = result.data || [];
      const index = goals.findIndex((g) => g.id === id);

      if (index === -1) {
        return { success: false, error: 'Goal not found' };
      }

      // Update goal
      const updatedGoal: Goal = {
        ...goals[index],
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      };

      goals[index] = updatedGoal;

      // Save back to storage
      const saveResult = await storageService.save(STORAGE_KEYS.GOALS, goals);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedGoal };
    } catch (error) {
      console.error('Error updating goal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update goal',
      };
    }
  }

  /**
   * Delete a goal
   */
  async deleteGoal(id: string): Promise<ServiceResponse<void>> {
    try {
      const result = await this.getAllGoals();
      const goals = result.data || [];
      const filteredGoals = goals.filter((g) => g.id !== id);

      if (goals.length === filteredGoals.length) {
        return { success: false, error: 'Goal not found' };
      }

      const saveResult = await storageService.save(STORAGE_KEYS.GOALS, filteredGoals);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting goal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete goal',
      };
    }
  }

  /**
   * Filter goals by criteria
   */
  async filterGoals(filters: GoalFilters): Promise<ServiceResponse<Goal[]>> {
    try {
      const result = await this.getAllGoals();
      let goals = result.data || [];

      // Filter by type
      if (filters.type) {
        goals = goals.filter((g) => g.type === filters.type);
      }

      // Filter by status
      if (filters.status) {
        goals = goals.filter((g) => g.status === filters.status);
      }

      // Filter by date range
      if (filters.dateRange) {
        const { startDate, endDate } = filters.dateRange;
        goals = goals.filter((g) => {
          const goalDate = new Date(g.startDate).getTime();
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime();
          return goalDate >= start && goalDate <= end;
        });
      }

      return { success: true, data: goals };
    } catch (error) {
      console.error('Error filtering goals:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to filter goals',
      };
    }
  }

  /**
   * Get active goals (status = 'active')
   */
  async getActiveGoals(): Promise<ServiceResponse<Goal[]>> {
    return this.filterGoals({ status: 'active' });
  }

  /**
   * Get goals by type
   */
  async getGoalsByType(type: GoalType): Promise<ServiceResponse<Goal[]>> {
    return this.filterGoals({ type });
  }

  /**
   * Update goal progress
   */
  async updateProgress(id: string, newValue: number): Promise<ServiceResponse<Goal>> {
    return this.updateGoal(id, {
      currentValue: newValue,
      lastUpdated: new Date().toISOString(),
    });
  }

  /**
   * Calculate goal progress percentage
   */
  calculateProgress(goal: Goal): number {
    if (goal.targetValue === 0) return 0;
    const progress = (goal.currentValue / goal.targetValue) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
  }

  /**
   * Check if goal is completed
   */
  isGoalCompleted(goal: Goal): boolean {
    return goal.currentValue >= goal.targetValue;
  }

  /**
   * Mark goal as completed
   */
  async completeGoal(id: string): Promise<ServiceResponse<Goal>> {
    return this.updateGoal(id, {
      status: 'completed',
      currentValue: (await this.getGoalById(id)).data?.targetValue || 0,
    });
  }
}

// Export singleton instance
export const goalsService = new GoalsService();

/**
 * Usage Examples:
 * 
 * // Create a goal
 * const result = await goalsService.createGoal({
 *   title: 'Daily Calorie Goal',
 *   type: 'nutrition',
 *   status: 'active',
 *   frequency: 'daily',
 *   targetValue: 2000,
 *   currentValue: 0,
 *   unit: 'calories',
 *   startDate: new Date().toISOString(),
 * });
 * 
 * // Get all goals
 * const goals = await goalsService.getAllGoals();
 * 
 * // Update progress
 * await goalsService.updateProgress('goal_123', 1850);
 * 
 * // Filter active nutrition goals
 * const nutritionGoals = await goalsService.filterGoals({
 *   type: 'nutrition',
 *   status: 'active',
 * });
 */
