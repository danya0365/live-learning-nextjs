import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { AdminChatPresenter } from "./AdminChatPresenter";

export class AdminChatPresenterAdminFactory {
  static create(): AdminChatPresenter {
    const supabase = createAdminSupabaseClient();
    const repository = new SupabaseChatRepository(supabase);
    return new AdminChatPresenter(repository);
  }
}

export function createAdminAdminChatPresenter(): AdminChatPresenter {
  return AdminChatPresenterAdminFactory.create();
}
