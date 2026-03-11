/**
 * IEnrollmentRepository
 * Repository interface for Enrollment data access
 * Following Clean Architecture - Application layer
 *
 * Enrollment = student purchases a course (1 course = 1 enrollment)
 * Booking = student reserves a live session slot (N bookings per enrollment)
 */

// ============================================================
// TYPES
// ============================================================

export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'expired' | 'refunded';

export interface Enrollment {
  id: string;
  studentProfileId: string;
  courseId: string;
  totalHours: number;
  usedHours: number;
  remainingHours: number;  // computed: totalHours - usedHours
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentPayload {
  courseId: string;
}

// ============================================================
// REPOSITORY INTERFACE
// ============================================================

export interface IEnrollmentRepository {
  /**
   * Check if the current user is enrolled in a specific course.
   * Returns the enrollment if found, null otherwise.
   */
  checkEnrollment(courseId: string): Promise<Enrollment | null>;

  /**
   * Get all enrollments for the current user (student).
   */
  getMyEnrollments(): Promise<Enrollment[]>;

  /**
   * Create a new enrollment (status = 'pending' until payment succeeds).
   */
  createEnrollment(data: CreateEnrollmentPayload): Promise<Enrollment>;

  /**
   * Get enrollment by ID.
   */
  getById(id: string): Promise<Enrollment | null>;
}
