import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';
import { authService } from '@/src/shared/api/services';
import { getErrorMessage } from '@/src/shared/api/client';

export function OTPStep() {
  const theme = useAppTheme();
  const { state, setOtpCode, setError, clearError, goNext, goBack, stepNumber, totalSteps } = useSignUp();
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    handleSendOTP();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (countdown > 0 || isSending) return;

    setIsSending(true);
    setLocalError(null);
    clearError('otp');

    try {
      await authService.sendOtp(state.email);
      setCountdown(60);
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.toLowerCase().includes('not expired')) {
        setCountdown(60);
      } else {
        setLocalError(message);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (state.otpCode.length < 4 || isVerifying) return;

    setIsVerifying(true);
    setLocalError(null);
    clearError('otp');

    try {
      await authService.verifyOtpAndRegister({
        email: state.email,
        password: state.password,
        code: state.otpCode,
      });
      goNext();
    } catch (error) {
      const message = getErrorMessage(error);
      setLocalError(message);
      setError('otp', message);
    } finally {
      setIsVerifying(false);
    }
  };

  const isValid = state.otpCode.length >= 4;
  const displayError = localError || state.errors.otp;

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

        {displayError && (
          <View
            style={[
              styles.errorContainer,
              {
                backgroundColor: '#FEE2E2',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            <Text variant="bodySmall" style={{ color: theme.colors.error?.light || '#EF4444' }}>
              {displayError}
            </Text>
          </View>
        )}

        <Input
          placeholder="Enter OTP code"
          value={state.otpCode}
          onChangeText={(text) => {
            setOtpCode(text);
            setLocalError(null);
          }}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        {isValid && (
          <Button
            onPress={handleVerify}
            variant="ghost"
            size="md"
            loading={isVerifying}
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
  errorContainer: {},
});
