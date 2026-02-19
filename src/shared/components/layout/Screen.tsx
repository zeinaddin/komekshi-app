import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  safeArea?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

export function Screen({
  children,
  style,
  contentContainerStyle,
  scrollable = false,
  keyboardAvoiding = false,
  safeArea = true,
  edges = ['top', 'bottom'],
  backgroundColor,
}: ScreenProps) {
  const theme = useAppTheme();
  const bgColor = backgroundColor || theme.colors.background;

  const content = scrollable ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentContainerStyle]}>{children}</View>
  );

  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  if (safeArea) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: bgColor }, style]} edges={edges}>
        {wrappedContent}
      </SafeAreaView>
    );
  }

  return <View style={[styles.flex, { backgroundColor: bgColor }, style]}>{wrappedContent}</View>;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
