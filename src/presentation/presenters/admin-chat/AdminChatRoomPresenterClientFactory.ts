'use client';

import { createBrowserSupabaseClient } from "@/src/infrastructure/supabase/client";

import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { AdminChatRoomPresenter } from "./AdminChatRoomPresenter";

/**
 * AdminChatRoomPresenterClientFactory
 * Factory for creating AdminChatRoomPresenter instances on the client side correctly.
 * Following Clean Architecture - this is in the Presentation layer.
 */
export class AdminChatRoomPresenterClientFactory {
  static create(): AdminChatRoomPresenter {
    const supabase = createBrowserSupabaseClient();
    const repository = new SupabaseChatRepository(supabase);
    return new AdminChatRoomPresenter(repository);
  }

}

export function createClientAdminChatRoomPresenter(): AdminChatRoomPresenter {
  return AdminChatRoomPresenterClientFactory.create();
}
