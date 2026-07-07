import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../i18n';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const { isDark } = useTheme();
  useLanguage();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup() {
    setError(null);
    if (password.length < 8) { setError(t('auth.passwordTooShort')); return; }
    setIsSubmitting(true);
    try {
      await signup(email.trim(), password, displayName.trim() || undefined);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof ApiError && err.status === 409
        ? t('auth.emailExists')
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
      <Text className="text-3xl font-bold text-ink dark:text-ink-dark mb-1">{t('auth.signUpTitle')}</Text>
      <Text className="text-muted dark:text-muted-dark mb-8">{t('auth.signUpSubtitle')}</Text>

      <Text className="text-ink dark:text-ink-dark font-medium mb-1">{t('auth.name')}</Text>
      <TextInput value={displayName} onChangeText={setDisplayName}
        placeholder={t('auth.namePlaceholder')} placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={inputStyle} className="border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 mb-4" />

      <Text className="text-ink dark:text-ink-dark font-medium mb-1">{t('auth.email')}</Text>
      <TextInput value={email} onChangeText={setEmail}
        autoCapitalize="none" autoComplete="email" keyboardType="email-address"
        placeholder={t('auth.emailPlaceholder')} placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={inputStyle} className="border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 mb-4" />

      <Text className="text-ink dark:text-ink-dark font-medium mb-1">{t('auth.password')}</Text>
      <TextInput value={password} onChangeText={setPassword}
        secureTextEntry autoComplete="password-new"
        placeholder={t('auth.newPasswordPlaceholder')} placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={inputStyle} className="border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 mb-2" />

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      <Pressable onPress={handleSignup} disabled={isSubmitting || !email || !password}
        className="bg-brand dark:bg-brand-dark rounded-xl py-3 items-center mt-4 disabled:opacity-50">
        {isSubmitting ? <ActivityIndicator color="white" /> : (
          <Text className="text-white font-semibold">{t('auth.signupButton')}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/auth/login')} className="mt-6">
        <Text className="text-muted dark:text-muted-dark text-center">
          {t('auth.alreadyHaveAccount')}{' '}
          <Text className="text-brand dark:text-brand-dark font-medium">{t('auth.loginLink')}</Text>
        </Text>
      </Pressable>
    </View>
  );
}