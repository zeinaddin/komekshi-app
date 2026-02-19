import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from './theme';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  const value = useMemo(() => {
    const isDark =
      themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
    const theme = isDark ? darkTheme : lightTheme;

    return {
      theme,
      isDark,
      toggleTheme: () => {
        setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'));
      },
      setTheme: setThemeMode,
    };
  }, [themeMode, systemColorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook to get just the theme object
export function useAppTheme(): Theme {
  return useTheme().theme;
}
