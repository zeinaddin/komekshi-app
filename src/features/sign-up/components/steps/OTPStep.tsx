import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';

export function OTPStep() {
  const theme = useAppTheme();
  const { state, setOtpCode, goNext, goBack, stepNumber, totalSteps } = useSignUp();
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Auto-send OTP when step is entered
    handleSendOTP();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (countdown > 0) return;

    setIsSending(true);
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSending(false);
    setCountdown(60); // 60 second cooldown
  };

  const handleVerify = () => {
    // In a real app, verify OTP with backend
    if (state.otpCode.length >= 4) {
      goNext();
    }
  };

  const isValid = state.otpCode.length >= 4;

  return (
    <StepContainer
      currentStep={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      footer={
        <Button
          onPress={handleSendOTP}
          variant="primary"
          size="lg"
          disabled={countdown > 0}
          loading={isSending}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP'}
        </Button>
      }
    >
      <View style={[styles.content, { marginTop: theme.spacing.xxl }]}>
        <Text variant="h2" style={{ marginBottom: theme.spacing.md }}>
          Enter OTP
        </Text>

        <Text variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
          We sent a code to {state.email}
        </Text>

        <Input
          placeholder="otp code"
          value={state.otpCode}
          onChangeText={setOtpCode}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          error={state.errors.otp}
        />

        {isValid && (
          <Button
            onPress={handleVerify}
            variant="ghost"
            size="md"
            style={{ marginTop: theme.spacing.md }}
          >
            Verify & Continue
          </Button>
        )}
      </View>
    </StepContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
