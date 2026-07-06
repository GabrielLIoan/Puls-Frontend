import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useOutletSettings } from '../../hooks/useOutletSettings';
import { t } from '../../i18n';
import type { OutletWithStatus } from '../../types/api';

function OutletRow({
  outlet,
  onToggle,
}: {
  outlet: OutletWithStatus;
  onToggle: (enable: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100">
      <Text className="text-ink font-medium flex-1" numberOfLines={1}>
        {outlet.name}
      </Text>
      <Switch
        value={outlet.enabled}
        onValueChange={onToggle}
        trackColor={{ true: '#FF5A5F' }}
      />
    </View>
  );
}

export default function OutletSettingsScreen() {
  const router = useRouter();
  const { outlets, isLoading, isError, toggleOutlet } = useOutletSettings();
  useLanguage(); // subscribe to re-render on language switch

  const roOutlets = outlets.filter((o) => o.country === 'RO');
  const euOutlets = outlets.filter((o) => o.country === 'EU');

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pt-14 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={12} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text className="text-xl font-bold text-ink">
          {t('outlets.title')}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF5A5F" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted text-center">
            {t('outlets.couldNotLoad')}
          </Text>
        </View>
      ) : (
        <ScrollView>
          {roOutlets.length > 0 && (
            <>
              <Text className="text-muted text-xs font-semibold uppercase px-4 pt-4 pb-1">
                {t('outlets.romania')}
              </Text>
              {roOutlets.map((outlet) => (
                <OutletRow
                  key={outlet.id}
                  outlet={outlet}
                  onToggle={(enable) => toggleOutlet(outlet.id, enable)}
                />
              ))}
            </>
          )}

          {euOutlets.length > 0 && (
            <>
              <Text className="text-muted text-xs font-semibold uppercase px-4 pt-4 pb-1">
                {t('outlets.euInternational')}
              </Text>
              {euOutlets.map((outlet) => (
                <OutletRow
                  key={outlet.id}
                  outlet={outlet}
                  onToggle={(enable) => toggleOutlet(outlet.id, enable)}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}