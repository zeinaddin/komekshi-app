import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

  const paddingVertical = size === 'sm' ? 6 : 10;
  const iconSize = size === 'sm' ? 12 : 14;
  const iconContainerSize = size === 'sm' ? 18 : 22;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary[500] : theme.colors.surface,
          borderRadius: 24,
          paddingLeft: size === 'sm' ? 12 : 16,
          paddingRight: size === 'sm' ? 6 : 8,
          paddingVertical,
          borderWidth: 1.5,
          borderColor: selected ? theme.colors.primary[500] : theme.colors.border.default,
          shadowColor: selected ? '#000' : 'transparent',
          shadowOffset: { width: 0, height: selected ? 2 : 0 },
          shadowOpacity: selected ? 0.1 : 0,
          shadowRadius: selected ? 4 : 0,
          elevation: selected ? 2 : 0,
        },
      ]}
    >
      <Text
        variant={size === 'sm' ? 'caption' : 'bodySmall'}
        style={{
          color: selected ? theme.colors.white : theme.colors.text.primary,
          fontWeight: '500',
          marginRight: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={[
          styles.iconContainer,
          {
            width: iconContainerSize,
            height: iconContainerSize,
            borderRadius: iconContainerSize / 2,
            backgroundColor: selected ? 'rgba(255,255,255,0.2)' : theme.colors.primary[50],
          },
        ]}
      >
        <Ionicons
          name={selected ? 'close' : 'add'}
          size={iconSize}
          color={selected ? theme.colors.white : theme.colors.primary[500]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
