/**
 * ApiInstructorRepository
 * Implements IInstructorRepository using API calls
 * 
 * ✅ For CLIENT-SIDE use
 */

import {
    CreateInstructorData,
    IInstructorRepository,
    Instructor,
    InstructorAvailability,
    InstructorReview,
    InstructorStats,
    UpdateInstructorData,
} from '@/src/application/repositories/IInstructorRepository';

export class ApiInstructorRepository implements IInstructorRepository {
  private baseUrl = '/api/instructors';

  async getById(id: string): Promise<Instructor | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch instructor');
    return res.json();
  }

  async getAll(): Promise<Instructor[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Failed to fetch instructors');
    return res.json();
  }

  async getPaginated(page: number, perPage: number): Promise<{ data: Instructor[]; total: number; page: number; perPage: number }> {
    const res = await fetch(`${this.baseUrl}?page=${page}&perPage=${perPage}`);
    if (!res.ok) throw new Error('Failed to fetch paginated instructors');
    return res.json();
  }

  async getAvailable(): Promise<Instructor[]> {
     const res = await fetch(`${this.baseUrl}?available=true`);
     if (!res.ok) throw new Error('Failed to fetch available instructors');
     return res.json();
  }

  async getTopRated(limit: number): Promise<Instructor[]> {
      const res = await fetch(`${this.baseUrl}?topRated=true&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch top rated instructors');
      return res.json();
  }

  async getAvailabilities(instructorId: string): Promise<InstructorAvailability[]> {
      const res = await fetch(`${this.baseUrl}/${instructorId}/timeslots`);
      if (!res.ok) throw new Error('Failed to fetch time slots');
      return res.json();
  }

  async getCourseInstructors(courseId: string): Promise<Instructor[]> {
    const res = await fetch(`${this.baseUrl}?courseId=${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course instructors');
    return res.json();
  }

  async addCourseToInstructor(instructorId: string, courseId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${instructorId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) throw new Error('Failed to add course to instructor');
  }

  async removeCourseFromInstructor(instructorId: string, courseId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${instructorId}/courses/${courseId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove course from instructor');
  }

  async getReviews(instructorId: string): Promise<InstructorReview[]> {
    const res = await fetch(`${this.baseUrl}/${instructorId}/reviews`);
    if (!res.ok) return [];
    return res.json();
  }

  async create(data: CreateInstructorData): Promise<Instructor> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create instructor');
    return res.json();
  }

  async update(id: string, data: UpdateInstructorData): Promise<Instructor> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update instructor');
    return res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  async deleteAvailability(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/availabilities/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  async addAvailability(instructorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<InstructorAvailability> {
    const res = await fetch(`${this.baseUrl}/${instructorId}/availabilities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayOfWeek, startTime, endTime }),
    });
    if (!res.ok) throw new Error('Failed to add availability');
    return res.json();
  }

  async getStats(): Promise<InstructorStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
     if (!res.ok) {
        return {
            totalItems: 0,
            activeItems: 0,
            inactiveItems: 0,
            onlineNow: 0,
            averageRating: 0
        };
    }
    return res.json();
  }

  async getMe(): Promise<Instructor | null> {
    const res = await fetch(`${this.baseUrl}/me`);
    if (res.status === 404 || res.status === 401) return null;
    if (!res.ok) throw new Error('Failed to fetch current instructor');
    return res.json();
  }
}
