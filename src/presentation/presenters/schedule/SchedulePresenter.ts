/**
 * SchedulePresenter
 * Handles business logic for the Schedule/Booking page
 * Shows timeslots by instructor with booking status
 */

import {
    IBookingRepository
} from '@/src/application/repositories/IBookingRepository';
import {
    ICourseRepository
} from '@/src/application/repositories/ICourseRepository';
import {
    IInstructorRepository,
    TimeSlot
} from '@/src/application/repositories/IInstructorRepository';
import { type Metadata } from 'next';

const DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

export interface ScheduleInstructor {
  id: string;
  name: string;
  specializations: string[];
  rating: number;
  isOnline: boolean;
  hourlyRate: number;
}

export interface ScheduleTimeSlot extends TimeSlot {
  instructorName: string;
  dayName: string;
}

export interface ScheduleFilters {
  instructorId: string | null;
  dayOfWeek: number | null;
  showBookedOnly: boolean;
  showAvailableOnly: boolean;
}

export interface ScheduleViewModel {
  timeSlots: ScheduleTimeSlot[];
  instructors: ScheduleInstructor[];
  filters: ScheduleFilters;
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
}

export class SchedulePresenter {
  constructor(
    private readonly instructorRepository: IInstructorRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async getViewModel(filters?: Partial<ScheduleFilters>): Promise<ScheduleViewModel> {
    const allInstructors = await this.instructorRepository.getAll();

    // Gather all timeslots for all instructors
    const allTimeSlotsRaw: ScheduleTimeSlot[] = [];
    for (const inst of allInstructors) {
      const slots = await this.instructorRepository.getTimeSlots(inst.id);
      for (const slot of slots) {
        allTimeSlotsRaw.push({
          ...slot,
          instructorName: inst.name,
          dayName: DAY_NAMES[slot.dayOfWeek],
        });
      }
    }

    const activeFilters: ScheduleFilters = {
      instructorId: filters?.instructorId ?? null,
      dayOfWeek: filters?.dayOfWeek ?? null,
      showBookedOnly: filters?.showBookedOnly ?? false,
      showAvailableOnly: filters?.showAvailableOnly ?? false,
    };

    const filtered = this.applyFilters(allTimeSlotsRaw, activeFilters);

    // Sort by day of week, then start time
    filtered.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });

    const scheduleInstructors: ScheduleInstructor[] = allInstructors.map((i) => ({
      id: i.id,
      name: i.name,
      specializations: i.specializations,
      rating: i.rating,
      isOnline: i.isOnline,
      hourlyRate: i.hourlyRate,
    }));

    return {
      timeSlots: filtered,
      instructors: scheduleInstructors,
      filters: activeFilters,
      totalSlots: allTimeSlotsRaw.length,
      availableSlots: allTimeSlotsRaw.filter((s) => !s.isBooked).length,
      bookedSlots: allTimeSlotsRaw.filter((s) => s.isBooked).length,
    };
  }

  private applyFilters(slots: ScheduleTimeSlot[], filters: ScheduleFilters): ScheduleTimeSlot[] {
    let result = [...slots];

    if (filters.instructorId) {
      result = result.filter((s) => s.instructorId === filters.instructorId);
    }
    if (filters.dayOfWeek !== null) {
      result = result.filter((s) => s.dayOfWeek === filters.dayOfWeek);
    }
    if (filters.showBookedOnly) {
      result = result.filter((s) => s.isBooked);
    }
    if (filters.showAvailableOnly) {
      result = result.filter((s) => !s.isBooked);
    }

    return result;
  }

  generateMetadata(): Metadata {
    return {
      title: 'ตารางเรียน — Live Learning',
      description: 'ดูตารางเวลาสอนของอาจารย์ จองเวลาเรียนสดออนไลน์ หรือเข้าร่วมคลาสที่มีอยู่',
    };
  }
}
