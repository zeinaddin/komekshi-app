import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { useAuthStore } from '@/src/shared/stores';


interface ProfileSectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  delay?: number;
  theme: ReturnType<typeof useAppTheme>;
}

function ProfileSection({ title, icon, children, delay = 0, theme }: ProfileSectionProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconContainer, {backgroundColor: theme.colors.primary[50]}]}>
          <Ionicons name={icon} size={18} color={theme.colors.primary[500]} />
        </View>
        <Text style={[styles.sectionTitle, {color: theme.colors.text.secondary}]}>{title}</Text>
      </View>
      {children}
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    // Clear auth state and tokens, then navigate to sign-in
    await logout();
    router.replace('/sign-in');
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
  };

  // Get user data from auth store
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userCountry = user?.city?.country?.name || 'Not set';
  const userCity = user?.city?.name || 'Not set';
  const userDirection = user?.direction?.name || 'Not set';

  // Skills can come from 'skills' array or 'modules' array (with nested skill object)
  const userSkills: string[] = (() => {
    // First try direct skills array
    if (user?.skills && user.skills.length > 0) {
      return user.skills.map((s) => s.name).filter(Boolean);
    }
    // Fallback to modules array (skill is nested)
    if (user?.modules && user.modules.length > 0) {
      return user.modules
        .map((m) => m.skill?.name)
        .filter((name): name is string => Boolean(name));
    }
    return [];
  })();

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={[styles.header, {backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border.default}]}>
        <Text style={[styles.headerTitle, {color: theme.colors.text.primary}]}>Profile</Text>
        <TouchableOpacity
          style={[styles.editButton, {backgroundColor: theme.colors.primary[50]}]}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={22} color={theme.colors.primary[500]} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400).springify()}
          style={[styles.profileCard, {backgroundColor: theme.colors.surface}]}
        >
          <LinearGradient
            colors={[theme.colors.primary[500], theme.colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarInitials}>{initials}</Text>
          </LinearGradient>
          <Text style={[styles.userName, {color: theme.colors.text.primary}]}>{userName}</Text>
          <Text style={[styles.userEmail, {color: theme.colors.text.tertiary}]}>{userEmail}</Text>
        </Animated.View>

        {/* Target Job Section */}
        {userDirection !== 'Not set' && (
          <ProfileSection title="Target Position" icon="briefcase-outline" delay={200} theme={theme}>
            <View style={[styles.jobCard, {backgroundColor: theme.colors.surface}]}>
              <View style={styles.jobInfo}>
                <Text style={[styles.jobTitle, {color: theme.colors.text.primary}]}>{userDirection}</Text>
                <Text style={[styles.jobSubtitle, {color: theme.colors.text.tertiary}]}>Career Direction</Text>
              </View>
            </View>
          </ProfileSection>
        )}

        {/* Region Section */}
        <ProfileSection title="Market Region" icon="location-outline" delay={300} theme={theme}>
          <View style={[styles.regionCard, {backgroundColor: theme.colors.surface}]}>
            <View style={styles.regionRow}>
              <Ionicons name="flag-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={[styles.regionText, {color: theme.colors.text.primary}]}>{userCountry}</Text>
            </View>
            <View style={[styles.regionDivider, {backgroundColor: theme.colors.border.default}]} />
            <View style={styles.regionRow}>
              <Ionicons name="business-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={[styles.regionText, {color: theme.colors.text.primary}]}>{userCity}</Text>
            </View>
          </View>
        </ProfileSection>

        {/* Skills Section */}
        {userSkills.length > 0 && (
          <ProfileSection title="Skills" icon="code-slash-outline" delay={400} theme={theme}>
            <View style={[styles.skillsContainer, {backgroundColor: theme.colors.surface}]}>
              {userSkills.map((skill) => (
                <View key={skill} style={[styles.skillChip, {backgroundColor: theme.colors.primary[50]}]}>
                  <Text style={[styles.skillText, {color: theme.colors.primary[500]}]}>{skill}</Text>
                </View>
              ))}
            </View>
          </ProfileSection>
        )}

        {/* Account Actions */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400).springify()}
          style={[styles.actionsSection, {backgroundColor: theme.colors.surface}]}
        >
          <TouchableOpacity style={[styles.actionItem, {borderBottomColor: theme.colors.border.default}]} activeOpacity={0.7}>
            <View style={[styles.actionIconContainer, {backgroundColor: theme.colors.surfaceSecondary}]}>
              <Ionicons name="settings-outline" size={20} color={theme.colors.text.secondary} />
            </View>
            <Text style={[styles.actionText, {color: theme.colors.text.primary}]}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, {borderBottomColor: theme.colors.border.default}]} activeOpacity={0.7}>
            <View style={[styles.actionIconContainer, {backgroundColor: theme.colors.surfaceSecondary}]}>
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.text.secondary} />
            </View>
            <Text style={[styles.actionText, {color: theme.colors.text.primary}]}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, {borderBottomColor: theme.colors.border.default}]} activeOpacity={0.7}>
            <View style={[styles.actionIconContainer, {backgroundColor: theme.colors.surfaceSecondary}]}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.text.secondary} />
            </View>
            <Text style={[styles.actionText, {color: theme.colors.text.primary}]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(400).springify()}
          style={styles.logoutContainer}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  jobCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  jobSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  salaryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  salaryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  regionCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  regionDivider: {
    height: 1,
    marginVertical: 12,
  },
  skillsContainer: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionsSection: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  logoutContainer: {
    paddingHorizontal: 4,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
