/**
 * SupabaseFeedbackRepository
 * Implementation of IFeedbackRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 *
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
    CreateFeedbackData,
    FeedbackItem,
    IFeedbackRepository,
} from '@/src/application/repositories/IFeedbackRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type FeedbackRow = Database['public']['Tables']['feedback']['Row'];

export class SupabaseFeedbackRepository implements IFeedbackRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(data: CreateFeedbackData): Promise<FeedbackItem> {
    const { data: created, error } = await this.supabase
      .from('feedback')
      .insert({
        topic: data.topic,
        email: data.email || '',
        message: data.message,
        category: data.category,
      })
      .select('*')
      .single();

    if (error) throw error;

    return this.mapToDomain(created);
  }

  private mapToDomain = (raw: FeedbackRow): FeedbackItem => ({
    id: raw.id,
    topic: raw.topic,
    email: raw.email || undefined,
    message: raw.message,
    category: raw.category,
    createdAt: raw.created_at || new Date().toISOString(),
  });
}
