import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';
import { JobResultItem } from '../ui/JobResultItem';
import { directionsService } from '@/src/shared/api/services';
import { DirectionDTO } from '@/src/shared/api/types';
import { Job } from '../../types';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function TargetJobStep() {
  const theme = useAppTheme();
  const { state, setTargetJob, goNext, goBack, stepNumber, totalSteps } = useSignUp();
  const [searchQuery, setSearchQuery] = useState('');
  const [directions, setDirections] = useState<DirectionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search query by 300ms
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Fetch directions when debounced query changes
  useEffect(() => {
    const fetchDirections = async () => {
      setIsLoading(true);
      try {
        const response = await directionsService.autocomplete({
          q: debouncedQuery || undefined,
          per_page: 20,
        });
        setDirections(response.items);
        setHasSearched(true);
      } catch (error) {
        console.error('Failed to fetch directions:', error);
        setDirections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirections();
  }, [debouncedQuery]);

  // Convert DirectionDTO to Job format for compatibility
  const convertToJob = useCallback((direction: DirectionDTO): Job => {
    return {
      id: direction.id.toString(),
      title: direction.name,
      subtitle: direction.description || 'Career Direction',
      salary: '',
    };
  }, []);

  const handleJobSelect = (direction: DirectionDTO) => {
    const job = convertToJob(direction);
    setTargetJob(state.targetJob?.id === job.id ? null : job);
  };

  // Create a new direction when it doesn't exist
  const handleCreateDirection = async () => {
    if (!searchQuery.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const newDirection = await directionsService.create(searchQuery.trim());
      const job = convertToJob(newDirection);
      setTargetJob(job);
      // Add to the list so it's visible
      setDirections((prev) => [newDirection, ...prev]);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to create direction:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleNext = () => {
    if (state.targetJob) {
      goNext();
    }
  };

  const handleSuggestionsPress = async () => {
    setIsLoadingAI(true);
    try {
      const response = await directionsService.autocomplete({
        per_page: 10,
      });
      setDirections(response.items);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const isValid = state.targetJob !== null;
  const showCreateOption = hasSearched && directions.length === 0 && searchQuery.trim().length > 0;

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
          placeholder="Search jobs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ marginBottom: theme.spacing.sm }}
        />

        <TouchableOpacity
          onPress={handleSuggestionsPress}
          style={{ marginBottom: theme.spacing.lg }}
          disabled={isLoadingAI}
        >
          <Text variant="bodySmall" color="link">
            {isLoadingAI ? 'Loading suggestions...' : 'Not sure what to choose? Tap here for suggestions.'}
          </Text>
        </TouchableOpacity>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary[500]} />
            <Text variant="bodySmall" color="secondary" style={{ marginTop: theme.spacing.sm }}>
              Searching...
            </Text>
          </View>
        ) : showCreateOption ? (
          // No results found - show create option
          <View style={styles.createContainer}>
            <Text variant="body" color="secondary" align="center" style={{ marginBottom: theme.spacing.lg }}>
              No jobs found for "{searchQuery}"
            </Text>
            <TouchableOpacity
              onPress={handleCreateDirection}
              disabled={isCreating}
              style={[
                styles.createButton,
                {
                  backgroundColor: theme.colors.primary[500],
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.md,
                },
              ]}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <View style={styles.createButtonContent}>
                  <Ionicons name="add-circle-outline" size={24} color={theme.colors.white} />
                  <Text
                    variant="body"
                    style={{ color: theme.colors.white, marginLeft: theme.spacing.sm, fontWeight: '600' }}
                  >
                    Create "{searchQuery.trim()}"
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : directions.length === 0 && hasSearched ? (
          <View style={styles.emptyContainer}>
            <Text variant="body" color="secondary" align="center">
              Start typing to search for jobs
            </Text>
          </View>
        ) : (
          <FlatList
            data={directions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const job = convertToJob(item);
              return (
                <View style={{ marginBottom: theme.spacing.sm }}>
                  <JobResultItem
                    title={job.title}
                    subtitle={job.subtitle}
                    salary={job.salary}
                    selected={state.targetJob?.id === job.id}
                    onPress={() => handleJobSelect(item)}
                  />
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
          />
        )}
      </View>
    </StepContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  createContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  createButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
