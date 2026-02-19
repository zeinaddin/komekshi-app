import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeIn,
  FadeInDown,
  FadeInUp,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

import { Text, Button } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function OnboardingFlowScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  // Animation values
  const rocketY = useSharedValue(20);
  const rocketScale = useSharedValue(0.8);
  const starOpacity1 = useSharedValue(0);
  const starOpacity2 = useSharedValue(0);
  const starOpacity3 = useSharedValue(0);
  const confettiRotate = useSharedValue(0);

  useEffect(() => {
    // Rocket animation
    rocketY.value = withDelay(
      300,
      withSpring(0, { damping: 8, stiffness: 100 })
    );
    rocketScale.value = withDelay(
      300,
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    // Stars twinkling
    starOpacity1.value = withDelay(600, withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0.3, { duration: 600 }),
      withTiming(1, { duration: 400 })
    ));
    starOpacity2.value = withDelay(800, withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0.3, { duration: 600 }),
      withTiming(1, { duration: 400 })
    ));
    starOpacity3.value = withDelay(1000, withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0.3, { duration: 600 }),
      withTiming(1, { duration: 400 })
    ));

    // Confetti rotation
    confettiRotate.value = withDelay(
      500,
      withTiming(360, { duration: 20000, easing: Easing.linear })
    );
  }, []);

  const rocketStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: rocketY.value },
      { scale: rocketScale.value },
    ],
  }));

  const handleLetsGo = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.primary[50], theme.colors.primary[100]]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Floating decorations */}
        <Animated.View
          entering={FadeIn.delay(1200).duration(800)}
          style={styles.decoration1}
        >
          <View style={[styles.decorDot, { backgroundColor: theme.colors.primary[300] }]} />
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(1400).duration(800)}
          style={styles.decoration2}
        >
          <View style={[styles.decorDot, { backgroundColor: theme.colors.secondary[300] }]} />
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(1600).duration(800)}
          style={styles.decoration3}
        >
          <View style={[styles.decorDotSmall, { backgroundColor: theme.colors.primary[400] }]} />
        </Animated.View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Animated illustration */}
          <Animated.View style={[styles.illustrationContainer, rocketStyle]}>
            <WelcomeIllustration theme={theme} />
          </Animated.View>

          {/* Welcome text */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.textContainer}
          >
            <Text variant="display" align="center" style={styles.title}>
              Welcome to{'\n'}Komekshi!
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(600).duration(600)}
          >
            <Text
              variant="body"
              color="secondary"
              align="center"
              style={styles.subtitle}
            >
              Your account is ready. Let's start your journey to interview success!
            </Text>
          </Animated.View>

          {/* Feature highlights */}
          <Animated.View
            entering={FadeInUp.delay(800).duration(600)}
            style={styles.featuresContainer}
          >
            <FeatureHighlight
              icon="🎯"
              text="Personalized roadmap"
              theme={theme}
              delay={900}
            />
            <FeatureHighlight
              icon="🎤"
              text="AI mock interviews"
              theme={theme}
              delay={1000}
            />
            <FeatureHighlight
              icon="📈"
              text="Track your progress"
              theme={theme}
              delay={1100}
            />
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.delay(1200).duration(600)}
          style={styles.footer}
        >
          <Button onPress={handleLetsGo} variant="primary" size="lg">
            Let's Go!
          </Button>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function FeatureHighlight({
  icon,
  text,
  theme,
  delay
}: {
  icon: string;
  text: string;
  theme: ReturnType<typeof useAppTheme>;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(400)}
      style={[
        styles.featureItem,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text variant="bodySmall" weight="medium">{text}</Text>
    </Animated.View>
  );
}

function WelcomeIllustration({ theme }: { theme: ReturnType<typeof useAppTheme> }) {
  return (
    <Svg width={280} height={220} viewBox="0 0 280 220">
      <Defs>
        <SvgLinearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.primary[400]} />
          <Stop offset="100%" stopColor={theme.colors.primary[600]} />
        </SvgLinearGradient>
        <SvgLinearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.secondary[400]} />
          <Stop offset="100%" stopColor={theme.colors.secondary[600]} />
        </SvgLinearGradient>
      </Defs>

      {/* Background glow */}
      <Circle cx="140" cy="110" r="90" fill={theme.colors.primary[100]} opacity={0.5} />
      <Circle cx="140" cy="110" r="70" fill={theme.colors.primary[200]} opacity={0.4} />

      {/* Stars */}
      <Circle cx="50" cy="40" r="4" fill={theme.colors.primary[400]} />
      <Circle cx="230" cy="50" r="5" fill={theme.colors.secondary[400]} />
      <Circle cx="40" cy="160" r="3" fill={theme.colors.primary[300]} />
      <Circle cx="240" cy="170" r="4" fill={theme.colors.secondary[300]} />
      <Circle cx="70" cy="100" r="2" fill={theme.colors.warning.light} />
      <Circle cx="210" cy="90" r="3" fill={theme.colors.warning.light} />

      {/* Rocket body */}
      <G transform="translate(100, 50)">
        <Path
          d="M40 0 C40 0 65 25 65 60 C65 95 40 120 40 120 C40 120 15 95 15 60 C15 25 40 0 40 0"
          fill="url(#rocketGrad)"
        />
        {/* Window */}
        <Circle cx="40" cy="50" r="16" fill={theme.colors.white} />
        <Circle cx="40" cy="50" r="12" fill={theme.colors.primary[100]} />
        <Circle cx="40" cy="50" r="8" fill={theme.colors.primary[500]} />
        {/* Window shine */}
        <Circle cx="36" cy="46" r="3" fill={theme.colors.white} opacity={0.8} />

        {/* Fins */}
        <Path
          d="M15 85 L0 110 L15 100 Z"
          fill={theme.colors.primary[500]}
        />
        <Path
          d="M65 85 L80 110 L65 100 Z"
          fill={theme.colors.primary[500]}
        />

        {/* Flames */}
        <Path
          d="M25 120 Q40 155 55 120 Q40 145 25 120"
          fill="url(#flameGrad)"
        />
        <Path
          d="M30 120 Q40 145 50 120 Q40 140 30 120"
          fill={theme.colors.secondary[300]}
        />
        <Path
          d="M35 120 Q40 135 45 120 Q40 130 35 120"
          fill={theme.colors.warning.light}
        />
      </G>

      {/* Success badge */}
      <G transform="translate(180, 130)">
        <Circle cx="0" cy="0" r="22" fill={theme.colors.success.light} />
        <Path
          d="M-8 0 L-3 5 L8 -6"
          stroke={theme.colors.white}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>

      {/* Sparkles */}
      <Path d="M60 70 L64 78 L72 78 L66 84 L68 92 L60 87 L52 92 L54 84 L48 78 L56 78 Z" fill={theme.colors.warning.light} />
      <Path d="M200 60 L203 66 L209 66 L205 70 L206 76 L200 73 L194 76 L195 70 L191 66 L197 66 Z" fill={theme.colors.warning.light} transform="scale(0.7) translate(90, 30)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  decoration1: {
    position: 'absolute',
    top: 100,
    left: 30,
  },
  decoration2: {
    position: 'absolute',
    top: 150,
    right: 40,
  },
  decoration3: {
    position: 'absolute',
    bottom: 200,
    left: 50,
  },
  decorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  decorDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: 32,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    lineHeight: 44,
  },
  subtitle: {
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});
