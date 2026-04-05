import { 
  AdminChatSummary, 
  ChatMessageData, 
  ChatSessionData, 
  IChatRepository 
} from "@/src/application/repositories/IChatRepository";

const MOCK_SUMMARIES: AdminChatSummary[] = [
  {
    id: "session-001",
    customerName: "สมชาย ใจดี",
    customerPhone: "081-234-5678",
    status: "new",
    isActive: true,
    autoReply: true,
    unreadCount: 3,
    lastMessageContent: "ขอสอบถามเรื่องคอร์สเรียนหน่อยครับ",
    lastMessageRole: "user",
    lastMessageStatus: "sent",
    lastMessageAt: new Date(),
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(),
  },
  {
    id: "session-002",
    customerName: "สมศรี มีสุข",
    customerPhone: "082-345-6789",
    status: "active",
    isActive: true,
    autoReply: false,
    unreadCount: 0,
    lastMessageContent: "ขอบคุณมากครับ",
    lastMessageRole: "assistant",
    lastMessageStatus: "read",
    lastMessageAt: new Date(Date.now() - 1800000),
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    id: "session-003",
    customerName: "วิชัย สุดยอด",
    customerPhone: "083-456-7890",
    status: "resolved",
    isActive: false,
    autoReply: true,
    unreadCount: 0,
    lastMessageContent: "ปิดงานเรียบร้อย",
    lastMessageRole: "admin",
    lastMessageStatus: "read",
    lastMessageAt: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
  }
];

export class MockChatRepository implements IChatRepository {
  private summaries: AdminChatSummary[] = [...MOCK_SUMMARIES];

  async getSession(sessionId: string): Promise<ChatSessionData | null> {
    const summary = this.summaries.find(s => s.id === sessionId);
    if (!summary) return null;
    return {
      id: summary.id,
      status: summary.status,
      autoReply: summary.autoReply,
      customerName: summary.customerName,
      customerPhone: summary.customerPhone,
      createdAt: summary.createdAt,
      updatedAt: summary.updatedAt,
    };
  }

  async getSessionByShortId(shortId: string): Promise<ChatSessionData | null> {
    const summary = this.summaries.find(s => s.id.startsWith(shortId));
    if (!summary) return null;
    return this.getSession(summary.id);
  }

  async getLatestActiveSession(): Promise<ChatSessionData | null> {
    const summary = this.summaries.find(s => s.status === 'active');
    if (!summary) return null;
    return this.getSession(summary.id);
  }

  async getAdminChatSummary(): Promise<AdminChatSummary[]> {
    await this.delay(300);
    return [...this.summaries];
  }

  async getUnreadSessionCount(): Promise<number> {
    return this.summaries.filter(s => s.unreadCount > 0).length;
  }

  async addMessage(
    sessionId: string,
    role: "user" | "assistant" | "admin" | "system",
    content: string,
    options?: { id?: string; isDraft?: boolean; status?: "sent" | "delivered" | "read" }
  ): Promise<ChatMessageData> {
    const message: ChatMessageData = {
      id: options?.id || `msg-${Date.now()}`,
      sessionId,
      role,
      content,
      status: options?.status || "sent",
      isDraft: options?.isDraft ?? false,
      createdAt: new Date(),
    };
    
    // Update summary in mock
    const index = this.summaries.findIndex(s => s.id === sessionId);
    if (index !== -1) {
       this.summaries[index] = {
         ...this.summaries[index],
         lastMessageContent: content,
         lastMessageRole: role,
         lastMessageAt: new Date(),
         updatedAt: new Date(),
       };
    }

    return message;
  }

  async getMessagesBySession(
    sessionId: string,
    options?: { lastMessageAt?: string; before?: string; limit?: number; ascending?: boolean }
  ): Promise<ChatMessageData[]> {
    return [];
  }

  async getOrCreateSession(name: string, phone: string): Promise<ChatSessionData> {
    const existing = this.summaries.find(s => s.customerPhone === phone);
    if (existing) return this.getSession(existing.id) as Promise<ChatSessionData>;

    const newSession: AdminChatSummary = {
      id: `session-${Date.now()}`,
      customerName: name,
      customerPhone: phone,
      status: "new",
      isActive: true,
      autoReply: true,
      unreadCount: 0,
      lastMessageContent: null,
      lastMessageRole: null,
      lastMessageStatus: null,
      lastMessageAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.summaries.push(newSession);
    return this.getSession(newSession.id) as Promise<ChatSessionData>;
  }

  async toggleAutoReply(sessionId: string, state: boolean): Promise<void> {
    const index = this.summaries.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      this.summaries[index].autoReply = state;
    }
  }

  async updateSessionStatus(
    sessionId: string,
    status: "new" | "active" | "follow_up" | "resolved" | "spam"
  ): Promise<void> {
    const index = this.summaries.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      this.summaries[index].status = status;
      this.summaries[index].isActive = !(status === "resolved" || status === "spam");
    }
  }

  async updateMessageStatus(messageIds: string[], status: "delivered" | "read"): Promise<void> {}

  async markMessagesAsReadForUser(sessionId: string): Promise<void> {}

  async markMessagesAsReadBySession(sessionId: string): Promise<void> {
    const index = this.summaries.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      this.summaries[index].unreadCount = 0;
    }
  }

  async searchMessages(sessionId: string, query: string): Promise<ChatMessageData[]> {
    return [];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockChatRepository = new MockChatRepository();
