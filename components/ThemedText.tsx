/**
 * Themed Text Component
 * 
 * A custom Text component that automatically applies the Lora font family
 * and respects the app's theme colors.
 */

import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Typography } from '@/constants/Typography';
import { useTheme } from '@/hooks/useTheme';

export interface ThemedTextProps extends RNTextProps {
  variant?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
}

export function ThemedText({ 
  style, 
  variant = 'regular',
  color,
  ...props 
}: ThemedTextProps) {
  const { colors } = useTheme();
  
  return (
    <RNText
      style={[
        styles.default,
        { 
          fontFamily: Typography.fontFamily[variant],
          color: color || colors.text,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.fontSize.base,
  },
});
