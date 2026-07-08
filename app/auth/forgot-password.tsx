import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { authApi } from '../../api/auth';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../i18n';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { prefillEmail } = useLocalSearchParams<{ prefillEmail?: string }>();
  const { isDark } = useTheme();
  useLanguage();

  const [email, setEmail] = useState(prefillEmail ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSubmitted(true);
    } catch {
      setError(t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = {
    color: isDark ? '#F9FAFB' : '#1A1A1A',
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  };

  if (submitted) {
    return (
      <View className="flex-1 bg-white dark:bg-bg-dark px-6 justify-center">
        <Text className="text-4xl mb-4">📬</Text>
        <Text className="text-2xl font-bold text-ink dark:text-ink-dark mb-2">
          {t('auth.checkYourEmail')}
        </Text>
        <Text className="text-muted dark:text-muted-dark mb-8">
          {t('auth.resetEmailSent', { email: email.trim() })}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-brand dark:bg-brand-dark rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold">
            {t('auth.backToLogin')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-bg-dark px-6 justify-center">
      <Pressable onPress={() => router.back()} className="mb-8">
        <Text className="text-brand dark:text-brand-dark font-medium">
          ← {t('auth.backToLogin')}
        </Text>
      </Pressable>

      <Text className="text-2xl font-bold text-ink dark:text-ink-dark mb-2">
        {t('auth.forgotPasswordTitle')}
      </Text>
      <Text className="text-muted dark:text-muted-dark mb-8">
        {t('auth.forgotPasswordSubtitle')}
      </Text>

      <Text className="text-ink dark:text-ink-dark font-medium mb-1">
        {t('auth.email')}
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder={t('auth.emailPlaceholder')}
        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={inputStyle}
        className="border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 mb-2"
      />

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting || !email}
        className="bg-brand dark:bg-brand-dark rounded-xl py-3 items-center mt-4 disabled:opacity-50"
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">
            {t('auth.sendResetLink')}
          </Text>
        )}
      </Pressable>
    </View>
  );
}