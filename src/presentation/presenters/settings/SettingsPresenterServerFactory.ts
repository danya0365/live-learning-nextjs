import { SupabaseSettingsRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSettingsRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { SettingsPresenter } from './SettingsPresenter';

export async function createServerSettingsPresenter() {
  const supabase = await createServerSupabaseClient();
  return new SettingsPresenter(new SupabaseSettingsRepository(supabase));
}
