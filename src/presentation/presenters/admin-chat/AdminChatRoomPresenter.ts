import { IChatRepository } from "@/src/application/repositories/IChatRepository";
import { MagicLinkService } from "@/src/infrastructure/security/MagicLinkService";
import { Metadata } from 'next';

export type AdminChatRoomViewState = "success" | "expired" | "invalid" | "notFound";

export interface AdminChatRoomViewModel {
  state: AdminChatRoomViewState;
  sessionId: string;
  customerName?: string;
  customerPhone?: string;
  status?: string;
  stats?: {
    totalMessages: number;
    unreadMessages: number;
    lastActive: string;
  };
}

/**
 * AdminChatRoomPresenter
 * Handles business logic for a single chat room session.
 * Following Clean Architecture - this is in the Presentation layer.
 */
export class AdminChatRoomPresenter {
  constructor(private readonly repository: IChatRepository) {}

  /**
   * Generate metadata for the chat room page
   */
  async generateMetadata(sessionId: string): Promise<Metadata> {
    try {
      const session = await this.repository.getSession(sessionId);
      if (!session) {
        return {
          title: "Chat Room Not Found | Admin",
          description: "ไม่พบข้อมูลการสนทนา"
        };
      }
      return {
        title: `คุณ ${session.customerName} - Chat Room | Admin`,
        description: `บริหารจัดการการสนทนากับคุณ ${session.customerName}`
      };
    } catch (error) {
      return {
        title: "Chat Room | Admin",
        description: "ระบบบริหารจัดการการสนทนา"
      };
    }
  }

  /**
   * Get the view model for a specific chat room.
   * Handles token verification, expiration, and session data fetching.
   */
  async getViewModel(
    sessionId: string,
    token: string,
    expires: string
  ): Promise<AdminChatRoomViewModel> {
    const expiresNum = parseInt(expires, 10);

    // 1. Check for basic input validity
    if (!token || !expires || isNaN(expiresNum)) {
      return { state: "invalid", sessionId };
    }

    // 2. Check for token expiration
    // Actually MagicLinkService.verifyToken also handles expiration, but explicit check is fine.
    if (Date.now() > expiresNum) {
      return { state: "expired", sessionId };
    }

    // 3. Verify the cryptographic token
    const isValid = MagicLinkService.verifyToken(sessionId, expiresNum, token);
    if (!isValid) {
      return { state: "invalid", sessionId };
    }

    // 4. Fetch session details from Repository
    try {
      const session = await this.repository.getSession(sessionId);

      if (!session) {
        return { state: "notFound", sessionId };
      }

      return {
        state: "success",
        sessionId: session.id,
        customerName: session.customerName,
        customerPhone: session.customerPhone,
        status: session.status || "active",
        stats: {
           totalMessages: (session as any).message_count || 0,
           unreadMessages: (session as any).unread_count || 0,
           lastActive: (session.updatedAt || session.createdAt).toISOString(),
        }
      };
    } catch (error) {
      console.error("AdminChatRoomPresenter: Failed to fetch session", error);
      return { state: "notFound", sessionId };
    }
  }

  /**
   * Sync new messages for the current session. (Client-side)
   */
  async syncMessages(sessionId: string, lastMessageAt?: string) {
    let url = `/api/admin/chats/${sessionId}`;
    if (lastMessageAt) {
      url += `?lastMessageAt=${encodeURIComponent(lastMessageAt)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Sync failed");
    return await response.json();
  }

  /**
   * Send a reply from admin. (Client-side)
   */
  async sendReply(sessionId: string, content: string) {
    const response = await fetch(`/api/admin/chats/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return await response.json();
  }

  /**
   * Mark messages as read. (Client-side)
   */
  async markAsRead(sessionId: string) {
    const response = await fetch(`/api/admin/chats/${sessionId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "read" })
    });
    if (!response.ok) throw new Error("Failed to mark as read");
    return await response.json();
  }

  /**
   * Search messages in session. (Client-side)
   */
  async searchMessages(sessionId: string, query: string) {
    const response = await fetch(`/api/admin/chats/${sessionId}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Search failed");
    return await response.json();
  }

  /**
   * Toggle auto-reply state. (Client-side)
   */
  async toggleAutoReply(sessionId: string, state: boolean) {
    const response = await fetch(`/api/admin/chats/${sessionId}/auto-reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoReply: state }),
    });
    if (!response.ok) throw new Error("Failed to toggle auto-reply");
    return await response.json();
  }

  /**
   * Close/Resolve session. (Client-side)
   */
  async closeSession(sessionId: string) {
    const response = await fetch(`/api/admin/chats/${sessionId}/close`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to close session");
    return await response.json();
  }

  /**
   * Update session status. (Client-side)
   */
  async updateSessionStatus(sessionId: string, status: string) {
    const response = await fetch(`/api/admin/chats/${sessionId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update status");
    return await response.json();
  }

  /**
   * Get session data by ID (Granular method)
   */
  async getSessionById(sessionId: string) {
    return await this.repository.getSession(sessionId);
  }
}
