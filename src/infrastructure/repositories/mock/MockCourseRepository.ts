/**
 * MockCourseRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    Course,
    CourseStats,
    CreateCourseData,
    ICourseRepository,
    PaginatedResult,
    UpdateCourseData,
} from '@/src/application/repositories/ICourseRepository';
import { MOCK_COURSES } from '@/src/data/mock/courses';

export class MockCourseRepository implements ICourseRepository {
  private items: Course[] = [...MOCK_COURSES];

  async getById(id: string): Promise<Course | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(): Promise<Course[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<Course>> {
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

  async getByCategory(categoryId: string): Promise<Course[]> {
    await this.delay(100);
    return this.items.filter((item) => item.categoryId === categoryId);
  }

  async getByInstructorId(_instructorId: string): Promise<Course[]> {
    await this.delay(100);
    return []; // In the new model, this requires a junction table query
  }

  async getFeatured(): Promise<Course[]> {
    await this.delay(100);
    return this.items
      .filter((item) => item.isActive && item.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }

  async create(data: CreateCourseData): Promise<Course> {
    await this.delay(200);
    const newItem: Course = {
      id: `course-${Date.now()}`,
      ...data,
      thumbnail: data.thumbnail || '',
      categoryName: '',
      rating: 0,
      totalStudents: 0,
      instructorCount: 0,
      isLiveFeature: false,
      isActive: true,
      tags: data.tags || [],
      learningOutcomes: [],
      requirements: [],
      targetAudience: [],
      syllabus: [],
      aboutCourse: '',
      hasInteractiveLab: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateCourseData): Promise<Course> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Course not found');
    const updatedItem: Course = {
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

  async getStats(): Promise<CourseStats> {
    await this.delay(100);
    const totalItems = this.items.length;
    const activeItems = this.items.filter((item) => item.isActive).length;
    const totalStudents = this.items.reduce((sum, item) => sum + item.totalStudents, 0);
    const averageRating = this.items.reduce((sum, item) => sum + item.rating, 0) / totalItems;
    return {
      totalItems,
      activeItems,
      inactiveItems: totalItems - activeItems,
      totalStudents,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }

  async getForCurrentInstructor(): Promise<Course[]> {
    await this.delay(100);
    // Return all courses for mock, or filter by a mock ID if we had one in context
    return this.items; 
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockCourseRepository = new MockCourseRepository();
