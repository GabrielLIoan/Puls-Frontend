import { ReactionBar } from '@/components/ReactionsBar';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { articlesApi } from '../../api/articles';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useRecordRead } from '../../hooks/useGamification';
import { useSaveToggle } from '../../hooks/useSaveToggle';
import { t } from '../../i18n';

const DWELL_TIME_MS = 8_000;

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isLoggedIn = !!user;
  useLanguage();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesApi.getById(id),
    enabled: !!id,
  });

  const { isSaved, isLoading: isSaveLoading, toggle } = useSaveToggle(id);
  const { mutate: recordRead } = useRecordRead();
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRecorded = useRef(false);

  function tryRecordRead() {
    if (hasRecorded.current || !user || !id) return;
    hasRecorded.current = true;
    const today = new Date().toISOString().split('T')[0];
    recordRead({ articleId: id, readDate: today });
  }

  useEffect(() => {
    if (!article || !user) return;
    dwellTimerRef.current = setTimeout(tryRecordRead, DWELL_TIME_MS);
    return () => {
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    };
  }, [article, user]);

  async function handleShare() {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.link}`,
        url: article.link,
      });
    } catch {}
  }

  function handleSavePress() {
    if (!isLoggedIn) {
      Alert.alert(
        t('article.signInToSave'),
        t('article.signInToSaveMessage'),
        [
          { text: t('article.cancel'), style: 'cancel' },
          { text: t('auth.loginButton'), onPress: () => router.push('/auth/login') },
        ],
      );
      return;
    }
    toggle();
  }

  if (isLoading || !article) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-bg-dark">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  const iconColor = isDark ? '#F9FAFB' : '#1A1A1A';
  const summaryColor = isDark ? '#D1D5DB' : '#374151';

  // Save icon: lock when logged out, bookmark when logged in
  function SaveIcon() {
    if (!isLoggedIn) {
      return (
        <Ionicons
          name="lock-closed-outline"
          size={22}
          color={isDark ? '#4B5563' : '#D1D5DB'}
        />
      );
    }
    return (
      <Ionicons
        name={isSaved ? 'bookmark' : 'bookmark-outline'}
        size={22}
        color={isSaved ? (isDark ? '#FF7A7F' : '#FF5A5F') : iconColor}
      />
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-bg-dark">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-2 bg-white dark:bg-bg-dark">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </Pressable>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={handleShare} hitSlop={12}>
            <Ionicons name="share-outline" size={22} color={iconColor} />
          </Pressable>
          <Pressable
            onPress={handleSavePress}
            hitSlop={12}
            disabled={isSaveLoading}
          >
            <SaveIcon />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {article.imageUrl && (
          <Image
            source={{ uri: article.imageUrl }}
            className="w-full h-48 rounded-xl bg-gray-100 dark:bg-gray-700 mb-4"
            resizeMode="cover"
          />
        )}

        <View className="flex-row items-center gap-2 mb-3">
          <View className="bg-gray-100 dark:bg-gray-700 rounded-full px-2.5 py-1">
            <Text className="text-muted dark:text-muted-dark text-xs font-semibold">
              {article.outlet.name}
            </Text>
          </View>
          {article.category && (
            <View className="bg-gray-100 dark:bg-gray-700 rounded-full px-2.5 py-1">
              <Text className="text-muted dark:text-muted-dark text-xs font-medium">
                {article.category}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-ink dark:text-ink-dark text-2xl font-bold leading-tight mb-4">
          {article.title}
        </Text>

        {article.summary && (
          <Text className="text-base leading-relaxed mb-4" style={{ color: summaryColor }}>
            {article.summary}
          </Text>
        )}

        <ReactionBar articleId={id} />

        <Pressable
          onPress={() => Linking.openURL(article.link)}
          className="bg-brand dark:bg-brand-dark rounded-xl py-3.5 items-center mt-2 mb-8"
        >
          <Text className="text-white font-semibold">
            {t('article.readFullArticle', { outlet: article.outlet.name })}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}