import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, Pressable,
  RefreshControl, Text, TextInput, View,
} from 'react-native';
import { ArticleCard } from '../../components/ArticleCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useArticleFeed } from '../../hooks/useArticleFeed';
import { useGamificationStats } from '../../hooks/useGamification';
import { useSearch } from '../../hooks/useSearch';
import { t } from '../../i18n';
import type { Article } from '../../types/api';

export default function FeedScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { data: stats } = useGamificationStats();
  useLanguage();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const isSearching = searchOpen && searchQuery.trim().length >= 2;

  const { data: feedData, isLoading: feedLoading, fetchNextPage,
    hasNextPage, isFetchingNextPage, refetch, isRefetching } = useArticleFeed();
  const { data: searchData, isFetching: searchFetching } = useSearch(searchQuery);

  const feedArticles: Article[] = feedData?.pages.flatMap((p) => p.data) ?? [];
  const searchArticles: Article[] = searchData?.data ?? [];
  const articles = isSearching ? searchArticles : feedArticles;

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery('');
    inputRef.current?.blur();
  }

  const iconColor = isDark ? '#F9FAFB' : '#1A1A1A';

  return (
    <View className="flex-1 bg-gray-50 dark:bg-bg-dark">
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleCard article={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          !isSearching ? (
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FF5A5F" />
          ) : undefined
        }
        onEndReached={() => {
          if (!isSearching && hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-border-dark px-4 pt-12 pb-3 mb-3">
            {searchOpen ? (
              <View className="flex-row items-center gap-2">
                <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 gap-2">
                  <Ionicons name="search" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    ref={inputRef}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={t('search.placeholder')}
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    style={{ color: isDark ? '#F9FAFB' : '#1A1A1A' }}
                    className="flex-1 text-sm"
                    autoCorrect={false}
                    returnKeyType="search"
                  />
                  {searchQuery.length > 0 && (
                    <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                      <Ionicons name="close-circle" size={16} color={isDark ? '#6B7280' : '#9CA3AF'} />
                    </Pressable>
                  )}
                </View>
                <Pressable onPress={closeSearch} hitSlop={8}>
                  <Text className="text-brand dark:text-brand-dark font-medium text-sm">
                    {t('search.cancel')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-lg bg-brand dark:bg-brand-dark items-center justify-center">
                    <Text className="text-white font-bold text-base">P</Text>
                  </View>
                  <Text className="text-2xl font-bold text-ink dark:text-ink-dark">
                    {t('feed.title')}
                  </Text>
                </View>

                <View className="flex-row items-center gap-3">
                  {user && stats && stats.currentStreak > 0 && (
                    <View className="flex-row items-center gap-1 bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">
                      <Text className="text-sm">🔥</Text>
                      <Text className="text-orange-500 font-bold text-sm">{stats.currentStreak}</Text>
                    </View>
                  )}
                  <Pressable onPress={openSearch} hitSlop={8}>
                    <Ionicons name="search" size={22} color={iconColor} />
                  </Pressable>
                </View>
              </View>
            )}
            {!searchOpen && user && (
              <Text className="text-muted dark:text-muted-dark text-xs mt-1">
                {t('feed.personalizedFeed')}
              </Text>
            )}
          </View>
        }
        ListFooterComponent={isFetchingNextPage ? <View className="py-4"><ActivityIndicator color="#FF5A5F" /></View> : null}
        ListEmptyComponent={
          (isSearching ? searchFetching : feedLoading) ? (
            <View className="py-20 items-center"><ActivityIndicator color="#FF5A5F" /></View>
          ) : isSearching ? (
            <View className="items-center justify-center py-20 px-6">
              <Text className="text-muted dark:text-muted-dark text-center">
                {t('search.noResults', { query: searchQuery })}
              </Text>
            </View>
          ) : (
            <View className="items-center justify-center py-20 px-6">
              <Text className="text-muted dark:text-muted-dark text-center">{t('feed.noArticles')}</Text>
            </View>
          )
        }
      />
    </View>
  );
}