import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../i18n';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  useLanguage();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup() {
    setError(null);
    if (password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    setIsSubmitting(true);
    try {
      await signup(email.trim(), password, displayName.trim() || undefined);
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(t('auth.emailExists'));
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
        {t('auth.signUpTitle')}
      </Text>
      <Text className="text-muted mb-8">{t('auth.signUpSubtitle')}</Text>

      <Text className="text-ink font-medium mb-1">{t('auth.name')}</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder={t('auth.namePlaceholder')}
        className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-ink"
      />

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

      <Text className="text-ink font-medium mb-1">{t('auth.password')}</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password-new"
        placeholder={t('auth.newPasswordPlaceholder')}
        className="border border-gray-200 rounded-xl px-4 py-3 mb-2 text-ink"
      />

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      <Pressable
        onPress={handleSignup}
        disabled={isSubmitting || !email || !password}
        className="bg-brand rounded-xl py-3 items-center mt-4 disabled:opacity-50"
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">{t('auth.signupButton')}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/auth/login')} className="mt-6">
        <Text className="text-muted text-center">
          {t('auth.alreadyHaveAccount')}{' '}
          <Text className="text-brand font-medium">{t('auth.loginLink')}</Text>
        </Text>
      </Pressable>
    </View>
  );
}