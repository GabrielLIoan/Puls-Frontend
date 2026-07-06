import { Pressable, Switch, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import {
    useNotificationPreferences,
    useRegisterPushToken,
} from '../hooks/useNotifications';
import { t } from '../i18n';
import type { DigestTime } from '../types/notifications';

const DIGEST_OPTIONS: { value: DigestTime; labelKey: string }[] = [
  { value: 'morning', labelKey: 'notifications.morning' },
  { value: 'afternoon', labelKey: 'notifications.afternoon' },
  { value: 'evening', labelKey: 'notifications.evening' },
];

export function NotificationSettings() {
  useLanguage();
  const { preferences, updatePreferences } = useNotificationPreferences();
  const { registerToken } = useRegisterPushToken();

  async function handleToggle(enabled: boolean) {
    if (enabled) {
      // Request permission and register token when enabling
      await registerToken(preferences?.digestTime);
    }
    updatePreferences({ notificationsEnabled: enabled });
  }

  return (
    <View className="px-4 py-4">
      {/* Enable/disable toggle */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-ink font-medium">
            {t('notifications.title')}
          </Text>
          <Text className="text-muted text-xs mt-0.5">
            {t('notifications.subtitle')}
          </Text>
        </View>
        <Switch
          value={preferences?.notificationsEnabled ?? false}
          onValueChange={handleToggle}
          trackColor={{ true: '#FF5A5F' }}
        />
      </View>

      {/* Digest time picker — only visible when notifications enabled */}
      {preferences?.notificationsEnabled && (
        <View>
          <Text className="text-ink font-medium mb-2">
            {t('notifications.digestTime')}
          </Text>
          <View className="flex-row gap-2">
            {DIGEST_OPTIONS.map(({ value, labelKey }) => (
              <Pressable
                key={value}
                onPress={() => updatePreferences({ digestTime: value })}
                className={`flex-1 py-2 rounded-xl items-center border ${
                  preferences?.digestTime === value
                    ? 'bg-brand border-brand'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    preferences?.digestTime === value
                      ? 'text-white'
                      : 'text-ink'
                  }`}
                >
                  {t(labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}