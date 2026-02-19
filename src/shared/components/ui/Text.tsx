import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { useAppTheme } from '../../theme';

type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link' | 'error';

interface AppTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export function Text({
  children,
  variant = 'body',
  color = 'primary',
  weight,
  align = 'left',
  style,
  numberOfLines,
}: AppTextProps) {
  const theme = useAppTheme();

  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case 'display':
        return {
          fontSize: theme.typography.sizes.xxxl,
          fontWeight: theme.typography.weights.bold,
          lineHeight: theme.typography.sizes.xxxl * theme.typography.lineHeights.tight,
        };
      case 'h1':
        return {
          fontSize: theme.typography.sizes.xxl,
          fontWeight: theme.typography.weights.bold,
          lineHeight: theme.typography.sizes.xxl * theme.typography.lineHeights.tight,
        };
      case 'h2':
        return {
          fontSize: theme.typography.sizes.xl,
          fontWeight: theme.typography.weights.semibold,
          lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.tight,
        };
      case 'h3':
        return {
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.semibold,
          lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.normal,
        };
      case 'body':
        return {
          fontSize: theme.typography.sizes.md,
          fontWeight: theme.typography.weights.regular,
          lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
        };
      case 'bodySmall':
        return {
          fontSize: theme.typography.sizes.sm,
          fontWeight: theme.typography.weights.regular,
          lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
        };
      case 'caption':
        return {
          fontSize: theme.typography.sizes.xs,
          fontWeight: theme.typography.weights.regular,
          lineHeight: theme.typography.sizes.xs * theme.typography.lineHeights.normal,
        };
      case 'label':
        return {
          fontSize: theme.typography.sizes.sm,
          fontWeight: theme.typography.weights.medium,
          lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
        };
    }
  };

  const getColor = (): string => {
    switch (color) {
      case 'primary':
        return theme.colors.text.primary;
      case 'secondary':
        return theme.colors.text.secondary;
      case 'tertiary':
        return theme.colors.text.tertiary;
      case 'inverse':
        return theme.colors.text.inverse;
      case 'link':
        return theme.colors.text.link;
      case 'error':
        return theme.colors.error.light;
    }
  };

  const variantStyles = getVariantStyles();
  const flattenedStyle = StyleSheet.flatten(style) ?? {};
  const customFontSize =
    typeof flattenedStyle.fontSize === 'number' ? flattenedStyle.fontSize : undefined;
  const hasCustomFontSize = typeof customFontSize === 'number';
  const hasCustomLineHeight = typeof flattenedStyle.lineHeight === 'number';
  const variantFontSize =
    typeof variantStyles.fontSize === 'number' ? variantStyles.fontSize : theme.typography.sizes.md;
  const variantLineHeight =
    typeof variantStyles.lineHeight === 'number'
      ? variantStyles.lineHeight
      : variantFontSize * theme.typography.lineHeights.normal;
  const lineHeightRatio = variantLineHeight / variantFontSize;
  const adaptiveLineHeightStyle =
    hasCustomFontSize && !hasCustomLineHeight
      ? { lineHeight: Math.round(customFontSize * lineHeightRatio) }
      : undefined;

  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[
        variantStyles,
        {
          color: getColor(),
          textAlign: align,
        },
        weight && { fontWeight: theme.typography.weights[weight] },
        adaptiveLineHeightStyle,
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
