import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useSignUp } from '../../context/SignUpContext';
import { StepContainer } from '../layout/StepContainer';
import { SkillChip } from '../ui/SkillChip';
import { SUGGESTED_SKILLS } from '../../constants/skills';

export function SkillsStep() {
  const theme = useAppTheme();
  const { state, toggleSkill, goNext, goBack, stepNumber, totalSteps } = useSignUp();
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = () => {
    const skill = inputValue.trim().toLowerCase();
    if (skill && !state.selectedSkills.includes(skill)) {
      toggleSkill(skill);
      setInputValue('');
    }
  };

  const handleInputSubmit = () => {
    handleAddSkill();
  };

  const handleNext = () => {
    goNext();
  };

  // Filter out selected skills from suggested list
  const availableSkills = SUGGESTED_SKILLS.filter(
    (skill) => !state.selectedSkills.includes(skill)
  );

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
          <Text variant="h2" style={{ marginBottom: theme.spacing.lg }}>
            Add your skill
          </Text>

          {/* Selected Skills */}
          {state.selectedSkills.length > 0 && (
            <View style={[styles.selectedContainer, { marginBottom: theme.spacing.lg }]}>
              <View style={styles.chipGrid}>
                {state.selectedSkills.map((skill) => (
                  <View key={skill} style={{ marginRight: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
                    <SkillChip
                      label={skill}
                      selected={true}
                      onPress={() => toggleSkill(skill)}
                    />
                  </View>
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
                borderRadius: theme.borderRadius.lg,
                marginBottom: theme.spacing.xl,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.sizes.md,
                },
              ]}
              placeholder="Type a skill and press enter..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleInputSubmit}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {inputValue.trim() && (
              <TouchableOpacity
                onPress={handleAddSkill}
                style={[
                  styles.addButton,
                  {
                    backgroundColor: theme.colors.primary[500],
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
              >
                <Ionicons name="add" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggested Skills */}
          <Text
            variant="label"
            color="secondary"
            style={{ marginBottom: theme.spacing.md }}
          >
            Suggested skills
          </Text>

          <View style={styles.chipGrid}>
            {availableSkills.map((skill) => (
              <View key={skill} style={{ marginRight: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
                <SkillChip
                  label={skill}
                  selected={false}
                  onPress={() => toggleSkill(skill)}
                />
              </View>
            ))}
          </View>
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  addButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
