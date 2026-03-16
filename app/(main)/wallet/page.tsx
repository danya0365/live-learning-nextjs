/**
 * Wallet Page — Auth-protected
 * Uses AuthGuard to protect wallet details and initial rendering
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { WalletView } from '@/src/presentation/components/wallet/WalletView';
import WalletSkeleton from '@/src/presentation/components/wallet/WalletSkeleton';

export default function WalletPage() {
  return (
    <AuthGuard fallback={<WalletSkeleton />}>
      <WalletView />
    </AuthGuard>
  );
}
