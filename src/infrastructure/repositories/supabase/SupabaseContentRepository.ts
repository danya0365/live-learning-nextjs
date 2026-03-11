/**
 * SupabaseContentRepository
 * Implementation of IContentRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 *
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import { ContentItem, IContentRepository } from '@/src/application/repositories/IContentRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type ContentRow = Database['public']['Tables']['content_pages']['Row'];

export class SupabaseContentRepository implements IContentRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getBySlug(slug: string): Promise<ContentItem | null> {
    const { data, error } = await this.supabase
      .from('content_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    return this.mapToDomain(data);
  }

  private mapToDomain = (raw: ContentRow): ContentItem => ({
    slug: raw.slug,
    title: raw.title,
    body: raw.body || '',
    lastUpdated: raw.last_updated || '',
  });
}
