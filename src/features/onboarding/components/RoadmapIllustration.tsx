import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { useAppTheme } from '../../../shared/theme';

interface RoadmapIllustrationProps {
  width?: number;
  height?: number;
}

export function RoadmapIllustration({ width = 280, height = 180 }: RoadmapIllustrationProps) {
  const theme = useAppTheme();

  const colors = {
    purple: '#8B5CF6',
    blue: '#3B82F6',
    orange: '#F97316',
    gray: theme.colors.gray[300],
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 280 180">
        <G opacity={0.8}>
          <Path
            d="M20 90 Q60 90 80 70 Q100 50 140 50"
            stroke={colors.purple}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M20 90 Q60 90 80 110 Q100 130 140 130"
            stroke={colors.blue}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M20 90 Q50 90 70 90 Q90 90 140 90"
            stroke={colors.orange}
            strokeWidth={2}
            fill="none"
          />

          {/* Upper branches */}
          <Path
            d="M140 50 Q160 40 180 35"
            stroke={colors.purple}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M140 50 Q165 55 190 60"
            stroke={colors.purple}
            strokeWidth={2}
            fill="none"
            opacity={0.6}
          />
          <Path
            d="M180 35 Q200 30 220 25"
            stroke={colors.purple}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M180 35 Q205 45 230 50"
            stroke={colors.purple}
            strokeWidth={2}
            fill="none"
            opacity={0.6}
          />

          {/* Middle branches */}
          <Path
            d="M140 90 Q170 80 200 75"
            stroke={colors.orange}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M140 90 Q175 95 210 100"
            stroke={colors.orange}
            strokeWidth={2}
            fill="none"
            opacity={0.6}
          />
          <Path
            d="M200 75 Q230 65 260 60"
            stroke={colors.orange}
            strokeWidth={2}
            fill="none"
          />

          {/* Lower branches */}
          <Path
            d="M140 130 Q160 140 180 145"
            stroke={colors.blue}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M140 130 Q170 125 200 120"
            stroke={colors.blue}
            strokeWidth={2}
            fill="none"
            opacity={0.6}
          />
          <Path
            d="M180 145 Q210 150 240 155"
            stroke={colors.blue}
            strokeWidth={2}
            fill="none"
          />
        </G>

        {/* Nodes - Main */}
        <Circle cx={20} cy={90} r={6} fill={colors.gray} />

        {/* Primary nodes */}
        <Circle cx={140} cy={50} r={8} fill={colors.purple} />
        <Circle cx={140} cy={90} r={8} fill={colors.orange} />
        <Circle cx={140} cy={130} r={8} fill={colors.blue} />

        {/* Secondary nodes - upper */}
        <Circle cx={180} cy={35} r={6} fill={colors.purple} />
        <Circle cx={190} cy={60} r={4} fill={colors.purple} opacity={0.6} />
        <Circle cx={220} cy={25} r={5} fill={colors.purple} opacity={0.8} />
        <Circle cx={230} cy={50} r={4} fill={colors.purple} opacity={0.5} />

        {/* Secondary nodes - middle */}
        <Circle cx={200} cy={75} r={6} fill={colors.orange} />
        <Circle cx={210} cy={100} r={4} fill={colors.orange} opacity={0.6} />
        <Circle cx={260} cy={60} r={5} fill={colors.orange} opacity={0.8} />

        {/* Secondary nodes - lower */}
        <Circle cx={180} cy={145} r={6} fill={colors.blue} />
        <Circle cx={200} cy={120} r={4} fill={colors.blue} opacity={0.6} />
        <Circle cx={240} cy={155} r={5} fill={colors.blue} opacity={0.8} />

        {/* Decorative small dots */}
        <Circle cx={100} cy={65} r={3} fill={colors.gray} opacity={0.4} />
        <Circle cx={110} cy={110} r={3} fill={colors.gray} opacity={0.4} />
        <Circle cx={165} cy={90} r={3} fill={colors.gray} opacity={0.4} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
