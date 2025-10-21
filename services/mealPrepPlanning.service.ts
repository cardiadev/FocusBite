/**
 * Meal Prep Planning Service
 * 
 * Handles weekly meal planning, prep tasks, shopping lists, and recipe ideas.
 * Separate from the meal prep portions tracking system.
 */

import { startOfWeek, endOfWeek, format } from 'date-fns';
import { storageService } from './storage.service';
import type { PrepTask, ShoppingItem, RecipeIdea, WeeklyMealPlan, ServiceResponse } from '@/types';

const PREP_TASKS_KEY = '@focusbite:prep_tasks';
const SHOPPING_ITEMS_KEY = '@focusbite:shopping_items';
const RECIPES_KEY = '@focusbite:recipe_ideas';
const WEEKLY_PLANS_KEY = '@focusbite:weekly_plans';

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current week dates
 */
function getCurrentWeekDates() {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
  return {
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    weekEnd: format(weekEnd, 'yyyy-MM-dd'),
  };
}

// ============================================================================
// Prep Tasks Service
// ============================================================================

class PrepTasksService {
  /**
   * Create a new prep task
   */
  async createTask(taskData: Omit<PrepTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<PrepTask>> {
    try {
      const now = new Date().toISOString();
      const newTask: PrepTask = {
        ...taskData,
        id: generateId('task'),
        createdAt: now,
        updatedAt: now,
      };

      const existingTasks = await this.getAllTasks();
      const tasks = existingTasks.data || [];
      tasks.push(newTask);

      const saveResult = await storageService.save(PREP_TASKS_KEY, tasks);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: newTask };
    } catch (error) {
      console.error('Error creating prep task:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create task',
      };
    }
  }

  /**
   * Get all prep tasks
   */
  async getAllTasks(): Promise<ServiceResponse<PrepTask[]>> {
    try {
      const result = await storageService.load<PrepTask[]>(PREP_TASKS_KEY);
      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error getting prep tasks:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get tasks',
      };
    }
  }

  /**
   * Update a prep task
   */
  async updateTask(id: string, updates: Partial<PrepTask>): Promise<ServiceResponse<PrepTask>> {
    try {
      const result = await this.getAllTasks();
      const tasks = result.data || [];
      const index = tasks.findIndex((t) => t.id === id);

      if (index === -1) {
        return { success: false, error: 'Task not found' };
      }

      const updatedTask: PrepTask = {
        ...tasks[index],
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };

      tasks[index] = updatedTask;

      const saveResult = await storageService.save(PREP_TASKS_KEY, tasks);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedTask };
    } catch (error) {
      console.error('Error updating prep task:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update task',
      };
    }
  }

  /**
   * Delete a prep task
   */
  async deleteTask(id: string): Promise<ServiceResponse<void>> {
    try {
      const result = await this.getAllTasks();
      const tasks = result.data || [];
      const filteredTasks = tasks.filter((t) => t.id !== id);

      if (tasks.length === filteredTasks.length) {
        return { success: false, error: 'Task not found' };
      }

      const saveResult = await storageService.save(PREP_TASKS_KEY, filteredTasks);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting prep task:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete task',
      };
    }
  }

  /**
   * Toggle task completion
   */
  async toggleTaskCompletion(id: string): Promise<ServiceResponse<PrepTask>> {
    try {
      const result = await this.getAllTasks();
      const tasks = result.data || [];
      const task = tasks.find((t) => t.id === id);

      if (!task) {
        return { success: false, error: 'Task not found' };
      }

      return this.updateTask(id, {
        isCompleted: !task.isCompleted,
        completedAt: !task.isCompleted ? new Date().toISOString() : undefined,
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle task',
      };
    }
  }
}

// ============================================================================
// Shopping Items Service
// ============================================================================

class ShoppingItemsService {
  /**
   * Create a new shopping item
   */
  async createItem(itemData: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<ShoppingItem>> {
    try {
      const now = new Date().toISOString();
      const newItem: ShoppingItem = {
        ...itemData,
        id: generateId('shop'),
        createdAt: now,
        updatedAt: now,
      };

      const existingItems = await this.getAllItems();
      const items = existingItems.data || [];
      items.push(newItem);

      const saveResult = await storageService.save(SHOPPING_ITEMS_KEY, items);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: newItem };
    } catch (error) {
      console.error('Error creating shopping item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create item',
      };
    }
  }

  /**
   * Get all shopping items
   */
  async getAllItems(): Promise<ServiceResponse<ShoppingItem[]>> {
    try {
      const result = await storageService.load<ShoppingItem[]>(SHOPPING_ITEMS_KEY);
      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error getting shopping items:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get items',
      };
    }
  }

  /**
   * Update a shopping item
   */
  async updateItem(id: string, updates: Partial<ShoppingItem>): Promise<ServiceResponse<ShoppingItem>> {
    try {
      const result = await this.getAllItems();
      const items = result.data || [];
      const index = items.findIndex((i) => i.id === id);

      if (index === -1) {
        return { success: false, error: 'Item not found' };
      }

      const updatedItem: ShoppingItem = {
        ...items[index],
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };

      items[index] = updatedItem;

      const saveResult = await storageService.save(SHOPPING_ITEMS_KEY, items);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedItem };
    } catch (error) {
      console.error('Error updating shopping item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update item',
      };
    }
  }

  /**
   * Delete a shopping item
   */
  async deleteItem(id: string): Promise<ServiceResponse<void>> {
    try {
      const result = await this.getAllItems();
      const items = result.data || [];
      const filteredItems = items.filter((i) => i.id !== id);

      if (items.length === filteredItems.length) {
        return { success: false, error: 'Item not found' };
      }

      const saveResult = await storageService.save(SHOPPING_ITEMS_KEY, filteredItems);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting shopping item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete item',
      };
    }
  }

  /**
   * Toggle item checked status
   */
  async toggleItemChecked(id: string): Promise<ServiceResponse<ShoppingItem>> {
    try {
      const result = await this.getAllItems();
      const items = result.data || [];
      const item = items.find((i) => i.id === id);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      return this.updateItem(id, {
        isChecked: !item.isChecked,
        checkedAt: !item.isChecked ? new Date().toISOString() : undefined,
      });
    } catch (error) {
      console.error('Error toggling item checked:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle item',
      };
    }
  }

  /**
   * Clear all checked items
   */
  async clearCheckedItems(): Promise<ServiceResponse<void>> {
    try {
      const result = await this.getAllItems();
      const items = result.data || [];
      const uncheckedItems = items.filter((i) => !i.isChecked);

      const saveResult = await storageService.save(SHOPPING_ITEMS_KEY, uncheckedItems);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error clearing checked items:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear items',
      };
    }
  }
}

// ============================================================================
// Recipe Ideas Service
// ============================================================================

class RecipeIdeasService {
  /**
   * Create a new recipe
   */
  async createRecipe(recipeData: Omit<RecipeIdea, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<RecipeIdea>> {
    try {
      const now = new Date().toISOString();
      const newRecipe: RecipeIdea = {
        ...recipeData,
        id: generateId('recipe'),
        createdAt: now,
        updatedAt: now,
      };

      const existingRecipes = await this.getAllRecipes();
      const recipes = existingRecipes.data || [];
      recipes.push(newRecipe);

      const saveResult = await storageService.save(RECIPES_KEY, recipes);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: newRecipe };
    } catch (error) {
      console.error('Error creating recipe:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create recipe',
      };
    }
  }

  /**
   * Get all recipes
   */
  async getAllRecipes(): Promise<ServiceResponse<RecipeIdea[]>> {
    try {
      const result = await storageService.load<RecipeIdea[]>(RECIPES_KEY);
      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error getting recipes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get recipes',
      };
    }
  }

  /**
   * Update a recipe
   */
  async updateRecipe(id: string, updates: Partial<RecipeIdea>): Promise<ServiceResponse<RecipeIdea>> {
    try {
      const result = await this.getAllRecipes();
      const recipes = result.data || [];
      const index = recipes.findIndex((r) => r.id === id);

      if (index === -1) {
        return { success: false, error: 'Recipe not found' };
      }

      const updatedRecipe: RecipeIdea = {
        ...recipes[index],
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };

      recipes[index] = updatedRecipe;

      const saveResult = await storageService.save(RECIPES_KEY, recipes);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedRecipe };
    } catch (error) {
      console.error('Error updating recipe:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update recipe',
      };
    }
  }

  /**
   * Delete a recipe
   */
  async deleteRecipe(id: string): Promise<ServiceResponse<void>> {
    try {
      const result = await this.getAllRecipes();
      const recipes = result.data || [];
      const filteredRecipes = recipes.filter((r) => r.id !== id);

      if (recipes.length === filteredRecipes.length) {
        return { success: false, error: 'Recipe not found' };
      }

      const saveResult = await storageService.save(RECIPES_KEY, filteredRecipes);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete recipe',
      };
    }
  }

  /**
   * Toggle recipe favorite status
   */
  async toggleFavorite(id: string): Promise<ServiceResponse<RecipeIdea>> {
    try {
      const result = await this.getAllRecipes();
      const recipes = result.data || [];
      const recipe = recipes.find((r) => r.id === id);

      if (!recipe) {
        return { success: false, error: 'Recipe not found' };
      }

      return this.updateRecipe(id, {
        isFavorite: !recipe.isFavorite,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle favorite',
      };
    }
  }

  /**
   * Get favorite recipes
   */
  async getFavorites(): Promise<ServiceResponse<RecipeIdea[]>> {
    try {
      const result = await this.getAllRecipes();
      const recipes = result.data || [];
      const favorites = recipes.filter((r) => r.isFavorite);

      return { success: true, data: favorites };
    } catch (error) {
      console.error('Error getting favorites:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get favorites',
      };
    }
  }
}

// Export singleton instances
export const prepTasksService = new PrepTasksService();
export const shoppingItemsService = new ShoppingItemsService();
export const recipeIdeasService = new RecipeIdeasService();

/**
 * Usage Examples:
 * 
 * // Create prep task
 * await prepTasksService.createTask({
 *   title: 'Grilled Chicken',
 *   servings: 4,
 *   prepTime: 30,
 *   isCompleted: false,
 * });
 * 
 * // Add shopping item
 * await shoppingItemsService.createItem({
 *   name: 'Chicken breast',
 *   quantity: '2 lbs',
 *   category: 'protein',
 *   isChecked: false,
 * });
 * 
 * // Create recipe
 * await recipeIdeasService.createRecipe({
 *   title: 'Mediterranean Bowl',
 *   prepTime: 35,
 *   servings: 4,
 *   isFavorite: false,
 * });
 */
