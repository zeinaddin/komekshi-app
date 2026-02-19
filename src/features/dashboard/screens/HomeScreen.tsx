import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {Text} from '@/src/shared/components/ui';
import {useAppTheme} from '@/src/shared/theme';
import {StatCard, MockInterviewCard, FireIcon} from '../components';

export function HomeScreen() {
    const theme = useAppTheme();
    const router = useRouter();

    const handleMockInterviewPress = () => {
        router.push('/mock-interview');
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top']}>
            <View style={[styles.content, {paddingHorizontal: theme.spacing.lg}]}>
                {/* Greeting Section - Fixed at top */}
                <View style={[styles.header, {marginTop: theme.spacing.md, marginBottom: theme.spacing.lg}]}>
                    <Text style={[styles.greeting, {color: theme.colors.primary[500]}]}>Good Morning, Dimash</Text>
                    <Text style={[styles.targetJob, {color: theme.colors.text.secondary}]}>Target Backend Engineer</Text>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{paddingBottom: theme.spacing.xxl}}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <StatCard
                            title="Readiness"
                            value="50%"
                            progress={50}
                            variant="readiness"
                        />
                        <StatCard
                            title="Streak"
                            value="4"
                            subtitle="days"
                            icon={<FireIcon size={36}/>}
                            variant="streak"
                        />
                    </View>

                    {/* Today's Mock Interview */}
                    <View style={styles.mockInterviewSection}>
                        <Text style={[styles.sectionTitle, {color: theme.colors.primary[400]}]}>Today's mock interview</Text>
                        <MockInterviewCard
                            title="Mock interview"
                            questionCount={1}
                            duration="30 min"
                            type="Hard"
                            onPress={handleMockInterviewPress}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    header: {},
    greeting: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    targetJob: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '400',
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    mockInterviewSection: {},
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
});
