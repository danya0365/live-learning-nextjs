/**
 * SupabaseConsultationRepository
 * Implementation of IConsultationRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
  ConsultationLevel,
  ConsultationOffer,
  ConsultationOfferStatus,
  ConsultationRequest,
  ConsultationRequestStats,
  ConsultationRequestStatus,
  CreateConsultationOfferPayload,
  CreateConsultationRequestPayload,
  IConsultationRepository,
  PreferredTime
} from '@/src/application/repositories/IConsultationRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type RequestRow = Database['public']['Tables']['consultation_requests']['Row'] & {
  student: Database['public']['Tables']['profiles']['Row'];
  category: Database['public']['Tables']['categories']['Row'];
};

type OfferRow = Database['public']['Tables']['consultation_offers']['Row'] & {
  instructor: Database['public']['Tables']['instructor_profiles']['Row'] & {
      profile: Database['public']['Tables']['profiles']['Row']
  };
};

export class SupabaseConsultationRepository implements IConsultationRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================
  // EXPLICIT MAPPERS
  // ============================================================

  private mapRequest(row: any): ConsultationRequest {
    return {
      id: row.id,
      studentId: row.student_profile_id,
      studentName: row.student?.full_name || 'Unknown Student',
      studentAvatar: row.student?.avatar_url || '',
      categoryId: row.category_id,
      categoryName: row.category?.name || 'Unknown Category',
      categoryIcon: row.category?.icon || '📁',
      title: row.title,
      description: row.description || '',
      level: row.level as ConsultationLevel,
      budgetMin: row.budget_min,
      budgetMax: row.budget_max,
      preferredDates: (row.preferred_dates as string[]) || [],
      preferredTimes: (row.preferred_times as PreferredTime[]) || [],
      status: row.status as ConsultationRequestStatus,
      offersCount: row.offers_count || 0,
      acceptedOfferId: row.accepted_offer_id,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapOffer(row: any): ConsultationOffer {
    const instructorProfile = row.instructor?.profile;
    return {
      id: row.id,
      requestId: row.request_id,
      instructorId: row.instructor_profile_id,
      instructorName: instructorProfile?.full_name || 'Unknown Instructor',
      instructorAvatar: instructorProfile?.avatar_url || '',
      instructorRating: row.instructor?.rating || 0,
      instructorSpecializations: row.instructor?.specializations || [],
      message: row.message || '',
      offeredPrice: row.offered_price,
      offeredDate: row.offered_date,
      offeredStartTime: row.offered_start_time,
      offeredEndTime: row.offered_end_time,
      status: row.status as ConsultationOfferStatus,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // ============================================================
  // REQUESTS - READ
  // ============================================================

  async getRequestById(id: string): Promise<ConsultationRequest | null> {
    const { data, error } = await this.supabase
      .from('consultation_requests')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapRequest(data);
  }

  async getAllRequests(): Promise<ConsultationRequest[]> {
     const { data, error } = await this.supabase
      .from('consultation_requests')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        category:categories(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapRequest);
  }

  async getOpenRequests(): Promise<ConsultationRequest[]> {
    const { data, error } = await this.supabase
      .from('consultation_requests')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        category:categories(*)
      `)
      .eq('status', 'open')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapRequest);
  }

  async getRequestsByStudentId(studentId: string): Promise<ConsultationRequest[]> {
    const { data, error } = await this.supabase
      .from('consultation_requests')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        category:categories(*)
      `)
      .eq('student_profile_id', studentId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapRequest);
  }

  async getRequestsByCategory(categoryId: string): Promise<ConsultationRequest[]> {
    const { data, error } = await this.supabase
      .from('consultation_requests')
      .select(`
        *,
        student:profiles!student_profile_id(*),
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'open') // Usually filter by open for public view
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapRequest);
  }

  async getRequestStats(studentId?: string): Promise<ConsultationRequestStats> {
    let query = this.supabase.from('consultation_requests').select('status, is_active', { count: 'exact' });
    
    if (studentId) {
        query = query.eq('student_profile_id', studentId);
    }
    
    const { data, error } = await query;
    if (error || !data) {
        return {
            totalRequests: 0,
            openRequests: 0,
            inProgressRequests: 0,
            closedRequests: 0,
            cancelledRequests: 0,
            totalOffers: 0
        };
    }

    // Need simpler query for offers count or aggregate separately
    // For now simple counts on loaded data (might be heavy if many rows)
    // Better: use .eq for specific status counts or RPC
    
    return {
        totalRequests: data.length,
        openRequests: data.filter(r => r.status === 'open').length,
        inProgressRequests: data.filter(r => r.status === 'in_progress').length,
        closedRequests: data.filter(r => r.status === 'closed').length,
        cancelledRequests: data.filter(r => r.status === 'cancelled').length,
        totalOffers: 0 // TODO: Implement separate query for offers count
    };
  }

  // ============================================================
  // REQUESTS - WRITE
  // ============================================================

  async createRequest(data: CreateConsultationRequestPayload, studentId?: string): Promise<ConsultationRequest> {
    // 🔒 Server-Injected Identity: studentId is provided separately by API route
    const resolvedStudentId = studentId || '';

    const { data: created, error } = await this.supabase
      .from('consultation_requests')
      .insert({
        student_profile_id: resolvedStudentId,
        category_id: data.categoryId,
        title: data.title,
        description: data.description,
        level: data.level,
        budget_min: data.budgetMin,
        budget_max: data.budgetMax,
        preferred_dates: data.preferredDates,
        preferred_times: data.preferredTimes as any,
        status: 'open',
        is_active: true
      })
      .select(`
        *,
        student:profiles!student_profile_id(*),
        category:categories(*)
      `)
      .single();

    if (error) throw error;
    return this.mapRequest(created);
  }

  async updateRequestStatus(id: string, status: ConsultationRequestStatus): Promise<ConsultationRequest> {
    const { data, error } = await this.supabase
      .from('consultation_requests')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        student:profiles!student_profile_id(*),
        category:categories(*)
      `)
      .single();
      
    if (error) throw error;
    return this.mapRequest(data);
  }

  async cancelRequest(id: string): Promise<ConsultationRequest> {
     return this.updateRequestStatus(id, 'cancelled');
  }

  // ============================================================
  // OFFERS - READ
  // ============================================================

  async getOfferById(id: string): Promise<ConsultationOffer | null> {
    const { data, error } = await this.supabase
      .from('consultation_offers')
      .select(`
        *,
        instructor:instructor_profiles!instructor_profile_id(
            *,
            profile:profiles(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapOffer(data);
  }

  async getOffersByRequestId(requestId: string): Promise<ConsultationOffer[]> {
    const { data, error } = await this.supabase
      .from('consultation_offers')
      .select(`
        *,
        instructor:instructor_profiles!instructor_profile_id(
            *,
            profile:profiles(*)
        )
      `)
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return data.map(this.mapOffer);
  }
  
  async getOffersByInstructorId(instructorId: string): Promise<ConsultationOffer[]> {
      const { data, error } = await this.supabase
      .from('consultation_offers')
      .select(`
        *,
        instructor:instructor_profiles!instructor_profile_id(
            *,
            profile:profiles(*)
        )
      `)
      .eq('instructor_profile_id', instructorId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapOffer);
  }

  // ============================================================
  // OFFERS - WRITE
  // ============================================================

  async createOffer(data: CreateConsultationOfferPayload, instructorId?: string): Promise<ConsultationOffer> {
    // 🔒 Server-Injected Identity: instructorId is provided separately by API route
    const resolvedInstructorId = instructorId || '';

    const { data: created, error } = await this.supabase
      .from('consultation_offers')
      .insert({
        request_id: data.requestId,
        instructor_profile_id: resolvedInstructorId,
        message: data.message,
        offered_price: data.offeredPrice,
        offered_date: data.offeredDate,
        offered_start_time: data.offeredStartTime,
        offered_end_time: data.offeredEndTime,
        status: 'pending',
        is_active: true
      })
      .select(`
        *,
        instructor:instructor_profiles!instructor_profile_id(
            *,
            profile:profiles(*)
        )
      `)
      .single();

    if (error) throw error;
    
    // Increment offer count on request
    const { data: reqData } = await this.supabase
      .from('consultation_requests')
      .select('offers_count')
      .eq('id', data.requestId)
      .single();

    if (reqData) {
      await this.supabase
        .from('consultation_requests')
        .update({ offers_count: (reqData.offers_count || 0) + 1 })
        .eq('id', data.requestId);
    }

    return this.mapOffer(created);
  }

  async acceptOffer(offerId: string): Promise<ConsultationOffer> {
    const { data: offer, error } = await this.supabase
      .from('consultation_offers')
      .select('*')
      .eq('id', offerId)
      .single();
      
    if (error || !offer) throw new Error('Offer not found');

    // 1. Update this offer to accepted
    const { data: updatedOffer, error: updateError } = await this.supabase
        .from('consultation_offers')
        .update({ status: 'accepted' })
        .eq('id', offerId)
        .select(`
            *,
            instructor:instructor_profiles!instructor_profile_id(
                *,
                profile:profiles(*)
            )
        `)
        .single();
        
    if (updateError) throw updateError;
    
    // 2. Reject other offers for this request? Or keep them pending?
    // Usually we close the request when an offer is accepted.
    await this.supabase
        .from('consultation_requests')
        .update({ 
            status: 'in_progress', 
            accepted_offer_id: offerId 
        })
        .eq('id', offer.request_id);

    return this.mapOffer(updatedOffer);
  }

  async rejectOffer(offerId: string): Promise<ConsultationOffer> {
    const { data: updatedOffer, error } = await this.supabase
        .from('consultation_offers')
        .update({ status: 'rejected' })
        .eq('id', offerId)
        .select(`
            *,
            instructor:instructor_profiles!instructor_profile_id(
                *,
                profile:profiles(*)
            )
        `)
        .single();
        
    if (error) throw error;
    return this.mapOffer(updatedOffer);
  }

  async withdrawOffer(offerId: string): Promise<ConsultationOffer> {
    const { data: updatedOffer, error } = await this.supabase
        .from('consultation_offers')
        .update({ status: 'withdrawn' })
        .eq('id', offerId)
        .select(`
            *,
            instructor:instructor_profiles!instructor_profile_id(
                *,
                profile:profiles(*)
            )
        `)
        .single();
        
    if (error) throw error;
    return this.mapOffer(updatedOffer);
  }
}
