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
}
