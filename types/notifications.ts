export type DigestTime = 'morning' | 'afternoon' | 'evening';

export interface NotificationPreferences {
  notificationsEnabled: boolean;
  digestTime: DigestTime;
}