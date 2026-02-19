import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '@/src/shared/theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  animated?: boolean;
}

export function ProgressBar({ currentStep, totalSteps, animated = true }: ProgressBarProps) {
  const theme = useAppTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    const targetProgress = currentStep / totalSteps;
    if (animated) {
      progress.value = withTiming(targetProgress, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    } else {
      progress.value = targetProgress;
    }
  }, [currentStep, totalSteps, animated, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.gray[200],
          borderRadius: theme.borderRadius.full,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: theme.colors.primary[500],
            borderRadius: theme.borderRadius.full,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
