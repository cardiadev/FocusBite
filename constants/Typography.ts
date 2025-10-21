/**
 * Typography System for FocusBite
 * 
 * Defines a consistent typography scale across the application.
 * Based on Material Design typography principles.
 */

export const Typography = {
  // Font Families (can be extended with custom fonts)
  fontFamily: {
    regular: 'System',           // System default
    medium: 'System',            // Can be replaced with custom fonts
    semibold: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,                      // Extra small text
    sm: 14,                      // Small text (captions, labels)
    base: 16,                    // Base body text
    lg: 18,                      // Large body text
    xl: 20,                      // Section headers
    '2xl': 24,                   // Screen titles
    '3xl': 30,                   // Large titles
    '4xl': 36,                   // Extra large titles
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,                  // For headings
    normal: 1.5,                 // For body text
    relaxed: 1.75,               // For comfortable reading
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
  
  // Common Text Styles (combining multiple properties)
  textStyles: {
    // Headlines
    h1: {
      fontSize: 36,
      fontWeight: '700' as const,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 30,
      fontWeight: '700' as const,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    
    // Body Text
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    
    // Special Text
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 1.4,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.2,
      letterSpacing: 0.5,
    },
    label: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
  },
} as const;

export type TypographyTextStyle = keyof typeof Typography.textStyles;
