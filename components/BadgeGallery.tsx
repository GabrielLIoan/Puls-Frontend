import { Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n';
import type { BadgeSlug, UserBadge } from '../types/gamification';

const BADGE_EMOJIS: Record<BadgeSlug, string> = {
  first_spark: '🔥',
  informed_week: '🔥',
  news_month: '🔥',
  iron_chronicler: '💎',
  explorer: '🗺️',
  polyglot: '🌍',
  omnivore: '🎯',
  loyal_fan: '⭐',
  collector: '📰',
  reactor: '💬',
};

const ALL_BADGES: BadgeSlug[] = [
  'first_spark',
  'informed_week',
  'news_month',
  'iron_chronicler',
  'explorer',
  'polyglot',
  'omnivore',
  'loyal_fan',
  'collector',
  'reactor',
];

function BadgeTile({ slug, earned }: { slug: BadgeSlug; earned: boolean }) {
  return (
    <View
      className={`items-center p-3 rounded-2xl flex-1 min-w-[30%] max-w-[32%] mb-3 ${
        earned ? 'bg-white' : 'bg-gray-50'
      }`}
      style={
        earned
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
            }
          : {}
      }
    >
      <Text className="text-3xl mb-1" style={{ opacity: earned ? 1 : 0.3 }}>
        {BADGE_EMOJIS[slug]}
      </Text>
      <Text
        className="text-xs font-semibold text-center"
        style={{ color: earned ? '#1A1A1A' : '#9CA3AF' }}
        numberOfLines={2}
      >
        {t(`badges.${slug}.name`)}
      </Text>
    </View>
  );
}

export function BadgeGallery({ earnedBadges }: { earnedBadges: UserBadge[] }) {
  // Subscribe to language changes so this re-renders on switch
  useLanguage();

  const earnedSlugs = new Set(earnedBadges.map((b) => b.badge));

  return (
    <View className="px-4 mb-4">
      <Text className="text-base font-bold text-ink mb-3">
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