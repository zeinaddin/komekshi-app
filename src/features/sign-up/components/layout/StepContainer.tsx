import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/src/shared/theme';
import { StepHeader } from './StepHeader';

interface StepContainerProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  showHeader?: boolean;
  footer?: React.ReactNode;
}

export function StepContainer({
  children,
  currentStep,
  totalSteps,
  onBack,
  showHeader = true,
  footer,
}: StepContainerProps) {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { paddingHorizontal: theme.spacing.lg }]}>
          {showHeader && (
            <View style={{ marginTop: theme.spacing.sm }}>
              <StepHeader
                currentStep={currentStep}
                totalSteps={totalSteps}
                onBack={onBack}
                showBack={currentStep > 0}
              />
            </View>
          )}

          <View style={styles.content}>{children}</View>

          {footer && (
            <View style={[styles.footer, { paddingBottom: theme.spacing.lg }]}>{footer}</View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    width: '100%',
  },
});
