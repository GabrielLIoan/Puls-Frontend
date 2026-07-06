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
import { useRecordRead } from '../../hooks/useGamification';
import { useSaveToggle } from '../../hooks/useSaveToggle';
import { t } from '../../i18n';

const DWELL_TIME_MS = 8_000;

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  useLanguage();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesApi.getById(id),
    enabled: !!id,
  });

  const { isSaved, isLoading: isSaveLoading, toggle } = useSaveToggle(id);
  const { mutate: recordRead } = useRecordRead();

  // --- ReadEvent tracking ---
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

  // --- Share ---
  async function handleShare() {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.link}`,
        url: article.link, // iOS uses url, Android uses message
      });
    } catch {
      // User dismissed the share sheet — not an error
    }
  }

  // --- Save ---
  function handleSavePress() {
    if (!user) {
      Alert.alert(
        t('article.signInToSave'),
        t('article.signInToSaveMessage'),
        [
          { text: t('article.cancel'), style: 'cancel' },
          {
            text: t('auth.loginButton'),
            onPress: () => router.push('/auth/login'),
          },
        ],
      );
      return;
    }
    toggle();
  }

  if (isLoading || !article) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header: back — share + save */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>

        <View className="flex-row items-center gap-4">
          {/* Share button */}
          <Pressable onPress={handleShare} hitSlop={12}>
            <Ionicons name="share-outline" size={24} color="#1A1A1A" />
          </Pressable>

          {/* Save button */}
          <Pressable
            onPress={handleSavePress}
            hitSlop={12}
            disabled={isSaveLoading}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? '#FF5A5F' : '#1A1A1A'}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {article.imageUrl && (
          <Image
            source={{ uri: article.imageUrl }}
            className="w-full h-48 rounded-xl bg-gray-100 mb-4"
            resizeMode="cover"
          />
        )}

        <Text className="text-muted text-xs font-medium mb-1">
          {article.outlet.name}
        </Text>
        <Text className="text-ink text-2xl font-bold mb-3">
          {article.title}
        </Text>

        {article.summary && (
          <Text className="text-ink text-base leading-relaxed mb-4">
            {article.summary}
          </Text>
        )}

        <ReactionBar articleId={id} />

        <Pressable
          onPress={() => Linking.openURL(article.link)}
          className="bg-brand rounded-xl py-3 items-center mb-8"
        >
          <Text className="text-white font-semibold">
            {t('article.readFullArticle', { outlet: article.outlet.name })}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}