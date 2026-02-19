import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface MicrophoneIconProps {
  size?: number;
  color?: string;
}

export function MicrophoneIcon({ size = 30, color = '#FFFFFF' }: MicrophoneIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.2C10.1 3.2 8.6 4.7 8.6 6.6V11.4C8.6 13.3 10.1 14.8 12 14.8C13.9 14.8 15.4 13.3 15.4 11.4V6.6C15.4 4.7 13.9 3.2 12 3.2Z"
        fill={color}
        fillOpacity={0.95}
      />
      <Path
        d="M6.2 10.9C6.2 14.2 8.8 16.8 12 16.8C15.2 16.8 17.8 14.2 17.8 10.9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Line x1="12" y1="16.8" x2="12" y2="20.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="9.3" y1="20.2" x2="14.7" y2="20.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
