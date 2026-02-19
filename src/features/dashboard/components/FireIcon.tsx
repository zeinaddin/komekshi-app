import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface FireIconProps {
  size?: number;
}

export function FireIcon({ size = 32 }: FireIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="fireGradient" x1="12" y1="23" x2="12" y2="3" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#F97316" />
          <Stop offset="1" stopColor="#FBBF24" />
        </LinearGradient>
        <LinearGradient id="innerFireGradient" x1="12" y1="20" x2="12" y2="9" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FCD34D" />
          <Stop offset="1" stopColor="#FEF3C7" />
        </LinearGradient>
      </Defs>
      {/* Outer flame */}
      <Path
        d="M12 23C16.5 23 20 19.5 20 15C20 11.5 18 8.5 16 6.5C15.5 6 14.5 6.5 14.5 7.5C14.5 8.5 14 10 13 10C12 10 11.5 9.5 11 9C10 8 9 6.5 9 4.5C9 3.5 8 3 7.5 3.5C5.5 5.5 4 9 4 12C4 17.5 7.5 23 12 23Z"
        fill="url(#fireGradient)"
      />
      {/* Inner flame */}
      <Path
        d="M12 20C14 20 16 18 16 15.5C16 14 15.5 12.5 14.5 11.5C14 11 13 11.5 13 12.5C13 13 12.5 14 12 14C11.5 14 11 13.5 10.5 13C10 12.5 9 11 9 9.5C9 9 8.5 8.5 8 9C7 10 6 11.5 6 13.5C6 17 8 20 12 20Z"
        fill="url(#innerFireGradient)"
      />
    </Svg>
  );
}
