import { useRouter } from 'expo-router';
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
import { t } from '../../i18n';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  useLanguage();

  const [email, setEmail] = useState('');
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

  if (submitted) {
    return (
      <View className="flex-1 bg-white px-6 justify-center">
        <Text className="text-4xl mb-4">📬</Text>
        <Text className="text-2xl font-bold text-ink mb-2">
          {t('auth.checkYourEmail')}
        </Text>
        <Text className="text-muted mb-8">
          {t('auth.resetEmailSent', { email: email.trim() })}
        </Text>
        <Pressable
          onPress={() => router.push('/auth/login')}
          className="bg-brand rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold">
            {t('auth.backToLogin')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Pressable onPress={() => router.back()} className="mb-8">
        <Text className="text-brand font-medium">← {t('auth.backToLogin')}</Text>
      </Pressable>

      <Text className="text-2xl font-bold text-ink mb-2">
        {t('auth.forgotPasswordTitle')}
      </Text>
      <Text className="text-muted mb-8">
        {t('auth.forgotPasswordSubtitle')}
      </Text>

      <Text className="text-ink font-medium mb-1">{t('auth.email')}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder={t('auth.emailPlaceholder')}
        className="border border-gray-200 rounded-xl px-4 py-3 mb-2 text-ink"
      />

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting || !email}
        className="bg-brand rounded-xl py-3 items-center mt-4 disabled:opacity-50"
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