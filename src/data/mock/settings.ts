import { UserPreferences } from '@/src/application/repositories/ISettingsRepository';

export const MOCK_PREFS: Record<string, UserPreferences> = {
  'user-001': {
    userId: 'user-001',
    language: 'th',
    autoPlay: true,
    showOnline: true,
    notifications: { email: true, push: true, courseReminder: true, promotions: false },
  },
};
