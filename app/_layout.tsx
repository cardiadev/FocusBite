/**
 * Root Layout
 * 
 * Main application layout that wraps all screens with necessary providers.
 * Includes ThemeProvider for app-wide theming support.
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Navigation Layout Component
 * Wrapped inside ThemeProvider to access theme
 */
function RootNavigator() {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

/**
 * Root Layout
 * Provides theme context to entire app
 */
export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after layout is ready
    const prepare = async () => {
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
