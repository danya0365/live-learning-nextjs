/**
 * MockEnrollmentRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    CreateEnrollmentPayload,
    Enrollment,
    IEnrollmentRepository,
} from '@/src/application/repositories/IEnrollmentRepository';

import { MOCK_ENROLLMENTS } from '@/src/data/mock/enrollments';

export class MockEnrollmentRepository implements IEnrollmentRepository {
  private items: Enrollment[] = [...MOCK_ENROLLMENTS];

  async checkEnrollment(courseId: string): Promise<Enrollment | null> {
    await this.delay(100);
    return this.items.find((e) => e.courseId === courseId && e.status === 'active') || null;
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    await this.delay(100);
    return [...this.items];
  }

  async createEnrollment(data: CreateEnrollmentPayload): Promise<Enrollment> {
    await this.delay(200);
    const newItem: Enrollment = {
      id: `enroll-${Date.now()}`,
      studentProfileId: '10000000-0000-0000-0000-000000000003',
      courseId: data.courseId,
      totalHours: 0,
      usedHours: 0,
      remainingHours: 0,
      status: 'pending',
      enrolledAt: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  async getById(id: string): Promise<Enrollment | null> {
    await this.delay(100);
    return this.items.find((e) => e.id === id) || null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockEnrollmentRepository = new MockEnrollmentRepository();
