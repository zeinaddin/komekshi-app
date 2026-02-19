import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '@/src/shared/theme';

interface AnalyzingIllustrationProps {
  size?: number;
  isComplete?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function AnalyzingIllustration({ size = 200, isComplete = false }: AnalyzingIllustrationProps) {
  const theme = useAppTheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isComplete) {
      // Floating animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      // Subtle rotation
      rotation.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [isComplete, scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <AnimatedView style={animatedStyle}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          {/* Background circle */}
          <Circle cx="100" cy="100" r="80" fill={theme.colors.primary[50]} />

          {/* Main robot/AI head shape */}
          <G>
            {/* Head */}
            <Rect
              x="60"
              y="50"
              width="80"
              height="70"
              rx="20"
              fill={theme.colors.gray[200]}
            />

            {/* Face plate */}
            <Rect
              x="70"
              y="60"
              width="60"
              height="50"
              rx="10"
              fill={theme.colors.white}
            />

            {/* Eyes */}
            <Circle
              cx="85"
              cy="85"
              r="8"
              fill={isComplete ? theme.colors.success.light : theme.colors.primary[500]}
            />
            <Circle
              cx="115"
              cy="85"
              r="8"
              fill={isComplete ? theme.colors.success.light : theme.colors.primary[500]}
            />

            {/* Antenna */}
            <Path
              d="M100 50 L100 35"
              stroke={theme.colors.gray[400]}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <Circle cx="100" cy="30" r="6" fill={theme.colors.secondary[400]} />

            {/* Ears/Side panels */}
            <Rect x="45" y="70" width="15" height="30" rx="5" fill={theme.colors.gray[300]} />
            <Rect x="140" y="70" width="15" height="30" rx="5" fill={theme.colors.gray[300]} />

            {/* Body hint */}
            <Path
              d="M70 120 Q100 140 130 120"
              fill={theme.colors.gray[200]}
            />
          </G>

          {/* Completion checkmark */}
          {isComplete && (
            <G>
              <Circle cx="150" cy="150" r="25" fill={theme.colors.success.light} />
              <Path
                d="M138 150 L146 158 L162 142"
                stroke={theme.colors.white}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </G>
          )}
        </Svg>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
