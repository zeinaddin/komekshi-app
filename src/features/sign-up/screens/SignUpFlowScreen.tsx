import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../context/SignUpContext';
import {
  InitialStep,
  EmailStep,
  PasswordStep,
  OTPStep,
  NameStep,
  MarketRegionStep,
  TargetJobStep,
  AnalyzingStep,
} from '../components/steps';

export function SignUpFlowScreen() {
  const theme = useAppTheme();
  const { state } = useSignUp();

  const renderStep = () => {
    switch (state.currentStep) {
      case 'initial':
        return <InitialStep />;
      case 'email':
        return <EmailStep />;
      case 'password':
        return <PasswordStep />;
      case 'otp':
        return <OTPStep />;
      case 'name':
        return <NameStep />;
      case 'marketRegion':
        return <MarketRegionStep />;
      case 'targetJob':
        return <TargetJobStep />;
      case 'analyzing':
        return <AnalyzingStep />;
      default:
        return <InitialStep />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
