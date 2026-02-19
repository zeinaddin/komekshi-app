import { colors, spacing, borderRadius, typography } from './tokens';

export const lightTheme = {
  colors: {
    ...colors,
    background: colors.white,
    surface: colors.white,
    surfaceSecondary: colors.gray[50],
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      tertiary: colors.gray[400],
      disabled: colors.gray[300],
      inverse: colors.white,
      link: colors.primary[500],
    },
    border: {
      default: colors.gray[200],
      focus: colors.primary[500],
      error: colors.error.light,
    },
    button: {
      primary: {
        background: colors.primary[500],
        text: colors.white,
        pressed: colors.primary[600],
        disabled: colors.primary[200],
      },
      secondary: {
        background: colors.white,
        text: colors.gray[900],
        pressed: colors.gray[50],
        disabled: colors.gray[100],
        border: colors.gray[200],
      },
      ghost: {
        background: 'transparent',
        text: colors.primary[500],
        pressed: colors.primary[50],
        disabled: colors.gray[300],
      },
    },
    input: {
      background: colors.white,
      border: colors.gray[200],
      borderFocus: colors.primary[500],
      placeholder: colors.gray[400],
      text: colors.gray[900],
    },
  },
  spacing,
  borderRadius,
  typography,
} as const;

export const darkTheme = {
  colors: {
    ...colors,
    background: colors.gray[900],
    surface: colors.gray[800],
    surfaceSecondary: colors.gray[700],
    text: {
      primary: colors.gray[50],
      secondary: colors.gray[300],
      tertiary: colors.gray[500],
      disabled: colors.gray[600],
      inverse: colors.gray[900],
      link: colors.primary[400],
    },
    border: {
      default: colors.gray[700],
      focus: colors.primary[400],
      error: colors.error.dark,
    },
    button: {
      primary: {
        background: colors.primary[500],
        text: colors.white,
        pressed: colors.primary[400],
        disabled: colors.primary[800],
      },
      secondary: {
        background: colors.gray[800],
        text: colors.gray[50],
        pressed: colors.gray[700],
        disabled: colors.gray[800],
        border: colors.gray[600],
      },
      ghost: {
        background: 'transparent',
        text: colors.primary[400],
        pressed: colors.primary[900],
        disabled: colors.gray[600],
      },
    },
    input: {
      background: colors.gray[800],
      border: colors.gray[600],
      borderFocus: colors.primary[400],
      placeholder: colors.gray[500],
      text: colors.gray[50],
    },
  },
  spacing,
  borderRadius,
  typography,
} as const;

// Create a common theme type that works for both light and dark themes
export interface Theme {
  colors: {
    primary: typeof colors.primary;
    secondary: typeof colors.secondary;
    success: typeof colors.success;
    warning: typeof colors.warning;
    error: typeof colors.error;
    gray: typeof colors.gray;
    white: string;
    black: string;
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      inverse: string;
      link: string;
    };
    border: {
      default: string;
      focus: string;
      error: string;
    };
    button: {
      primary: {
        background: string;
        text: string;
        pressed: string;
        disabled: string;
      };
      secondary: {
        background: string;
        text: string;
        pressed: string;
        disabled: string;
        border: string;
      };
      ghost: {
        background: string;
        text: string;
        pressed: string;
        disabled: string;
      };
    };
    input: {
      background: string;
      border: string;
      borderFocus: string;
      placeholder: string;
      text: string;
    };
  };
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
}

export type ThemeColors = Theme['colors'];
