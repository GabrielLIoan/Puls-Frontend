import { useRouter } from 'expo-router';
import {
  ActivityIndicator, FlatList, Pressable,
  RefreshControl, Text, View,
} from 'react-native';
import { ArticleCard } from '../../components/ArticleCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useColumns } from '../../hooks/useColumns';
import { useSavedArticles } from '../../hooks/useSavedArticles';
import { t } from '../../i18n';
import type { Article } from '../../types/api';

export default function SavedScreen() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const columns = useColumns();
  useLanguage();

  const {
    data, isLoading, isError,
    fetchNextPage, hasNextPage,
    isFetchingNextPage, refetch, isRefetching,
  } = useSavedArticles();

  if (!isAuthLoading && !user) {
    return (
      <View className="flex-1 bg-white dark:bg-bg-dark items-center justify-center px-6">
        <Text className="text-3xl mb-4">🔖</Text>
        <Text className="text-ink dark:text-ink-dark font-bold text-xl mb-2">{t('saved.saveTitle')}</Text>
        <Text className="text-muted dark:text-muted-dark text-center mb-8">{t('saved.saveSubtitle')}</Text>
        <Pressable onPress={() => router.push('/auth/login')}
          className="bg-brand dark:bg-brand-dark rounded-xl py-3 px-8 items-center w-full mb-3">
          <Text className="text-white font-semibold">{t('auth.loginButton')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/auth/signup')}
          className="border border-gray-200 dark:border-border-dark rounded-xl py-3 px-8 items-center w-full">
          <Text className="text-ink dark:text-ink-dark font-semibold">{t('auth.signupButton')}</Text>
        </Pressable>
      </View>
    );
  }

  const articles: Article[] = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-bg-dark">
      <ActivityIndicator size="large" color="#FF5A5F" />
    </View>
  );

  if (isError) return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-bg-dark px-6">
      <Text className="text-ink dark:text-ink-dark text-center font-medium">{t('saved.couldNotLoad')}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-bg-dark">
      <FlatList
        data={articles}
        key={`saved-${columns}`}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        renderItem={({ item }) => <ArticleCard article={item} columns={columns} />}
        contentContainerStyle={{
          paddingBottom: 24,
          paddingHorizontal: columns > 1 ? 10 : 0,
          paddingTop: columns > 1 ? 6 : 0,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FF5A5F" />
        }
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-border-dark px-4 pt-12 pb-3 mb-3">
            <Text className="text-2xl font-bold text-ink dark:text-ink-dark">{t('saved.title')}</Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4"><ActivityIndicator color="#FF5A5F" /></View>
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20 px-6">
            <Text className="text-3xl mb-3">🔖</Text>
            <Text className="text-muted dark:text-muted-dark text-center">{t('saved.empty')}</Text>
          </View>
        }
      />
    </View>
  );
}