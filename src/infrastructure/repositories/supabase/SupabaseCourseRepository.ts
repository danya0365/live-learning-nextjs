/**
 * SupabaseCourseRepository
 * Implementation of ICourseRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 * ❌ Do NOT use in Client Components directly
 */

import {
    Course,
    CourseStats,
    CreateCourseData,
    ICourseRepository,
    PaginatedResult,
    UpdateCourseData,
} from '@/src/application/repositories/ICourseRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// Type alias for the database row
type CourseRow = Database['public']['Tables']['courses']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
  instructor_profiles?: Database['public']['Tables']['instructor_profiles']['Row'] & {
    profiles?: Database['public']['Tables']['profiles']['Row'];
  };
};

export class SupabaseCourseRepository implements ICourseRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================
  // READ OPERATIONS
  // ============================================================

  async getById(id: string): Promise<Course | null> {
    const { data, error } = await this.supabase
      .from('courses')
      .select(`
        *,
        categories (*),
        instructor_profiles (
          *,
          profiles (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    
    // Type assertion because Supabase types might be complex with nested relations
    return this.mapToDomain(data as unknown as CourseRow);
  }

  async getAll(): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from('courses')
      .select(`
        *,
        categories (*),
        instructor_profiles (
          *,
          profiles (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return (data as unknown as CourseRow[]).map(this.mapToDomain);
  }

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<Course>> {
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;

    const { data, error, count } = await this.supabase
      .from('courses')
      .select(`
        *,
        categories (*),
        instructor_profiles (
          *,
          profiles (*)
        )
      `, { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: (data as unknown as CourseRow[]).map(this.mapToDomain),
      total: count || 0,
      page,
      perPage,
    };
  }

  async getByCategory(categoryId: string): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from('courses')
      .select(`
        *,
        categories (*),
        instructor_profiles (
          *,
          profiles (*)
        )
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses by category:', error);
      return [];
    }

    return (data as unknown as CourseRow[]).map(this.mapToDomain);
  }

  async getByInstructorId(instructorId: string): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from('courses')
      .select(`
        *,
        categories (*),
        instructor_profiles (
          *,
          profiles (*)
        )
      `)
      .eq('instructor_profile_id', instructorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses by instructor:', error);
      return [];
    }

    return (data as unknown as CourseRow[]).map(this.mapToDomain);
  }

  async getFeatured(): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from('courses')
      .select(`
        *,
        categories (*),
        instructor_profiles (
          *,
          profiles (*)
        )
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching featured courses:', error);
      return [];
    }

    return (data as unknown as CourseRow[]).map(this.mapToDomain);
  }

  async getForCurrentInstructor(): Promise<Course[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data: instructor } = await this.supabase
      .from('instructor_profiles')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (!instructor) return [];

    return this.getByInstructorId(instructor.id);
  }

  // ============================================================
  // WRITE OPERATIONS
  // ============================================================

  async create(data: CreateCourseData): Promise<Course> {
    const { data: created, error } = await this.supabase
      .from('courses')
      .insert({
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail || null,
        category_id: data.categoryId,
        level: data.level,
        total_hours: Math.floor(data.durationMinutes / 60) || 1, // Fallback conversion
        price: data.price,
        instructor_profile_id: data.instructorId,
        tags: data.tags || [],
        slug: data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        // Default values
        rating: 0,
        total_students: 0,
        total_reviews: 0,
        total_lessons: 0,
        is_live_feature: false,
        is_featured: false,
        is_active: true,
      })
      .select(`
        *,
        categories (*),
        instructor_profiles (
          *,
          profiles (*)
        )
      `)
      .single();

    if (error) throw error;
    return this.mapToDomain(created as unknown as CourseRow);
  }

  async update(id: string, data: UpdateCourseData): Promise<Course> {
    const updatePayload: any = {};
    if (data.title) updatePayload.title = data.title;
    if (data.description) updatePayload.description = data.description;
    if (data.thumbnail) updatePayload.thumbnail = data.thumbnail;
    if (data.categoryId) updatePayload.category_id = data.categoryId;
    if (data.level) updatePayload.level = data.level;
    if (data.price !== undefined) updatePayload.price = data.price;
    if (data.isActive !== undefined) updatePayload.is_active = data.isActive;
    if (data.tags) updatePayload.tags = data.tags;

    const { data: updated, error } = await this.supabase
      .from('courses')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        *,
        categories (*),
        instructor_profiles (
          *,
          profiles (*)
        )
      `)
      .single();

    if (error) throw error;
    return this.mapToDomain(updated as unknown as CourseRow);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', id);

    return !error;
  }

  // ============================================================
  // STATISTICS
  // ============================================================

  async getStats(): Promise<CourseStats> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('price, rating, total_students, is_active');

    if (error || !data) {
      return {
        totalItems: 0,
        activeItems: 0,
        inactiveItems: 0,
        totalStudents: 0,
        averageRating: 0,
      };
    }

    const total = data.length;
    const active = data.filter((c) => c.is_active).length;
    const totalStudents = data.reduce((sum, c) => sum + (c.total_students || 0), 0);
    const avgRating = total > 0 
      ? data.reduce((sum, c) => sum + (c.rating || 0), 0) / total 
      : 0;

    return {
      totalItems: total,
      activeItems: active,
      inactiveItems: total - active,
      totalStudents,
      averageRating: Number(avgRating.toFixed(2)),
    };
  }

  // ============================================================
  // DOMAIN MAPPING
  // ============================================================

  /**
   * Map database row (snake_case) to domain model (camelCase)
   */
  private mapToDomain = (raw: CourseRow): Course => {
    // Safely access nested optional properties
    const instructorProfile = raw.instructor_profiles;
    const profile = instructorProfile?.profiles;
    const category = raw.categories;

    return {
      id: raw.id,
      title: raw.title,
      description: raw.description || '',
      thumbnail: raw.thumbnail_url || '/images/placeholder-course.jpg', // thumbnail_url in new schema
      categoryId: raw.category_id || '',
      categoryName: category?.name || 'Unknown Category',
      level: (raw.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
      durationMinutes: (raw.total_hours || 0) * 60, // Convert hours to minutes
      price: raw.price,
      rating: raw.rating || 0,
      totalStudents: raw.total_students || 0,
      instructorId: raw.instructor_profile_id || '',
      instructorName: profile?.full_name || 'Unknown Instructor',
      instructorAvatar: profile?.avatar_url || '/images/placeholder-avatar.jpg',
      isLive: raw.is_live_feature,
      isActive: raw.is_active,
      tags: raw.tags || [],
      learningOutcomes: raw.learning_outcomes || [],
      requirements: raw.requirements || [],
      targetAudience: raw.target_audience || [],
      syllabus: Array.isArray(raw.syllabus) ? raw.syllabus : [],
      aboutCourse: raw.about_course || '',
      hasInteractiveLab: raw.has_interactive_lab || false,
      interactiveLabSlug: raw.interactive_lab_slug || undefined,
      createdAt: raw.created_at || new Date().toISOString(),
      updatedAt: raw.updated_at || new Date().toISOString(),
    };
  };
}
