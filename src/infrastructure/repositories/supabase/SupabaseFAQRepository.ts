/**
 * SupabaseFAQRepository
 * Implementation of IFAQRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 *
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
    CreateFAQData,
    FAQItem,
    FAQStats,
    IFAQRepository,
    PaginatedResult,
    UpdateFAQData,
} from '@/src/application/repositories/IFAQRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type FAQRow = Database['public']['Tables']['faqs']['Row'];

export class SupabaseFAQRepository implements IFAQRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================
  // READ OPERATIONS
  // ============================================================

  async getById(id: string): Promise<FAQItem | null> {
    const { data, error } = await this.supabase
      .from('faqs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapToDomain(data);
  }

  async getAll(category?: string): Promise<FAQItem[]> {
    let query = this.supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }

    return (data || []).map(this.mapToDomain);
  }

  async getPaginated(page: number, perPage: number, category?: string): Promise<PaginatedResult<FAQItem>> {
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;

    let query = this.supabase
      .from('faqs')
      .select('*', { count: 'exact' })
      .order('sort_order', { ascending: true })
      .range(start, end);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: (data || []).map(this.mapToDomain),
      total: count || 0,
      page,
      perPage,
    };
  }

  // ============================================================
  // WRITE OPERATIONS
  // ============================================================

  async create(data: CreateFAQData): Promise<FAQItem> {
    const { data: created, error } = await this.supabase
      .from('faqs')
      .insert({
        question: data.question,
        answer: data.answer,
        category: data.category,
        sort_order: data.order || 0,
        is_active: true,
      })
      .select('*')
      .single();

    if (error) throw error;
    return this.mapToDomain(created);
  }

  async update(id: string, data: UpdateFAQData): Promise<FAQItem> {
    const updatePayload: Record<string, unknown> = {};
    if (data.question !== undefined) updatePayload.question = data.question;
    if (data.answer !== undefined) updatePayload.answer = data.answer;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.isActive !== undefined) updatePayload.is_active = data.isActive;
    if (data.order !== undefined) updatePayload.sort_order = data.order;

    const { data: updated, error } = await this.supabase
      .from('faqs')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    return !error;
  }

  // ============================================================
  // STATISTICS
  // ============================================================

  async getStats(): Promise<FAQStats> {
    const { data, error } = await this.supabase
      .from('faqs')
      .select('category');

    if (error || !data) {
      return { totalItems: 0, categories: [] };
    }

    const categories = Array.from(new Set(data.map((item) => item.category)));

    return {
      totalItems: data.length,
      categories,
    };
  }

  // ============================================================
  // DOMAIN MAPPING
  // ============================================================

  private mapToDomain = (raw: FAQRow): FAQItem => ({
    id: raw.id,
    question: raw.question,
    answer: raw.answer,
    category: raw.category,
    isActive: raw.is_active,
    order: raw.sort_order,
  });
}
