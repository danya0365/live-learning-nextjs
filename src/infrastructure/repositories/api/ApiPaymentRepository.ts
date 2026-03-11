/**
 * ApiPaymentRepository
 * Implements IPaymentRepository using API calls
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    CheckoutResult,
    CreatePaymentData,
    IPaymentRepository,
    PaginatedResult,
    Payment,
    PaymentStats,
    UpdatePaymentData,
} from '@/src/application/repositories/IPaymentRepository';

export class ApiPaymentRepository implements IPaymentRepository {
  private baseUrl = '/api/payments';

  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Request failed with status ${res.status}`);
    }
    return res.json();
  }

  async getById(id: string): Promise<Payment | null> {
    try {
      return await this.fetchJson<Payment>(`${this.baseUrl}/${id}`);
    } catch (e: any) {
      if (e.message.includes('404')) return null;
      throw e;
    }
  }

  async getByIds(ids: string[]): Promise<Payment[]> {
    if (ids.length === 0) return [];
    return this.fetchJson<Payment[]>(`${this.baseUrl}?ids=${ids.join(',')}`);
  }

  async getAll(): Promise<Payment[]> {
    return this.fetchJson<Payment[]>(this.baseUrl);
  }

  async getByBookingId(bookingId: string): Promise<Payment | null> {
    try {
      const payments = await this.fetchJson<Payment[]>(`${this.baseUrl}?bookingId=${bookingId}`);
      return payments.length > 0 ? payments[0] : null;
    } catch (e) {
      return null;
    }
  }

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<Payment>> {
    return this.fetchJson<PaginatedResult<Payment>>(`${this.baseUrl}?page=${page}&perPage=${perPage}`);
  }

  async create(data: CreatePaymentData): Promise<Payment> {
    return this.fetchJson<Payment>(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: UpdatePaymentData): Promise<Payment> {
    return this.fetchJson<Payment>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
     await this.fetchJson(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  async getStats(): Promise<PaymentStats> {
    return this.fetchJson<PaymentStats>(`${this.baseUrl}/stats`);
  }

  async createCheckoutSession(bookingId: string): Promise<CheckoutResult> {
    const res = await fetch(`${this.baseUrl}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Checkout failed' }));
        throw new Error(error.error || 'Failed to create checkout session');
    }

    return res.json();
  }
}
