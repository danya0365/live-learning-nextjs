/**
 * IBookingRepository
 * Repository interface for Booking data access
 * Following Clean Architecture - Application layer
 */

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  instructorId: string;
  instructorName: string;
  courseId: string;
  courseName: string;
  enrollmentId?: string;
  instructorAvailabilityId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  bookedHours: number;
  status: BookingStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStats {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface CreateBookingData {
  studentId: string;        // 🔒 Server-injected from auth session
  instructorId: string;
  courseId: string;
  enrollmentId?: string;
  instructorAvailabilityId: string;
  scheduledDate: string;
}

/**
 * 🔒 Server-Injected Identity Pattern
 * Client-safe payload — auth IDs (studentId) are resolved server-side from session
 */
export type CreateBookingPayload = Omit<CreateBookingData, 'studentId'>;

export interface UpdateBookingData {
  status?: BookingStatus;
  isActive?: boolean;
}

export interface IBookingRepository {
  getById(id: string): Promise<Booking | null>;
  getPaginated(page: number, perPage: number): Promise<{ data: Booking[]; total: number; page: number; perPage: number }>;
  getByStudentId(studentId: string): Promise<Booking[]>;
  getByInstructorId(instructorId: string): Promise<Booking[]>;
  getByCourseId(courseId: string): Promise<Booking[]>;
  create(data: CreateBookingPayload): Promise<Booking>;
  update(id: string, data: UpdateBookingData): Promise<Booking>;
  delete(id: string): Promise<boolean>;
  getStats(): Promise<BookingStats>;
  getByMonth(month: number, year: number, filters?: { instructorId?: string; studentId?: string }): Promise<Booking[]>;
}
