import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, Pressable,
  RefreshControl, Text, TextInput, View,
} from 'react-native';
import { ArticleCard } from '../../components/ArticleCard';
import { FilterBottomSheet } from '../../components/FilterBottomSheet';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useArticleFeed } from '../../hooks/useArticleFeed';
import { useColumns } from '../../hooks/useColumns';
import { useFeedFilter } from '../../hooks/useFeedFilter';
import { useGamificationStats } from '../../hooks/useGamification';
import { useSearch } from '../../hooks/useSearch';
import { t } from '../../i18n';
import type { Article } from '../../types/api';
import type { CountryFilter } from '../../types/feedFilter';

export default function FeedScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { data: stats } = useGamificationStats();
  const columns = useColumns();
  useLanguage();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const { filter, activeCount, toggleCountry, toggleCategory, clearAll } = useFeedFilter();
  const isSearching = searchOpen && searchQuery.trim().length >= 2;

  const {
    data: feedData, isLoading: feedLoading,
    fetchNextPage, hasNextPage, isFetchingNextPage,
    refetch, isRefetching,
  } = useArticleFeed(filter);

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
        // Key must change when numColumns changes — React Native requirement
        key={`feed-${columns}`}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        renderItem={({ item }) => <ArticleCard article={item} columns={columns} />}
        contentContainerStyle={{
          paddingBottom: 24,
          // In grid mode, outer padding replaces per-card mx-4
          paddingHorizontal: columns > 1 ? 10 : 0,
          paddingTop: columns > 1 ? 6 : 0,
        }}
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

                  <Pressable onPress={() => setFilterOpen(true)} hitSlop={8} className="relative">
                    <Ionicons
                      name="options-outline"
                      size={22}
                      color={activeCount > 0 ? '#FF5A5F' : iconColor}
                    />
                    {activeCount > 0 && (
                      <View className="absolute -top-1.5 -right-1.5 bg-brand dark:bg-brand-dark rounded-full w-4 h-4 items-center justify-center">
                        <Text className="text-white text-xs font-bold leading-none">{activeCount}</Text>
                      </View>
                    )}
                  </Pressable>

                  <Pressable onPress={openSearch} hitSlop={8}>
                    <Ionicons name="search" size={22} color={iconColor} />
                  </Pressable>
                </View>
              </View>
            )}

            {!searchOpen && activeCount > 0 && (
              <View className="flex-row flex-wrap gap-1.5 mt-2">
                {filter.country && (
                  <Pressable
                    onPress={() => toggleCountry(filter.country as CountryFilter)}
                    className="flex-row items-center gap-1 bg-brand/10 dark:bg-brand-dark/10 px-2.5 py-1 rounded-full"
                  >
                    <Text className="text-brand dark:text-brand-dark text-xs font-medium">
                      {filter.country === 'RO' ? '🇷🇴 România' : '🇪🇺 EU'}
                    </Text>
                    <Ionicons name="close" size={12} color="#FF5A5F" />
                  </Pressable>
                )}
                {filter.categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => toggleCategory(cat)}
                    className="flex-row items-center gap-1 bg-brand/10 dark:bg-brand-dark/10 px-2.5 py-1 rounded-full"
                  >
                    <Text className="text-brand dark:text-brand-dark text-xs font-medium">{cat}</Text>
                    <Ionicons name="close" size={12} color="#FF5A5F" />
                  </Pressable>
                ))}
              </View>
            )}

            {!searchOpen && user && activeCount === 0 && (
              <Text className="text-muted dark:text-muted-dark text-xs mt-1">
                {t('feed.personalizedFeed')}
              </Text>
            )}
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4"><ActivityIndicator color="#FF5A5F" /></View>
          ) : null
        }
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
              <Text className="text-muted dark:text-muted-dark text-center">
                {activeCount > 0 ? t('filter.noResults') : t('feed.noArticles')}
              </Text>
            </View>
          )
        }
      />

      <FilterBottomSheet
        visible={filterOpen}
        filter={filter}
        onToggleCountry={toggleCountry}
        onToggleCategory={toggleCategory}
        onClearAll={clearAll}
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}