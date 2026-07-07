import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { BadgeGallery } from '../../components/BadgeGallery';
import { NotificationSettings } from '../../components/NotificationSettings';
import { XpBar } from '../../components/XpBar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { ThemePreference } from '../../context/ThemeContext';
import { useTheme } from '../../context/ThemeContext';
import {
  useGamificationBadges,
  useGamificationStats,
} from '../../hooks/useGamification';
import { SupportedLocale, t } from '../../i18n';

function SettingsRow({
  label,
  onPress,
  destructive = false,
  showBorder = true,
}: {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  showBorder?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 py-4 ${
        showBorder ? 'border-b border-gray-100 dark:border-border-dark' : ''
      }`}
    >
      <Text
        className={`font-medium ${
          destructive ? 'text-red-500' : 'text-ink dark:text-ink-dark'
        }`}
      >
        {label}
      </Text>
      {!destructive && (
        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
      )}
    </Pressable>
  );
}

function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  useLanguage();

  const options: { value: ThemePreference; label: string; icon: string }[] = [
    { value: 'light', label: t('theme.light'), icon: '☀️' },
    { value: 'system', label: t('theme.system'), icon: '⚙️' },
    { value: 'dark', label: t('theme.dark'), icon: '🌙' },
  ];

  return (
    <View className="px-4 pb-4 pt-3">
      <Text className="text-xs text-muted dark:text-muted-dark font-medium uppercase mb-2">
        {t('theme.title')}
      </Text>
      <View className="flex-row gap-2">
        {options.map(({ value, label, icon }) => (
          <Pressable
            key={value}
            onPress={() => setPreference(value)}
            className={`flex-1 py-2.5 rounded-xl items-center border ${
              preference === value
                ? 'bg-brand dark:bg-brand-dark border-brand dark:border-brand-dark'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-border-dark'
            }`}
          >
            <Text className="text-sm mb-0.5">{icon}</Text>
            <Text
              className={`text-xs font-medium ${
                preference === value
                  ? 'text-white'
                  : 'text-ink dark:text-ink-dark'
              }`}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function LanguageSwitcher({
  locale,
  availableLocales,
  setLanguage,
}: {
  locale: string;
  availableLocales: { value: string; label: string }[];
  setLanguage: (l: SupportedLocale) => void;
}) {
  return (
    <View className="px-4 pb-4 pt-3">
      <Text className="text-xs text-muted dark:text-muted-dark font-medium uppercase mb-2">
        {t('profile.language')}
      </Text>
      <View className="flex-row gap-2">
        {availableLocales.map(({ value, label }) => (
          <Pressable
            key={value}
            onPress={() => setLanguage(value as SupportedLocale)}
            className={`flex-1 py-2.5 rounded-xl items-center border ${
              locale === value
                ? 'bg-brand dark:bg-brand-dark border-brand dark:border-brand-dark'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-border-dark'
            }`}
          >
            <Text
              className={`font-medium text-sm ${
                locale === value ? 'text-white' : 'text-ink dark:text-ink-dark'
              }`}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const { locale, setLanguage, availableLocales } = useLanguage();
  const { data: stats } = useGamificationStats();
  const { data: badges } = useGamificationBadges();

  if (isAuthLoading) {
    return <View className="flex-1 bg-gray-50 dark:bg-bg-dark" />;
  }

  if (!user) {
    return (
      <View className="flex-1 bg-white dark:bg-bg-dark px-6 justify-center">
        <Text className="text-ink dark:text-ink-dark font-bold text-2xl mb-2 text-center">
          {t('profile.signInTitle')}
        </Text>
        <Text className="text-muted dark:text-muted-dark text-center mb-8">
          {t('profile.signInSubtitle')}
        </Text>

        <Pressable
          onPress={() => router.push('/auth/login')}
          className="bg-brand dark:bg-brand-dark rounded-xl py-3 items-center w-full mb-3"
        >
          <Text className="text-white font-semibold">
            {t('auth.loginButton')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/auth/signup')}
          className="border border-gray-200 dark:border-border-dark rounded-xl py-3 items-center w-full mb-8"
        >
          <Text className="text-ink dark:text-ink-dark font-semibold">
            {t('auth.signupButton')}
          </Text>
        </Pressable>

        <LanguageSwitcher
          locale={locale}
          availableLocales={availableLocales}
          setLanguage={setLanguage}
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-bg-dark">
      {/* Header */}
      <View className="bg-white dark:bg-surface-dark px-5 pt-14 pb-5 mb-4">
        <Text className="text-2xl font-bold text-ink dark:text-ink-dark">
          {user.displayName || user.email}
        </Text>
        <Text className="text-muted dark:text-muted-dark text-sm mt-0.5">
          {user.email}
        </Text>
      </View>

      {/* XP bar */}
      {stats && <XpBar stats={stats} />}

      {/* Settings rows */}
      <View className="bg-white dark:bg-surface-dark mx-4 rounded-2xl mb-4 overflow-hidden">
        <SettingsRow
          label={t('profile.manageOutlets')}
          onPress={() => router.push('/settings/outlets')}
        />
        <SettingsRow
          label={t('profile.categoryPreferences')}
          onPress={() => {}}
        />
        <SettingsRow
          label={t('profile.changePassword')}
          onPress={() =>
            router.push({
              pathname: '/auth/forgot-password',
              params: { prefillEmail: user.email },
            })
          }
          showBorder={false}
        />
      </View>

      {/* Notifications — native only, push notifications don't work on web */}
      {Platform.OS !== 'web' && (
        <View className="bg-white dark:bg-surface-dark mx-4 rounded-2xl mb-4 overflow-hidden">
          <NotificationSettings />
        </View>
      )}

      {/* Appearance — theme + language */}
      <View className="bg-white dark:bg-surface-dark mx-4 rounded-2xl mb-4 overflow-hidden">
        <ThemeToggle />
        <View className="border-t border-gray-100 dark:border-border-dark">
          <LanguageSwitcher
            locale={locale}
            availableLocales={availableLocales}
            setLanguage={setLanguage}
          />
        </View>
      </View>

      {/* Badges */}
      {badges && <BadgeGallery earnedBadges={badges} />}

      {/* Logout */}
      <View className="bg-white dark:bg-surface-dark mx-4 rounded-2xl mb-8 overflow-hidden">
        <SettingsRow
          label={t('profile.logout')}
          onPress={logout}
          destructive
          showBorder={false}
        />
      </View>
    </ScrollView>
  );
}