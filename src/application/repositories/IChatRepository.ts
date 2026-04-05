export interface ChatMessageData {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "admin" | "system";
  content: string;
  status: "sent" | "delivered" | "read";
  isDraft: boolean;
  createdAt: Date;
}

export interface ChatSessionData {
  id: string;
  status: "new" | "active" | "follow_up" | "resolved" | "spam";
  autoReply: boolean;
  customerName: string;
  customerPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminChatSummary {
  id: string;
  customerName: string;
  customerPhone: string;
  status: "new" | "active" | "follow_up" | "resolved" | "spam";
  isActive: boolean;
  autoReply: boolean;
  unreadCount: number;
  lastMessageContent: string | null;
  lastMessageRole: string | null;
  lastMessageStatus: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatRepository {
  /**
   * Get a session by its ID.
   */
  getSession(sessionId: string): Promise<ChatSessionData | null>;

  /**
   * Find a session by its short ID prefix (first 8 chars of UUID).
   */
  getSessionByShortId(shortId: string): Promise<ChatSessionData | null>;

  /**
   * Get the most recently active session.
   */
  getLatestActiveSession(): Promise<ChatSessionData | null>;

  /**
   * Fetch pre-aggregated session summaries for the Admin Dashboard.
   */
  getAdminChatSummary(): Promise<AdminChatSummary[]>;

  /**
   * Count unique sessions from the summary that have unread messages.
   */
  getUnreadSessionCount(): Promise<number>;

  /**
   * Add a new message to a session.
   */
  addMessage(
    sessionId: string,
    role: "user" | "assistant" | "admin" | "system",
    content: string,
    options?: {
      id?: string;
      isDraft?: boolean;
      status?: "sent" | "delivered" | "read";
    }
  ): Promise<ChatMessageData>;

  /**
   * Retrieve messages for a session with optional polling and pagination.
   */
  getMessagesBySession(
    sessionId: string,
    options?: {
      lastMessageAt?: string;
      before?: string;
      limit?: number;
      ascending?: boolean;
    }
  ): Promise<ChatMessageData[]>;

  /**
   * Find or create a session by customer name and phone.
   */
  getOrCreateSession(name: string, phone: string): Promise<ChatSessionData>;

  /**
   * Toggle the AI Auto-Reply state for a session.
   */
  toggleAutoReply(sessionId: string, state: boolean): Promise<void>;

  /**
   * Update the status and updated_at of a session.
   */
  updateSessionStatus(
    sessionId: string, 
    status: "new" | "active" | "follow_up" | "resolved" | "spam"
  ): Promise<void>;

  /**
   * Batch update the status of messages.
   */
  updateMessageStatus(messageIds: string[], status: "delivered" | "read"): Promise<void>;

  /**
   * Mark all admin/assistant messages in a session as read (for the customer).
   */
  markMessagesAsReadForUser(sessionId: string): Promise<void>;

  /**
   * Mark all customer messages in a session as read (for the admin).
   */
  markMessagesAsReadBySession(sessionId: string): Promise<void>;

  /**
   * Search for messages containing a query within a session.
   */
  searchMessages(sessionId: string, query: string): Promise<ChatMessageData[]>;
}
