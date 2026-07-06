import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { notificationsApi } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import type { DigestTime, NotificationPreferences } from '../types/notifications';

const PREFS_QUERY_KEY = ['me', 'notifications', 'preferences'];

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request permission and get the Expo push token.
// Returns null if permission denied or running on web/simulator.
async function getExpoPushToken(): Promise<string | null> {
  // Push notifications require a physical device
  if (!Device.isDevice || Platform.OS === 'web') {
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

export function useNotificationPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: PREFS_QUERY_KEY,
    queryFn: notificationsApi.getPreferences,
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: (prefs: Partial<NotificationPreferences>) =>
      notificationsApi.updatePreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PREFS_QUERY_KEY });
    },
  });

  return {
    preferences: query.data,
    isLoading: query.isLoading,
    updatePreferences: updateMutation.mutate,
  };
}

// Call this AFTER a meaningful user action (e.g. first badge earned)
// to request permission and register the token — NOT on first launch.
export function useRegisterPushToken() {
  const { user } = useAuth();
  const [registered, setRegistered] = useState(false);

  async function registerToken(digestTime?: DigestTime) {
    if (!user || registered) return;

    const token = await getExpoPushToken();
    if (!token) return; // permission denied or web/simulator

    await notificationsApi.registerToken(token, digestTime);
    setRegistered(true);
  }

  return { registerToken };
}

// Wire up notification tap handling — navigates to the relevant screen
// when user taps a notification. Call this once in the root layout.
export function useNotificationListener() {
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(() => {
        // For now, any notification tap just opens the app to the feed.
        // When we have notification types with data payloads (e.g. a
        // specific article), navigate to that screen using the response
        // data here instead.
      });

    return () => subscription.remove();
  }, []);
}