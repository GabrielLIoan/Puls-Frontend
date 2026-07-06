import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { ArticleCard } from '../../components/ArticleCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSavedArticles } from '../../hooks/useSavedArticles';
import { t } from '../../i18n';
import type { Article } from '../../types/api';

export default function SavedScreen() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  useLanguage(); // subscribe to re-render on language switch

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSavedArticles();

  if (!isAuthLoading && !user) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-ink font-bold text-xl mb-2">
          {t('saved.saveTitle')}
        </Text>
        <Text className="text-muted text-center mb-8">
          {t('saved.saveSubtitle')}
        </Text>
        <Pressable
          onPress={() => router.push('/auth/login')}
          className="bg-brand rounded-xl py-3 px-8 items-center w-full mb-3"
        >
          <Text className="text-white font-semibold">
            {t('auth.loginButton')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/auth/signup')}
          className="border border-gray-200 rounded-xl py-3 px-8 items-center w-full"
        >
          <Text className="text-ink font-semibold">
            {t('auth.signupButton')}
          </Text>
        </Pressable>
      </View>
    );
  }

  const articles: Article[] = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-ink text-center font-medium">
          {t('saved.couldNotLoad')}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-14 pb-3">
        <Text className="text-2xl font-bold text-ink">{t('saved.title')}</Text>
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleCard article={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
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
            <Text className="text-muted text-center">{t('saved.empty')}</Text>
          </View>
        }
      />
    </View>
  );
}