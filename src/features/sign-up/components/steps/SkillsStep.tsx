import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';
import { SkillChip } from '../ui/SkillChip';
import { skillsService } from '@/src/shared/api/services';
import { SkillDTO } from '@/src/shared/api/types';

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

export function SkillsStep() {
  const theme = useAppTheme();
  const { state, toggleSkill, goNext, goBack, stepNumber, totalSteps } = useSignUp();
  const [inputValue, setInputValue] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<SkillDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce input by 300ms
  const debouncedInput = useDebounce(inputValue, 300);

  // Fetch skills when input changes or on mount
  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const response = await skillsService.autocomplete({
          q: debouncedInput || undefined,
          per_page: 30,
        });
        setSuggestedSkills(response.items);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        setSuggestedSkills([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [debouncedInput]);

  const handleAddSkill = () => {
    const skill = inputValue.trim();
    if (skill && !state.selectedSkills.includes(skill)) {
      toggleSkill(skill);
      setInputValue('');
    }
  };

  const handleSuggestedSkillPress = (skillName: string) => {
    if (!state.selectedSkills.includes(skillName)) {
      toggleSkill(skillName);
    }
  };

  const handleNext = () => {
    goNext();
  };

  // Filter out already selected skills from suggestions
  const availableSkills = suggestedSkills.filter(
    (skill) => !state.selectedSkills.includes(skill.name)
  );

  // Check if current input matches an existing skill or is already selected
  const canAddCustomSkill =
    inputValue.trim() &&
    !state.selectedSkills.includes(inputValue.trim()) &&
    !suggestedSkills.some((s) => s.name.toLowerCase() === inputValue.trim().toLowerCase());

  return (
    <StepContainer
      currentStep={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      footer={
        <Button onPress={handleNext} variant="primary" size="lg">
          Next
        </Button>
      }
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: theme.spacing.xxl }}>
          <Text variant="h2" style={{ marginBottom: theme.spacing.sm }}>
            Add your skills
          </Text>
          <Text variant="body" color="secondary" style={{ marginBottom: theme.spacing.lg }}>
            Select skills you're proficient in
          </Text>

          {/* Selected Skills */}
          {state.selectedSkills.length > 0 && (
            <View style={[styles.selectedContainer, { marginBottom: theme.spacing.lg }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.success.light} />
                <Text variant="label" color="secondary" style={{ marginLeft: 6 }}>
                  Selected ({state.selectedSkills.length})
                </Text>
              </View>
              <View style={styles.chipGrid}>
                {state.selectedSkills.map((skill) => (
                  <SkillChip
                    key={skill}
                    label={skill}
                    selected={true}
                    onPress={() => toggleSkill(skill)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Skill Input */}
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border.default,
              },
            ]}
          >
            <Ionicons name="search" size={20} color={theme.colors.text.tertiary} />
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary }]}
              placeholder="Search or add skill..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleAddSkill}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {inputValue.length > 0 && (
              <TouchableOpacity onPress={() => setInputValue('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Add custom skill button */}
          {canAddCustomSkill && (
            <TouchableOpacity
              style={[
                styles.addCustomButton,
                { backgroundColor: theme.colors.primary[50], borderColor: theme.colors.primary[200] },
              ]}
              onPress={handleAddSkill}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={22} color={theme.colors.primary[500]} />
              <Text style={{ color: theme.colors.primary[500], fontWeight: '600', marginLeft: 8 }}>
                Add "{inputValue.trim()}"
              </Text>
            </TouchableOpacity>
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary[500]} />
            </View>
          )}

          {/* Suggested Skills */}
          {availableSkills.length > 0 && (
            <View style={{ marginTop: theme.spacing.lg }}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles" size={18} color={theme.colors.primary[400]} />
                <Text variant="label" color="secondary" style={{ marginLeft: 6 }}>
                  {inputValue ? 'Search Results' : 'Popular Skills'}
                </Text>
              </View>
              <View style={styles.chipGrid}>
                {availableSkills.map((skill) => (
                  <SkillChip
                    key={skill.id}
                    label={skill.name}
                    selected={false}
                    onPress={() => handleSuggestedSkillPress(skill.name)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Empty state */}
          {!isLoading && availableSkills.length === 0 && inputValue.trim() && !canAddCustomSkill && (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="search-outline" size={32} color={theme.colors.text.tertiary} />
              <Text variant="body" color="secondary" style={{ marginTop: 8 }}>
                No skills found for "{inputValue}"
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </StepContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  selectedContainer: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 12,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
});
