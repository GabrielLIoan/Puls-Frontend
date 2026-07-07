import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getCurrentLocale, setLocale, type SupportedLocale } from '../i18n';

const LANGUAGE_KEY = 'puls_language';

const LANGUAGE_LABELS: Record<SupportedLocale, string> = {
  en: '🇬🇧 English',
  ro: '🇷🇴 Română',
};

interface LanguageContextValue {
  locale: SupportedLocale;
  setLanguage: (locale: SupportedLocale) => Promise<void>;
  languageLabel: string;
  availableLocales: { value: SupportedLocale; label: string }[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(
    getCurrentLocale(),
  );

  // On mount: restore persisted preference if any
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((stored) => {
      if (stored === 'en' || stored === 'ro') {
        setLocale(stored);
        setLocaleState(stored);
      }
    });
  }, []);

  const setLanguage = useCallback(async (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setLocaleState(newLocale); // triggers re-render of everything that calls t()
    await AsyncStorage.setItem(LANGUAGE_KEY, newLocale);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLanguage,
        languageLabel: LANGUAGE_LABELS[locale],
        availableLocales: Object.entries(LANGUAGE_LABELS).map(
          ([value, label]) => ({ value: value as SupportedLocale, label }),
        ),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  // Return a safe default instead of throwing — tab layouts render
  // early before providers are fully mounted
  if (!ctx) {
    return {
      locale: 'en',
      setLanguage: async () => {},
      languageLabel: '🇬🇧 English',
      availableLocales: [
        { value: 'en', label: '🇬🇧 English' },
        { value: 'ro', label: '🇷🇴 Română' },
      ],
    };
  }
  return ctx;
}