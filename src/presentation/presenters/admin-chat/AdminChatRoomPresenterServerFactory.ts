import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { AdminChatRoomPresenter } from "./AdminChatRoomPresenter";

/**
 * AdminChatRoomPresenterServerFactory
 * Factory for creating AdminChatRoomPresenter instances on the server side correctly.
 * Following Clean Architecture - this is in the Presentation layer.
 */
export class AdminChatRoomPresenterServerFactory {
  static create(): AdminChatRoomPresenter {
    const supabase = createAdminSupabaseClient();
    const repository = new SupabaseChatRepository(supabase);
    return new AdminChatRoomPresenter(repository);
  }
}

export function createServerAdminChatRoomPresenter(): AdminChatRoomPresenter {
  return AdminChatRoomPresenterServerFactory.create();
}
