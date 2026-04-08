import { MagicLinkService } from "@/src/infrastructure/security/MagicLinkService";
import { AdminChatView } from "@/src/presentation/components/chat/AdminChatView";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { notFound } from "next/navigation";

interface AdminChatPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ token?: string; expires?: string }>;
}

export default async function AdminChatPage({ params, searchParams }: AdminChatPageProps) {
  const { sessionId } = await params;
  const { token, expires } = await searchParams;

  if (!token || !expires) {
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

  // Verify the magic link token
  const isValid = MagicLinkService.verifyToken(sessionId, parseInt(expires), token);

  if (!isValid) {
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

  // Fetch session details from Repository
  const chatRepo = new SupabaseChatRepository(createAdminSupabaseClient());
  const session = await chatRepo.getSession(sessionId);

  if (!session) {
    notFound();
  }

  return <AdminChatView sessionId={sessionId} customerName={session.customerName} />;
}
