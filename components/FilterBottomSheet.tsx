import { Ionicons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAvailableCategories } from '../hooks/useFeedFilter';
import { t } from '../i18n';
import type { CountryFilter, FeedFilter } from '../types/feedFilter';

interface Props {
  visible: boolean;
  filter: FeedFilter;
  onToggleCountry: (country: CountryFilter) => void;
  onToggleCategory: (category: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full border mr-2 mb-2 ${
        selected
          ? 'bg-brand dark:bg-brand-dark border-brand dark:border-brand-dark'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-border-dark'
      }`}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? 'text-white' : 'text-ink dark:text-ink-dark'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function FilterBottomSheet({
  visible,
  filter,
  onToggleCountry,
  onToggleCategory,
  onClearAll,
  onClose,
}: Props) {
  const { isDark } = useTheme();
  useLanguage();
  const { data: categories, isLoading: categoriesLoading } =
    useAvailableCategories();

  const hasFilters =
    filter.country !== null || filter.categories.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />

      <View
        className="bg-white dark:bg-surface-dark rounded-t-3xl px-5 pt-4 pb-8"
        style={{ maxHeight: '75%' }}
      >
        <View className="w-10 h-1 bg-gray-200 dark:bg-gray-600 rounded-full self-center mb-4" />

        <View className="flex-row items-center justify-between mb-5">
          <Text className="text-lg font-bold text-ink dark:text-ink-dark">
            {t('filter.title')}
          </Text>
          <View className="flex-row items-center gap-3">
            {hasFilters && (
              <Pressable onPress={onClearAll}>
                <Text className="text-brand dark:text-brand-dark text-sm font-medium">
                  {t('filter.clearAll')}
                </Text>
              </Pressable>
            )}
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons
                name="close"
                size={22}
                color={isDark ? '#F9FAFB' : '#1A1A1A'}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-xs font-semibold text-muted dark:text-muted-dark uppercase mb-3">
            {t('filter.country')}
          </Text>
          <View className="flex-row mb-5">
            <Chip
              label="🇷🇴 România"
              selected={filter.country === 'RO'}
              onPress={() => onToggleCountry('RO')}
            />
            <Chip
              label="🇪🇺 EU / International"
              selected={filter.country === 'EU'}
              onPress={() => onToggleCountry('EU')}
            />
          </View>

          <Text className="text-xs font-semibold text-muted dark:text-muted-dark uppercase mb-3">
            {t('filter.category')}
          </Text>

          {categoriesLoading ? (
            <ActivityIndicator color="#FF5A5F" />
          ) : (
            <View className="flex-row flex-wrap">
              {(categories ?? []).map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  selected={filter.categories.includes(cat)}
                  onPress={() => onToggleCategory(cat)}
                />
              ))}
              {(categories ?? []).length === 0 && (
                <Text className="text-muted dark:text-muted-dark text-sm">
                  {t('filter.noCategories')}
                </Text>
              )}
            </View>
          )}

          {hasFilters && (
            <View className="mt-4 p-3 bg-brand/10 dark:bg-brand-dark/10 rounded-xl">
              <Text className="text-brand dark:text-brand-dark text-xs font-medium">
                {t('filter.active', {
                  count: (filter.country ? 1 : 0) + filter.categories.length,
                })}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}