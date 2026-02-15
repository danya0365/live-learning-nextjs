/**
 * SupabaseInstructorRepository
 * Implementation of IInstructorRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
    CreateInstructorData,
    IInstructorRepository,
    Instructor,
    InstructorStats,
    TimeSlot,
    UpdateInstructorData,
} from '@/src/application/repositories/IInstructorRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type InstructorRow = Database['public']['Tables']['instructor_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

type TimeSlotRow = Database['public']['Tables']['time_slots']['Row'] & {
  courses?: Database['public']['Tables']['courses']['Row'] | null;
};

export class SupabaseInstructorRepository implements IInstructorRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================
  // READ OPERATIONS
  // ============================================================

  async getById(id: string): Promise<Instructor | null> {
    const { data, error } = await this.supabase
      .from('instructor_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapToDomain(data as unknown as InstructorRow);
  }

  async getAll(): Promise<Instructor[]> {
    const { data, error } = await this.supabase
      .from('instructor_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching instructors:', error);
      return [];
    }

    return (data as unknown as InstructorRow[]).map(this.mapToDomain);
  }

  async getPaginated(page: number, perPage: number): Promise<{ data: Instructor[]; total: number; page: number; perPage: number }> {
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;

    const { data, error, count } = await this.supabase
      .from('instructor_profiles')
      .select(`
        *,
        profiles (*)
      `, { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: (data as unknown as InstructorRow[]).map(this.mapToDomain),
      total: count || 0,
      page,
      perPage,
    };
  }

  async getAvailable(): Promise<Instructor[]> {
    const { data, error } = await this.supabase
      .from('instructor_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .eq('is_active', true)
      .eq('is_online', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching available instructors:', error);
      return [];
    }

    return (data as unknown as InstructorRow[]).map(this.mapToDomain);
  }

  async getTopRated(limit: number): Promise<Instructor[]> {
    const { data, error } = await this.supabase
      .from('instructor_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top rated instructors:', error);
      return [];
    }

    return (data as unknown as InstructorRow[]).map(this.mapToDomain);
  }

  async getTimeSlots(instructorId: string): Promise<TimeSlot[]> {
    const { data, error } = await this.supabase
      .from('time_slots')
      .select(`
        *,
        courses (title)
      `)
      .eq('instructor_profile_id', instructorId)
      .eq('is_active', true)
      .order('day_of_week')
      .order('start_time');

    if (error) {
      console.error('Error fetching time slots:', error);
      return [];
    }

    return (data as unknown as TimeSlotRow[]).map((row) => ({
      id: row.id,
      instructorId: row.instructor_profile_id,
      dayOfWeek: row.day_of_week,
      startTime: row.start_time,
      endTime: row.end_time,
      isBooked: row.is_booked,
      bookedCourseId: row.booked_course_id || undefined,
      bookedCourseName: row.courses?.title || undefined,
    }));
  }

  // ============================================================
  // WRITE OPERATIONS
  // ============================================================

  async create(data: CreateInstructorData): Promise<Instructor> {
    // Note: This needs a profile_id. In a real scenario, we'd creating this from a user profile context.
    // For now, assuming we have a way to link it or this is an admin function.
    // But specific to this interface, we don't pass profile_id.
    // We might need to adjust the interface or the implementation context.
    // For this migration, I'll assume we are creating both or linking to an existing 'profile_id' if passed in 'data' (but interface doesn't have it).
    
    // Simplification for now: We can't easily implement 'create' without a user profile.
    // But since this is mostly for 'READ' on the homepage, I'll throw error for now or mock it if needed.
    // Actually, I should probably fetch the profile based on the name or something if I was converting full logic.
    // But Supabase usually creates Instructor Profile linked to Auth User.
    
    throw new Error('Create Instructor via Repository not fully supported without Auth Context. Use Auth Repository to promote user.');
  }

  async update(id: string, data: UpdateInstructorData): Promise<Instructor> {
    const updatePayload: any = {};
    if (data.hourlyRate !== undefined) updatePayload.hourly_rate = data.hourlyRate;
    if (data.isOnline !== undefined) updatePayload.is_online = data.isOnline;
    if (data.isActive !== undefined) updatePayload.is_active = data.isActive;
    if (data.specializations) updatePayload.specializations = data.specializations;
    if (data.languages) updatePayload.languages = data.languages;
    if (data.bio) updatePayload.bio = data.bio;

    // 'name' and 'avatar' are in 'profiles' table, so we need to update that separately or ignore it here.
    // This implies a distributed update which is transaction-heavy.
    // For MVP, valid to update local fields.

    const { data: updated, error } = await this.supabase
      .from('instructor_profiles')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        *,
        profiles (*)
      `)
      .single();

    if (error) throw error;
    
    // If name/avatar update is needed, we should update public.profiles too.
    if (data.name || data.avatar) {
      const profileId = updated.profile_id;
      const profilePayload: any = {};
      if (data.name) profilePayload.full_name = data.name;
      if (data.avatar) profilePayload.avatar_url = data.avatar;
      
      await this.supabase.from('profiles').update(profilePayload).eq('id', profileId);
      
      // refetch to get updated profile data
       const { data: refetched } = await this.supabase
        .from('instructor_profiles')
        .select(`*, profiles (*)`)
        .eq('id', id)
        .single();
        
       return this.mapToDomain(refetched as unknown as InstructorRow);
    }

    return this.mapToDomain(updated as unknown as InstructorRow);
  }

  async delete(id: string): Promise<boolean> {
     const { error } = await this.supabase
      .from('instructor_profiles')
      .delete()
      .eq('id', id);
    return !error;
  }

  // ============================================================
  // STATISTICS
  // ============================================================

  async getStats(): Promise<InstructorStats> {
    const { data, error } = await this.supabase
      .from('instructor_profiles')
      .select('rating, is_active, is_online');

    if (error || !data) {
      return {
        totalItems: 0,
        activeItems: 0,
        inactiveItems: 0,
        onlineNow: 0,
        averageRating: 0,
      };
    }

    const total = data.length;
    const active = data.filter((i) => i.is_active).length;
    const online = data.filter((i) => i.is_online).length;
    const avgRating = total > 0
      ? data.reduce((sum, i) => sum + (i.rating || 0), 0) / total
      : 0;

    return {
      totalItems: total,
      activeItems: active,
      inactiveItems: total - active,
      onlineNow: online,
      averageRating: Number(avgRating.toFixed(1)),
    };
  }

  // ============================================================
  // DOMAIN MAPPING
  // ============================================================

  private mapToDomain = (raw: InstructorRow): Instructor => {
    const profile = raw.profiles;
    return {
      id: raw.id,
      name: profile?.full_name || 'Unknown Instructor',
      avatar: profile?.avatar_url || '/images/placeholder-avatar.jpg',
      bio: raw.bio || profile?.bio || '',
      specializations: raw.specializations || [],
      rating: raw.rating || 0,
      totalStudents: raw.total_students || 0,
      totalCourses: raw.total_courses || 0,
      isOnline: raw.is_online || false,
      isActive: raw.is_active || false,
      hourlyRate: raw.hourly_rate || 0,
      languages: raw.languages || [],
      createdAt: raw.created_at || new Date().toISOString(),
      updatedAt: raw.updated_at || new Date().toISOString(),
    };
  };
}
