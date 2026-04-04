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
   * Update the status and updated_at of a session.
   */
  updateSessionStatus(
    sessionId: string, 
    status: "new" | "active" | "follow_up" | "resolved" | "spam"
  ): Promise<void>;
}
