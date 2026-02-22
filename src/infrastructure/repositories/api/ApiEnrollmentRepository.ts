/**
 * ApiEnrollmentRepository
 * API-based implementation for enrollment operations
 * Following Clean Architecture - Infrastructure layer
 */

import {
    CreateEnrollmentPayload,
    Enrollment,
    IEnrollmentRepository,
} from '@/src/application/repositories/IEnrollmentRepository';

const BASE_URL = '/api/enrollments';

export class ApiEnrollmentRepository implements IEnrollmentRepository {

  async checkEnrollment(courseId: string): Promise<Enrollment | null> {
    const res = await fetch(`${BASE_URL}/check?courseId=${courseId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.enrollment || null;
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch enrollments');
    const data = await res.json();
    return data.data || [];
  }

  async createEnrollment(data: CreateEnrollmentPayload): Promise<Enrollment> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create enrollment');
    }
    return res.json();
  }

  async getById(id: string): Promise<Enrollment | null> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
}
