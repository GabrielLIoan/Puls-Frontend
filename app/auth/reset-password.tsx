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
import { t } from '../../i18n';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
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
      if (err instanceof ApiError && err.status === 400) {
        setError(t('auth.invalidOrExpiredToken'));
      } else {
        setError(t('auth.genericError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <View className="flex-1 bg-white px-6 justify-center">
        <Text className="text-4xl mb-4">✅</Text>
        <Text className="text-2xl font-bold text-ink mb-2">
          {t('auth.passwordUpdated')}
        </Text>
        <Text className="text-muted mb-8">
          {t('auth.passwordUpdatedSubtitle')}
        </Text>
        <Pressable
          onPress={() => router.replace('/auth/login')}
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
      <Text className="text-2xl font-bold text-ink mb-2">
        {t('auth.resetPasswordTitle')}
      </Text>
      <Text className="text-muted mb-8">
        {t('auth.resetPasswordSubtitle')}
      </Text>

      <Text className="text-ink font-medium mb-1">
        {t('auth.newPassword')}
      </Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder={t('auth.newPasswordPlaceholder')}
        className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-ink"
      />

      <Text className="text-ink font-medium mb-1">
        {t('auth.confirmPassword')}
      </Text>
      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholder={t('auth.confirmPasswordPlaceholder')}
        className="border border-gray-200 rounded-xl px-4 py-3 mb-2 text-ink"
      />

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      <Pressable
        onPress={handleReset}
        disabled={isSubmitting || !password || !confirm}
        className="bg-brand rounded-xl py-3 items-center mt-4 disabled:opacity-50"
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