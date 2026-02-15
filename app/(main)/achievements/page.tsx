/**
 * Achievements Page — Auth-protected
 * Uses AuthGuard + AchievementsView
 */

'use client';

import { AchievementsView } from '@/src/presentation/components/achievements/AchievementsView';
import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';

export default function AchievementsPage() {
  return (
    <AuthGuard>
      <AchievementsView />
    </AuthGuard>
  );
}
