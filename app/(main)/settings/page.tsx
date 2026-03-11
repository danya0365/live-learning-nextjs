/**
 * Settings Page — Auth-protected
 * User account settings: profile editing, password change, preferences
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import SettingsSkeleton from '@/src/presentation/components/settings/SettingsSkeleton';
import { SettingsView } from '@/src/presentation/components/settings/SettingsView';

/* ── Component ─────────────────────────────── */
export default function SettingsPage() {
  return (
    <AuthGuard fallback={<SettingsSkeleton />}>
      <SettingsView />
    </AuthGuard>
  );
}
