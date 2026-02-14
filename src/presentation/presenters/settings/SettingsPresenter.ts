
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

  async updateProfile(userId: string, name: string, bio: string) {
    return this.repo.updateProfile({ userId, name, bio });
  }

  async updatePassword(userId: string, current: string, next: string, confirm: string) {
    if (!current || !next || !confirm) {
      throw new Error('กรุณากรอกข้อมูลให้ครบ');
    }
    if (next !== confirm) {
      throw new Error('รหัสผ่านใหม่ไม่ตรงกัน');
    }
    if (next.length < 6) {
      throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    }
    return this.repo.updatePassword({ userId, current, new: next });
  }

  async updatePreferences(userId: string, data: SettingsViewModel) {
    return this.repo.updatePreferences({ userId, ...data });
  }
}
