import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/src/shared/components/ui';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2; // padding 24*2 + gap 12

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  progress?: number;
  icon?: React.ReactNode;
  variant?: 'readiness' | 'streak';
}

export function StatCard({
  title,
  value,
  subtitle,
  progress,
  icon,
  variant = 'readiness',
}: StatCardProps) {
  const gradientColors = variant === 'readiness'
    ? ['#7C3AED', '#8B5CF6'] as const // Purple gradient
    : ['#6366F1', '#818CF8'] as const; // Indigo gradient

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Value Section */}
      <View style={styles.valueRow}>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>

      {/* Progress Bar */}
      {progress !== undefined && (
        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    minHeight: 120,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginLeft: 4,
    marginBottom: 4,
  },
  iconContainer: {
    marginBottom: 4,
  },
  progressWrapper: {
    marginTop: 12,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
});
