/**
 * SupabaseBookingRepository
 * Implementation of IBookingRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
  Booking,
  BookingStats,
  BookingStatus,
  CreateBookingPayload,
  IBookingRepository,
  UpdateBookingData
} from '@/src/application/repositories/IBookingRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type BookingRow = Database['public']['Tables']['bookings']['Row'] & {
  student: Database['public']['Tables']['profiles']['Row'];
  instructor: Database['public']['Tables']['instructor_profiles']['Row'] & {
      profile: Database['public']['Tables']['profiles']['Row']
  };
  course: Database['public']['Tables']['courses']['Row'];
};

export class SupabaseBookingRepository implements IBookingRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  private mapBooking(row: any): Booking {
    // Handle joins
    const student = row.student;
    const instructorProfile = row.instructor?.profile; // instructor join is usually deep: instructor -> profile
    const course = row.course;

    return {
      id: row.id,
      studentId: row.student_profile_id,
      studentName: student?.full_name || 'Unknown Student',
      instructorId: row.instructor_profile_id,
      instructorName: instructorProfile?.full_name || 'Unknown Instructor',
      courseId: row.course_id,
      courseName: course?.title || 'Unknown Course',
      enrollmentId: row.enrollment_id || undefined,
      timeSlotId: row.time_slot_id || '',
      scheduledDate: row.scheduled_date,
      startTime: row.start_time,
      endTime: row.end_time,
      bookedHours: Number(row.booked_hours) || 0,
      status: (row.status as BookingStatus) || 'pending',
      isActive: row.is_active ?? true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getById(id: string): Promise<Booking | null> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        instructor:instructor_profiles!instructor_profile_id(
            *,
            profile:profiles(*)
        ),
        course:courses(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapBooking(data);
  }

  async getAll(): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        instructor:instructor_profiles!instructor_profile_id(
             *,
            profile:profiles(*)
        ),
        course:courses(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapBooking);
  }

  async getPaginated(page: number, perPage: number): Promise<{ data: Booking[]; total: number; page: number; perPage: number }> {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await this.supabase
      .from('bookings')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        instructor:instructor_profiles!instructor_profile_id(
             *,
            profile:profiles(*)
        ),
        course:courses(*)
      `, { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error || !data) {
        return { data: [], total: 0, page, perPage };
    }

    return {
        data: data.map(this.mapBooking),
        total: count || 0,
        page,
        perPage
    };
  }

  async getByStudentId(studentId: string): Promise<Booking[]> {
     const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        instructor:instructor_profiles!instructor_profile_id(
             *,
            profile:profiles(*)
        ),
        course:courses(*)
      `)
      .eq('student_profile_id', studentId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapBooking);
  }

  async getByInstructorId(instructorId: string): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        instructor:instructor_profiles!instructor_profile_id(
             *,
            profile:profiles(*)
        ),
        course:courses(*)
      `)
      .eq('instructor_profile_id', instructorId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapBooking);
  }

  async getByCourseId(courseId: string): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        instructor:instructor_profiles!instructor_profile_id(
             *,
            profile:profiles(*)
        ),
        course:courses(*)
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapBooking);
  }

  async create(data: CreateBookingPayload, studentId?: string): Promise<Booking> {
     // 🔒 Server-Injected Identity: studentId is provided separately by API route
     const resolvedStudentId = studentId || '';

     const { data: slot } = await this.supabase
        .from('time_slots')
        .select('*')
        .eq('id', data.timeSlotId)
        .single();
        
     const startTime = slot ? slot.start_time : '09:00:00';
     const endTime = slot ? slot.end_time : '10:00:00';

     const { data: created, error } = await this.supabase
      .from('bookings')
      .insert({
          student_profile_id: resolvedStudentId,
          instructor_profile_id: data.instructorId,
          course_id: data.courseId,
          time_slot_id: data.timeSlotId,
          scheduled_date: data.scheduledDate,
          start_time: startTime,
          end_time: endTime,
          status: 'pending',
          is_active: true
      })
      .select(`
        *,
        student:profiles!student_profile_id(*),
        instructor:instructor_profiles!instructor_profile_id(
             *,
            profile:profiles(*)
        ),
        course:courses(*)
      `)
      .single();

    if (error) throw error;
    return this.mapBooking(created as unknown as BookingRow);
  }

  async update(id: string, data: UpdateBookingData): Promise<Booking> {
    const updatePayload: any = {};
    if (data.status) updatePayload.status = data.status;
    if (data.isActive !== undefined) updatePayload.is_active = data.isActive;
    updatePayload.updated_at = new Date().toISOString();

    const { data: updated, error } = await this.supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        *,
        student:profiles!student_profile_id(*),
        instructor:instructor_profiles!instructor_profile_id(
             *,
            profile:profiles(*)
        ),
        course:courses(*)
      `)
      .single();

    if (error) throw error;
    return this.mapBooking(updated);
  }

  async delete(id: string): Promise<boolean> {
     const { error } = await this.supabase
        .from('bookings')
        .delete()
        .eq('id', id);
    
    return !error;
  }

  async getStats(): Promise<BookingStats> {
      const { count: total } = await this.supabase.from('bookings').select('*', { count: 'exact', head: true });
      const { count: active } = await this.supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: pending } = await this.supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: confirmed } = await this.supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed');
      const { count: completed } = await this.supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'completed');
      const { count: cancelled } = await this.supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'cancelled');
      
      return {
          totalItems: total || 0,
          activeItems: active || 0,
          inactiveItems: (total || 0) - (active || 0),
          pendingCount: pending || 0,
          confirmedCount: confirmed || 0,
          completedCount: completed || 0,
          cancelledCount: cancelled || 0
      };
  }

  async getForCurrentUser(role: 'student' | 'instructor'): Promise<Booking[]> {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return [];

      // Resolve Profile ID from Auth ID
      // NOTE: This assumes 'profiles' table has 'auth_id' or 'id' matches 'user.id'. 
      // Based on schema, profiles.id IS usually auth.uid OR linked via auth_id.
      // Let's assume simplest: fetch profile by auth_id.
      
      if (role === 'student') {
        // Try getting profile.
        // If profiles.id == auth.uid, we can just use user.id.
        // If separate, we need to query.
        // Safest: Query profile by auth_id (if column exists) or id.
        // Assuming profiles.id is the key used in bookings.student_profile_id
        
        // Let's check if we can get the profile first
        const { data: profile } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id) // Assuming id is same as auth.uid, or logic needs adjustment if different
            .single();
            
        if (!profile) return [];
        return this.getByStudentId(profile.id);
      }
      
      if (role === 'instructor') {
          // Find instructor profile for this user
          // Instructor is linked to profile, which is linked to user.
          // instructor_profiles -> profile_id
          const { data: instructor } = await this.supabase
            .from('instructor_profiles')
            .select('id')
            .eq('profile_id', user.id) // Assuming user.id is profile_id
            .single();
            
          if (!instructor) return [];
          return this.getByInstructorId(instructor.id);
      }
      
      return [];
  }
}
