/**
 * Theme Context for FocusBite
 * 
 * Provides theme state and controls throughout the application.
 * Automatically detects and responds to OS-level theme preferences.
 * Allows manual theme override when needed.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ColorScheme, ThemeColors } from '@/constants/Colors';

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (scheme: ColorScheme) => void;
}

// Create context with undefined default (will be provided by provider)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // State for theme override (null means follow system)
  const [themeOverride, setThemeOverride] = useState<ColorScheme | null>(null);
  
  // Determine active color scheme
  const activeColorScheme: ColorScheme = themeOverride ?? (systemColorScheme ?? 'light');
  const colors = Colors[activeColorScheme];
  const isDark = activeColorScheme === 'dark';
  
  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeOverride(prev => {
      if (prev === null) {
        // If following system, switch to opposite of system
        return systemColorScheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  };
  
  // Set specific theme
  const setTheme = (scheme: ColorScheme) => {
    setThemeOverride(scheme);
  };
  
  // Effect to log theme changes (can be removed in production)
  useEffect(() => {
    console.log(`[Theme] Active scheme: ${activeColorScheme}, System: ${systemColorScheme}, Override: ${themeOverride}`);
  }, [activeColorScheme, systemColorScheme, themeOverride]);
  
  const value: ThemeContextType = {
    colorScheme: activeColorScheme,
    colors,
    isDark,
    toggleTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
