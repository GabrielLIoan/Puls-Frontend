import { Platform, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';
import type { BadgeSlug, UserBadge } from '../types/gamification';

const BADGE_EMOJIS: Record<BadgeSlug, string> = {
  first_spark: '🔥', informed_week: '🔥', news_month: '🔥',
  iron_chronicler: '💎', explorer: '🗺️', polyglot: '🌍',
  omnivore: '🎯', loyal_fan: '⭐', collector: '📰', reactor: '💬',
};

const ALL_BADGES: BadgeSlug[] = [
  'first_spark', 'informed_week', 'news_month', 'iron_chronicler',
  'explorer', 'polyglot', 'omnivore', 'loyal_fan', 'collector', 'reactor',
];

function BadgeTile({ slug, earned }: { slug: BadgeSlug; earned: boolean }) {
  const { isDark } = useTheme();

  return (
    <View
      className={`items-center p-3 rounded-2xl flex-1 min-w-[30%] max-w-[32%] mb-3 ${
        earned
          ? 'bg-white dark:bg-surface-dark'
          : 'bg-gray-50 dark:bg-gray-800'
      }`}
      style={
        earned
          ? Platform.select({
              web: { boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)' },
              default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.3 : 0.06,
                shadowRadius: 4,
              },
            })
          : {}
      }
    >
      <Text className="text-3xl mb-1" style={{ opacity: earned ? 1 : 0.25 }}>
        {BADGE_EMOJIS[slug]}
      </Text>
      <Text
        className="text-xs font-semibold text-center"
        style={{ color: earned ? (isDark ? '#F9FAFB' : '#1A1A1A') : isDark ? '#4B5563' : '#9CA3AF' }}
        numberOfLines={2}
      >
        {t(`badges.${slug}.name`)}
      </Text>
    </View>
  );
}

export function BadgeGallery({ earnedBadges }: { earnedBadges: UserBadge[] }) {
  useLanguage();
  const earnedSlugs = new Set(earnedBadges.map((b) => b.badge));

  return (
    <View className="px-4 mb-4">
      <Text className="text-base font-bold text-ink dark:text-ink-dark mb-3">
        {t('badges.title')}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {ALL_BADGES.map((slug) => (
          <BadgeTile key={slug} slug={slug} earned={earnedSlugs.has(slug)} />
        ))}
      </View>
    </View>
  );
}