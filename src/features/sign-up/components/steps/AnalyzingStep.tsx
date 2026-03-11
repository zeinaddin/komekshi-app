import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';
import { AnalyzingIllustration } from '../ui/AnalyzingIllustration';
import { useUserStore, useAuthStore } from '@/src/shared/stores';
import { locationsService, directionsService, skillsService } from '@/src/shared/api/services';
import { getErrorMessage } from '@/src/shared/api/client';

export function AnalyzingStep() {
  const theme = useAppTheme();
  const router = useRouter();
  const { state, startAnalyzing, completeAnalyzing, goBack, stepNumber, totalSteps } = useSignUp();
  const { createProfile, fetchProfile } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    createUserProfile();
  }, []);

  const createUserProfile = async () => {
    if (isCreating) return;

    setIsCreating(true);
    startAnalyzing();
    setError(null);

    try {
      // Find city ID by name
      const citiesResponse = await locationsService.searchCities({
        q: state.city,
        per_page: 1,
      });

      if (citiesResponse.items.length === 0) {
        throw new Error('City not found. Please go back and select a valid city.');
      }
      const cityId = citiesResponse.items[0].id;

      // Find direction ID by job title
      const directionsResponse = await directionsService.autocomplete({
        q: state.targetJob?.title || '',
        per_page: 1,
      });

      let directionId: number;
      if (directionsResponse.items.length === 0) {
        // Create new direction if not found
        const newDirection = await directionsService.create(state.targetJob?.title || 'Software Engineer');
        directionId = newDirection.id;
      } else {
        directionId = directionsResponse.items[0].id;
      }

      // Get or create skill IDs
      const skillIds: number[] = [];
      for (const skillName of state.selectedSkills) {
        const skillsResponse = await skillsService.autocomplete({
          q: skillName,
          per_page: 1,
        });

        if (skillsResponse.items.length > 0) {
          skillIds.push(skillsResponse.items[0].id);
        } else {
          // Create new skill if not found
          const newSkill = await skillsService.create(skillName);
          skillIds.push(newSkill.id);
        }
      }

      // Create user profile
      await createProfile({
        name: state.name,
        city_id: cityId,
        direction_id: directionId,
        skill_ids: skillIds,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Refresh profile and auth state
      await fetchProfile();
      await useAuthStore.getState().initialize();

      completeAnalyzing();
    } catch (err) {
      setError(getErrorMessage(err));
      completeAnalyzing();
    } finally {
      setIsCreating(false);
    }
  };

  const handleLetsGo = () => {
    router.replace('/(tabs)');
  };

  const handleRetry = () => {
    setError(null);
    createUserProfile();
  };

  return (
    <StepContainer
      currentStep={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      showHeader={!state.analysisComplete}
      footer={
        state.analysisComplete ? (
          error ? (
            <Button onPress={handleRetry} variant="primary" size="lg">
              Retry
            </Button>
          ) : (
            <Button onPress={handleLetsGo} variant="primary" size="lg">
              Let's go
            </Button>
          )
        ) : undefined
      }
    >
      <View style={styles.content}>
        <View style={styles.centered}>
          {!state.analysisComplete && (
            <View style={[styles.progressDots, { marginBottom: theme.spacing.xxl }]}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: theme.colors.border.default,
                      marginHorizontal: theme.spacing.xs,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          <View style={{ marginBottom: theme.spacing.xl }}>
            <AnalyzingIllustration size={200} isComplete={state.analysisComplete && !error} />
          </View>

          {error ? (
            <>
              <Text variant="h3" align="center" style={{ color: theme.colors.error?.light || '#EF4444' }}>
                Setup Failed
              </Text>
              <Text
                variant="body"
                align="center"
                color="secondary"
                style={{ marginTop: theme.spacing.md, paddingHorizontal: theme.spacing.lg }}
              >
                {error}
              </Text>
            </>
          ) : state.analysisComplete ? (
            <Text variant="h3" align="center" color="primary">
              Profile Created!
            </Text>
          ) : (
            <Text variant="body" align="center" color="secondary">
              Setting up your profile{'\n'}and personalizing your plan...
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
