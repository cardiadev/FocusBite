/**
 * Date Helpers
 * 
 * Centralized utilities for date handling across the app.
 * All dates use ISO 8601 format: 2025-10-21T21:28:07.658Z
 */

/**
 * Format a Date object to ISO 8601 string with timestamp
 * @param date - Date object to format
 * @returns ISO 8601 string (e.g., "2025-10-21T21:28:07.658Z")
 * 
 * @example
 * formatDateToISO(new Date()) // "2025-10-21T21:28:07.658Z"
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Get the current date/time as ISO 8601 string
 * @returns Current date/time in ISO 8601 format
 * 
 * @example
 * getCurrentDateISO() // "2025-10-21T21:28:07.658Z"
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString();
};

/**
 * Extract only the date part (YYYY-MM-DD) from an ISO 8601 string
 * @param isoString - ISO 8601 date string
 * @returns Date part only (e.g., "2025-10-21")
 * 
 * @example
 * getDatePart("2025-10-21T21:28:07.658Z") // "2025-10-21"
 */
export const getDatePart = (isoString: string): string => {
  return isoString.split('T')[0];
};

/**
 * Check if two ISO 8601 dates are on the same day
 * Ignores time component, only compares date
 * @param date1 - First ISO 8601 date string
 * @param date2 - Second ISO 8601 date string
 * @returns true if dates are on the same day
 * 
 * @example
 * isSameDay("2025-10-21T10:00:00.000Z", "2025-10-21T22:00:00.000Z") // true
 * isSameDay("2025-10-21T10:00:00.000Z", "2025-10-22T10:00:00.000Z") // false
 */
export const isSameDay = (date1: string, date2: string): boolean => {
  return getDatePart(date1) === getDatePart(date2);
};

/**
 * Create an ISO 8601 date string for start of day (00:00:00.000)
 * Useful for scheduling tasks at the beginning of a day
 * @param date - Date object
 * @returns ISO 8601 string with time set to 00:00:00.000
 * 
 * @example
 * formatDateToStartOfDay(new Date("2025-10-21")) // "2025-10-21T00:00:00.000Z"
 */
export const formatDateToStartOfDay = (date: Date): string => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate.toISOString();
};

/**
 * Create an ISO 8601 date string for end of day (23:59:59.999)
 * @param date - Date object
 * @returns ISO 8601 string with time set to 23:59:59.999
 * 
 * @example
 * formatDateToEndOfDay(new Date("2025-10-21")) // "2025-10-21T23:59:59.999Z"
 */
export const formatDateToEndOfDay = (date: Date): string => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate.toISOString();
};

/**
 * Parse an ISO 8601 string to Date object
 * @param isoString - ISO 8601 date string
 * @returns Date object
 * 
 * @example
 * parseISODate("2025-10-21T21:28:07.658Z") // Date object
 */
export const parseISODate = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Check if a date is today
 * @param isoString - ISO 8601 date string
 * @returns true if the date is today
 * 
 * @example
 * isToday("2025-10-21T21:28:07.658Z") // true if today is Oct 21, 2025
 */
export const isToday = (isoString: string): boolean => {
  const today = getCurrentDateISO();
  return isSameDay(isoString, today);
};

/**
 * Check if a date is in the past
 * @param isoString - ISO 8601 date string
 * @returns true if the date is before now
 * 
 * @example
 * isPast("2024-01-01T00:00:00.000Z") // true
 */
export const isPast = (isoString: string): boolean => {
  return new Date(isoString) < new Date();
};

/**
 * Check if a date is in the future
 * @param isoString - ISO 8601 date string
 * @returns true if the date is after now
 * 
 * @example
 * isFuture("2026-01-01T00:00:00.000Z") // true
 */
export const isFuture = (isoString: string): boolean => {
  return new Date(isoString) > new Date();
};

/**
 * Format ISO date for display (localized)
 * @param isoString - ISO 8601 date string
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 * 
 * @example
 * formatForDisplay("2025-10-21T21:28:07.658Z") // "October 21, 2025"
 */
export const formatForDisplay = (isoString: string, locale: string = 'en-US'): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format ISO date for short display
 * @param isoString - ISO 8601 date string
 * @returns Short formatted date string
 * 
 * @example
 * formatForShortDisplay("2025-10-21T21:28:07.658Z") // "Oct 21, 2025"
 */
export const formatForShortDisplay = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Add days to an ISO date
 * @param isoString - ISO 8601 date string
 * @param days - Number of days to add (can be negative)
 * @returns New ISO 8601 string
 * 
 * @example
 * addDaysToISO("2025-10-21T00:00:00.000Z", 7) // "2025-10-28T00:00:00.000Z"
 */
export const addDaysToISO = (isoString: string, days: number): string => {
  const date = new Date(isoString);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

/**
 * Get difference in days between two ISO dates
 * @param isoString1 - First ISO 8601 date string
 * @param isoString2 - Second ISO 8601 date string
 * @returns Number of days difference (can be negative)
 * 
 * @example
 * getDaysDifference("2025-10-21T00:00:00.000Z", "2025-10-28T00:00:00.000Z") // 7
 */
export const getDaysDifference = (isoString1: string, isoString2: string): number => {
  const date1 = new Date(isoString1);
  const date2 = new Date(isoString2);
  const diffTime = date2.getTime() - date1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
