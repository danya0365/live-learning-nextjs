import { ChatMessageData, ChatSessionData, IChatRepository } from "@/src/application/repositories/IChatRepository";
import { Database } from "@/src/domain/types/supabase";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { v4 as uuidv4 } from "uuid";

type ChatSessionRow = Database["public"]["Tables"]["chat_sessions"]["Row"];
type ChatMessageRow = Database["public"]["Tables"]["chat_messages"]["Row"];

export class SupabaseChatRepository implements IChatRepository {
  private supabase = createAdminSupabaseClient();

  async getSession(sessionId: string): Promise<ChatSessionData | null> {
    const { data, error } = await this.supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !data) return null;

    return this.mapSession(data as ChatSessionRow);
  }

  async getSessionByShortId(shortId: string): Promise<ChatSessionData | null> {
    // shortId is first 8 chars of UUID
    // Use ilike and % to find the matching UUID
    const { data, error } = await this.supabase
      .from("chat_sessions")
      .select("*")
      .ilike("id", `${shortId}%`)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

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
      .single();

    if (error || !data) return null;

    return this.mapSession(data as ChatSessionRow);
  }

  async addMessage(
    sessionId: string,
    role: "user" | "assistant" | "admin" | "system",
    content: string,
    options?: { id?: string; isDraft?: boolean; status?: "sent" | "delivered" | "read" }
  ): Promise<ChatMessageData> {
    const messageId = options?.id || uuidv4();
    const { data, error } = await this.supabase
      .from("chat_messages")
      .insert({
        id: messageId,
        session_id: sessionId,
        role,
        content,
        is_draft: options?.isDraft ?? false,
        status: options?.status ?? "sent",
      })
      .select()
      .single();

    if (error) throw error;

    // Update session timestamp
    await this.supabase
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", sessionId);

    return this.mapMessage(data as ChatMessageRow);
  }

  async updateSessionStatus(
    sessionId: string,
    status: "new" | "active" | "follow_up" | "resolved" | "spam"
  ): Promise<void> {
    const { error } = await this.supabase
      .from("chat_sessions")
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", sessionId);

    if (error) throw error;
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
}
