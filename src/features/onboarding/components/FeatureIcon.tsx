import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useAppTheme } from '../../../shared/theme';

type IconType = 'readiness' | 'roadmap' | 'practice';

interface FeatureIconProps {
  type: IconType;
  size?: number;
}

export function FeatureIcon({ type, size = 32 }: FeatureIconProps) {
  const theme = useAppTheme();
  const strokeColor = theme.colors.gray[800];

  const renderIcon = () => {
    // Connected circles icon (like glasses/binoculars)
    return (
      <Svg width={size} height={size} viewBox="0 0 32 20">
        <Circle
          cx="8"
          cy="10"
          r="7"
          stroke={strokeColor}
          strokeWidth={2}
          fill="none"
        />
        <Circle
          cx="24"
          cy="10"
          r="7"
          stroke={strokeColor}
          strokeWidth={2}
          fill="none"
        />
        <Path
          d="M15 10 L17 10"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    );
  };

  return <View style={styles.container}>{renderIcon()}</View>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
