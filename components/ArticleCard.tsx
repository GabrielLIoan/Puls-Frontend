import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useSaveToggle } from '../hooks/useSaveToggle';
import type { Article } from '../types/api';

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Deterministic colour from outlet name so each outlet gets a
// consistent accent colour on its placeholder tile.
const PLACEHOLDER_COLORS = [
  '#FF5A5F', // brand red
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
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
  const initial = outletName.charAt(0).toUpperCase();

  return (
    <View
      className="w-20 h-20 rounded-xl items-center justify-center"
      style={{ backgroundColor: color + '18' }} // ~10% opacity tint
    >
      <Text
        className="font-bold text-xl"
        style={{ color }}
      >
        {initial}
      </Text>
      {category && (
        <Text
          className="text-xs font-medium mt-0.5"
          style={{ color }}
          numberOfLines={1}
        >
          {category}
        </Text>
      )}
    </View>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggle } = useSaveToggle(article.id);

  function handleSavePress() {
    if (!user) {
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

  return (
    <View
      className="mx-4 mb-3 bg-white rounded-2xl overflow-hidden"
      style={Platform.select({
        web: { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
        default: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        },
      })}
    >
      <Pressable
        onPress={() => router.push(`/article/${article.id}`)}
        className="flex-row gap-3 p-3"
        style={({ pressed }) => ({
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        {/* Image or placeholder */}
        {article.imageUrl ? (
          <Image
            source={{ uri: article.imageUrl }}
            className="w-20 h-20 rounded-xl bg-gray-100"
            resizeMode="cover"
          />
        ) : (
          <ImagePlaceholder
            outletName={article.outlet.name}
            category={article.category}
          />
        )}

        {/* Text content */}
        <View className="flex-1 justify-between py-0.5">
          <Text
            className="text-ink font-semibold text-sm leading-snug"
            numberOfLines={3}
          >
            {article.title}
          </Text>

          <View className="flex-row items-center gap-1.5 mt-1">
            {article.category && (
              <>
                <View className="bg-gray-100 rounded-full px-2 py-0.5">
                  <Text className="text-muted text-xs font-medium">
                    {article.category}
                  </Text>
                </View>
                <Text className="text-gray-300 text-xs">·</Text>
              </>
            )}
            <Text className="text-muted text-xs font-medium">
              {article.outlet.name}
            </Text>
            <Text className="text-gray-300 text-xs">·</Text>
            <Text className="text-muted text-xs">
              {timeAgo(article.publishedAt)}
            </Text>
          </View>
        </View>

        {/* Save button */}
        <Pressable
          onPress={handleSavePress}
          hitSlop={8}
          className="justify-start pt-0.5"
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isSaved ? '#FF5A5F' : '#D1D5DB'}
          />
        </Pressable>
      </Pressable>
    </View>
  );
}