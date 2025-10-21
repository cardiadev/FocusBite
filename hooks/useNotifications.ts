/**
 * useNotifications Hook
 * 
 * Custom hook for managing notification permissions and settings.
 */

import { useState, useEffect, useCallback } from 'react';
import { notificationsService } from '@/services';
import type { NotificationPermissions } from '@/types';

interface UseNotificationsReturn {
  permissions: NotificationPermissions | null;
  loading: boolean;
  error: string | null;
  requestPermissions: () => Promise<boolean>;
  checkPermissions: () => Promise<void>;
}

/**
 * Hook for managing notifications
 */
export function useNotifications(): UseNotificationsReturn {
  const [permissions, setPermissions] = useState<NotificationPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check current permissions
   */
  const checkPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await notificationsService.checkPermissions();
      if (result.success && result.data) {
        setPermissions(result.data);
      } else {
        setError(result.error || 'Failed to check permissions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request notification permissions
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await notificationsService.requestPermissions();
      if (result.success && result.data) {
        setPermissions(result.data);
        return result.data.granted;
      } else {
        setError(result.error || 'Failed to request permissions');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissions,
    loading,
    error,
    requestPermissions,
    checkPermissions,
  };
}

/**
 * Usage Example:
 * 
 * const { permissions, requestPermissions } = useNotifications();
 * 
 * if (!permissions?.granted) {
 *   await requestPermissions();
 * }
 */
