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
          className="border border-gray-200 rounded-xl py-3 px-8 items-center w-full"
        >
          <Text className="text-ink font-semibold">
            {t('auth.signupButton')}
          </Text>
        </Pressable>

        {/* Language switcher available even when logged out */}
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
        <Pressable
          onPress={() => router.push('/settings/outlets')}
          className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100"
        >
          <Text className="text-ink font-medium">
            {t('profile.manageOutlets')}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </Pressable>

        <Pressable className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
          <Text className="text-ink font-medium">
            {t('profile.categoryPreferences')}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </Pressable>

        {/* Language switcher */}
        <View className="px-4 py-4">
          <Text className="text-ink font-medium mb-3">
            {t('profile.language')}
          </Text>
          <LanguageSwitcher
            locale={locale}
            availableLocales={availableLocales}
            setLanguage={setLanguage}
          />
        </View>
      </View>

      {/* Badge gallery */}
      {badges && <BadgeGallery earnedBadges={badges} />}

      {/* Logout */}
      <Pressable onPress={logout} className="mx-4 py-4 mt-2 mb-8">
        <Text className="text-red-500 font-medium text-center">
          {t('profile.logout')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function LanguageSwitcher({
  locale,
  availableLocales,
  setLanguage,
}: {
  locale: string;
  availableLocales: { value: string; label: string }[];
  setLanguage: (l: any) => void;
}) {
  return (
    <View className="flex-row gap-2">
      {availableLocales.map(({ value, label }) => (
        <Pressable
          key={value}
          onPress={() => setLanguage(value)}
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
  );
}