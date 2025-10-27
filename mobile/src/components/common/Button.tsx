/**
 * Custom Button Component
 * Reusable button with different variants and loading states
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;
    
    if (disabled || loading) {
      return { ...baseStyle, ...styles.buttonDisabled };
    }
    
    switch (variant) {
      case 'primary':
        return { ...baseStyle, ...styles.buttonPrimary };
      case 'secondary':
        return { ...baseStyle, ...styles.buttonSecondary };
      case 'outline':
        return { ...baseStyle, ...styles.buttonOutline };
      default:
        return baseStyle;
    }
  };
  
  const getTextStyle = (): TextStyle => {
    const baseStyle = styles.text;
    
    if (disabled || loading) {
      return { ...baseStyle, color: theme.colors.textDisabled };
    }
    
    switch (variant) {
      case 'primary':
        return { ...baseStyle, color: '#ffffff' };
      case 'secondary':
        return { ...baseStyle, color: '#ffffff' };
      case 'outline':
        return { ...baseStyle, color: theme.colors.primary };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary : '#ffffff'}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.small,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
  },
  text: {
    ...theme.typography.button,
  },
});
