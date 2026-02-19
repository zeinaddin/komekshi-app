import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  containerStyle,
  inputStyle,
  labelStyle,
  rightElement,
  leftElement,
  secureTextEntry,
  ...textInputProps
}: InputProps) {
  const theme = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry !== undefined;
  const showPassword = isPassword && isPasswordVisible;

  const getBorderColor = (): string => {
    if (error) return theme.colors.border.error;
    if (isFocused) return theme.colors.border.focus;
    return theme.colors.input.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.medium,
              marginBottom: theme.spacing.sm,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.input.background,
            borderColor: getBorderColor(),
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.md,
          },
        ]}
      >
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
        <TextInput
          {...textInputProps}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              color: theme.colors.input.text,
              fontSize: theme.typography.sizes.md,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.input.placeholder}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.passwordToggle}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
        {rightElement && !isPassword && <View style={styles.rightElement}>{rightElement}</View>}
      </View>
      {(error || hint) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.colors.error.light : theme.colors.text.tertiary,
              fontSize: theme.typography.sizes.xs,
              marginTop: theme.spacing.xs,
            },
          ]}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
  },
  leftElement: {
    marginRight: 8,
  },
  rightElement: {
    marginLeft: 8,
  },
  passwordToggle: {
    padding: 4,
  },
  helperText: {},
});
