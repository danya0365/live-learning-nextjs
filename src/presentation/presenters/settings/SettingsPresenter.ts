
import {
    ISettingsRepository
} from '@/src/application/repositories/ISettingsRepository';

export interface SettingsViewModel {
  language: string;
  autoPlay: boolean;
  showOnline: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    courseReminder: boolean;
    promotions: boolean;
  };
}

export class SettingsPresenter {
  constructor(private readonly repo: ISettingsRepository) {}

  async getViewModel(userId: string): Promise<SettingsViewModel> {
    const prefs = await this.repo.getPreferences(userId);
    return {
      language: prefs.language,
      autoPlay: prefs.autoPlay,
      showOnline: prefs.showOnline,
      notifications: prefs.notifications,
    };
  }

  // ============================================================
  // GRANULAR DATA METHODS (For API Routes & Individual Actions)
  // ============================================================

  async getPreferences(userId: string) {
    return this.repo.getPreferences(userId);
  }

  async updateProfile(data: import('@/src/application/repositories/ISettingsRepository').UpdateProfileData) {
    return this.repo.updateProfile(data);
  }

  async updatePassword(data: import('@/src/application/repositories/ISettingsRepository').UpdatePasswordData & { userId: string }) {
    if (!data.current || !data.new) {
      throw new Error('กรุณากรอกข้อมูลให้ครบ');
    }
    if (data.new.length < 6) {
      throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    }
    return this.repo.updatePassword(data);
  }

  async updatePreferences(data: import('@/src/application/repositories/ISettingsRepository').UserPreferences & { userId: string }) {
    return this.repo.updatePreferences(data);
  }
}
