/**
 * MockInstructorRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    CreateInstructorData,
    IInstructorRepository,
    Instructor,
    InstructorStats,
    TimeSlot,
    UpdateInstructorData,
} from '@/src/application/repositories/IInstructorRepository';
import { MOCK_INSTRUCTORS, MOCK_TIME_SLOTS } from '@/src/data/mock/instructors';

export class MockInstructorRepository implements IInstructorRepository {
  private items: Instructor[] = [...MOCK_INSTRUCTORS];
  private timeSlots: TimeSlot[] = [...MOCK_TIME_SLOTS];

  async getById(id: string): Promise<Instructor | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(): Promise<Instructor[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number) {
    await this.delay(100);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      data: this.items.slice(start, end),
      total: this.items.length,
      page,
      perPage,
    };
  }

  async getAvailable(): Promise<Instructor[]> {
    await this.delay(100);
    return this.items.filter((item) => item.isActive && item.isOnline);
  }

  async getTopRated(limit: number): Promise<Instructor[]> {
    await this.delay(100);
    return [...this.items]
      .filter((item) => item.isActive)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  async getTimeSlots(instructorId: string): Promise<TimeSlot[]> {
    await this.delay(100);
    return this.timeSlots.filter((slot) => slot.instructorId === instructorId);
  }

  async create(data: CreateInstructorData): Promise<Instructor> {
    await this.delay(200);
    const newItem: Instructor = {
      id: `inst-${Date.now()}`,
      ...data,
      avatar: data.avatar || '',
      rating: 0,
      totalStudents: 0,
      totalCourses: 0,
      isOnline: false,
      isActive: true,
      languages: data.languages || ['ไทย'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateInstructorData): Promise<Instructor> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Instructor not found');
    const updatedItem: Instructor = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
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

  async getStats(): Promise<InstructorStats> {
    await this.delay(100);
    const totalItems = this.items.length;
    const activeItems = this.items.filter((item) => item.isActive).length;
    const onlineNow = this.items.filter((item) => item.isOnline).length;
    const averageRating = this.items.reduce((sum, item) => sum + item.rating, 0) / totalItems;
    return {
      totalItems,
      activeItems,
      inactiveItems: totalItems - activeItems,
      onlineNow,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }

  async getMe(): Promise<Instructor | null> {
    await this.delay(100);
    // Mock getting the first instructor as "me"
    return this.items[0] || null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockInstructorRepository = new MockInstructorRepository();
