import { AdminChatSummary, ChatMessageData, ChatSessionData, IChatRepository } from "@/src/application/repositories/IChatRepository";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

type ChatSessionRow = Database["public"]["Tables"]["chat_sessions"]["Row"];
type ChatSessionUpdate = Database["public"]["Tables"]["chat_sessions"]["Update"];
type ChatMessageRow = Database["public"]["Tables"]["chat_messages"]["Row"];
type AdminChatSummaryRow = Database["public"]["Views"]["admin_chat_summary"]["Row"];

export class SupabaseChatRepository implements IChatRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getSession(sessionId: string): Promise<ChatSessionData | null> {
    const { data, error } = await this.supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !data) return null;

    return this.mapSession(data as ChatSessionRow);
  }

  async getAdminChatSummary(): Promise<AdminChatSummary[]> {
    const { data, error } = await this.supabase
      .from("admin_chat_summary")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(row => this.mapAdminChatSummary(row as AdminChatSummaryRow));
  }

  async getUnreadSessionCount(): Promise<number> {
    const { data, error } = await this.supabase
      .from("admin_chat_summary")
      .select("id")
      .gt("unread_count", 0)
      .not('status', 'eq', 'resolved');

    if (error && error.code !== 'PGRST116') throw error;
    return data?.length || 0;
  }

  async getSessionByShortId(shortId: string): Promise<ChatSessionData | null> {
    const { data, error } = await this.supabase
      .from("chat_sessions")
      .select("*")
      .ilike("id", `${shortId.toLowerCase()}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapSession(data as ChatSessionRow);
  }

  async getLatestActiveSession(): Promise<ChatSessionData | null> {
    const { data, error } = await this.supabase
      .from("chat_sessions")
      .select("*")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapSession(data as ChatSessionRow);
  }

  async addMessage(
    sessionId: string,
    role: "user" | "assistant" | "admin" | "system",
    content: string,
    options?: { id?: string; isDraft?: boolean; status?: "sent" | "delivered" | "read" }
  ): Promise<ChatMessageData> {
    const { data, error } = await this.supabase
      .from("chat_messages")
      .insert({
        id: options?.id || uuidv4(),
        session_id: sessionId,
        role,
        content,
        is_draft: options?.isDraft ?? false,
        status: options?.status || "sent",
      })
      .select()
      .single();

    if (error) throw error;

    // Also update session's updated_at and move to 'active' if it was 'new'
    const { data: session } = await this.supabase
      .from("chat_sessions")
      .select("status")
      .eq("id", sessionId)
      .single();

    const updateData: ChatSessionUpdate = { updated_at: new Date().toISOString() };
    if (session?.status === 'new' && (role === 'admin' || role === 'assistant')) {
      updateData.status = 'active';
      updateData.is_active = true;
    }

    await this.supabase
      .from("chat_sessions")
      .update(updateData)
      .eq("id", sessionId);

    return this.mapMessage(data as ChatMessageRow);
  }

  async getMessagesBySession(
    sessionId: string,
    options?: { lastMessageAt?: string; before?: string; limit?: number; ascending?: boolean }
  ): Promise<ChatMessageData[]> {
    let query = this.supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId);

    if (options?.lastMessageAt) {
      query = query.gt("created_at", options.lastMessageAt);
    } else if (options?.before) {
      query = query.lt("created_at", options.before);
    }

    const isAscending = options?.ascending ?? (options?.before ? false : true);
    query = query.order("created_at", { ascending: isAscending });

    if (options?.limit) {
      query = query.limit(options.limit);
    } else if (!options?.lastMessageAt) {
      query = query.limit(50);
    }

    let { data: messages, error } = await query;
    if (error) throw error;

    if (options?.before && messages) {
       messages = messages.reverse();
    }

    return (messages || []).map(m => this.mapMessage(m as ChatMessageRow));
  }

  async getOrCreateSession(name: string, phone: string): Promise<ChatSessionData> {
    // Check if session exists by phone number
    let { data: session, error: fetchError } = await this.supabase
      .from('chat_sessions')
      .select('*')
      .eq('customer_phone', phone)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (!session) {
      // Create new session
      const { data: newSession, error: createError } = await this.supabase
        .from('chat_sessions')
        .insert({ customer_name: name, customer_phone: phone })
        .select()
        .single();
        
      if (createError) throw createError;
      session = newSession;
    } else {
      // Update name if changed
      if (session.customer_name !== name) {
        const { data: updatedSession, error: updateError } = await this.supabase
          .from('chat_sessions')
          .update({ customer_name: name, updated_at: new Date().toISOString() })
          .eq('id', session.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        session = updatedSession;
      }
    }

    return this.mapSession(session as ChatSessionRow);
  }

  async updateSessionStatus(
    sessionId: string,
    status: "new" | "active" | "follow_up" | "resolved" | "spam"
  ): Promise<void> {
    const isResolved = status === "resolved" || status === "spam";
    const { error } = await this.supabase
      .from("chat_sessions")
      .update({ 
        status,
        is_active: !isResolved,
        updated_at: new Date().toISOString()
      })
      .eq("id", sessionId);

    if (error) throw error;
  }

  async toggleAutoReply(sessionId: string, state: boolean): Promise<void> {
    const { error } = await this.supabase
      .from("chat_sessions")
      .update({ auto_reply: state })
      .eq("id", sessionId);

    if (error) throw error;
  }

  async updateMessageStatus(messageIds: string[], status: "delivered" | "read"): Promise<void> {
    if (messageIds.length === 0) return;
    const { error } = await this.supabase
      .from("chat_messages")
      .update({ status })
      .in("id", messageIds);

    if (error) throw error;
  }

  async markMessagesAsReadForUser(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('chat_messages')
      .update({ status: 'read' })
      .eq('session_id', sessionId)
      .neq('role', 'user')
      .neq('status', 'read');

    if (error) throw error;
  }

  async markMessagesAsReadBySession(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from("chat_messages")
      .update({ status: "read" })
      .eq("session_id", sessionId)
      .eq("role", "user");

    if (error) throw error;
  }

  async searchMessages(sessionId: string, query: string): Promise<ChatMessageData[]> {
    const { data, error } = await this.supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .ilike("content", `%${query}%`)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []).map(m => this.mapMessage(m as ChatMessageRow));
  }

  private mapSession(data: ChatSessionRow): ChatSessionData {
    return {
      id: data.id,
      status: (data.status as ChatSessionData["status"]) || "new",
      autoReply: data.auto_reply ?? false,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapMessage(data: ChatMessageRow): ChatMessageData {
    return {
      id: data.id,
      sessionId: data.session_id,
      role: data.role as ChatMessageData["role"],
      content: data.content,
      status: (data.status as ChatMessageData["status"]) || "sent",
      isDraft: data.is_draft ?? false,
      createdAt: new Date(data.created_at),
    };
  }

  private mapAdminChatSummary(data: AdminChatSummaryRow): AdminChatSummary {
    return {
      id: data.id || "",
      customerName: data.customer_name || "",
      customerPhone: data.customer_phone || "",
      status: (data.status as AdminChatSummary["status"]) || "new",
      isActive: data.is_active ?? false,
      autoReply: data.auto_reply ?? false,
      unreadCount: data.unread_count || 0,
      lastMessageContent: data.last_message_content || null,
      lastMessageRole: data.last_message_role || null,
      lastMessageStatus: data.last_message_status || null,
      lastMessageAt: data.last_message_at ? new Date(data.last_message_at) : null,
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
    };
  }
}
