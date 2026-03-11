import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, G, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

import { Text, Button, Input } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useAuthStore, useUserStore } from '@/src/shared/stores';
import { locationsService, directionsService, skillsService } from '@/src/shared/api/services';
import { DirectionDTO, SkillDTO, CityDTO } from '@/src/shared/api/types';
import { getErrorMessage } from '@/src/shared/api/client';

type OnboardingStep = 'name' | 'region' | 'skills' | 'direction' | 'complete';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function OnboardingFlowScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { user, completeOnboarding, initialize } = useAuthStore();
  const { createProfile } = useUserStore();

  // Check if profile is already complete
  const hasCompleteProfile = Boolean(user?.name && user?.city_id && user?.direction_id);

  // If profile is complete, show welcome screen
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(hasCompleteProfile ? 'complete' : 'name');

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<CityDTO | null>(null);
  const [cities, setCities] = useState<CityDTO[]>([]);
  const [skillQuery, setSkillQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<SkillDTO[]>([]);
  const [directionQuery, setDirectionQuery] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<DirectionDTO | null>(null);
  const [directions, setDirections] = useState<DirectionDTO[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiDirections, setAIDirections] = useState<DirectionDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const debouncedCityQuery = useDebounce(cityQuery, 300);
  const debouncedSkillQuery = useDebounce(skillQuery, 300);
  const debouncedDirectionQuery = useDebounce(directionQuery, 300);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      if (!debouncedCityQuery) {
        setCities([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await locationsService.searchCities({ q: debouncedCityQuery, per_page: 10 });
        setCities(response.items);
      } catch {
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, [debouncedCityQuery]);

  // Fetch skills when step is active or query changes
  useEffect(() => {
    const fetchSkills = async () => {
      if (currentStep !== 'skills') return;
      setIsLoading(true);
      try {
        const response = await skillsService.autocomplete({ q: debouncedSkillQuery || undefined, per_page: 30 });
        setSuggestedSkills(response.items);
      } catch {
        setSuggestedSkills([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, [debouncedSkillQuery, currentStep]);

  // Fetch directions
  useEffect(() => {
    const fetchDirections = async () => {
      setIsLoading(true);
      try {
        const response = await directionsService.autocomplete({ q: debouncedDirectionQuery || undefined, per_page: 20 });
        setDirections(response.items);
      } catch {
        setDirections([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (currentStep === 'direction') {
      fetchDirections();
    }
  }, [debouncedDirectionQuery, currentStep]);

  const handleNext = () => {
    const steps: OnboardingStep[] = ['name', 'region', 'skills', 'direction', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = ['name', 'region', 'skills', 'direction', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmitProfile = async () => {
    if (!selectedCity || !selectedDirection) {
      setError('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get or create skill IDs
      const skillIds: number[] = [];
      for (const skillName of selectedSkills) {
        const skillsResponse = await skillsService.autocomplete({ q: skillName, per_page: 1 });
        if (skillsResponse.items.length > 0) {
          skillIds.push(skillsResponse.items[0].id);
        } else {
          const newSkill = await skillsService.create(skillName);
          skillIds.push(newSkill.id);
        }
      }

      // Create profile
      await createProfile({
        name,
        city_id: selectedCity.id,
        direction_id: selectedDirection.id,
        skill_ids: skillIds,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Refresh auth state
      await initialize();
      setCurrentStep('complete');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLetsGo = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  const handleCreateDirection = async () => {
    if (!directionQuery.trim()) return;
    setIsLoading(true);
    try {
      const newDirection = await directionsService.create(directionQuery.trim());
      setSelectedDirection(newDirection);
      setDirections((prev) => [newDirection, ...prev]);
      setDirectionQuery('');
    } catch {
      // Ignore error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAIDirections = async () => {
    if (!selectedCity) return;
    setIsLoadingAI(true);
    setAIDirections([]);
    try {
      const response = await directionsService.getAIDirections({
        city_id: selectedCity.id,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      });
      // Extract directions from salary responses, adding salary info as description
      const uniqueDirections: DirectionDTO[] = [];
      const seenIds = new Set<number>();
      for (const salary of response) {
        if (salary.direction && !seenIds.has(salary.direction.id)) {
          seenIds.add(salary.direction.id);
          uniqueDirections.push({
            ...salary.direction,
            description: `~${salary.amount.toLocaleString()} ${salary.currency}/month`,
          });
        }
      }
      setAIDirections(uniqueDirections);
    } catch (err) {
      console.error('Failed to get AI directions:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const getStepNumber = () => {
    const steps: OnboardingStep[] = ['name', 'region', 'skills', 'direction'];
    return steps.indexOf(currentStep) + 1;
  };

  // Render different steps
  if (currentStep === 'complete') {
    return <WelcomeScreen theme={theme} onLetsGo={handleLetsGo} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Progress Header */}
      <View style={styles.header}>
        {currentStep !== 'name' && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border.default }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary[500], width: `${(getStepNumber() / 4) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {currentStep === 'name' && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Text variant="h2" style={{ marginBottom: theme.spacing.lg }}>
              What's your name?
            </Text>
            <Input
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </Animated.View>
        )}

        {currentStep === 'region' && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Text variant="h2" style={{ marginBottom: theme.spacing.lg }}>
              Where are you located?
            </Text>
            <Input
              placeholder="Search city..."
              value={cityQuery}
              onChangeText={setCityQuery}
              autoFocus
            />
            {selectedCity && (
              <View style={[styles.selectedItem, { backgroundColor: theme.colors.primary[50], marginTop: theme.spacing.md }]}>
                <Text style={{ color: theme.colors.primary[500] }}>{selectedCity.name}, {selectedCity.country?.name}</Text>
                <TouchableOpacity onPress={() => setSelectedCity(null)}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.primary[500]} />
                </TouchableOpacity>
              </View>
            )}
            {isLoading && <ActivityIndicator style={{ marginTop: theme.spacing.md }} color={theme.colors.primary[500]} />}
            {!selectedCity && cities.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={[styles.listItem, { borderBottomColor: theme.colors.border.default }]}
                onPress={() => {
                  setSelectedCity(city);
                  setCityQuery('');
                }}
              >
                <Text>{city.name}, {city.country?.name}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {currentStep === 'skills' && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Text variant="h2" style={{ marginBottom: theme.spacing.sm }}>
              What are your skills?
            </Text>
            <Text variant="body" color="secondary" style={{ marginBottom: theme.spacing.lg }}>
              Select skills you're proficient in
            </Text>

            {/* Selected Skills Section */}
            {selectedSkills.length > 0 && (
              <View style={{ marginBottom: theme.spacing.lg }}>
                <View style={styles.skillsSectionHeader}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.success.light} />
                  <Text variant="bodySmall" weight="semibold" style={{ marginLeft: 6, color: theme.colors.text.secondary }}>
                    Selected ({selectedSkills.length})
                  </Text>
                </View>
                <View style={styles.skillsGrid}>
                  {selectedSkills.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={[
                        styles.skillChip,
                        styles.skillChipSelected,
                        { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                      ]}
                      onPress={() => toggleSkill(skill)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.skillChipText, { color: theme.colors.white }]}>{skill}</Text>
                      <View style={[styles.skillChipIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Ionicons name="close" size={14} color={theme.colors.white} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Search Input */}
            <View style={[styles.skillSearchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border.default }]}>
              <Ionicons name="search" size={20} color={theme.colors.text.tertiary} />
              <TextInput
                placeholder="Search or add skill..."
                value={skillQuery}
                onChangeText={setSkillQuery}
                style={[styles.skillSearchInput, { color: theme.colors.text.primary }]}
                placeholderTextColor={theme.colors.text.tertiary}
              />
              {skillQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSkillQuery('')}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Add custom skill button */}
            {skillQuery.trim() && !suggestedSkills.some(s => s.name.toLowerCase() === skillQuery.trim().toLowerCase()) && !selectedSkills.includes(skillQuery.trim()) && (
              <TouchableOpacity
                style={[styles.addCustomSkill, { backgroundColor: theme.colors.primary[50], borderColor: theme.colors.primary[200] }]}
                onPress={() => {
                  toggleSkill(skillQuery.trim());
                  setSkillQuery('');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle" size={22} color={theme.colors.primary[500]} />
                <Text style={{ color: theme.colors.primary[500], fontWeight: '600', marginLeft: 8 }}>
                  Add "{skillQuery.trim()}"
                </Text>
              </TouchableOpacity>
            )}

            {isLoading && <ActivityIndicator style={{ marginTop: theme.spacing.md }} color={theme.colors.primary[500]} />}

            {/* Suggested Skills Section */}
            {suggestedSkills.filter((s) => !selectedSkills.includes(s.name)).length > 0 && (
              <View style={{ marginTop: theme.spacing.lg }}>
                <View style={styles.skillsSectionHeader}>
                  <Ionicons name="sparkles" size={18} color={theme.colors.primary[400]} />
                  <Text variant="bodySmall" weight="semibold" style={{ marginLeft: 6, color: theme.colors.text.secondary }}>
                    {skillQuery ? 'Search Results' : 'Popular Skills'}
                  </Text>
                </View>
                <View style={styles.skillsGrid}>
                  {suggestedSkills
                    .filter((s) => !selectedSkills.includes(s.name))
                    .map((skill) => (
                      <TouchableOpacity
                        key={skill.id}
                        style={[
                          styles.skillChip,
                          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border.default }
                        ]}
                        onPress={() => toggleSkill(skill.name)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.skillChipText, { color: theme.colors.text.primary }]}>{skill.name}</Text>
                        <View style={[styles.skillChipIcon, { backgroundColor: theme.colors.primary[50] }]}>
                          <Ionicons name="add" size={14} color={theme.colors.primary[500]} />
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            )}

            {/* Empty state */}
            {!isLoading && suggestedSkills.length === 0 && skillQuery.trim() && (
              <View style={[styles.emptySkillsState, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="search-outline" size={32} color={theme.colors.text.tertiary} />
                <Text variant="body" color="secondary" style={{ marginTop: 8 }}>
                  No skills found for "{skillQuery}"
                </Text>
                <Text variant="bodySmall" color="tertiary" style={{ marginTop: 4 }}>
                  You can add it as a custom skill
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {currentStep === 'direction' && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Text variant="h2" style={{ marginBottom: theme.spacing.sm }}>
              What's your target job?
            </Text>
            <Text variant="body" color="secondary" style={{ marginBottom: theme.spacing.lg }}>
              Search or get AI-powered recommendations
            </Text>

            {/* Selected Direction */}
            {selectedDirection && (
              <View style={[styles.selectedDirectionCard, { backgroundColor: theme.colors.primary[50], borderColor: theme.colors.primary[200] }]}>
                <View style={styles.selectedDirectionInfo}>
                  <Ionicons name="briefcase" size={24} color={theme.colors.primary[500]} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ color: theme.colors.primary[600], fontWeight: '600', fontSize: 16 }}>{selectedDirection.name}</Text>
                    {selectedDirection.description && (
                      <Text style={{ color: theme.colors.primary[400], fontSize: 13, marginTop: 2 }}>{selectedDirection.description}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedDirection(null)} style={styles.removeDirectionButton}>
                  <Ionicons name="close" size={20} color={theme.colors.primary[500]} />
                </TouchableOpacity>
              </View>
            )}

            {/* AI Suggestions Button */}
            {!selectedDirection && (
              <TouchableOpacity
                style={[
                  styles.aiSuggestButton,
                  {
                    backgroundColor: theme.colors.secondary[50],
                    borderColor: theme.colors.secondary[200],
                  },
                ]}
                onPress={handleGetAIDirections}
                disabled={isLoadingAI || !selectedCity}
                activeOpacity={0.7}
              >
                {isLoadingAI ? (
                  <ActivityIndicator size="small" color={theme.colors.secondary[500]} />
                ) : (
                  <Ionicons name="sparkles" size={22} color={theme.colors.secondary[500]} />
                )}
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: theme.colors.secondary[600], fontWeight: '600', fontSize: 15 }}>
                    {isLoadingAI ? 'Analyzing your profile...' : 'Get AI Recommendations'}
                  </Text>
                  <Text style={{ color: theme.colors.secondary[400], fontSize: 12, marginTop: 2 }}>
                    Based on your skills and location
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary[400]} />
              </TouchableOpacity>
            )}

            {/* AI Recommended Directions */}
            {!selectedDirection && aiDirections.length > 0 && (
              <View style={{ marginTop: theme.spacing.lg }}>
                <View style={styles.skillsSectionHeader}>
                  <Ionicons name="sparkles" size={18} color={theme.colors.secondary[500]} />
                  <Text variant="bodySmall" weight="semibold" style={{ marginLeft: 6, color: theme.colors.text.secondary }}>
                    AI Recommended for You
                  </Text>
                </View>
                {aiDirections.map((direction) => (
                  <TouchableOpacity
                    key={direction.id}
                    style={[styles.aiDirectionItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border.default }]}
                    onPress={() => {
                      setSelectedDirection(direction);
                      setDirectionQuery('');
                    }}
                  >
                    <View style={[styles.aiDirectionIcon, { backgroundColor: theme.colors.secondary[50] }]}>
                      <Ionicons name="briefcase-outline" size={20} color={theme.colors.secondary[500]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', color: theme.colors.text.primary }}>{direction.name}</Text>
                      {direction.description && (
                        <Text style={{ fontSize: 12, color: theme.colors.success.light, marginTop: 2 }}>{direction.description}</Text>
                      )}
                    </View>
                    <Ionicons name="add-circle" size={24} color={theme.colors.primary[500]} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Divider */}
            {!selectedDirection && (
              <View style={[styles.orDivider, { marginVertical: theme.spacing.lg }]}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.default }]} />
                <Text style={{ color: theme.colors.text.tertiary, paddingHorizontal: 12, fontSize: 13 }}>or search manually</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.default }]} />
              </View>
            )}

            {/* Search Input */}
            {!selectedDirection && (
              <Input
                placeholder="Search jobs..."
                value={directionQuery}
                onChangeText={setDirectionQuery}
              />
            )}

            {isLoading && <ActivityIndicator style={{ marginTop: theme.spacing.md }} color={theme.colors.primary[500]} />}

            {/* Create new direction option */}
            {!selectedDirection && directions.length === 0 && directionQuery.trim() && !isLoading && (
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: theme.colors.primary[500], marginTop: theme.spacing.lg }]}
                onPress={handleCreateDirection}
              >
                <Ionicons name="add-circle-outline" size={20} color={theme.colors.white} />
                <Text style={{ color: theme.colors.white, marginLeft: 8 }}>Create "{directionQuery.trim()}"</Text>
              </TouchableOpacity>
            )}

            {/* Search results */}
            {!selectedDirection && directions.length > 0 && (
              <View style={{ marginTop: theme.spacing.md }}>
                {directions.map((direction) => (
                  <TouchableOpacity
                    key={direction.id}
                    style={[styles.listItem, { borderBottomColor: theme.colors.border.default }]}
                    onPress={() => {
                      setSelectedDirection(direction);
                      setDirectionQuery('');
                    }}
                  >
                    <Text>{direction.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {error && (
              <Text style={{ color: theme.colors.error?.light || '#EF4444', marginTop: theme.spacing.md }}>
                {error}
              </Text>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingHorizontal: theme.spacing.lg }]}>
        {currentStep === 'direction' ? (
          <Button
            onPress={handleSubmitProfile}
            variant="primary"
            size="lg"
            disabled={!selectedDirection || isSubmitting}
            loading={isSubmitting}
          >
            Complete Setup
          </Button>
        ) : (
          <Button
            onPress={handleNext}
            variant="primary"
            size="lg"
            disabled={
              (currentStep === 'name' && !name.trim()) ||
              (currentStep === 'region' && !selectedCity)
            }
          >
            Next
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

// Welcome Screen Component
function WelcomeScreen({ theme, onLetsGo }: { theme: ReturnType<typeof useAppTheme>; onLetsGo: () => void }) {
  const rocketY = useSharedValue(20);
  const rocketScale = useSharedValue(0.8);

  useEffect(() => {
    rocketY.value = withDelay(300, withSpring(0, { damping: 8, stiffness: 100 }));
    rocketScale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 100 }));
  }, []);

  const rocketStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rocketY.value }, { scale: rocketScale.value }],
  }));

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.primary[50], theme.colors.primary[100]]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <Animated.View style={[styles.illustrationContainer, rocketStyle]}>
            <WelcomeIllustration theme={theme} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(600)}>
            <Text variant="display" align="center" style={styles.title}>
              Welcome to{'\n'}Komekshi!
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).duration(600)}>
            <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
              Your account is ready. Let's start your journey to interview success!
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.featuresContainer}>
            <FeatureHighlight icon="🎯" text="Personalized roadmap" theme={theme} />
            <FeatureHighlight icon="🎤" text="AI mock interviews" theme={theme} />
            <FeatureHighlight icon="📈" text="Track your progress" theme={theme} />
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(1200).duration(600)} style={styles.welcomeFooter}>
          <Button onPress={onLetsGo} variant="primary" size="lg">
            Let's Go!
          </Button>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function FeatureHighlight({ icon, text, theme }: { icon: string; text: string; theme: ReturnType<typeof useAppTheme> }) {
  return (
    <View style={[styles.featureItem, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text variant="bodySmall" weight="medium">{text}</Text>
    </View>
  );
}

function WelcomeIllustration({ theme }: { theme: ReturnType<typeof useAppTheme> }) {
  return (
    <Svg width={280} height={220} viewBox="0 0 280 220">
      <Defs>
        <SvgLinearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.primary[400]} />
          <Stop offset="100%" stopColor={theme.colors.primary[600]} />
        </SvgLinearGradient>
        <SvgLinearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.secondary[400]} />
          <Stop offset="100%" stopColor={theme.colors.secondary[600]} />
        </SvgLinearGradient>
      </Defs>
      <Circle cx="140" cy="110" r="90" fill={theme.colors.primary[100]} opacity={0.5} />
      <Circle cx="140" cy="110" r="70" fill={theme.colors.primary[200]} opacity={0.4} />
      <Circle cx="50" cy="40" r="4" fill={theme.colors.primary[400]} />
      <Circle cx="230" cy="50" r="5" fill={theme.colors.secondary[400]} />
      <Circle cx="40" cy="160" r="3" fill={theme.colors.primary[300]} />
      <Circle cx="240" cy="170" r="4" fill={theme.colors.secondary[300]} />
      <Circle cx="70" cy="100" r="2" fill={theme.colors.warning.light} />
      <Circle cx="210" cy="90" r="3" fill={theme.colors.warning.light} />
      <G transform="translate(100, 50)">
        <Path d="M40 0 C40 0 65 25 65 60 C65 95 40 120 40 120 C40 120 15 95 15 60 C15 25 40 0 40 0" fill="url(#rocketGrad)" />
        <Circle cx="40" cy="50" r="16" fill={theme.colors.white} />
        <Circle cx="40" cy="50" r="12" fill={theme.colors.primary[100]} />
        <Circle cx="40" cy="50" r="8" fill={theme.colors.primary[500]} />
        <Circle cx="36" cy="46" r="3" fill={theme.colors.white} opacity={0.8} />
        <Path d="M15 85 L0 110 L15 100 Z" fill={theme.colors.primary[500]} />
        <Path d="M65 85 L80 110 L65 100 Z" fill={theme.colors.primary[500]} />
        <Path d="M25 120 Q40 155 55 120 Q40 145 25 120" fill="url(#flameGrad)" />
        <Path d="M30 120 Q40 145 50 120 Q40 140 30 120" fill={theme.colors.secondary[300]} />
        <Path d="M35 120 Q40 135 45 120 Q40 130 35 120" fill={theme.colors.warning.light} />
      </G>
      <G transform="translate(180, 130)">
        <Circle cx="0" cy="0" r="22" fill={theme.colors.success.light} />
        <Path d="M-8 0 L-3 5 L8 -6" stroke={theme.colors.white} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>
      <Path d="M60 70 L64 78 L72 78 L66 84 L68 92 L60 87 L52 92 L54 84 L48 78 L56 78 Z" fill={theme.colors.warning.light} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { marginRight: 12 },
  progressContainer: { flex: 1 },
  progressBar: { height: 4, borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  content: { flex: 1 },
  contentContainer: { padding: 24 },
  footer: { paddingBottom: 24 },
  selectedItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8 },
  listItem: { paddingVertical: 16, borderBottomWidth: 1 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  chipSelected: {},
  createButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12 },
  // Skills step styles
  skillsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  skillChipSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillChipText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  skillChipIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  skillSearchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  addCustomSkill: {
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
  emptySkillsState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  // Direction step styles
  selectedDirectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  selectedDirectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  removeDirectionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSuggestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  aiDirectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  aiDirectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  gradient: { flex: 1 },
  welcomeContainer: { flex: 1 },
  welcomeContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  illustrationContainer: { marginBottom: 32 },
  title: { lineHeight: 44, marginBottom: 12 },
  subtitle: { marginBottom: 32, paddingHorizontal: 20, lineHeight: 24 },
  featuresContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  featureIcon: { fontSize: 20 },
  welcomeFooter: { paddingHorizontal: 24, paddingBottom: 16 },
});
