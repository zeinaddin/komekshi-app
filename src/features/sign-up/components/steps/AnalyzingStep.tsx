import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';
import { AnalyzingIllustration } from '../ui/AnalyzingIllustration';

export function AnalyzingStep() {
  const theme = useAppTheme();
  const router = useRouter();
  const { state, startAnalyzing, completeAnalyzing, goBack, stepNumber, totalSteps } = useSignUp();

  useEffect(() => {
    // Start analyzing when step is entered
    startAnalyzing();

    // Simulate analysis completion after 3 seconds
    const timer = setTimeout(() => {
      completeAnalyzing();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLetsGo = () => {
    // Navigate to welcome/onboarding page after sign up
    router.replace('/onboarding');
  };

  return (
    <StepContainer
      currentStep={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      showHeader={!state.analysisComplete}
      footer={
        state.analysisComplete ? (
          <Button onPress={handleLetsGo} variant="primary" size="lg">
            Let's go
          </Button>
        ) : undefined
      }
    >
      <View style={styles.content}>
        <View style={styles.centered}>
          {/* Progress indicator at top when not complete */}
          {!state.analysisComplete && (
            <View style={[styles.progressDots, { marginBottom: theme.spacing.xxl }]}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: theme.colors.gray[300],
                      marginHorizontal: theme.spacing.xs,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Illustration */}
          <View style={{ marginBottom: theme.spacing.xl }}>
            <AnalyzingIllustration size={200} isComplete={state.analysisComplete} />
          </View>

          {/* Status text */}
          {state.analysisComplete ? (
            <Text variant="h3" align="center" color="primary">
              completed
            </Text>
          ) : (
            <Text variant="body" align="center" color="secondary">
              Analyzing your skills to{'\n'}personalize your plan...
            </Text>
          )}
        </View>
      </View>
    </StepContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
