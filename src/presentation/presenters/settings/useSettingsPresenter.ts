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
    if (!user) return;
    setLoading(true);
    presenter.getViewModel(user.id)
      .then((vm) => {
        setViewModel(vm);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, presenter]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const updateProfile = useCallback(async (name: string, bio: string) => {
    if (!user) return;
    try {
      const updatedUser = await presenter.updateProfile(user.id, name, bio);
      updateUser(updatedUser);
      
      showToast('บันทึกโปรไฟล์เรียบร้อยแล้ว ✅');
    } catch (err: any) {
      showToast('เกิดข้อผิดพลาด: ' + err.message);
    }
  }, [user, presenter, showToast]);

  const updatePassword = useCallback(async (current: string, next: string, confirm: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await presenter.updatePassword(user.id, current, next, confirm);
      showToast('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว ✅');
      return true;
    } catch (err: any) {
      showToast(err.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ ❌');
      return false;
    }
  }, [user, presenter, showToast]);

  const updatePreferences = useCallback(async (data: SettingsViewModel) => {
    if (!user) return;
    try {
      const newPrefs = await presenter.updatePreferences(user.id, data);
      // Repo returns UserPreferences (full object). 
      // We extract ViewModel parts.
      // Or Presenter returns partial?
      // Presenter `updatePreferences` returns `Promise<UserPreferences>`.
      // We assume UserPreferences is compatible or superset.
      setViewModel((prev) => prev ? { ...prev, ...newPrefs } : newPrefs as unknown as SettingsViewModel);
      showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว 💾');
    } catch (err: any) {
      showToast('บันทึกไม่สำเร็จ: ' + err.message);
    }
  }, [user, presenter, showToast]);

  return {
    state: { activeTab, user, viewModel, loading, error, toast },
    actions: { setActiveTab, updateProfile, updatePassword, updatePreferences, showToast }
  };
}
