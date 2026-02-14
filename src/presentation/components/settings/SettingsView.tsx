'use client';

import { useSettingsPresenter } from '@/src/presentation/presenters/settings/useSettingsPresenter';
import { NotificationsForm } from './NotificationsForm';
import { PreferencesForm } from './PreferencesForm';
import { ProfileForm } from './ProfileForm';
import { SecurityForm } from './SecurityForm';
import SettingsSkeleton from './SettingsSkeleton';
import { SettingsTabs } from './SettingsTabs';

export function SettingsView() {
  const { state, actions } = useSettingsPresenter();

  // Loading state
  if (state.loading && !state.viewModel) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--gradient-primary)' }} />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: 'linear-gradient(135deg, hsl(280,70%,60%), hsl(330,70%,60%))' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-lg">
              {state.user?.avatar || '⚙️'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">ตั้งค่าบัญชี</h1>
              <p className="text-text-secondary text-sm mt-0.5">จัดการข้อมูลส่วนตัวและการตั้งค่าต่างๆ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <SettingsTabs activeTab={state.activeTab} onTabChange={actions.setActiveTab} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {state.activeTab === 'profile' && state.user && (
              <ProfileForm
                user={state.user}
                onSave={actions.updateProfile}
              />
            )}

            {state.activeTab === 'security' && state.user && (
              <SecurityForm
                user={state.user}
                onUpdatePassword={actions.updatePassword}
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
      </div>

      {/* Toast */}
      {state.toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="glass rounded-xl px-5 py-3 border border-border/50 shadow-xl text-sm font-medium text-text-primary">
            {state.toast}
          </div>
        </div>
      )}
    </div>
  );
}
