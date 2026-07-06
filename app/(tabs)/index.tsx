import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { ArticleCard } from '../../components/ArticleCard';
import { useAuth } from '../../context/AuthContext';
import { useArticleFeed } from '../../hooks/useArticleFeed';
import { useGamificationStats } from '../../hooks/useGamification';
import { t } from '../../i18n';
import type { Article } from '../../types/api';

function FeedHeader() {
  const { user } = useAuth();
  const { data: stats } = useGamificationStats();

  return (
    <View className="px-4 pt-14 pb-4 bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-lg bg-brand items-center justify-center">
            <Text className="text-white font-bold text-base">P</Text>
          </View>
          <Text className="text-2xl font-bold text-ink">
            {t('feed.title')}
          </Text>
        </View>

        {/* Streak indicator — only shown when logged in and streak > 0 */}
        {user && stats && stats.currentStreak > 0 && (
          <View className="flex-row items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
            <Text className="text-base">🔥</Text>
            <Text className="text-orange-500 font-bold text-sm">
              {stats.currentStreak}
            </Text>
          </View>
        )}
      </View>

      {user && (
        <Text className="text-muted text-sm mt-1">
          {t('feed.personalizedFeed')}
        </Text>
      )}
    </View>
  );
}

export default function FeedScreen() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useArticleFeed();

  const articles: Article[] = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-gray-50">
        <FeedHeader />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-ink text-center font-medium mb-1">
            {t('feed.couldNotLoad')}
          </Text>
          <Text className="text-muted text-center text-sm">
            {error instanceof Error ? error.message : t('feed.somethingWentWrong')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleCard article={item} />}
        ListHeaderComponent={<FeedHeader />}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#FF5A5F"
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator color="#FF5A5F" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20 px-6">
            <Text className="text-muted text-center">
              {t('feed.noArticles')}
            </Text>
          </View>
        }
      />
    </View>
  );
}