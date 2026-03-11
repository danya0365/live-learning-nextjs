/**
 * SupabaseEventRepository
 * Implementation of IEventRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 *
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import { EventItem, IEventRepository } from '@/src/application/repositories/IEventRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type EventRow = Database['public']['Tables']['events']['Row'];

export class SupabaseEventRepository implements IEventRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getAll(): Promise<EventItem[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return (data || []).map(this.mapToDomain);
  }

  private mapToDomain = (raw: EventRow): EventItem => ({
    id: raw.id,
    title: raw.title,
    description: raw.description || '',
    date: raw.event_date,
    time: raw.event_time,
    location: raw.location || '',
    imageUrl: raw.image_url || undefined,
  });
}
