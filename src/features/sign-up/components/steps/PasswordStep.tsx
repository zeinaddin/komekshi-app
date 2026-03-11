import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';

interface RequirementProps {
  met: boolean;
  text: string;
}

function Requirement({ met, text }: RequirementProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.requirement}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={18}
        color={met ? (theme.colors.success?.light || '#22C55E') : theme.colors.text.disabled}
      />
      <Text
        variant="bodySmall"
        style={{
          marginLeft: 8,
          color: met ? theme.colors.text.primary : theme.colors.text.disabled,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

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

  // Individual requirement checks
  const hasMinLength = state.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(state.password);
  const hasLowercase = /[a-z]/.test(state.password);
  const hasNumber = /[0-9]/.test(state.password);
  const passwordsMatch = state.password.length > 0 && state.password === state.confirmPassword;

  const allRequirementsMet = hasMinLength && hasUppercase && hasLowercase && hasNumber;
  const isValid = allRequirementsMet && passwordsMatch;

  const handleNext = () => {
    if (!allRequirementsMet) {
      setError('password', 'Please meet all password requirements');
      return;
    }
    if (!passwordsMatch) {
      setError('confirmPassword', 'Passwords do not match');
      return;
    }
    goNext();
  };

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
          Create a Password
        </Text>

        <Input
          placeholder="Password"
          value={state.password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          error={state.errors.password}
          containerStyle={{ marginBottom: theme.spacing.md }}
        />

        {/* Password Requirements Checklist */}
        <View style={[styles.requirements, { marginBottom: theme.spacing.xl }]}>
          <Requirement met={hasMinLength} text="At least 8 characters" />
          <Requirement met={hasUppercase} text="One uppercase letter (A-Z)" />
          <Requirement met={hasLowercase} text="One lowercase letter (a-z)" />
          <Requirement met={hasNumber} text="One number (0-9)" />
        </View>

        <Input
          placeholder="Confirm password"
          value={state.confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          error={state.errors.confirmPassword}
        />

        {/* Password match indicator */}
        {state.confirmPassword.length > 0 && (
          <View style={[styles.matchIndicator, { marginTop: theme.spacing.sm }]}>
            <Ionicons
              name={passwordsMatch ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={passwordsMatch ? (theme.colors.success?.light || '#22C55E') : (theme.colors.error?.light || '#EF4444')}
            />
            <Text
              variant="bodySmall"
              style={{
                marginLeft: 8,
                color: passwordsMatch ? (theme.colors.success?.light || '#22C55E') : (theme.colors.error?.light || '#EF4444'),
              }}
            >
              {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
            </Text>
          </View>
        )}
      </View>
    </StepContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  requirements: {
    gap: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
