/**
 * useMealPrepPlanning Hooks
 * 
 * Custom hooks for managing prep tasks, shopping lists, and recipe ideas.
 */

import { useState, useEffect, useCallback } from 'react';
import { prepTasksService, shoppingItemsService, recipeIdeasService } from '@/services/mealPrepPlanning.service';
import type { PrepTask, ShoppingItem, RecipeIdea } from '@/types';

// ============================================================================
// Prep Tasks Hook
// ============================================================================

interface UsePrepTasksReturn {
  tasks: PrepTask[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTask: (taskData: Omit<PrepTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PrepTask | null>;
  updateTask: (id: string, updates: Partial<PrepTask>) => Promise<PrepTask | null>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskCompletion: (id: string) => Promise<PrepTask | null>;
  completedCount: number;
  totalCount: number;
}

export function usePrepTasks(): UsePrepTasksReturn {
  const [tasks, setTasks] = useState<PrepTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await prepTasksService.getAllTasks();
      if (result.success && result.data) {
        setTasks(result.data);
      } else {
        setError(result.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: Omit<PrepTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<PrepTask | null> => {
    try {
      const result = await prepTasksService.createTask(taskData);
      if (result.success && result.data) {
        await fetchTasks();
        return result.data;
      }
      setError(result.error || 'Failed to create task');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<PrepTask>): Promise<PrepTask | null> => {
    try {
      const result = await prepTasksService.updateTask(id, updates);
      if (result.success && result.data) {
        await fetchTasks();
        return result.data;
      }
      setError(result.error || 'Failed to update task');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await prepTasksService.deleteTask(id);
      if (result.success) {
        await fetchTasks();
        return true;
      }
      setError(result.error || 'Failed to delete task');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchTasks]);

  const toggleTaskCompletion = useCallback(async (id: string): Promise<PrepTask | null> => {
    try {
      const result = await prepTasksService.toggleTaskCompletion(id);
      if (result.success && result.data) {
        await fetchTasks();
        return result.data;
      }
      setError(result.error || 'Failed to toggle task');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    completedCount,
    totalCount,
  };
}

// ============================================================================
// Shopping Items Hook
// ============================================================================

interface UseShoppingItemsReturn {
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createItem: (itemData: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ShoppingItem | null>;
  updateItem: (id: string, updates: Partial<ShoppingItem>) => Promise<ShoppingItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  toggleItemChecked: (id: string) => Promise<ShoppingItem | null>;
  clearCheckedItems: () => Promise<boolean>;
  checkedCount: number;
  uncheckedCount: number;
  totalCount: number;
}

export function useShoppingItems(): UseShoppingItemsReturn {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await shoppingItemsService.getAllItems();
      if (result.success && result.data) {
        setItems(result.data);
      } else {
        setError(result.error || 'Failed to load shopping items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (itemData: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingItem | null> => {
    try {
      const result = await shoppingItemsService.createItem(itemData);
      if (result.success && result.data) {
        await fetchItems();
        return result.data;
      }
      setError(result.error || 'Failed to create item');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchItems]);

  const updateItem = useCallback(async (id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | null> => {
    try {
      const result = await shoppingItemsService.updateItem(id, updates);
      if (result.success && result.data) {
        await fetchItems();
        return result.data;
      }
      setError(result.error || 'Failed to update item');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchItems]);

  const deleteItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await shoppingItemsService.deleteItem(id);
      if (result.success) {
        await fetchItems();
        return true;
      }
      setError(result.error || 'Failed to delete item');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchItems]);

  const toggleItemChecked = useCallback(async (id: string): Promise<ShoppingItem | null> => {
    try {
      const result = await shoppingItemsService.toggleItemChecked(id);
      if (result.success && result.data) {
        await fetchItems();
        return result.data;
      }
      setError(result.error || 'Failed to toggle item');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchItems]);

  const clearCheckedItems = useCallback(async (): Promise<boolean> => {
    try {
      const result = await shoppingItemsService.clearCheckedItems();
      if (result.success) {
        await fetchItems();
        return true;
      }
      setError(result.error || 'Failed to clear items');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const checkedCount = items.filter((i) => i.isChecked).length;
  const uncheckedCount = items.filter((i) => !i.isChecked).length;
  const totalCount = items.length;

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
    toggleItemChecked,
    clearCheckedItems,
    checkedCount,
    uncheckedCount,
    totalCount,
  };
}

// ============================================================================
// Recipe Ideas Hook
// ============================================================================

interface UseRecipeIdeasReturn {
  recipes: RecipeIdea[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createRecipe: (recipeData: Omit<RecipeIdea, 'id' | 'createdAt' | 'updatedAt'>) => Promise<RecipeIdea | null>;
  updateRecipe: (id: string, updates: Partial<RecipeIdea>) => Promise<RecipeIdea | null>;
  deleteRecipe: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<RecipeIdea | null>;
  favorites: RecipeIdea[];
}

export function useRecipeIdeas(): UseRecipeIdeasReturn {
  const [recipes, setRecipes] = useState<RecipeIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await recipeIdeasService.getAllRecipes();
      if (result.success && result.data) {
        setRecipes(result.data);
      } else {
        setError(result.error || 'Failed to load recipes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecipe = useCallback(async (recipeData: Omit<RecipeIdea, 'id' | 'createdAt' | 'updatedAt'>): Promise<RecipeIdea | null> => {
    try {
      const result = await recipeIdeasService.createRecipe(recipeData);
      if (result.success && result.data) {
        await fetchRecipes();
        return result.data;
      }
      setError(result.error || 'Failed to create recipe');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchRecipes]);

  const updateRecipe = useCallback(async (id: string, updates: Partial<RecipeIdea>): Promise<RecipeIdea | null> => {
    try {
      const result = await recipeIdeasService.updateRecipe(id, updates);
      if (result.success && result.data) {
        await fetchRecipes();
        return result.data;
      }
      setError(result.error || 'Failed to update recipe');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchRecipes]);

  const deleteRecipe = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await recipeIdeasService.deleteRecipe(id);
      if (result.success) {
        await fetchRecipes();
        return true;
      }
      setError(result.error || 'Failed to delete recipe');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchRecipes]);

  const toggleFavorite = useCallback(async (id: string): Promise<RecipeIdea | null> => {
    try {
      const result = await recipeIdeasService.toggleFavorite(id);
      if (result.success && result.data) {
        await fetchRecipes();
        return result.data;
      }
      setError(result.error || 'Failed to toggle favorite');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [fetchRecipes]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const favorites = recipes.filter((r) => r.isFavorite);

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    favorites,
  };
}

/**
 * Usage Examples:
 * 
 * // Prep tasks
 * const { tasks, createTask, toggleTaskCompletion } = usePrepTasks();
 * 
 * // Shopping list
 * const { items, createItem, toggleItemChecked, clearCheckedItems } = useShoppingItems();
 * 
 * // Recipes
 * const { recipes, createRecipe, toggleFavorite, favorites } = useRecipeIdeas();
 */
