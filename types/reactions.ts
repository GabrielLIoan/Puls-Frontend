export type ReactionEmoji = 'like' | 'love' | 'sad' | 'angry' | 'surprised';

export const REACTION_META: Record<
  ReactionEmoji,
  { emoji: string; label: string }
> = {
  like: { emoji: '👍', label: 'Like' },
  love: { emoji: '❤️', label: 'Love' },
  sad: { emoji: '😢', label: 'Sad' },
  angry: { emoji: '😠', label: 'Angry' },
  surprised: { emoji: '😮', label: 'Surprised' },
};

export const REACTION_ORDER: ReactionEmoji[] = [
  'like',
  'love',
  'sad',
  'angry',
  'surprised',
];

export interface ReactionSummary {
  articleId: string;
  counts: Record<ReactionEmoji, number>;
  total: number;
  myReaction: ReactionEmoji | null;
}