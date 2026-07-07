import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../i18n';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { isDark } = useTheme();
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
      setError(err instanceof ApiError && err.status === 401
        ? t('auth.incorrectCredentials')
        : t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = {
    color: isDark ? '#F9FAFB' : '#1A1A1A',
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  };

  return (
    <View className="flex-1 bg-white dark:bg-bg-dark px-6 justify-center">
      <Text className="text-3xl font-bold text-ink dark:text-ink-dark mb-1">{t('auth.signInTitle')}</Text>
      <Text className="text-muted dark:text-muted-dark mb-8">{t('auth.signInSubtitle')}</Text>

      <Text className="text-ink dark:text-ink-dark font-medium mb-1">{t('auth.email')}</Text>
      <TextInput
        value={email} onChangeText={setEmail}
        autoCapitalize="none" autoComplete="email" keyboardType="email-address"
        placeholder={t('auth.emailPlaceholder')}
        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={inputStyle}
        className="border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 mb-4"
      />

      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-ink dark:text-ink-dark font-medium">{t('auth.password')}</Text>
        <Pressable onPress={() => router.push('/auth/forgot-password')}>
          <Text className="text-brand dark:text-brand-dark text-sm font-medium">{t('auth.forgotPassword')}</Text>
        </Pressable>
      </View>
      <TextInput
        value={password} onChangeText={setPassword}
        secureTextEntry autoComplete="password"
        placeholder={t('auth.passwordPlaceholder')}
        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={inputStyle}
        className="border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 mb-2"
      />

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      <Pressable
        onPress={handleLogin}
        disabled={isSubmitting || !email || !password}
        className="bg-brand dark:bg-brand-dark rounded-xl py-3 items-center mt-4 disabled:opacity-50"
      >
        {isSubmitting ? <ActivityIndicator color="white" /> : (
          <Text className="text-white font-semibold">{t('auth.loginButton')}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/auth/signup')} className="mt-6">
        <Text className="text-muted dark:text-muted-dark text-center">
          {t('auth.noAccount')}{' '}
          <Text className="text-brand dark:text-brand-dark font-medium">{t('auth.signUpLink')}</Text>
        </Text>
      </Pressable>
    </View>
  );
}