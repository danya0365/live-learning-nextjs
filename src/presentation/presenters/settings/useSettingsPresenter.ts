'use client';

import { AuthUser, useAuthStore } from '@/src/stores/authStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SettingsViewModel } from './SettingsPresenter';
import { createClientSettingsPresenter } from './SettingsPresenterClientFactory';

export type SettingsTab = 'profile' | 'security' | 'preferences' | 'notifications';

export interface SettingsState {
  activeTab: SettingsTab;
  user: AuthUser | null;
  viewModel: SettingsViewModel | null;
  loading: boolean;
  error: string | null;
  toast: string | null;
}

export interface SettingsActions {
  setActiveTab: (tab: SettingsTab) => void;
  updateProfile: (name: string, bio: string) => Promise<void>;
  updatePassword: (current: string, next: string, confirm: string) => Promise<boolean>;
  updatePreferences: (data: SettingsViewModel) => Promise<void>;
  showToast: (msg: string) => void;
}

export function useSettingsPresenter() {
  const { user, updateUser } = useAuthStore();
  const presenter = useMemo(() => createClientSettingsPresenter(), []);

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [viewModel, setViewModel] = useState<SettingsViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    let mounted = true;
    if (!user) return;

    const loadData = async () => {
        // Use profileId if available, otherwise fallback to id (Auth ID)
        const targetId = user.profileId || user.id;

        setLoading(true);
        try {
            const vm = await presenter.getViewModel(targetId);
            if (mounted) {
                setViewModel(vm);
            }
        } catch (err) {
            if (mounted) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        } finally {
            if (mounted) {
                setLoading(false);
            }
        }
    };

    loadData();

    return () => { mounted = false; };
  }, [user, presenter]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const updateProfile = useCallback(async (name: string, bio: string) => {
    if (!user) return;
    try {
      const targetId = user.profileId || user.id;
      const updatedUser = await presenter.updateProfile(targetId, name, bio);
      updateUser(updatedUser);
      
      showToast('บันทึกโปรไฟล์เรียบร้อยแล้ว ✅');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      showToast('เกิดข้อผิดพลาด: ' + message);
    }
  }, [user, presenter, showToast, updateUser]);

  const updatePassword = useCallback(async (current: string, next: string, confirm: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await presenter.updatePassword(user.id, current, next, confirm);
      showToast('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว ✅');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'เปลี่ยนรหัสผ่านไม่สำเร็จ ❌';
      showToast(message);
      return false;
    }
  }, [user, presenter, showToast]);

  const updatePreferences = useCallback(async (data: SettingsViewModel) => {
    if (!user) return;
    try {
      const targetId = user.profileId || user.id;
      const newPrefs = await presenter.updatePreferences(targetId, data);
      setViewModel((prev) => prev ? { ...prev, ...newPrefs } : newPrefs as unknown as SettingsViewModel);
      showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว 💾');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      showToast('บันทึกไม่สำเร็จ: ' + message);
    }
  }, [user, presenter, showToast]);

  return {
    state: { activeTab, user, viewModel, loading, error, toast },
    actions: { setActiveTab, updateProfile, updatePassword, updatePreferences, showToast }
  };
}
