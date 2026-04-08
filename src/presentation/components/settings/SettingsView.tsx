'use client';

import { useSettingsPresenter } from '@/src/presentation/presenters/settings/useSettingsPresenter';
import { NotificationsForm } from './NotificationsForm';
import { PreferencesForm } from './PreferencesForm';
import { ProfileForm } from './ProfileForm';
import { SecurityForm } from './SecurityForm';
import SettingsSkeleton from './SettingsSkeleton';
import { SettingsTabs, TABS } from './SettingsTabs';

export function SettingsView() {
  const { state, actions } = useSettingsPresenter();

  // Loading state
  if (state.loading && !state.viewModel) {
    return <SettingsSkeleton />;
  }

  // Error state
  if (state.error && !state.viewModel) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-text-secondary mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-game px-6 py-2 text-white rounded-xl"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // Find active tab info for description
  const activeTabInfo = TABS.find((t) => t.key === state.activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header — consistent with ScheduleView */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          ⚙️ ตั้งค่าบัญชี
        </h1>
        <p className="text-text-secondary">
          จัดการข้อมูลส่วนตัว ความปลอดภัย และการตั้งค่าต่างๆ ของบัญชีคุณ
        </p>
      </div>

      {/* Stats Row — quick info cards */}
      {state.user && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{state.user.avatar || '👤'}</div>
            <div className="text-sm font-bold text-text-primary truncate">{state.user.name}</div>
            <div className="text-xs text-text-muted truncate">{state.user.email}</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-primary">{state.user.level || '—'}</div>
            <div className="text-xs text-text-muted">🏅 ระดับ</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-secondary">{state.user.role || '—'}</div>
            <div className="text-xs text-text-muted">🎭 บทบาท</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-success">
              {TABS.length}
            </div>
            <div className="text-xs text-text-muted">📋 ส่วนการตั้งค่า</div>
          </div>
        </div>
      )}

      {/* Tabs + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs — glass card on desktop */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="glass rounded-2xl p-3 sm:p-4 lg:sticky lg:top-24">
            <p className="hidden lg:block text-[10px] uppercase tracking-wider text-text-muted font-semibold px-3 mb-2">
              เมนูตั้งค่า
            </p>
            <SettingsTabs activeTab={state.activeTab} onTabChange={actions.setActiveTab} />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Active tab title — small breadcrumb context */}
          {activeTabInfo && (
            <p className="text-sm text-text-muted mb-4">
              ตั้งค่า › <span className="font-medium text-text-primary">{activeTabInfo.icon} {activeTabInfo.label}</span>
            </p>
          )}

          {state.activeTab === 'profile' && state.user && (
            <ProfileForm
              user={state.user}
              onSave={actions.updateProfile}
            />
          )}

          {state.activeTab === 'security' && state.user && (
            <SecurityForm
              user={state.user}
              activeSessions={state.activeSessions}
              loadingSessions={state.loadingSessions}
              onUpdatePassword={actions.updatePassword}
              onRevokeOtherSessions={actions.revokeOtherSessions}
            />
          )}

          {state.activeTab === 'preferences' && state.viewModel && (
            <PreferencesForm
              viewModel={state.viewModel}
              onSave={actions.updatePreferences}
            />
          )}

          {state.activeTab === 'notifications' && state.viewModel && (
            <NotificationsForm
              viewModel={state.viewModel}
              onSave={actions.updatePreferences}
            />
          )}
        </div>
      </div>

      {/* Toast */}
      {state.toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="glass rounded-2xl px-5 py-3.5 border border-border/50 shadow-2xl text-sm font-medium text-text-primary flex items-center gap-2">
            <span>{state.toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
