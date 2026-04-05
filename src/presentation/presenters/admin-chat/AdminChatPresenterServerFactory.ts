import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { AdminChatPresenter } from "./AdminChatPresenter";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";

export class AdminChatPresenterServerFactory {
  static async create(): Promise<AdminChatPresenter> {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseChatRepository(supabase);

    return new AdminChatPresenter(repository);
  }
}

export async function createServerAdminChatPresenter(): Promise<AdminChatPresenter> {
  return await AdminChatPresenterServerFactory.create();
}
