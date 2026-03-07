/**
 * MockBookingRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
  Booking,
  BookingStats,
  CreateBookingPayload,
  IBookingRepository,
  UpdateBookingData,
} from '@/src/application/repositories/IBookingRepository';
import { MOCK_BOOKINGS } from '@/src/data/mock/bookings';

export class MockBookingRepository implements IBookingRepository {
  private items: Booking[] = [...MOCK_BOOKINGS];

  async getById(id: string): Promise<Booking | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }


  async getPaginated(page: number, perPage: number) {
    await this.delay(100);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return { data: this.items.slice(start, end), total: this.items.length, page, perPage };
  }

  async getByStudentId(studentId: string): Promise<Booking[]> {
    await this.delay(100);
    return this.items.filter((item) => item.studentId === studentId);
  }

  async getByInstructorId(instructorId: string): Promise<Booking[]> {
    await this.delay(100);
    return this.items.filter((item) => item.instructorId === instructorId);
  }

  async getByCourseId(courseId: string): Promise<Booking[]> {
    await this.delay(100);
    return this.items.filter((item) => item.courseId === courseId);
  }

  async create(data: CreateBookingPayload): Promise<Booking> {
    await this.delay(200);
    const newItem: Booking = {
      id: `book-${Date.now()}`,
      ...data,
      studentId: 'student-001', // 🔒 Mock: auto-assigned (server resolves in prod)
      studentName: 'Mock Student',
      instructorName: '',
      courseName: '',
      startTime: '',
      endTime: '',
      bookedHours: 0,
      status: 'pending',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateBookingData): Promise<Booking> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Booking not found');
    const updatedItem: Booking = { ...this.items[index], ...data, updatedAt: new Date().toISOString() };
    this.items[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  async getStats(): Promise<BookingStats> {
    await this.delay(100);
    const totalItems = this.items.length;
    const activeItems = this.items.filter((i) => i.isActive).length;
    return {
      totalItems,
      activeItems,
      inactiveItems: totalItems - activeItems,
      pendingCount: this.items.filter((i) => i.status === 'pending').length,
      confirmedCount: this.items.filter((i) => i.status === 'confirmed').length,
      completedCount: this.items.filter((i) => i.status === 'completed').length,
      cancelledCount: this.items.filter((i) => i.status === 'cancelled').length,
    };
  }

  async getForCurrentUser(role: 'student' | 'instructor'): Promise<Booking[]> {
    await this.delay(100);
    // Return mock data for the default demo users
    if (role === 'student') {
        return this.items.filter(item => item.studentId === 'student-001');
    } else {
        return this.items.filter(item => item.instructorId === 'inst-001');
    }
  }

  async getByMonth(month: number, year: number, filters?: { instructorId?: string; studentId?: string }): Promise<Booking[]> {
    await this.delay(100);
    return this.items.filter(item => {
        const d = new Date(item.scheduledDate);
        const matchesDate = d.getMonth() + 1 === month && d.getFullYear() === year;
        const matchesInstructor = filters?.instructorId ? item.instructorId === filters.instructorId : true;
        const matchesStudent = filters?.studentId ? item.studentId === filters.studentId : true;
        return matchesDate && matchesInstructor && matchesStudent;
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockBookingRepository = new MockBookingRepository();
