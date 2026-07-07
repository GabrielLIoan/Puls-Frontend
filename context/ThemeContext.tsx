import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';
export type EffectiveTheme = 'light' | 'dark';

const THEME_KEY = 'puls_theme_preference';

interface ThemeContextValue {
  preference: ThemePreference;
  theme: EffectiveTheme;
  isDark: boolean;
  setPreference: (pref: ThemePreference) => Promise<void>;
}

const defaultValue: ThemeContextValue = {
  preference: 'system',
  theme: 'light',
  isDark: false,
  setPreference: async () => {},
};

const ThemeContext = createContext<ThemeContextValue>(defaultValue);

export function applyScheme(pref: ThemePreference): void {
  if (Platform.OS === 'web') return; // Appearance.setColorScheme is native-only
  const scheme = pref === 'system' ? null : pref;
  (Appearance as any).setColorScheme(scheme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
        applyScheme(stored);
      }
    });
  }, []);

  const setPreference = useCallback(async (pref: ThemePreference): Promise<void> => {
    setPreferenceState(pref);
    await AsyncStorage.setItem(THEME_KEY, pref);
    applyScheme(pref);
  }, []);

  const effectiveTheme: EffectiveTheme =
    preference !== 'system' ? preference : deviceScheme === 'dark' ? 'dark' : 'light';

  const value: ThemeContextValue = {
    preference,
    theme: effectiveTheme,
    isDark: effectiveTheme === 'dark',
    setPreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) return defaultValue;
  return ctx;
}