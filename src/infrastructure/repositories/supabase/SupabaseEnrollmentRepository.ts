/**
 * SupabaseEnrollmentRepository
 * Implementation of IEnrollmentRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 *
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 *
 * NOTE: The Supabase generated types (supabase.ts) need to be regenerated
 * after `supabase db reset` to include the enrollments table. Until then,
 * we use `any` for DB operations on the enrollments table.
 */

import {
    CreateEnrollmentPayload,
    Enrollment,
    IEnrollmentRepository,
} from '@/src/application/repositories/IEnrollmentRepository';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseEnrollmentRepository implements IEnrollmentRepository {
  private readonly db: SupabaseClient<any>;

  constructor(supabase: SupabaseClient<any>) {
    this.db = supabase;
  }

  private mapEnrollment(row: any): Enrollment {
    return {
      id: row.id,
      studentProfileId: row.student_profile_id,
      courseId: row.course_id,
      totalHours: Number(row.total_hours),
      usedHours: Number(row.used_hours),
      remainingHours: Number(row.total_hours) - Number(row.used_hours),
      status: row.status,
      enrolledAt: row.enrolled_at,
      completedAt: row.completed_at || undefined,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async checkEnrollment(courseId: string): Promise<Enrollment | null> {
    const { data: profileData } = await this.db.rpc('get_active_profile_id');
    if (!profileData) return null;

    const { data, error } = await this.db
      .from('enrollments')
      .select('*')
      .eq('student_profile_id', profileData)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !data) return null;
    return this.mapEnrollment(data);
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    const { data: profileData } = await this.db.rpc('get_active_profile_id');
    if (!profileData) return [];

    const { data, error } = await this.db
      .from('enrollments')
      .select('*')
      .eq('student_profile_id', profileData)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((row: any) => this.mapEnrollment(row));
  }

  async createEnrollment(payload: CreateEnrollmentPayload): Promise<Enrollment> {
    const { data: profileData } = await this.db.rpc('get_active_profile_id');
    if (!profileData) throw new Error('Not authenticated');

    // Get course to determine total hours
    const { data: course } = await this.db
      .from('courses')
      .select('total_hours')
      .eq('id', payload.courseId)
      .single();

    const { data, error } = await this.db
      .from('enrollments')
      .insert({
        student_profile_id: profileData,
        course_id: payload.courseId,
        total_hours: course?.total_hours || 0,
        used_hours: 0,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return this.mapEnrollment(data);
  }

  async getById(id: string): Promise<Enrollment | null> {
    const { data, error } = await this.db
      .from('enrollments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapEnrollment(data);
  }

  /**
   * Activate an enrollment (called after successful payment via webhook)
   */
  async activate(id: string): Promise<Enrollment> {
    const { data, error } = await this.db
      .from('enrollments')
      .update({ status: 'active', enrolled_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return this.mapEnrollment(data);
  }

  /**
   * Add used hours to an enrollment (called when a booking is confirmed)
   */
  async addUsedHours(id: string, hours: number): Promise<Enrollment> {
    const enrollment = await this.getById(id);
    if (!enrollment) throw new Error('Enrollment not found');

    const newUsedHours = enrollment.usedHours + hours;
    const isCompleted = newUsedHours >= enrollment.totalHours;

    const { data, error } = await this.db
      .from('enrollments')
      .update({
        used_hours: newUsedHours,
        status: isCompleted ? 'completed' : 'active',
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return this.mapEnrollment(data);
  }
}
