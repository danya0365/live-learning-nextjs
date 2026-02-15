
/**
 * ApiCourseRepository
 * Implements ICourseRepository using API calls
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    Course,
    CourseStats,
    CreateCourseData,
    ICourseRepository,
    PaginatedResult,
    UpdateCourseData,
} from '@/src/application/repositories/ICourseRepository';

export class ApiCourseRepository implements ICourseRepository {
  private baseUrl = '/api/courses';

  async getById(id: string): Promise<Course | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  }

  async getAll(): Promise<Course[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  }

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<Course>> {
    const res = await fetch(`${this.baseUrl}?page=${page}&perPage=${perPage}`);
    if (!res.ok) throw new Error('Failed to fetch paginated courses');
    return res.json();
  }

  async getByCategory(categoryId: string): Promise<Course[]> {
    const res = await fetch(`${this.baseUrl}?categoryId=${categoryId}`);
    if (!res.ok) throw new Error('Failed to fetch courses by category');
    return res.json();
  }

  async getByInstructorId(instructorId: string): Promise<Course[]> {
    const res = await fetch(`${this.baseUrl}?instructorId=${instructorId}`);
    if (!res.ok) throw new Error('Failed to fetch courses by instructor');
    return res.json();
  }

  async getFeatured(): Promise<Course[]> {
    const res = await fetch(`${this.baseUrl}?featured=true`);
    if (!res.ok) throw new Error('Failed to fetch featured courses');
    return res.json();
  }

  // Write operations usually go to specific endpoints or use Server Actions
  // For now, these are placeholders or point to API endpoints if implemented

  async create(data: CreateCourseData): Promise<Course> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  }

  async update(id: string, data: UpdateCourseData): Promise<Course> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  async getStats(): Promise<CourseStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) {
        return {
            totalItems: 0,
            activeItems: 0,
            inactiveItems: 0,
            totalStudents: 0,
            averageRating: 0
        };
    }
    return res.json();
  }
}
