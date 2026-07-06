import { Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n';
import type { UserStats } from '../types/gamification';

function levelName(level: number): string {
  return t(`levels.${level}`);
}

export function XpBar({ stats }: { stats: UserStats }) {
  // Subscribe to language changes so this re-renders on switch
  useLanguage();
  const isMaxLevel = stats.level >= 8;

  return (
    <View
      className="bg-white rounded-2xl p-4 mx-4 mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-xs text-muted font-medium">
            {t('xp.level', { level: stats.level })}
          </Text>
          <Text className="text-lg font-bold text-ink">
            {levelName(stats.level)}
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-2xl">🔥</Text>
          <Text className="text-xs font-bold text-ink">
            {stats.currentStreak}
          </Text>
          <Text className="text-xs text-muted">
            {stats.currentStreak === 1 ? t('xp.day') : t('xp.days')}
          </Text>
        </View>
      </View>

      <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
        <View
          className="h-2 bg-brand rounded-full"
          style={{ width: `${stats.progressPercent}%` }}
        />
      </View>

      <View className="flex-row justify-between">
        <Text className="text-xs text-muted">
          {t('xp.xpCount', { xp: stats.xp })}
        </Text>
        <Text className="text-xs text-muted">
          {isMaxLevel
            ? t('xp.maxLevel')
            : t('xp.nextLevel', { xp: stats.nextLevelXp })}
        </Text>
      </View>
    </View>
  );
}