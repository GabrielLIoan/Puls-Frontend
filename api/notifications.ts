import type {
    DigestTime,
    NotificationPreferences,
} from '../types/notifications';
import { api } from './client';

export const notificationsApi = {
  getPreferences: () =>
    api.get<NotificationPreferences>('/me/notifications/preferences'),

  registerToken: (token: string, digestTime?: DigestTime) =>
    api.post<{ success: boolean }>('/me/notifications/token', {
      token,
      digestTime,
    }),

  removeToken: (token: string) =>
    api.delete<{ success: boolean }>('/me/notifications/token'),

  updatePreferences: (prefs: Partial<NotificationPreferences>) =>
    api.patch<{ success: boolean }>('/me/notifications/preferences', prefs),
};