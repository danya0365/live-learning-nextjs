/**
 * ApiBookingRepository
 * Implements IBookingRepository using API calls
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    Booking,
    BookingStats,
    CreateBookingData,
    IBookingRepository,
    UpdateBookingData
} from '@/src/application/repositories/IBookingRepository';

export class ApiBookingRepository implements IBookingRepository {
  private baseUrl = '/api/bookings';

  async getById(id: string): Promise<Booking | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch booking');
    return res.json();
  }

  async getAll(): Promise<Booking[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  }

  async getPaginated(page: number, perPage: number): Promise<{ data: Booking[]; total: number; page: number; perPage: number }> {
    const res = await fetch(`${this.baseUrl}?page=${page}&perPage=${perPage}`);
    if (!res.ok) throw new Error('Failed to fetch paginated bookings');
    return res.json();
  }

  async getByStudentId(studentId: string): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}?studentId=${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch student bookings');
    return res.json();
  }

  async getByInstructorId(instructorId: string): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}?instructorId=${instructorId}`);
    if (!res.ok) throw new Error('Failed to fetch instructor bookings');
    return res.json();
  }
  
  async getByCourseId(courseId: string): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}?courseId=${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course bookings');
    return res.json();
  }

  async create(data: CreateBookingData): Promise<Booking> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  }

  async update(id: string, data: UpdateBookingData): Promise<Booking> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update booking');
    return res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  async getStats(): Promise<BookingStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) {
        return {
            totalItems: 0,
            activeItems: 0,
            inactiveItems: 0,
            pendingCount: 0,
            confirmedCount: 0,
            completedCount: 0,
            cancelledCount: 0
        };
    }
    return res.json();
  }
}
