import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';

export function NameStep() {
  const theme = useAppTheme();
  const { state, setName, goNext, goBack, stepNumber, totalSteps } = useSignUp();

  const handleNext = () => {
    if (state.name.trim().length > 0) {
      goNext();
    }
  };

  const isValid = state.name.trim().length > 0;

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
          Enter Your name
        </Text>

        <Input
          placeholder="dimash"
          value={state.name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          autoFocus
          error={state.errors.name}
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
