import { AdminChatListView } from "@/src/presentation/components/admin-chat/AdminChatListView";
import { createServerAdminChatPresenter } from "@/src/presentation/presenters/admin-chat/AdminChatPresenterServerFactory";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminChatListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: activeTab = "active" } = await searchParams;
  const presenter = await createServerAdminChatPresenter();


  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(activeTab);

    return (
      <AdminChatListView activeTab={activeTab} initialViewModel={viewModel} />
    );
  } catch (error) {
    console.error("Error fetching admin chat data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูล Chat Dashboard ได้</p>
          <Link
            href="/admin"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            กลับหน้าหลักแอดมิน
          </Link>
        </div>
      </div>
    );
  }
}
