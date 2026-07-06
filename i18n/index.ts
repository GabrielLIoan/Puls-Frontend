import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './en';
import ro from './ro';

export type SupportedLocale = 'en' | 'ro';

const i18n = new I18n({ en, ro });

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Set initial locale from device — will be overridden by
// LanguageContext once it reads the persisted user preference.
const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
i18n.locale = ['en', 'ro'].includes(deviceLocale) ? deviceLocale : 'en';

export function setLocale(locale: SupportedLocale) {
  i18n.locale = locale;
}

export function getCurrentLocale(): SupportedLocale {
  return i18n.locale as SupportedLocale;
}

export function t(
  key: string,
  options?: Record<string, string | number>,
): string {
  return i18n.t(key, options);
}

export default i18n;