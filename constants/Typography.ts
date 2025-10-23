/**
 * Typography System for FocusBite
 * 
 * Defines a consistent typography scale across the application.
 * Based on Material Design typography principles.
 */

export const Typography = {
  // Font Families - Open Sans from Google Fonts (loaded locally)
  fontFamily: {
    regular: 'OpenSans_400Regular',
    medium: 'OpenSans_500Medium',
    semibold: 'OpenSans_600SemiBold',
    bold: 'OpenSans_700Bold',
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
      fontFamily: 'OpenSans_700Bold',
      fontSize: 36,
      fontWeight: '700' as const,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'OpenSans_700Bold',
      fontSize: 30,
      fontWeight: '700' as const,
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: 'OpenSans_600SemiBold',
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: 'OpenSans_600SemiBold',
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    
    // Body Text
    bodyLarge: {
      fontFamily: 'OpenSans_400Regular',
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    body: {
      fontFamily: 'OpenSans_400Regular',
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontFamily: 'OpenSans_400Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    
    // Special Text
    caption: {
      fontFamily: 'OpenSans_400Regular',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 1.4,
    },
    button: {
      fontFamily: 'OpenSans_600SemiBold',
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.2,
      letterSpacing: 0.5,
    },
    label: {
      fontFamily: 'OpenSans_500Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
  },
} as const;

export type TypographyTextStyle = keyof typeof Typography.textStyles;
