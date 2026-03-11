
/**
 * SupabaseCategoryRepository
 * Implementation of ICategoryRepository using Supabase
 */

import {
    Category,
    CategoryStats,
    CreateCategoryData,
    ICategoryRepository,
    UpdateCategoryData,
} from '@/src/application/repositories/ICategoryRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// Type alias for the database row
type CategoryRow = Database['public']['Tables']['categories']['Row'] & {
  // Add count if joined
  course_count?: number; 
};

export class SupabaseCategoryRepository implements ICategoryRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getById(id: string): Promise<Category | null> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async getAll(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*, courses(count)') // Count courses
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    // Need to handle the join result differently as types might not match exactly
    return (data as any[]).map(item => this.mapToDomain({
        ...item,
        course_count: item.courses?.[0]?.count || 0
    }));
  }

  async getPaginated(page: number, perPage: number) {
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;

    const { data, error, count } = await this.supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return {
      data: (data || []).map(this.mapToDomain),
      total: count || 0,
      page,
      perPage,
    };
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const { data: created, error } = await this.supabase
      .from('categories')
      .insert({
        name: data.name,
        slug: data.name.toLowerCase().replace(/ /g, '-'),
        icon: data.icon || 'folder',
        description: data.description,
        color: data.color || 'blue',
      })
      .select()
      .single();
      
    if (error) throw error;
    return this.mapToDomain(created);
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    const updatePayload: any = {};
    if (data.name) {
        updatePayload.name = data.name;
        updatePayload.slug = data.name.toLowerCase().replace(/ /g, '-');
    }
    if (data.icon) updatePayload.icon = data.icon;
    if (data.description) updatePayload.description = data.description;
    if (data.color) updatePayload.color = data.color;
    if (data.isActive !== undefined) updatePayload.is_active = data.isActive;

    const { data: updated, error } = await this.supabase
      .from('categories')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToDomain(updated);
  }
  
  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);
    return !error;
  }

  async getStats(): Promise<CategoryStats> {
    const { count: total } = await this.supabase.from('categories').select('*', { count: 'exact', head: true });
    
    return {
      totalItems: total || 0,
      activeItems: total || 0, // Assumption
      inactiveItems: 0,
    };
  }

  private mapToDomain = (raw: any): Category => {
    return {
      id: raw.id,
      name: raw.name,
      icon: raw.icon,
      description: raw.description || '',
      courseCount: raw.course_count || 0,
      color: raw.color,
      isActive: raw.is_active,
      createdAt: raw.created_at || '',
      updatedAt: raw.updated_at || '',
    };
  };
}
