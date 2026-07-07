import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSaveToggle } from '../hooks/useSaveToggle';
import type { Article } from '../types/api';

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const PLACEHOLDER_COLORS = [
  '#FF5A5F', '#3B82F6', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

function placeholderColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length];
}

function ImagePlaceholder({ outletName, category }: { outletName: string; category?: string }) {
  const color = placeholderColor(outletName);
  return (
    <View
      className="w-20 h-20 rounded-xl items-center justify-center"
      style={{ backgroundColor: color + '18' }}
    >
      <Text className="font-bold text-xl" style={{ color }}>
        {outletName.charAt(0).toUpperCase()}
      </Text>
      {category && (
        <Text className="text-xs font-medium mt-0.5 px-1 text-center" style={{ color }} numberOfLines={1}>
          {category}
        </Text>
      )}
    </View>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { isSaved, toggle } = useSaveToggle(article.id);

  function handleSavePress() {
    if (!user) {
      Alert.alert('Sign in to save', 'Create an account or log in to save articles for later.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log in', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }
    toggle();
  }

  return (
    <View
      className="mx-4 mb-3 rounded-2xl overflow-hidden bg-white dark:bg-surface-dark"
      style={Platform.select({
        web: { boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)' },
        default: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 4,
          elevation: 2,
        },
      })}
    >
      <View className="flex-row gap-3 p-3">
        <Pressable
          onPress={() => router.push(`/article/${article.id}`)}
          className="flex-row gap-3 flex-1"
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}
        >
          {article.imageUrl ? (
            <Image
              source={{ uri: article.imageUrl }}
              className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700"
              resizeMode="cover"
            />
          ) : (
            <ImagePlaceholder outletName={article.outlet.name} category={article.category} />
          )}

          <View className="flex-1 justify-between py-0.5">
            <Text className="text-ink dark:text-ink-dark font-semibold text-sm leading-snug mb-2" numberOfLines={3}>
              {article.title}
            </Text>

            <View className="flex-row items-center flex-wrap gap-x-1.5">
              {article.category && (
                <>
                  <View className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                    <Text className="text-muted dark:text-muted-dark text-xs font-medium">
                      {article.category}
                    </Text>
                  </View>
                  <Text className="text-gray-300 dark:text-gray-600 text-xs">·</Text>
                </>
              )}
              <Text className="text-muted dark:text-muted-dark text-xs font-medium">
                {article.outlet.name}
              </Text>
              <Text className="text-gray-300 dark:text-gray-600 text-xs">·</Text>
              <Text className="text-muted dark:text-muted-dark text-xs">
                {timeAgo(article.publishedAt)}
              </Text>
            </View>
          </View>
        </Pressable>

        <Pressable onPress={handleSavePress} hitSlop={8} className="justify-start pt-0.5">
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isSaved ? '#FF7A7F' : isDark ? '#4B5563' : '#D1D5DB'}
          />
        </Pressable>
      </View>
    </View>
  );
}