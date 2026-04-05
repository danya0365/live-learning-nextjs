import { createServerAdminChatRoomPresenter } from "@/src/presentation/presenters/admin-chat/AdminChatRoomPresenterServerFactory";
import { AdminChatView } from "@/src/presentation/components/chat/AdminChatView";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface AdminChatPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ token?: string; expires?: string }>;
}

/**
 * Generate metadata for the chat room page
 */
export async function generateMetadata({
  params,
}: AdminChatPageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const presenter = createServerAdminChatRoomPresenter();

  try {
    return await presenter.generateMetadata(sessionId);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Chat Room | Admin Dashboard",
      description: "ระบบบริหารจัดการการสนทนา"
    };
  }
}

/**
 * AdminChatPage - Chat room interface for a single session.
 * Following Clean Architecture specifically following CREATE_PAGE_PATTERN.md.
 */
export default async function AdminChatPage({ params, searchParams }: AdminChatPageProps) {
  const { sessionId } = await params;
  const { token = "", expires = "" } = await searchParams;

  const presenter = createServerAdminChatRoomPresenter();

  try {
    // 1. Get View Model
    const viewModel = await presenter.getViewModel(sessionId, token, expires);

    // 2. Handle specific business states
    if (viewModel.state === "invalid") {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-50">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚫</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">You need a valid magic link to access this chat session.</p>
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100">
               Session: {sessionId.toUpperCase()}
            </div>
          </div>
        </div>
      );
    }

    if (viewModel.state === "expired") {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-50">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⏰</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
            <p className="text-gray-500 mb-6">This magic link is no longer valid or has expired. Please check your LINE for a new one.</p>
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100">
               Session: {sessionId.toUpperCase()}
            </div>
          </div>
        </div>
      );
    }

    if (viewModel.state === "notFound") {
      notFound();
    }

    // Success state
    return (
      <AdminChatView 
        sessionId={sessionId} 
        initialViewModel={viewModel} 
      />
    );

  } catch (error) {
    console.error("Error fetching chat data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลการสนทนาได้</p>
          <Link
            href="/admin/chat"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            กลับสู่ Dashboard
          </Link>
        </div>
      </div>
    );
  }
}
