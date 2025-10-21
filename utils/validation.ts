/**
 * Validation Utilities
 * 
 * Helper functions for input validation.
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate required field
 */
export function isRequired(value: string | number | undefined | null): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Validate number is positive
 */
export function isPositiveNumber(value: number): boolean {
  return !isNaN(value) && value > 0;
}

/**
 * Validate number is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return !isNaN(value) && value >= min && value <= max;
}

/**
 * Validate string length
 */
export function isValidLength(
  value: string,
  minLength: number,
  maxLength?: number
): boolean {
  if (!value) return false;
  if (value.length < minLength) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;
  return true;
}
