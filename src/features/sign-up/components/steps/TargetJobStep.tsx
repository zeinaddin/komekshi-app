import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';
import { JobResultItem } from '../ui/JobResultItem';
import { SAMPLE_JOBS } from '../../constants/jobs';
import { Job } from '../../types';

export function TargetJobStep() {
  const theme = useAppTheme();
  const { state, setTargetJob, goNext, goBack, stepNumber, totalSteps } = useSignUp();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter jobs based on search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) {
      return SAMPLE_JOBS;
    }
    const query = searchQuery.toLowerCase();
    return SAMPLE_JOBS.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.subtitle.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleJobSelect = (job: Job) => {
    setTargetJob(state.targetJob?.id === job.id ? null : job);
  };

  const handleNext = () => {
    if (state.targetJob) {
      goNext();
    }
  };

  const handleSuggestionsPress = () => {
    // Show suggestions based on selected skills
    // For now, just clear the search
    setSearchQuery('');
  };

  const isValid = state.targetJob !== null;

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
        <Text variant="h2" style={{ marginBottom: theme.spacing.lg }}>
          Set your target job
        </Text>

        <Input
          placeholder="job"
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ marginBottom: theme.spacing.sm }}
        />

        <TouchableOpacity
          onPress={handleSuggestionsPress}
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Text variant="bodySmall" color="link">
            Not sure what to choose? Tap here for suggestions.
          </Text>
        </TouchableOpacity>

        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: theme.spacing.sm }}>
              <JobResultItem
                title={item.title}
                subtitle={item.subtitle}
                salary={item.salary}
                selected={state.targetJob?.id === item.id}
                onPress={() => handleJobSelect(item)}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
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
