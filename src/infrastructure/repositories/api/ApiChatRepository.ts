import { 
  AdminChatSummary, 
  ChatMessageData, 
  ChatSessionData, 
  IChatRepository 
} from "@/src/application/repositories/IChatRepository";

export class ApiChatRepository implements IChatRepository {
  private baseUrl = '/api/admin/chats';

  async getAdminChatSummary(): Promise<AdminChatSummary[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
       const error = await response.json();
       throw new Error(error.error || 'Failed to fetch chat summaries');
    }
    const data = await response.json();
    
    // Map dates back to Date objects since JSON is stringified
    return (data.sessions || []).map((s: any) => ({
      ...s,
      lastMessageAt: s.lastMessageAt ? new Date(s.lastMessageAt) : null,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
    }));
  }

  // Other methods implemented as needed, or throwing error if called from client improperly
  async getSession(sessionId: string): Promise<ChatSessionData | null> {
    throw new Error("Method not implemented.");
  }

  async getSessionByShortId(shortId: string): Promise<ChatSessionData | null> {
    throw new Error("Method not implemented.");
  }

  async getLatestActiveSession(): Promise<ChatSessionData | null> {
    throw new Error("Method not implemented.");
  }

  async getUnreadSessionCount(): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async addMessage(
    sessionId: string,
    role: "user" | "assistant" | "admin" | "system",
    content: string,
    options?: { id?: string; isDraft?: boolean; status?: "sent" | "delivered" | "read" }
  ): Promise<ChatMessageData> {
    throw new Error("Method not implemented.");
  }

  async getMessagesBySession(
    sessionId: string,
    options?: { lastMessageAt?: string; before?: string; limit?: number; ascending?: boolean }
  ): Promise<ChatMessageData[]> {
    throw new Error("Method not implemented.");
  }

  async getOrCreateSession(name: string, phone: string): Promise<ChatSessionData> {
    throw new Error("Method not implemented.");
  }

  async toggleAutoReply(sessionId: string, state: boolean): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async updateSessionStatus(
    sessionId: string,
    status: "new" | "active" | "follow_up" | "resolved" | "spam"
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async updateMessageStatus(messageIds: string[], status: "delivered" | "read"): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async markMessagesAsReadForUser(sessionId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async markMessagesAsReadBySession(sessionId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async searchMessages(sessionId: string, query: string): Promise<ChatMessageData[]> {
    throw new Error("Method not implemented.");
  }
}
