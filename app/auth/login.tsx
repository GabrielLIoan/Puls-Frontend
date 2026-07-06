import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../i18n';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(t('auth.incorrectCredentials'));
      } else {
        setError(t('auth.genericError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-ink mb-1">
        {t('auth.signInTitle')}
      </Text>
      <Text className="text-muted mb-8">{t('auth.signInSubtitle')}</Text>

      <Text className="text-ink font-medium mb-1">{t('auth.email')}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder={t('auth.emailPlaceholder')}
        className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-ink"
      />

      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-ink font-medium">{t('auth.password')}</Text>
        <Pressable onPress={() => router.push('/auth/forgot-password')}>
          <Text className="text-brand text-sm font-medium">
            {t('auth.forgotPassword')}
          </Text>
        </Pressable>
      </View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        placeholder={t('auth.passwordPlaceholder')}
        className="border border-gray-200 rounded-xl px-4 py-3 mb-2 text-ink"
      />

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      <Pressable
        onPress={handleLogin}
        disabled={isSubmitting || !email || !password}
        className="bg-brand rounded-xl py-3 items-center mt-4 disabled:opacity-50"
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">{t('auth.loginButton')}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/auth/signup')} className="mt-6">
        <Text className="text-muted text-center">
          {t('auth.noAccount')}{' '}
          <Text className="text-brand font-medium">{t('auth.signUpLink')}</Text>
        </Text>
      </Pressable>
    </View>
  );
}