import { Platform, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';
import type { UserStats } from '../types/gamification';

function levelName(level: number): string {
  return t(`levels.${level}`);
}

export function XpBar({ stats }: { stats: UserStats }) {
  useLanguage();
  const { isDark } = useTheme();
  const isMaxLevel = stats.level >= 8;

  return (
    <View
      className="rounded-2xl p-4 mx-4 mb-4 bg-white dark:bg-surface-dark"
      style={Platform.select({
        web: { boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)' },
        default: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 4,
        },
      })}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-xs text-muted dark:text-muted-dark font-medium">
            {t('xp.level', { level: stats.level })}
          </Text>
          <Text className="text-lg font-bold text-ink dark:text-ink-dark">
            {levelName(stats.level)}
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-2xl">🔥</Text>
          <Text className="text-xs font-bold text-ink dark:text-ink-dark">
            {stats.currentStreak}
          </Text>
          <Text className="text-xs text-muted dark:text-muted-dark">
            {stats.currentStreak === 1 ? t('xp.day') : t('xp.days')}
          </Text>
        </View>
      </View>

      <View className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
        <View
          className="h-2 bg-brand dark:bg-brand-dark rounded-full"
          style={{ width: `${stats.progressPercent}%` }}
        />
      </View>

      <View className="flex-row justify-between">
        <Text className="text-xs text-muted dark:text-muted-dark">
          {t('xp.xpCount', { xp: stats.xp })}
        </Text>
        <Text className="text-xs text-muted dark:text-muted-dark">
          {isMaxLevel
            ? t('xp.maxLevel')
            : t('xp.nextLevel', { xp: stats.nextLevelXp })}
        </Text>
      </View>
    </View>
  );
}