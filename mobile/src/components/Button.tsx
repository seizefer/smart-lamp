import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight } from '../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  gradient = false
}) => {
  const buttonStyle = [
    styles.button,
    styles[`button_${size}`],
    styles[`button_${variant}`],
    disabled && styles.buttonDisabled,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_${variant}`],
    disabled && styles.textDisabled,
    textStyle
  ];

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.text} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </>
  );

  if (gradient && variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={buttonStyle}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md
  },
  button_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg
  },
  button_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl
  },
  button_primary: {
    backgroundColor: colors.primary
  },
  button_secondary: {
    backgroundColor: colors.surface
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary
  },
  button_ghost: {
    backgroundColor: 'transparent'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  text: {
    fontWeight: fontWeight.semibold
  },
  text_sm: {
    fontSize: fontSize.sm
  },
  text_md: {
    fontSize: fontSize.md
  },
  text_lg: {
    fontSize: fontSize.lg
  },
  text_primary: {
    color: colors.text
  },
  text_secondary: {
    color: colors.text
  },
  text_outline: {
    color: colors.primary
  },
  text_ghost: {
    color: colors.primary
  },
  textDisabled: {
    opacity: 0.7
  }
});
