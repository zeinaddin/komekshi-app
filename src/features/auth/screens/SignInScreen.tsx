import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../../shared/components/layout';
import { Button, Input, Text } from '../../../shared/components/ui';
import { useAppTheme } from '../../../shared/theme';

export function SignInScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    // TODO: Implement actual sign in logic
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // TODO: Implement Google sign in
    console.log('Google sign in');
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot password');
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

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

      {/* Form */}
      <View style={[styles.form, { marginTop: theme.spacing.xxl }]}>
        <Input
          label="Your Email"
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          containerStyle={{ marginBottom: theme.spacing.lg }}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
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
