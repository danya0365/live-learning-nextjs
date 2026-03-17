/**
 * ApiBookingRepository
 * Implements IBookingRepository using API calls
 * 
 * ✅ For use in CLIENT-SIDE components only
 * 
 * Patterns:
 *  - getMyStudentBookings()     → GET /api/bookings/students         (session-based, no ID)
 *  - getMyInstructorBookings()  → GET /api/bookings/instructors      (session-based, no ID)
 *  - getByStudentId(id)         → GET /api/bookings/students/[id]    (explicit ID)
 *  - getByInstructorId(id)      → GET /api/bookings/instructors/[id] (explicit ID)
 */

'use client';

import {
  Booking,
  BookingStats,
  CreateBookingPayload,
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

  async getPaginated(page: number, perPage: number): Promise<{ data: Booking[]; total: number; page: number; perPage: number }> {
    const res = await fetch(`${this.baseUrl}?page=${page}&perPage=${perPage}`);
    if (!res.ok) throw new Error('Failed to fetch paginated bookings');
    return res.json();
  }

  /** My bookings as a student — server resolves identity from session */
  async getMyStudentBookings(): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}/students`);
    if (!res.ok) throw new Error('Failed to fetch my student bookings');
    return res.json();
  }

  /** My bookings as an instructor — server resolves identity from session */
  async getMyInstructorBookings(): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}/instructors`);
    if (!res.ok) throw new Error('Failed to fetch my instructor bookings');
    return res.json();
  }

  /** Bookings of a specific student by explicit ID */
  async getByStudentId(studentId: string): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}/students/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch student bookings');
    return res.json();
  }

  /** Bookings of a specific instructor by explicit ID */
  async getByInstructorId(instructorId: string): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}/instructors/${instructorId}`);
    if (!res.ok) throw new Error('Failed to fetch instructor bookings');
    return res.json();
  }
  
  async getByCourseId(courseId: string): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}?courseId=${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course bookings');
    return res.json();
  }

  async create(data: CreateBookingPayload, studentId: string): Promise<Booking> {
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

  async getStatsByProfile(profileId: string): Promise<BookingStats> {
    const res = await fetch(`${this.baseUrl}/profiles/${profileId}/stats`);
    if (!res.ok) {
        return {
            totalItems: 0, activeItems: 0, inactiveItems: 0,
            pendingCount: 0, confirmedCount: 0, completedCount: 0, cancelledCount: 0
        };
    }
    return res.json();
  }

  async getMyStats(): Promise<BookingStats> {
    const res = await fetch(`${this.baseUrl}/me/stats`);
    if (!res.ok) {
        return {
            totalItems: 0, activeItems: 0, inactiveItems: 0,
            pendingCount: 0, confirmedCount: 0, completedCount: 0, cancelledCount: 0
        };
    }
    return res.json();
  }

  async getByMonth(month: number, year: number, filters?: { instructorId?: string; studentId?: string }): Promise<Booking[]> {
    const params = new URLSearchParams({ month: month.toString(), year: year.toString() });
    if (filters?.instructorId) params.append('instructorId', filters.instructorId);
    if (filters?.studentId) params.append('studentId', filters.studentId);

    const res = await fetch(`${this.baseUrl}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch bookings by month');
    return res.json();
  }

  async getByMonthByProfile(profileId: string, month: number, year: number): Promise<Booking[]> {
    const params = new URLSearchParams({ month: month.toString(), year: year.toString() });
    const res = await fetch(`${this.baseUrl}/profiles/${profileId}/month?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch bookings by month by profile');
    return res.json();
  }

  async getMyBookingsByMonth(month: number, year: number): Promise<Booking[]> {
    const params = new URLSearchParams({ month: month.toString(), year: year.toString() });
    const res = await fetch(`${this.baseUrl}/me/month?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch my bookings by month');
    return res.json();
  }
}
