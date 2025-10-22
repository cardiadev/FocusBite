/**
 * Color Palette for FocusBite Application
 * Primary: Deep Purple (#6E34D2) - Represents focus and calm
 * Text: Dark Gray (#424242) - Ensures readability
 * 
 * This file defines the complete color scheme for both light and dark modes,
 * supporting OS-level theme preferences.
 */

// Define the color structure interface
export interface ColorPalette {
  // Primary Colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  
  // Text Colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textOnPrimary: string;
  
  // Background Colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Surface Colors
  surface: string;
  surfaceVariant: string;
  
  // Semantic Colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Border & Divider Colors
  border: string;
  divider: string;
  
  // Shadow & Overlay
  shadow: string;
  overlay: string;
  
  // Tab Bar
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
}

export const Colors: { light: ColorPalette; dark: ColorPalette } = {
  light: {
    // Primary Colors
    primary: '#6E34D2',          // Deep purple - main brand color
    primaryDark: '#5A2AB5',      // Darker purple for pressed states
    primaryLight: '#8E5FE8',     // Lighter purple for backgrounds
    
    // Text Colors
    text: '#424242',             // Dark gray - primary text
    textSecondary: '#757575',    // Medium gray - secondary text
    textTertiary: '#9E9E9E',     // Light gray - tertiary text
    textOnPrimary: '#FFFFFF',    // White text on primary color
    
    // Background Colors
    background: '#FFFFFF',        // Pure white background
    backgroundSecondary: '#F5F5F5', // Light gray background
    backgroundTertiary: '#FAFAFA',  // Very light gray
    
    // Surface Colors (for cards, sheets, etc.)
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    
    // Semantic Colors
    success: '#4CAF50',          // Green for success states
    error: '#F44336',            // Red for errors
    warning: '#FF9800',          // Orange for warnings
    info: '#2196F3',             // Blue for informational
    
    // Border & Divider Colors
    border: '#E0E0E0',           // Light border
    divider: '#EEEEEE',          // Divider line
    
    // Shadow & Overlay
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Tab Bar
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#6E34D2',
    tabBarInactive: '#9E9E9E',
  },
  
  dark: {
    // Primary Colors
    primary: '#9087F0',          // Lighter purple for dark mode contrast
    primaryDark: '#7B6DD9',      // Darker for pressed states
    primaryLight: '#A99DF3',     // Lighter variant
    
    // Text Colors
    text: '#E0E0E0',             // Light gray - primary text
    textSecondary: '#B0B0B0',    // Medium gray - secondary text
    textTertiary: '#808080',     // Darker gray - tertiary text
    textOnPrimary: '#FFFFFF',    // White text on primary
    
    // Background Colors
    background: '#121212',        // Dark background
    backgroundSecondary: '#1E1E1E', // Slightly lighter dark
    backgroundTertiary: '#2C2C2C',  // Card background
    
    // Surface Colors
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    
    // Semantic Colors (adjusted for dark mode)
    success: '#66BB6A',          // Slightly lighter green
    error: '#EF5350',            // Slightly lighter red
    warning: '#FFA726',          // Slightly lighter orange
    info: '#42A5F5',             // Slightly lighter blue
    
    // Border & Divider Colors
    border: '#3A3A3A',           // Dark border
    divider: '#2C2C2C',          // Dark divider
    
    // Shadow & Overlay
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    // Tab Bar
    tabBarBackground: '#1E1E1E',
    tabBarActive: '#9087F0',
    tabBarInactive: '#808080',
  },
};

// Type for accessing colors safely
export type ThemeColors = ColorPalette;
export type ColorScheme = 'light' | 'dark';
