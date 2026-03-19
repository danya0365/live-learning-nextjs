import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { UnauthorizedAccessView } from '@/src/presentation/components/auth/UnauthorizedAccessView';
import { WalletView } from '@/src/presentation/components/wallet/WalletView';
import { createServerWalletPresenter } from '@/src/presentation/presenters/wallet/WalletPresenterServerFactory';
import Link from 'next/link';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata() {
  try {
    const presenter = await createServerWalletPresenter();
    return presenter.generateMetadata();
  } catch (error) {
    return {
      title: "กระเป๋าเงิน | Live Learning",
      description: "ระบบจัดการกระเป๋าเงิน",
    };
  }
}

export default async function WalletPage() {
  try {
    const presenter = await createServerWalletPresenter();
    const viewModel = await presenter.getViewModel();

    return (
      <AuthGuard 
        allowedRoles={['student', 'instructor']}
        unauthorizedFallback={
          <UnauthorizedAccessView 
            message="หน้านี้สงวนสิทธิ์เฉพาะโปรไฟล์ประเภทนักเรียน (Student) หรือผู้สอน (Instructor) เท่านั้น" 
          />
        }
      >
        <WalletView initialViewModel={viewModel} />
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error fetching wallet data:", error);

    // Fallback UI or allow AuthGuard to naturally handle Unauthorized users
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center rounded-2xl glass p-8">
            <h1 className="text-2xl font-bold text-error mb-2">
              ⚠️ การเข้าถึงข้อมูลล้มเหลว
            </h1>
            <p className="text-text-muted mb-6">ไม่สามารถโหลดข้อมูลกระเป๋าเงินของคุณได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง</p>
            <Link
              href="/"
              className="btn-game px-6 py-3 rounded-xl text-white font-bold"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }
}
