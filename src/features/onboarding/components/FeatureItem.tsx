import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../shared/components/ui';
import { useAppTheme } from '../../../shared/theme';

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

export function FeatureItem({ icon, text }: FeatureItemProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { marginBottom: theme.spacing.md }]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text variant="body" color="primary">
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
    width: 36,
  },
});
