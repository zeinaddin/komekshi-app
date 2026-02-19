import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';

interface SkillChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  size?: 'sm' | 'md';
}

export function SkillChip({ label, selected, onPress, size = 'md' }: SkillChipProps) {
  const theme = useAppTheme();

  const paddingVertical = size === 'sm' ? theme.spacing.xs : theme.spacing.sm;
  const paddingHorizontal = size === 'sm' ? theme.spacing.sm : theme.spacing.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary[500] : theme.colors.gray[100],
          borderRadius: theme.borderRadius.full,
          paddingVertical,
          paddingHorizontal,
          borderWidth: 1,
          borderColor: selected ? theme.colors.primary[500] : theme.colors.gray[200],
        },
      ]}
    >
      <Text
        variant={size === 'sm' ? 'caption' : 'bodySmall'}
        color={selected ? 'inverse' : 'primary'}
        weight="medium"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
});
