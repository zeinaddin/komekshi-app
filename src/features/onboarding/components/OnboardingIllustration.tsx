import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '@/src/shared/theme';

const AnimatedG = Animated.createAnimatedComponent(G);

interface OnboardingIllustrationProps {
  type: 'welcome' | 'location' | 'goal' | 'ready';
  size?: number;
}

export function OnboardingIllustration({ type, size = 280 }: OnboardingIllustrationProps) {
  const theme = useAppTheme();
  const floatY = useSharedValue(0);
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (type === 'welcome') {
    return (
      <Animated.View style={[styles.container, floatStyle]}>
        <Svg width={size} height={size * 0.7} viewBox="0 0 280 196">
          <Defs>
            <LinearGradient id="welcomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors.primary[400]} />
              <Stop offset="100%" stopColor={theme.colors.primary[600]} />
            </LinearGradient>
          </Defs>
          {/* Background circles */}
          <Circle cx="140" cy="98" r="80" fill={theme.colors.primary[100]} opacity={0.5} />
          <Circle cx="140" cy="98" r="60" fill={theme.colors.primary[200]} opacity={0.5} />
          {/* Main icon - Rocket */}
          <G transform="translate(100, 50)">
            <Path
              d="M40 0 C40 0 60 20 60 50 C60 80 40 100 40 100 C40 100 20 80 20 50 C20 20 40 0 40 0"
              fill="url(#welcomeGrad)"
            />
            <Circle cx="40" cy="45" r="12" fill={theme.colors.white} />
            <Circle cx="40" cy="45" r="8" fill={theme.colors.primary[500]} />
            {/* Flames */}
            <Path
              d="M30 100 Q40 120 50 100 Q40 115 30 100"
              fill={theme.colors.secondary[500]}
            />
            <Path
              d="M35 100 Q40 110 45 100 Q40 108 35 100"
              fill={theme.colors.secondary[300]}
            />
          </G>
          {/* Stars */}
          <Circle cx="60" cy="40" r="3" fill={theme.colors.primary[400]} />
          <Circle cx="220" cy="60" r="4" fill={theme.colors.secondary[400]} />
          <Circle cx="50" cy="140" r="3" fill={theme.colors.primary[300]} />
          <Circle cx="230" cy="150" r="3" fill={theme.colors.secondary[300]} />
        </Svg>
      </Animated.View>
    );
  }

  if (type === 'location') {
    return (
      <Animated.View style={[styles.container, floatStyle]}>
        <Svg width={size} height={size * 0.7} viewBox="0 0 280 196">
          <Defs>
            <LinearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors.primary[100]} />
              <Stop offset="100%" stopColor={theme.colors.primary[200]} />
            </LinearGradient>
            <LinearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors.secondary[400]} />
              <Stop offset="100%" stopColor={theme.colors.secondary[600]} />
            </LinearGradient>
          </Defs>
          {/* Globe */}
          <Circle cx="140" cy="98" r="70" fill="url(#mapGrad)" />
          <Path
            d="M80 98 Q100 60 140 60 Q180 60 200 98 Q180 136 140 136 Q100 136 80 98"
            fill={theme.colors.primary[300]}
            opacity={0.5}
          />
          {/* Continents (simplified) */}
          <Path
            d="M100 80 Q120 70 140 75 Q150 80 145 95 Q130 100 110 90 Z"
            fill={theme.colors.success.light}
            opacity={0.7}
          />
          <Path
            d="M155 85 Q175 80 180 100 Q175 115 160 110 Q150 100 155 85"
            fill={theme.colors.success.light}
            opacity={0.7}
          />
          {/* Location Pin */}
          <G transform="translate(125, 20)">
            <Path
              d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 42 15 42 C15 42 30 26 30 15 C30 6.7 23.3 0 15 0"
              fill="url(#pinGrad)"
            />
            <Circle cx="15" cy="15" r="8" fill={theme.colors.white} />
          </G>
          {/* Orbiting dots */}
          <Circle cx="220" cy="70" r="6" fill={theme.colors.primary[400]} />
          <Circle cx="60" cy="130" r="5" fill={theme.colors.secondary[400]} />
        </Svg>
      </Animated.View>
    );
  }

  if (type === 'goal') {
    return (
      <Animated.View style={[styles.container, pulseStyle]}>
        <Svg width={size} height={size * 0.7} viewBox="0 0 280 196">
          <Defs>
            <LinearGradient id="targetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors.primary[400]} />
              <Stop offset="100%" stopColor={theme.colors.primary[600]} />
            </LinearGradient>
          </Defs>
          {/* Target circles */}
          <Circle cx="140" cy="98" r="75" fill={theme.colors.primary[100]} />
          <Circle cx="140" cy="98" r="55" fill={theme.colors.white} />
          <Circle cx="140" cy="98" r="35" fill={theme.colors.primary[200]} />
          <Circle cx="140" cy="98" r="15" fill="url(#targetGrad)" />
          {/* Arrow */}
          <G transform="translate(160, 40) rotate(45)">
            <Rect x="0" y="0" width="60" height="8" fill={theme.colors.secondary[500]} rx="2" />
            <Path
              d="M55 -8 L75 4 L55 16 Z"
              fill={theme.colors.secondary[500]}
            />
            {/* Feathers */}
            <Path d="M0 0 L-15 -10 L5 0 Z" fill={theme.colors.secondary[400]} />
            <Path d="M0 8 L-15 18 L5 8 Z" fill={theme.colors.secondary[400]} />
          </G>
          {/* Stars */}
          <Circle cx="50" cy="50" r="4" fill={theme.colors.warning.light} />
          <Circle cx="230" cy="40" r="3" fill={theme.colors.warning.light} />
          <Circle cx="40" cy="150" r="3" fill={theme.colors.warning.light} />
        </Svg>
      </Animated.View>
    );
  }

  // Ready illustration
  return (
    <Animated.View style={[styles.container, floatStyle]}>
      <Svg width={size} height={size * 0.7} viewBox="0 0 280 196">
        <Defs>
          <LinearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.success.light} />
            <Stop offset="100%" stopColor="#16A34A" />
          </LinearGradient>
        </Defs>
        {/* Success circle */}
        <Circle cx="140" cy="98" r="70" fill={theme.colors.success.light} opacity={0.2} />
        <Circle cx="140" cy="98" r="55" fill="url(#checkGrad)" />
        {/* Checkmark */}
        <Path
          d="M110 98 L130 118 L170 78"
          stroke={theme.colors.white}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Celebration particles */}
        <Circle cx="60" cy="50" r="6" fill={theme.colors.primary[400]} />
        <Circle cx="220" cy="40" r="8" fill={theme.colors.secondary[400]} />
        <Circle cx="40" cy="130" r="5" fill={theme.colors.warning.light} />
        <Circle cx="240" cy="140" r="6" fill={theme.colors.primary[300]} />
        <Circle cx="80" cy="160" r="4" fill={theme.colors.secondary[300]} />
        <Circle cx="200" cy="170" r="5" fill={theme.colors.success.light} />
        {/* Confetti lines */}
        <Rect x="50" y="70" width="3" height="15" fill={theme.colors.primary[400]} rx="1" transform="rotate(-20 50 70)" />
        <Rect x="230" y="90" width="3" height="15" fill={theme.colors.secondary[400]} rx="1" transform="rotate(20 230 90)" />
        <Rect x="70" y="30" width="3" height="12" fill={theme.colors.warning.light} rx="1" transform="rotate(-30 70 30)" />
        <Rect x="210" y="160" width="3" height="12" fill={theme.colors.success.light} rx="1" transform="rotate(30 210 160)" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
