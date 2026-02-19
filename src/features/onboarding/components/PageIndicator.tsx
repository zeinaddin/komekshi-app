import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { useAppTheme } from '@/src/shared/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PageIndicatorProps {
  totalPages: number;
  scrollX: SharedValue<number>;
}

export function PageIndicator({ totalPages, scrollX }: PageIndicatorProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <Dot
          key={index}
          index={index}
          scrollX={scrollX}
          activeColor={theme.colors.primary[500]}
          inactiveColor={theme.colors.gray[300]}
        />
      ))}
    </View>
  );
}

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
}

function Dot({ index, scrollX, activeColor, inactiveColor }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return {
      width,
      opacity,
      backgroundColor: index * SCREEN_WIDTH === scrollX.value ? activeColor : activeColor,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
