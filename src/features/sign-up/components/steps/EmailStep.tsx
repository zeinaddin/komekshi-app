import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';

export function EmailStep() {
  const theme = useAppTheme();
  const { state, setEmail, goNext, goBack, stepNumber, totalSteps } = useSignUp();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    if (validateEmail(state.email)) {
      goNext();
    }
  };

  const isValid = validateEmail(state.email);

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
          Enter Your Email
        </Text>

        <Input
          label=""
          placeholder="Enter Your Email"
          value={state.email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoFocus
          error={state.errors.email}
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
