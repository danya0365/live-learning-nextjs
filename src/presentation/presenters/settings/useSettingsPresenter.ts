'use client';

import { AuthUser, useAuthStore } from '@/src/stores/authStore';
import { ActiveSession } from '@/src/application/repositories/IAuthRepository';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SettingsViewModel } from './SettingsPresenter';
import { createClientSettingsPresenter } from './SettingsPresenterClientFactory';

export type SettingsTab = 'profile' | 'security' | 'preferences' | 'notifications';

export interface SettingsState {
  activeTab: SettingsTab;
  user: AuthUser | null;
  viewModel: SettingsViewModel | null;
  loading: boolean;
  activeSessions: ActiveSession[];
  loadingSessions: boolean;
  error: string | null;
  toast: string | null;
}
export interface SettingsActions {
  setActiveTab: (tab: SettingsTab) => void;
  updateProfile: (name: string, bio: string) => Promise<void>;
  updatePassword: (current: string, next: string, confirm: string) => Promise<boolean>;
  updatePreferences: (data: SettingsViewModel) => Promise<void>;
  revokeOtherSessions: () => Promise<boolean>;
  showToast: (msg: string) => void;
}

export function useSettingsPresenter() {
  const { user, updateUser } = useAuthStore();
  const presenter = useMemo(() => createClientSettingsPresenter(), []);

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [viewModel, setViewModel] = useState<SettingsViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
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

  // Fetch sessions when security tab is active
  useEffect(() => {
    if (activeTab === 'security' && user) {
      const fetchSessions = async () => {
        setLoadingSessions(true);
        try {
          const sessions = await presenter.getActiveSessions();
          setActiveSessions(sessions);
        } catch (err) {
          console.error('Failed to fetch sessions', err);
        } finally {
          setLoadingSessions(false);
        }
      };
      fetchSessions();
    }
  }, [activeTab, user, presenter]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const updateProfile = useCallback(async (name: string, bio: string) => {
    if (!user) return;
    try {
      const targetId = user.profileId || user.id;
      const updatedUser = await presenter.updateProfile({ userId: targetId, name, bio });
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
      if (next !== confirm) throw new Error("รหัสผ่านใหม่ไม่ตรงกัน");
      await presenter.updatePassword({ userId: user.id, current, new: next });
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
      const newPrefs = await presenter.updatePreferences({ userId: targetId, ...data });
      setViewModel((prev) => prev ? { ...prev, ...newPrefs } : newPrefs as unknown as SettingsViewModel);
      showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว 💾');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      showToast('บันทึกไม่สำเร็จ: ' + message);
    }
  }, [user, presenter, showToast]);

  const revokeOtherSessions = useCallback(async (): Promise<boolean> => {
    try {
      const success = await presenter.revokeOtherSessions();
      if (success) {
        showToast('ออกจากระบบจากอุปกรณ์อื่นเรียบร้อยแล้ว ✅');
        // Refresh session list
        const sessions = await presenter.getActiveSessions();
        setActiveSessions(sessions);
      }
      return success;
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการออกจากระบบอุปกรณ์อื่น ❌');
      return false;
    }
  }, [presenter, showToast]);

  return {
    state: { activeTab, user, viewModel, loading, activeSessions, loadingSessions, error, toast },
    actions: { setActiveTab, updateProfile, updatePassword, updatePreferences, revokeOtherSessions, showToast }
  };
}
