import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Screen } from '../../../shared/components/layout';
import { Button, Input, Text } from '../../../shared/components/ui';
import { useAppTheme } from '../../../shared/theme';
import { useAuthStore } from '../../../shared/stores';
import { authService } from '../../../shared/api/services';
import { getErrorMessage } from '../../../shared/api/client';

export function SignInScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      setLocalError('Please enter email and password');
      return;
    }

    setLocalError(null);
    clearError();

    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user?.is_onboarding_completed) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    } catch (err) {
      setLocalError(getErrorMessage(err));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const authUrl = authService.getGoogleOAuthUrl();
      const result = await WebBrowser.openAuthSessionAsync(authUrl);
      if (result.type === 'success' && result.url) {
        // The callback URL would contain tokens - handle accordingly
        // For now, re-initialize auth state
        await useAuthStore.getState().initialize();
        const user = useAuthStore.getState().user;
        if (user) {
          if (user.is_onboarding_completed) {
            router.replace('/(tabs)');
          } else {
            router.replace('/onboarding');
          }
        }
      }
    } catch (err) {
      setLocalError(getErrorMessage(err));
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Enter your email above, then we will send you an OTP to reset your password.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send OTP',
          onPress: async () => {
            if (!email) {
              setLocalError('Please enter your email first');
              return;
            }
            try {
              await authService.sendOtp(email);
              Alert.alert('Success', 'Check your email for the OTP code');
            } catch (err) {
              setLocalError(getErrorMessage(err));
            }
          },
        },
      ]
    );
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  const displayError = localError || error;

  return (
    <Screen
      keyboardAvoiding
      scrollable
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: theme.spacing.lg },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { marginTop: theme.spacing.xxl }]}>
        <Text variant="h1" align="center">
          Sign in
        </Text>
      </View>

      {/* Error Message */}
      {displayError && (
        <View
          style={[
            styles.errorContainer,
            {
              marginTop: theme.spacing.lg,
              backgroundColor: '#FEE2E2',
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
            },
          ]}
        >
          <Text variant="bodySmall" style={{ color: theme.colors.error?.light || '#EF4444' }}>
            {displayError}
          </Text>
        </View>
      )}

      {/* Form */}
      <View style={[styles.form, { marginTop: theme.spacing.xxl }]}>
        <Input
          label="Your Email"
          placeholder="email@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setLocalError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          containerStyle={{ marginBottom: theme.spacing.lg }}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setLocalError(null);
          }}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
        />

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={[styles.forgotPassword, { marginTop: theme.spacing.sm }]}
        >
          <Text variant="bodySmall" color="link">
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <View style={[styles.actions, { marginTop: theme.spacing.xl }]}>
        <Button
          onPress={handleSignIn}
          variant="primary"
          size="lg"
          loading={isLoading}
          disabled={!email || !password}
        >
          Continue
        </Button>
      </View>

      {/* Google Sign In */}
      <View style={[styles.socialAuth, { marginTop: theme.spacing.xl }]}>
        <Button
          onPress={handleGoogleSignIn}
          variant="outline"
          size="lg"
          icon={
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={styles.googleIcon}
            />
          }
          iconPosition="left"
        >
          Login with Google
        </Button>
      </View>

      {/* Sign Up Link */}
      <View style={[styles.signUpContainer, { marginTop: theme.spacing.xl }]}>
        <Text variant="body" color="secondary">
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text variant="body" color="link" weight="medium">
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {},
  errorContainer: {},
  form: {},
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  actions: {},
  socialAuth: {},
  googleIcon: {
    width: 20,
    height: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
});
