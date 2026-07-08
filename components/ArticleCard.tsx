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
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
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

interface ArticleCardProps {
  article: Article;
  // columns > 1 = grid mode: card stacks vertically with image on top
  columns?: number;
}

export function ArticleCard({ article, columns = 1 }: ArticleCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { isSaved, toggle } = useSaveToggle(article.id);
  const isLoggedIn = !!user;
  const isGrid = columns > 1;

  function handleSavePress() {
    if (!isLoggedIn) {
      Alert.alert(
        'Sign in to save',
        'Create an account or log in to save articles for later.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log in', onPress: () => router.push('/auth/login') },
        ],
      );
      return;
    }
    toggle();
  }

  function SaveIcon() {
    if (!isLoggedIn) {
      return <Ionicons name="lock-closed-outline" size={16} color={isDark ? '#4B5563' : '#D1D5DB'} />;
    }
    return (
      <Ionicons
        name={isSaved ? 'bookmark' : 'bookmark-outline'}
        size={18}
        color={isSaved ? (isDark ? '#FF7A7F' : '#FF5A5F') : isDark ? '#4B5563' : '#D1D5DB'}
      />
    );
  }

  const shadowStyle = Platform.select({
    web: { boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
  });

  // --- GRID MODE (tablet) ---
  // Card is vertical: full-width image on top, text below
  if (isGrid) {
    return (
      <View
        className="rounded-2xl overflow-hidden bg-white dark:bg-surface-dark"
        style={[{ flex: 1, margin: 6 }, shadowStyle]}
      >
        <Pressable
          onPress={() => router.push(`/article/${article.id}`)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}
        >
          {/* Top image — full width */}
          {article.imageUrl ? (
            <Image
              source={{ uri: article.imageUrl }}
              className="w-full bg-gray-100 dark:bg-gray-700"
              style={{ height: 140 }}
              resizeMode="cover"
            />
          ) : (
            <View
              className="w-full items-center justify-center"
              style={{ height: 140, backgroundColor: placeholderColor(article.outlet.name) + '18' }}
            >
              <Text className="font-bold text-4xl" style={{ color: placeholderColor(article.outlet.name) }}>
                {article.outlet.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {/* Text content */}
          <View className="p-3 gap-1.5">
            <Text
              className="text-ink dark:text-ink-dark font-semibold text-sm leading-snug"
              numberOfLines={3}
            >
              {article.title}
            </Text>

            {/* Outlet + time row */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5 flex-1">
                <Text className="text-muted dark:text-muted-dark text-xs font-semibold" numberOfLines={1}>
                  {article.outlet.name}
                </Text>
                <Text className="text-gray-300 dark:text-gray-600 text-xs">·</Text>
                <Text className="text-muted dark:text-muted-dark text-xs">
                  {timeAgo(article.publishedAt)}
                </Text>
              </View>
              {/* Save button inline for grid mode */}
              <Pressable onPress={handleSavePress} hitSlop={8}>
                <SaveIcon />
              </Pressable>
            </View>

            {/* Category pill */}
            {article.category && (
              <View className="flex-row">
                <View className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 self-start">
                  <Text className="text-muted dark:text-muted-dark text-xs font-medium">
                    {article.category}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Pressable>
      </View>
    );
  }

  // --- LIST MODE (phone) ---
  return (
    <View
      className="mx-4 mb-3 rounded-2xl overflow-hidden bg-white dark:bg-surface-dark"
      style={shadowStyle}
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

          <View className="flex-1 justify-between py-0.5 gap-1.5">
            <Text
              className="text-ink dark:text-ink-dark font-semibold text-sm leading-snug"
              numberOfLines={3}
            >
              {article.title}
            </Text>

            <View className="flex-row items-center gap-1.5">
              <Text className="text-muted dark:text-muted-dark text-xs font-semibold" numberOfLines={1}>
                {article.outlet.name}
              </Text>
              <Text className="text-gray-300 dark:text-gray-600 text-xs">·</Text>
              <Text className="text-muted dark:text-muted-dark text-xs">
                {timeAgo(article.publishedAt)}
              </Text>
            </View>

            {article.category && (
              <View className="flex-row">
                <View className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 self-start">
                  <Text className="text-muted dark:text-muted-dark text-xs font-medium">
                    {article.category}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Pressable>

        <Pressable onPress={handleSavePress} hitSlop={8} className="justify-start pt-0.5">
          <SaveIcon />
        </Pressable>
      </View>
    </View>
  );
}