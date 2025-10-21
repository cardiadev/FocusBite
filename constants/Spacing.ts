/**
 * Spacing System for FocusBite
 * 
 * Defines a consistent spacing scale using an 8-point grid system.
 * This ensures visual harmony and consistent spacing throughout the app.
 */

export const Spacing = {
  // Base spacing unit (8px)
  unit: 8,
  
  // Spacing Scale
  xs: 4,           // 0.5 * base unit
  sm: 8,           // 1 * base unit
  md: 16,          // 2 * base unit
  lg: 24,          // 3 * base unit
  xl: 32,          // 4 * base unit
  '2xl': 40,       // 5 * base unit
  '3xl': 48,       // 6 * base unit
  '4xl': 64,       // 8 * base unit
  
  // Screen Padding (horizontal)
  screenPadding: 16,
  screenPaddingLarge: 24,
  
  // Common Component Spacing
  cardPadding: 16,
  cardMargin: 16,
  sectionSpacing: 24,
  
  // Border Radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,    // Pill shape
  },
  
  // Icon Sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },
  
  // Button Heights
  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  
  // Tab Bar Height
  tabBarHeight: 60,
  
  // Header Height
  headerHeight: 56,
} as const;
