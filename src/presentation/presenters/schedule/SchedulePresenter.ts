import {
    IBookingRepository
} from '@/src/application/repositories/IBookingRepository';
import {
    ICourseRepository
} from '@/src/application/repositories/ICourseRepository';
import {
    IInstructorRepository,
    InstructorAvailability
} from '@/src/application/repositories/IInstructorRepository';
import dayjs from 'dayjs';
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

export interface ScheduleTimeSlot extends InstructorAvailability {
  instructorName: string;
  dayName: string;
  isBooked: boolean;
  studentName?: string;
  courseName?: string;
  courseId?: string;
  scheduledDate?: string; // YYYY-MM-DD
}

export interface ScheduleFilters {
  instructorId: string | null;
  dayOfWeek: number | null;
  month: number; // 1-12
  year: number;
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
    const now = dayjs();
    
    const activeFilters: ScheduleFilters = {
      instructorId: filters?.instructorId ?? null,
      dayOfWeek: filters?.dayOfWeek ?? null,
      month: filters?.month ?? (now.month() + 1),
      year: filters?.year ?? now.year(),
      showBookedOnly: filters?.showBookedOnly ?? false,
      showAvailableOnly: filters?.showAvailableOnly ?? false,
    };

    // Calculate date range for the month
    const startOfMonth = dayjs(`${activeFilters.year}-${activeFilters.month}-01`).startOf('month');
    const endOfMonth = startOfMonth.endOf('month');

    // Fetch bookings for the month concurrently
    // Use strictly targeted getByMonth to avoid performance issues
    const monthBookings = await this.bookingRepository.getByMonth(
      activeFilters.month, 
      activeFilters.year, 
      { instructorId: activeFilters.instructorId || undefined }
    );

    // Gather all availability templates
    const availabilityPromises = allInstructors.map(async (inst) => {
      const slots = await this.instructorRepository.getAvailabilities(inst.id);
      return { inst, slots };
    });
    const instructorSlotsGroups = await Promise.all(availabilityPromises);

    // Expand templates into specific dates for the month
    const expandedSlots: ScheduleTimeSlot[] = [];
    
    let current = startOfMonth;
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
      const dayOfWeek = current.day();
      
      instructorSlotsGroups.forEach(({ inst, slots }) => {
        // Filter by instructor if needed
        if (activeFilters.instructorId && inst.id !== activeFilters.instructorId) return;
        
        // Filter by day of week if needed
        if (activeFilters.dayOfWeek !== null && dayOfWeek !== activeFilters.dayOfWeek) return;

        const dailyTemplates = slots.filter(s => s.dayOfWeek === dayOfWeek);
        
        dailyTemplates.forEach(template => {
          // Check if this slot is booked on this specific date
          const booking = monthBookings.find(b => 
            b.instructorId === inst.id && 
            b.scheduledDate === current.format('YYYY-MM-DD') &&
            b.startTime === template.startTime
          );

          expandedSlots.push({
            ...template,
            instructorName: inst.name,
            dayName: DAY_NAMES[dayOfWeek],
            isBooked: !!booking,
            studentName: booking?.studentName,
            courseName: booking?.courseName,
            courseId: booking?.courseId,
            scheduledDate: current.format('YYYY-MM-DD')
          });
        });
      });
      
      current = current.add(1, 'day');
    }

    const filtered = this.applyFilters(expandedSlots, activeFilters);

    // Sort by date, then start time
    filtered.sort((a, b) => {
      const dateA = a.scheduledDate || '';
      const dateB = b.scheduledDate || '';
      if (dateA !== dateB) return dateA.localeCompare(dateB);
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
      totalSlots: expandedSlots.length,
      availableSlots: expandedSlots.filter((s) => !s.isBooked).length,
      bookedSlots: expandedSlots.filter((s) => s.isBooked).length,
    };
  }

  private applyFilters(slots: ScheduleTimeSlot[], filters: ScheduleFilters): ScheduleTimeSlot[] {
    let result = [...slots];

    if (filters.showBookedOnly) {
      result = result.filter((s) => s.isBooked);
    }
    if (filters.showAvailableOnly) {
      result = result.filter((s) => !s.isBooked);
    }

    return result;
  }

  async addAvailability(dayOfWeek: number, startTime: string, endTime: string): Promise<boolean> {
    const instructorId = await this.getCurrentInstructorId();
    if (!instructorId) return false;
    
    await this.instructorRepository.addAvailability(instructorId, dayOfWeek, startTime, endTime);
    return true;
  }

  async deleteAvailability(id: string): Promise<boolean> {
    return await this.instructorRepository.deleteAvailability(id);
  }

  generateMetadata(): Metadata {
    return {
      title: 'ตารางเรียน — Live Learning',
      description: 'ดูตารางเวลาสอนของอาจารย์ จองเวลาเรียนสดออนไลน์ หรือเข้าร่วมคลาสที่มีอยู่',
    };
  }

  async getCurrentInstructorId(): Promise<string | null> {
    const me = await this.instructorRepository.getMe();
    return me?.id || null;
  }
}
