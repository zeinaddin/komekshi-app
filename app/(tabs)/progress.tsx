import { StyleSheet } from 'react-native';
import { Screen } from '@/src/shared/components/layout';
import { Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';

export default function ProgressScreen() {
  const theme = useAppTheme();

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text variant="h1" align="center">
        Progress
      </Text>
      <Text
        variant="body"
        color="secondary"
        align="center"
        style={{ marginTop: theme.spacing.md }}
      >
        Track your readiness score and streaks
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
