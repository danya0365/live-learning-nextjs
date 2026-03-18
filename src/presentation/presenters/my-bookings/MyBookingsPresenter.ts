/**
 * MyBookingsPresenter
 * Handles business logic for student's bookings dashboard
 */

import {
    Booking,
    BookingStats,
    BookingStatus,
    IBookingRepository,
} from '@/src/application/repositories/IBookingRepository';

export type BookingFilter = 'all' | BookingStatus;

export interface MyBookingsViewModel {
  bookings: Booking[];
  stats: BookingStats;
  filter: BookingFilter;
  upcomingCount: number;
}

export class MyBookingsPresenter {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async getViewModel(
    filter: BookingFilter = 'all',
  ): Promise<MyBookingsViewModel> {
    const [allBookings, stats] = await Promise.all([
      this.bookingRepository.getMyStudentBookings(),
      this.bookingRepository.getMyStats(),
    ]);


    const filteredBookings =
      filter === 'all'
        ? allBookings
        : allBookings.filter((b) => b.status === filter);

    // Sort by date descending
    filteredBookings.sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime(),
    );

    const upcomingCount = allBookings.filter(
      (b) => b.status === 'confirmed' || b.status === 'pending',
    ).length;

    return {
      bookings: filteredBookings,
      stats,
      filter,
      upcomingCount,
    };
  }

  // ============================================================
  // GRANULAR DATA METHODS (For API Routes & Individual Actions)
  // ============================================================
  // ⚠️ API Routes MUST call these methods individually rather than using getViewModel()

  async getByMonth(month: number, year: number, filters?: { instructorId?: string; studentId?: string; courseId?: string }) {
    return await this.bookingRepository.getByMonth(month, year, filters);
  }

  async getByMonthByProfile(profileId: string, month: number, year: number) {
    return await this.bookingRepository.getByMonthByProfile(profileId, month, year);
  }

  async getByInstructorId(instructorId: string) {
    return await this.bookingRepository.getByInstructorId(instructorId);
  }

  async getByCourseId(courseId: string) {
    return await this.bookingRepository.getByCourseId(courseId);
  }

  async create(data: any, studentId: string) {
    return await this.bookingRepository.create(data, studentId);
  }

  async getById(id: string) {
    return await this.bookingRepository.getById(id);
  }

  async update(id: string, updates: Partial<Booking>) {
    return await this.bookingRepository.update(id, updates);
  }

  async delete(id: string) {
    return await this.bookingRepository.delete(id);
  }

  async getMyBookingsByMonth(month: number, year: number) {
    return await this.bookingRepository.getMyBookingsByMonth(month, year);
  }

  async getByStudentId(studentId: string) {
    return await this.bookingRepository.getByStudentId(studentId);
  }

  async getStatsByProfile(profileId: string) {
    return await this.bookingRepository.getStatsByProfile(profileId);
  }

  async getMyStats() {
    return await this.bookingRepository.getMyStats();
  }

  async getStats() {
    return await this.bookingRepository.getStats();
  }
}
