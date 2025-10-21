/**
 * Notifications Service
 * 
 * Handles all push notification operations for meal prep expiration alerts.
 * Schedules notifications 24 hours before food expires.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { addDays, subDays, parseISO, isAfter, isBefore } from 'date-fns';
import type { NotificationPermissions, NotificationConfig, ServiceResponse } from '@/types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Notifications Service Class
 */
class NotificationsService {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<ServiceResponse<NotificationPermissions>> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // For Android, set notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('meal-prep-expiration', {
          name: 'Meal Prep Expiration',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#B39DDB',
          description: 'Notifications for meal prep expiration reminders',
        });
      }

      const permissions: NotificationPermissions = {
        granted: finalStatus === 'granted',
        canAskAgain: finalStatus !== 'denied',
        status: finalStatus as 'granted' | 'denied' | 'undetermined',
      };

      return { success: true, data: permissions };
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to request permissions',
      };
    }
  }

  /**
   * Check current notification permissions
   */
  async checkPermissions(): Promise<ServiceResponse<NotificationPermissions>> {
    try {
      const { status } = await Notifications.getPermissionsAsync();

      const permissions: NotificationPermissions = {
        granted: status === 'granted',
        canAskAgain: status !== 'denied',
        status: status as 'granted' | 'denied' | 'undetermined',
      };

      return { success: true, data: permissions };
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check permissions',
      };
    }
  }

  /**
   * Schedule expiration notification for a meal prep portion
   * Notifies 24 hours before expiration
   */
  async scheduleExpirationNotification(
    mealPrepId: string,
    portionId: string,
    mealName: string,
    expirationDate: string,
    location: 'refrigerator' | 'freezer'
  ): Promise<ServiceResponse<string>> {
    try {
      // Check permissions first
      const permissionResult = await this.checkPermissions();
      if (!permissionResult.data?.granted) {
        return {
          success: false,
          error: 'Notification permissions not granted',
        };
      }

      // Calculate notification time (24 hours before expiration)
      const expiration = parseISO(expirationDate);
      const notificationTime = subDays(expiration, 1);
      const now = new Date();

      // Don't schedule if notification time has already passed
      if (isBefore(notificationTime, now)) {
        return {
          success: false,
          error: 'Notification time has already passed',
        };
      }

      // Don't schedule if expiration is already passed
      if (isBefore(expiration, now)) {
        return {
          success: false,
          error: 'Food has already expired',
        };
      }

      // Schedule the notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🍽️ Meal Prep Expiring Soon',
          body: `${mealName} in ${location} expires tomorrow!`,
          data: {
            mealPrepId,
            portionId,
            expirationDate,
            type: 'meal_prep_expiration',
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          date: notificationTime,
          channelId: 'meal-prep-expiration',
        },
      });

      return { success: true, data: identifier };
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to schedule notification',
      };
    }
  }

  /**
   * Schedule multiple notifications for all portions
   */
  async scheduleNotificationsForPortions(
    mealPrepId: string,
    mealName: string,
    portions: Array<{ id: string; expirationDate: string; location: 'refrigerator' | 'freezer'; status: string }>
  ): Promise<ServiceResponse<string[]>> {
    try {
      const identifiers: string[] = [];

      for (const portion of portions) {
        // Only schedule for available portions
        if (portion.status === 'available') {
          const result = await this.scheduleExpirationNotification(
            mealPrepId,
            portion.id,
            mealName,
            portion.expirationDate,
            portion.location
          );

          if (result.success && result.data) {
            identifiers.push(result.data);
          }
        }
      }

      return { success: true, data: identifiers };
    } catch (error) {
      console.error('Error scheduling multiple notifications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to schedule notifications',
      };
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(identifier: string): Promise<ServiceResponse<void>> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      return { success: true };
    } catch (error) {
      console.error('Error canceling notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel notification',
      };
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<ServiceResponse<void>> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return { success: true };
    } catch (error) {
      console.error('Error canceling all notifications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel notifications',
      };
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<ServiceResponse<Notifications.NotificationRequest[]>> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return { success: true, data: notifications };
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get notifications',
      };
    }
  }

  /**
   * Get count of notifications expiring soon (within 48 hours)
   */
  async getExpiringItemsCount(): Promise<number> {
    try {
      const result = await this.getScheduledNotifications();
      if (!result.success || !result.data) return 0;

      const now = new Date();
      const fortyEightHoursFromNow = addDays(now, 2);

      const expiringCount = result.data.filter((notification) => {
        const trigger = notification.trigger as any;
        if (trigger.type === 'date' && trigger.date) {
          const notificationDate = new Date(trigger.date);
          return isAfter(notificationDate, now) && isBefore(notificationDate, fortyEightHoursFromNow);
        }
        return false;
      }).length;

      return expiringCount;
    } catch (error) {
      console.error('Error getting expiring items count:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const notificationsService = new NotificationsService();

/**
 * Usage Examples:
 * 
 * // Request permissions
 * const { data: permissions } = await notificationsService.requestPermissions();
 * 
 * // Schedule notification for a portion
 * await notificationsService.scheduleExpirationNotification(
 *   'meal_123',
 *   'portion_1',
 *   'Chicken Breast',
 *   '2025-01-25',
 *   'refrigerator'
 * );
 * 
 * // Schedule for all portions
 * await notificationsService.scheduleNotificationsForPortions(
 *   'meal_123',
 *   'Chicken Breast',
 *   portions
 * );
 * 
 * // Get expiring items badge count
 * const count = await notificationsService.getExpiringItemsCount();
 */
