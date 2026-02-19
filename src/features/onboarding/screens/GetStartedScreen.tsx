import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '../../../shared/components/ui';
import { useAppTheme } from '../../../shared/theme';
import { FeatureItem, FeatureIcon } from '../components';
import { Video, ResizeMode } from "expo-av";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FEATURES = [
  { id: 'readiness', icon: 'readiness' as const, text: 'Readiness score' },
  { id: 'roadmap', icon: 'roadmap' as const, text: 'Market-driven roadmap' },
  { id: 'practice', icon: 'practice' as const, text: 'Daily voice practice' },
];

export function GetStartedScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/sign-up');
  };

  const handleSignIn = () => {
    router.replace('/sign-in');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Video - Full width at top */}
      <View style={styles.videoContainer}>
        <Video
          source={require("../../../../assets/images/neuron.mp4")}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted={true}
        />
      </View>

      {/* Content */}
      <SafeAreaView edges={['bottom']} style={styles.contentWrapper}>
        <View style={[styles.content, { paddingHorizontal: theme.spacing.lg }]}>
          {/* Headline */}
          <Text
            variant="display"
            align="left"
            style={[styles.headline, { marginBottom: theme.spacing.md }]}
          >
            Get interview-ready{'\n'}in 5 minutes a day
          </Text>

          {/* Subtitle */}
          <Text
            variant="body"
            color="secondary"
            align="left"
            style={{ marginBottom: theme.spacing.xl, lineHeight: 24 }}
          >
            Personal roadmap, voice mock interviews, and clear feedback based on target role and region
          </Text>

          {/* Features list */}
          <View style={[styles.features, { marginBottom: theme.spacing.xl }]}>
            {FEATURES.map((feature) => (
              <FeatureItem
                key={feature.id}
                icon={<FeatureIcon type={feature.icon} />}
                text={feature.text}
              />
            ))}
          </View>
        </View>

        {/* Actions - pinned to bottom */}
        <View style={[styles.actions, { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md }]}>
          <Button onPress={handleGetStarted} variant="primary" size="lg">
            Get Started
          </Button>

          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.signInButton, { marginTop: theme.spacing.md }]}
          >
            <Text variant="body" color="secondary" align="center">
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 32,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  features: {},
  actions: {
    width: '100%',
  },
  signInButton: {
    paddingVertical: 12,
  },
});
