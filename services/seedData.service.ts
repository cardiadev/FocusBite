/**
 * Seed Data Service
 * 
 * Provides sample data for testing and development
 */

import { prepTasksService } from './mealPrepPlanning.service';
import { formatDateToStartOfDay } from '@/utils/dateHelpers';

/**
 * Seed prep tasks for the current week (one task per day)
 */
export async function seedPrepTasks() {
  try {
    // Get current week dates (Sunday to Saturday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday
    const weekDates = [];
    
    // Get all 7 days of the week starting from Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      weekDates.push(date);
    }
    
    // Sample tasks for each day
    const sampleTasks = [
      { title: 'Meal prep chicken breast', servings: 6, prepTime: 45 },
      { title: 'Chop vegetables for the week', servings: 8, prepTime: 30 },
      { title: 'Cook quinoa and rice', servings: 10, prepTime: 40 },
      { title: 'Prepare overnight oats', servings: 5, prepTime: 15 },
      { title: 'Marinate salmon fillets', servings: 4, prepTime: 20 },
      { title: 'Bake sweet potatoes', servings: 6, prepTime: 60 },
      { title: 'Make protein smoothie packs', servings: 7, prepTime: 25 },
    ];
    
    // Create one task for each day
    for (let i = 0; i < 7; i++) {
      const scheduledDate = formatDateToStartOfDay(weekDates[i]);
      const task = sampleTasks[i];
      
      await prepTasksService.createTask({
        title: task.title,
        servings: task.servings,
        prepTime: task.prepTime,
        isCompleted: false,
        scheduledDate: scheduledDate,
      });
    }
    
    console.log('✅ Seeded 7 prep tasks (one per day)');
    return { success: true };
  } catch (error) {
    console.error('❌ Error seeding prep tasks:', error);
    return { success: false, error };
  }
}

/**
 * Clear all prep tasks
 */
export async function clearPrepTasks() {
  try {
    const result = await prepTasksService.getAllTasks();
    const tasks = result.data || [];
    
    for (const task of tasks) {
      await prepTasksService.deleteTask(task.id);
    }
    
    console.log(`✅ Cleared ${tasks.length} prep tasks`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing prep tasks:', error);
    return { success: false, error };
  }
}
