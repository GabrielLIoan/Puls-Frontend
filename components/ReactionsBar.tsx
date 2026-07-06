import { useRouter } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useReactions } from '../hooks/useReactions';
import { t } from '../i18n';
import type { ReactionEmoji } from '../types/reactions';
import { REACTION_META, REACTION_ORDER } from '../types/reactions';

function ReactionButton({
  emoji,
  count,
  isSelected,
  onPress,
}: {
  emoji: ReactionEmoji;
  count: number;
  isSelected: boolean;
  onPress: () => void;
}) {
  const meta = REACTION_META[emoji];

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full border ${
        isSelected ? 'bg-brand border-brand' : 'bg-white border-gray-200'
      }`}
    >
      <Text className="text-base">{meta.emoji}</Text>
      {count > 0 && (
        <Text
          className={`text-xs font-medium ${
            isSelected ? 'text-white' : 'text-muted'
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
  useLanguage(); // subscribe to language changes

  function handleReact(emoji: ReactionEmoji) {
    if (!user) {
      Alert.alert(
        t('reactions.signInToReact'),
        t('reactions.signInToReactMessage'),
        [
          { text: t('reactions.cancel'), style: 'cancel' },
          {
            text: t('reactions.loginButton'),
            onPress: () => router.push('/auth/login'),
          },
        ],
      );
      return;
    }
    react(emoji);
  }

  return (
    <View className="flex-row flex-wrap gap-2 py-4">
      {REACTION_ORDER.map((emoji) => (
        <ReactionButton
          key={emoji}
          emoji={emoji}
          count={summary?.counts[emoji] ?? 0}
          isSelected={summary?.myReaction === emoji}
          onPress={() => handleReact(emoji)}
        />
      ))}
    </View>
  );
}