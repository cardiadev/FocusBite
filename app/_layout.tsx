/**
 * Root Layout
 * 
 * Main application layout that wraps all screens with necessary providers.
 * Includes ThemeProvider for app-wide theming support and animated splash screen.
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { AnimatedSplash } from '@/components/AnimatedSplash';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Navigation Layout Component
 * Wrapped inside ThemeProvider to access theme
 */
function RootNavigator() {
  const { colors } = useTheme();
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Hide Expo's splash screen after layout is ready
    const prepare = async () => {
      await SplashScreen.hideAsync();
      setAppIsReady(true);
    };
    prepare();
  }, []);

  const handleSplashFinish = () => {
    setShowAnimatedSplash(false);
  };

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
      
      {/* Show animated splash screen */}
      {appIsReady && showAnimatedSplash && (
        <AnimatedSplash onFinish={handleSplashFinish} />
      )}
    </>
  );
}

/**
 * Root Layout
 * Provides theme context to entire app
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
