/**
 * useTheme Hook
 * 
 * Custom hook to access theme context.
 * Throws error if used outside ThemeProvider.
 */

import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Usage Example:
 * 
 * const { colors, isDark, toggleTheme } = useTheme();
 * 
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text }}>Hello</Text>
 * </View>
 */
