import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';

export function PasswordStep() {
  const theme = useAppTheme();
  const {
    state,
    setPassword,
    setConfirmPassword,
    setError,
    goNext,
    goBack,
    stepNumber,
    totalSteps,
  } = useSignUp();

  const validatePassword = (): boolean => {
    if (state.password.length < 8) {
      return false;
    }
    if (state.password !== state.confirmPassword) {
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (state.password.length < 8) {
      setError('password', 'Password must be at least 8 characters');
      return;
    }
    if (state.password !== state.confirmPassword) {
      setError('confirmPassword', 'Passwords do not match');
      return;
    }
    goNext();
  };

  const isValid = validatePassword();

  return (
    <StepContainer
      currentStep={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      footer={
        <Button onPress={handleNext} variant="primary" size="lg" disabled={!isValid}>
          Next
        </Button>
      }
    >
      <View style={[styles.content, { marginTop: theme.spacing.xxl }]}>
        <Text variant="h2" style={{ marginBottom: theme.spacing.xl }}>
          Enter Your Password
        </Text>

        <Input
          placeholder="password"
          value={state.password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          error={state.errors.password}
          containerStyle={{ marginBottom: theme.spacing.lg }}
        />

        <Input
          placeholder="password2"
          value={state.confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          error={state.errors.confirmPassword}
        />
      </View>
    </StepContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
