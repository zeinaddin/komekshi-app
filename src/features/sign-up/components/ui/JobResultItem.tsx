import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';

interface JobResultItemProps {
  title: string;
  subtitle: string;
  salary: string;
  selected?: boolean;
  onPress: () => void;
}

export function JobResultItem({ title, subtitle, salary, selected = false, onPress }: JobResultItemProps) {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: selected ? theme.colors.primary[50] : theme.colors.background,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? theme.colors.primary[500] : theme.colors.border.default,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text variant="body" weight="semibold" color="primary">
            {title}
          </Text>
          <Text
            variant="bodySmall"
            color="secondary"
            style={{ marginTop: theme.spacing.xs }}
          >
            {subtitle}
          </Text>
        </View>
        <Text variant="bodySmall" weight="semibold" color="secondary">
          {salary}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
});
