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
  timeSlotId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
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
  studentId: string;
  instructorId: string;
  courseId: string;
  timeSlotId: string;
  scheduledDate: string;
}

export interface UpdateBookingData {
  status?: BookingStatus;
  isActive?: boolean;
}

export interface IBookingRepository {
  getById(id: string): Promise<Booking | null>;
  getAll(): Promise<Booking[]>;
  getPaginated(page: number, perPage: number): Promise<{ data: Booking[]; total: number; page: number; perPage: number }>;
  getByStudentId(studentId: string): Promise<Booking[]>;
  getByInstructorId(instructorId: string): Promise<Booking[]>;
  getByCourseId(courseId: string): Promise<Booking[]>;
  create(data: CreateBookingData): Promise<Booking>;
  update(id: string, data: UpdateBookingData): Promise<Booking>;
  delete(id: string): Promise<boolean>;
  getStats(): Promise<BookingStats>;
}
