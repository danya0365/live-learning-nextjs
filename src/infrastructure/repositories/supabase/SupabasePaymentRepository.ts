/**
 * SupabasePaymentRepository
 * Implementation of IPaymentRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
    CheckoutResult,
    CreatePaymentData,
    IPaymentRepository,
    PaginatedResult,
    Payment,
    PaymentStats,
    PaymentStatus,
    UpdatePaymentData
} from '@/src/application/repositories/IPaymentRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type PaymentRow = Database['public']['Tables']['payments']['Row'];

export class SupabasePaymentRepository implements IPaymentRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getById(id: string): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async getByIds(ids: string[]): Promise<Payment[]> {
    if (ids.length === 0) return [];
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .in('id', ids);

    if (error) {
        console.error('Error fetching payments by IDs:', error);
        return [];
    }
    return (data || []).map(this.mapToDomain);
  }

  async getAll(): Promise<Payment[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
    return data.map(this.mapToDomain);
  }


  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<Payment>> {
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;

    const { data, error, count } = await this.supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: (data || []).map(this.mapToDomain),
      total: count || 0,
      page,
      perPage,
    };
  }

  async create(data: CreatePaymentData): Promise<Payment> {
    const insertPayload: any = {
      amount: data.amount,
      currency: data.currency,
      payment_method: data.paymentMethod,
      transaction_id: data.transactionId,
      status: data.status || 'pending',
    };
    if (data.enrollmentId) insertPayload.enrollment_id = data.enrollmentId;

    const { data: created, error } = await this.supabase
      .from('payments')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;
    return this.mapToDomain(created);
  }

  async update(id: string, data: UpdatePaymentData): Promise<Payment> {
    const updatePayload: any = {};
    if (data.status) updatePayload.status = data.status;
    if (data.transactionId) updatePayload.transaction_id = data.transactionId;
    updatePayload.updated_at = new Date().toISOString();

    const { data: updated, error } = await this.supabase
      .from('payments')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('payments')
      .delete()
      .eq('id', id);
    return !error;
  }

  async getStats(): Promise<PaymentStats> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*');

    if (error || !data) {
      return {
        totalPayments: 0,
        succeededPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        totalRevenue: 0,
      };
    }

    const totalRevenue = data
      .filter(p => p.status === 'succeeded')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      totalPayments: data.length,
      succeededPayments: data.filter(p => p.status === 'succeeded').length,
      failedPayments: data.filter(p => p.status === 'failed').length,
      pendingPayments: data.filter(p => p.status === 'pending').length,
      totalRevenue,
    };
  }

  async createCheckoutSession(bookingId: string): Promise<CheckoutResult> {
    throw new Error('Method not implemented in SupabaseRepository. Use StripeRepository or ApiRepository.');
  }

  private mapToDomain = (raw: PaymentRow): Payment => {
    return {
      id: raw.id,
      amount: Number(raw.amount),
      currency: raw.currency,
      paymentMethod: raw.payment_method,
      transactionId: raw.transaction_id || undefined,
      status: raw.status as PaymentStatus,
      createdAt: raw.created_at || '',
      updatedAt: raw.updated_at || '',
    };
  };
}
