import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';

export function InitialStep() {
  const theme = useAppTheme();
  const router = useRouter();
  const { goNext } = useSignUp();

  const handleContinue = () => {
    goNext();
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { paddingHorizontal: theme.spacing.lg }]}>
        {/* Spacer for centering */}
        <View style={styles.spacer} />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text variant="h1" align="center">
            Sign up
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Actions */}
        <View style={[styles.actions, { paddingBottom: theme.spacing.lg }]}>
          <Button onPress={handleContinue} variant="primary" size="lg">
            Continue
          </Button>

          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.signInButton, { marginTop: theme.spacing.md }]}
          >
            <Text variant="body" color="secondary" align="center">
              Already have an account?{' '}
              <Text variant="body" color="link" weight="medium">
                Sign in
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
  },
  actions: {
    width: '100%',
  },
  signInButton: {
    paddingVertical: 12,
  },
});
