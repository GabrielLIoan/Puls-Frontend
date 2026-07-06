export type BadgeSlug =
  | 'first_spark'
  | 'informed_week'
  | 'news_month'
  | 'iron_chronicler'
  | 'explorer'
  | 'polyglot'
  | 'omnivore'
  | 'loyal_fan'
  | 'collector'
  | 'reactor';

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  progressPercent: number;
  nextLevelXp: number;
}

export interface UserBadge {
  id: string;
  badge: BadgeSlug;
  earnedAt: string;
}

export interface ReadEventResult {
  xpAwarded: number;
  xpBreakdown: {
    base: number;
    firstOfDay: boolean;
    newCategory: boolean;
    categoryBreadth: boolean;
  };
  stats: UserStats;
  newBadges: BadgeSlug[];
  alreadyRead: boolean;
}