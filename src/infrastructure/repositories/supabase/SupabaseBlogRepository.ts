/**
 * SupabaseBlogRepository
 * Implementation of IBlogRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 *
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import { BlogPost, IBlogRepository } from '@/src/application/repositories/IBlogRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type BlogRow = Database['public']['Tables']['blog_posts']['Row'];

export class SupabaseBlogRepository implements IBlogRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .eq('is_active', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return (data || []).map(this.mapToDomain);
  }

  async getById(id: string): Promise<BlogPost | null> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapToDomain(data);
  }

  private mapToDomain = (raw: BlogRow): BlogPost => ({
    id: raw.id,
    title: raw.title,
    excerpt: raw.excerpt || '',
    category: raw.category,
    author: raw.author,
    publishedAt: raw.published_at || '',
    readTimeMinutes: raw.read_time_minutes,
    imageUrl: raw.image_url || '',
  });
}
