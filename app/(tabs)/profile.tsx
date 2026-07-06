import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BadgeGallery } from '../../components/BadgeGallery';
import { XpBar } from '../../components/XpBar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  useGamificationBadges,
  useGamificationStats,
} from '../../hooks/useGamification';
import { t } from '../../i18n';

type SupportedLocale = 'en' | 'ro';

function SettingsRow({
  label,
  onPress,
  destructive = false,
}: {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100"
    >
      <Text
        className={`font-medium ${destructive ? 'text-red-500' : 'text-ink'}`}
      >
        {label}
      </Text>
      {!destructive && (
        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
      )}
    </Pressable>
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
    <View className="px-4 py-4">
      <Text className="text-ink font-medium mb-3">{t('profile.language')}</Text>
      <View className="flex-row gap-2">
        {availableLocales.map(({ value, label }) => (
          <Pressable
            key={value}
            onPress={() => setLanguage(value as SupportedLocale)}
            className={`flex-1 py-2.5 rounded-xl items-center border ${
              locale === value
                ? 'bg-brand border-brand'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text
              className={`font-medium text-sm ${
                locale === value ? 'text-white' : 'text-ink'
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
    return <View className="flex-1 bg-gray-50" />;
  }

  if (!user) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-ink font-bold text-2xl mb-2">
          {t('profile.signInTitle')}
        </Text>
        <Text className="text-muted text-center mb-8">
          {t('profile.signInSubtitle')}
        </Text>

        <Pressable
          onPress={() => router.push('/auth/login')}
          className="bg-brand rounded-xl py-3 px-8 items-center w-full mb-3"
        >
          <Text className="text-white font-semibold">
            {t('auth.loginButton')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/auth/signup')}
          className="border border-gray-200 rounded-xl py-3 px-8 items-center w-full mb-8"
        >
          <Text className="text-ink font-semibold">
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
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-16 pb-6 mb-4">
        <Text className="text-2xl font-bold text-ink mb-0.5">
          {user.displayName || user.email}
        </Text>
        <Text className="text-muted">{user.email}</Text>
      </View>

      {/* XP / streak bar */}
      {stats && <XpBar stats={stats} />}

      {/* Settings rows */}
      <View className="bg-white mx-4 rounded-2xl mb-4 overflow-hidden">
        <SettingsRow
          label={t('profile.manageOutlets')}
          onPress={() => router.push('/settings/outlets')}
        />
        <SettingsRow
          label={t('profile.categoryPreferences')}
          onPress={() => {}}
        />
        {/* Password reset — navigates to forgot-password which sends
            the reset email. Email is pre-filled since we know it. */}
        <SettingsRow
          label={t('profile.changePassword')}
          onPress={() =>
            router.push({
              pathname: '/auth/forgot-password',
              params: { prefillEmail: user.email },
            })
          }
        />

        {/* Language switcher */}
        <LanguageSwitcher
          locale={locale}
          availableLocales={availableLocales}
          setLanguage={setLanguage}
        />
      </View>

      {/* Badge gallery */}
      {badges && <BadgeGallery earnedBadges={badges} />}

      {/* Logout */}
      <View className="bg-white mx-4 rounded-2xl mb-8 overflow-hidden">
        <SettingsRow
          label={t('profile.logout')}
          onPress={logout}
          destructive
        />
      </View>
    </ScrollView>
  );
}