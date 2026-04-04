import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "admin";
  content: string;
  status?: "sending" | "sent" | "delivered" | "read";
  isDraft?: boolean;
  timestamp: Date;
}

interface AdminChatState {
  messages: ChatMessage[];
  searchResults: ChatMessage[] | null;
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
  autoReply: boolean;
}

interface AdminChatActions {
  setSessionId: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  syncMessages: () => Promise<void>;
  sendReply: (content: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  searchMessages: (query: string) => Promise<void>;
  clearSearch: () => void;
  toggleAutoReply: (state: boolean) => Promise<void>;
  closeSession: () => Promise<void>;
  updateSessionStatus: (status: string) => Promise<void>;
  setError: (error: string | null) => void;
}

type AdminChatStore = AdminChatState & AdminChatActions;

/**
 * Admin Chat Store (Non-persisted)
 */
export const useAdminChatStore = create<AdminChatStore>((set, get) => ({
  messages: [],
  searchResults: null,
  isLoading: false,
  sessionId: null,
  error: null,
  autoReply: true,

  setSessionId: (id) => set({ sessionId: id, messages: [], error: null, searchResults: null }),
  setMessages: (messages) => set({ messages }),
  setError: (error) => set({ error }),
  clearSearch: () => set({ searchResults: null }),

  syncMessages: async () => {
    const { sessionId, messages } = get();
    if (!sessionId) return;

    try {
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      let url = `/api/admin/chats/${sessionId}`;
      
      if (lastMessage) {
        const timestamp = lastMessage.timestamp instanceof Date 
            ? lastMessage.timestamp 
            : new Date(lastMessage.timestamp);
        url += `?lastMessageAt=${timestamp.toISOString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) return;

      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        const newParsedMessages = data.messages.map((m: any) => ({
          id: m.id || uuidv4(),
          role: m.role,
          content: m.content,
          status: m.status,
          isDraft: m.is_draft,
          timestamp: new Date(m.created_at || m.timestamp || Date.now()),
        }));

        if (lastMessage) {
          const existingIds = new Set(messages.map(m => m.id));
          const strictlyNew = newParsedMessages.filter((m: any) => !existingIds.has(m.id));
          if (strictlyNew.length > 0) {
            set({ messages: [...messages, ...strictlyNew] });
          }
        } else {
          set({ messages: newParsedMessages });
        }
      }
    } catch (error) {
      console.error("[Admin Store] Sync failed:", error);
    }
  },

  sendReply: async (content: string) => {
    const { sessionId, syncMessages } = get();
    if (!sessionId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/admin/chats/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error("Failed to send reply");

      // Sync immediately to show the new message
      await syncMessages();
    } catch (error) {
      set({ error: "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่" });
      console.error("[Admin Store] Reply failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async () => {
    const { sessionId } = get();
    if (!sessionId) return;
    
    // Optimistically update local messages
    set((state) => ({
      messages: state.messages.map(m => m.role === "user" && m.status !== "read" 
        ? { ...m, status: "read" } 
        : m)
    }));

    try {
      await fetch(`/api/admin/chats/${sessionId}/status`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" })
      });
    } catch (error) {
       console.error("[Admin Store] Failed to mark messages as read", error);
    }
  },

  searchMessages: async (query: string) => {
    const { sessionId } = get();
    if (!sessionId || !query.trim()) return;

    set({ isLoading: true });
    try {
      const response = await fetch(`/api/admin/chats/${sessionId}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      
      const parsed = data.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        status: m.status,
        timestamp: new Date(m.created_at)
      }));
      set({ searchResults: parsed });
    } catch (error) {
       console.error("[Admin Store] Search failed:", error);
    } finally {
       set({ isLoading: false });
    }
  },

  toggleAutoReply: async (state: boolean) => {
    const { sessionId } = get();
    if (!sessionId) return;

    set({ autoReply: state }); // Optimistic
    try {
      await fetch(`/api/admin/chats/${sessionId}/auto-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoReply: state }),
      });
    } catch (error) {
       console.error("[Admin Store] Toggle auto-reply failed:", error);
    }
  },

  closeSession: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    try {
      await fetch(`/api/admin/chats/${sessionId}/close`, { method: "POST" });
    } catch (error) {
       console.error("[Admin Store] Close session failed:", error);
    }
  },

  updateSessionStatus: async (status: string) => {
    const { sessionId } = get();
    if (!sessionId) return;

    try {
      await fetch(`/api/admin/chats/${sessionId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
       console.error("[Admin Store] Update status failed:", error);
    }
  }
}));
