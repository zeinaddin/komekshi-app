import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { useAppTheme } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {
  const theme = useAppTheme();

  const getBackgroundColor = (): string => {
    if (disabled) {
      switch (variant) {
        case 'primary':
          return theme.colors.button.primary.disabled;
        case 'secondary':
        case 'outline':
          return theme.colors.button.secondary.disabled;
        case 'ghost':
          return 'transparent';
      }
    }
    switch (variant) {
      case 'primary':
        return theme.colors.button.primary.background;
      case 'secondary':
        return theme.colors.button.secondary.background;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return theme.colors.button.ghost.background;
    }
  };

  const getTextColor = (): string => {
    if (disabled) {
      return theme.colors.text.disabled;
    }
    switch (variant) {
      case 'primary':
        return theme.colors.button.primary.text;
      case 'secondary':
      case 'outline':
        return theme.colors.button.secondary.text;
      case 'ghost':
        return theme.colors.button.ghost.text;
    }
  };

  const getBorderColor = (): string | undefined => {
    if (variant === 'outline') {
      return disabled ? theme.colors.border.default : theme.colors.gray[300];
    }
    if (variant === 'secondary') {
      return theme.colors.button.secondary.border;
    }
    return undefined;
  };

  const getPadding = (): { paddingVertical: number; paddingHorizontal: number } => {
    switch (size) {
      case 'sm':
        return { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md };
      case 'md':
        return { paddingVertical: theme.spacing.md - 4, paddingHorizontal: theme.spacing.lg };
      case 'lg':
        return { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return theme.typography.sizes.sm;
      case 'md':
        return theme.typography.sizes.md;
      case 'lg':
        return theme.typography.sizes.md;
    }
  };

  const borderColor = getBorderColor();
  const padding = getPadding();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: theme.borderRadius.xl,
          ...padding,
          borderWidth: borderColor ? 1 : 0,
          borderColor,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: theme.typography.weights.semibold,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
