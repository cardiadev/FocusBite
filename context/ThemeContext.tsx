/**
 * Theme Context for FocusBite
 * 
 * Provides theme state and controls throughout the application.
 * Automatically detects and responds to OS-level theme preferences.
 * Allows manual theme override when needed.
 * Persists theme preference to AsyncStorage.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ColorScheme, ThemeColors } from '@/constants/Colors';

const THEME_STORAGE_KEY = '@focusbite:theme_preference';

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
  const [isLoading, setIsLoading] = useState(true);
  
  // Load theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeOverride(savedTheme);
        }
      } catch (error) {
        console.error('[Theme] Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        if (themeOverride !== null) {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, themeOverride);
        } else {
          await AsyncStorage.removeItem(THEME_STORAGE_KEY);
        }
      } catch (error) {
        console.error('[Theme] Failed to save theme preference:', error);
      }
    };
    
    if (!isLoading) {
      saveThemePreference();
    }
  }, [themeOverride, isLoading]);
  
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
