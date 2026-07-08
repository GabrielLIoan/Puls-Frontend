import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useReactions } from '../hooks/useReactions';
import { t } from '../i18n';
import type { ReactionEmoji } from '../types/reactions';
import { REACTION_META, REACTION_ORDER } from '../types/reactions';

function ReactionButton({
  emoji,
  count,
  isSelected,
  isLoggedIn,
  onPress,
}: {
  emoji: ReactionEmoji;
  count: number;
  isSelected: boolean;
  isLoggedIn: boolean;
  onPress: () => void;
}) {
  const { isDark } = useTheme();
  const meta = REACTION_META[emoji];

  if (!isLoggedIn) {
    // Logged-out: greyed out pill with a lock, not interactive-looking
    return (
      <View
        className="flex-row items-center gap-1 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <Text className="text-base" style={{ opacity: 0.4 }}>{meta.emoji}</Text>
        {count > 0 && (
          <Text className="text-xs text-muted dark:text-muted-dark" style={{ opacity: 0.4 }}>
            {count}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full border ${
        isSelected
          ? 'bg-brand dark:bg-brand-dark border-brand dark:border-brand-dark'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <Text className="text-base">{meta.emoji}</Text>
      {count > 0 && (
        <Text
          className={`text-xs font-medium ${
            isSelected ? 'text-white' : 'text-muted dark:text-muted-dark'
          }`}
        >
          {count}
        </Text>
      )}
    </Pressable>
  );
}

export function ReactionBar({ articleId }: { articleId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { summary, react } = useReactions(articleId);
  const isLoggedIn = !!user;
  useLanguage();

  function handleReact(emoji: ReactionEmoji) {
    if (!isLoggedIn) {
      // Shouldn't reach here since buttons are non-pressable when logged out,
      // but guard just in case
      router.push('/auth/login');
      return;
    }
    react(emoji);
  }

  return (
    <View>
      <View className="flex-row flex-wrap gap-2 py-3">
        {REACTION_ORDER.map((emoji) => (
          <ReactionButton
            key={emoji}
            emoji={emoji}
            count={summary?.counts[emoji] ?? 0}
            isSelected={summary?.myReaction === emoji}
            isLoggedIn={isLoggedIn}
            onPress={() => handleReact(emoji)}
          />
        ))}
      </View>

      {/* Sign in prompt shown below reactions for logged-out users */}
      {!isLoggedIn && (
        <Pressable
          onPress={() => router.push('/auth/login')}
          className="mb-2"
        >
          <Text className="text-muted dark:text-muted-dark text-xs">
            {t('reactions.signInToReact')}{' '}
            <Text className="text-brand dark:text-brand-dark font-medium">
              {t('auth.loginLink')}
            </Text>
          </Text>
        </Pressable>
      )}
    </View>
  );
}