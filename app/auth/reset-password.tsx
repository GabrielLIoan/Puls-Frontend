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
import { ApiError } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../i18n';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { isDark } = useTheme();
  useLanguage();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    setError(null);
    if (password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }
    if (!token) {
      setError(t('auth.invalidResetLink'));
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 400
          ? t('auth.invalidOrExpiredToken')
          : t('auth.genericError'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = {
    color: isDark ? '#F9FAFB' : '#1A1A1A',
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  };

  if (done) {
    return (
      <View className="flex-1 bg-white dark:bg-bg-dark px-6 justify-center">
        <Text className="text-4xl mb-4">✅</Text>
        <Text className="text-2xl font-bold text-ink dark:text-ink-dark mb-2">
          {t('auth.passwordUpdated')}
        </Text>
        <Text className="text-muted dark:text-muted-dark mb-8">
          {t('auth.passwordUpdatedSubtitle')}
        </Text>
        <Pressable
          onPress={() => router.replace('/auth/login')}
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
      <Text className="text-2xl font-bold text-ink dark:text-ink-dark mb-2">
        {t('auth.resetPasswordTitle')}
      </Text>
      <Text className="text-muted dark:text-muted-dark mb-8">
        {t('auth.resetPasswordSubtitle')}
      </Text>

      <Text className="text-ink dark:text-ink-dark font-medium mb-1">
        {t('auth.newPassword')}
      </Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder={t('auth.newPasswordPlaceholder')}
        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={inputStyle}
        className="border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 mb-4"
      />

      <Text className="text-ink dark:text-ink-dark font-medium mb-1">
        {t('auth.confirmPassword')}
      </Text>
      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholder={t('auth.confirmPasswordPlaceholder')}
        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={inputStyle}
        className="border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 mb-2"
      />

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      <Pressable
        onPress={handleReset}
        disabled={isSubmitting || !password || !confirm}
        className="bg-brand dark:bg-brand-dark rounded-xl py-3 items-center mt-4 disabled:opacity-50"
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">
            {t('auth.updatePassword')}
          </Text>
        )}
      </Pressable>
    </View>
  );
}