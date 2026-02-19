import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/src/shared/theme';
import { ProgressBar } from './ProgressBar';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  showBack?: boolean;
}

export function StepHeader({
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
}: StepHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.topRow, { marginBottom: theme.spacing.md }]}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.backButton, { padding: theme.spacing.xs }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>
      <View style={styles.progressContainer}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: -8,
  },
  backPlaceholder: {
    width: 24,
    height: 24,
  },
  progressContainer: {
    width: '100%',
  },
});
