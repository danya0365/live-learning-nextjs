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
import {
  IProfileRepository
} from '@/src/application/repositories/IProfileRepository';
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

export interface MyScheduleViewModel {
  timeSlots: ScheduleTimeSlot[];
  instructors: ScheduleInstructor[];
  filters: ScheduleFilters;
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
}

export class MySchedulePresenter {
  constructor(
    private readonly instructorRepository: IInstructorRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly profileRepository: IProfileRepository,
  ) {}

  async getViewModel(filters?: Partial<ScheduleFilters>): Promise<MyScheduleViewModel> {
    const profile = await this.profileRepository.getProfile();
    const isInstructor = profile?.role === 'instructor';
    
    const { data: allInstructors } = await this.instructorRepository.getPaginated(1, 100);
    const now = dayjs();
    
    const activeFilters: ScheduleFilters = {
      instructorId: isInstructor ? (profile?.id || null) : null,
      dayOfWeek: filters?.dayOfWeek ?? null,
      month: filters?.month ?? (now.month() + 1),
      year: filters?.year ?? now.year(),
      showBookedOnly: !isInstructor ? true : (filters?.showBookedOnly ?? false),
      showAvailableOnly: isInstructor ? (filters?.showAvailableOnly ?? false) : false,
    };

    // Calculate date range for the month
    const startOfMonth = dayjs(`${activeFilters.year}-${activeFilters.month}-01`).startOf('month');
    const endOfMonth = startOfMonth.endOf('month');

    // หน้า My Schedule ต้องดึงข้อมูลเฉพาะที่ Login เข้ามาเท่านั้น
    const monthBookings = await this.bookingRepository.getMyBookingsByMonth(
      activeFilters.month,
      activeFilters.year
    );

    // Gather all availability templates only for the current instructor
    let instructorSlotsGroups: any[] = [];
    if (isInstructor && profile) {
      // Find the instructor profile by profile_id
      const currentInstructorRow = await this.instructorRepository.getByProfileId(profile.id);
      
      if (currentInstructorRow) {
        const slots = await this.instructorRepository.getAvailabilities(currentInstructorRow.id);
        instructorSlotsGroups.push({ inst: currentInstructorRow, slots });
        
        // Ensure the filter uses the internal instructor_profile.id
        if (!activeFilters.instructorId) {
          activeFilters.instructorId = currentInstructorRow.id;
        }
      }
    }

    // Expand templates into specific dates for the month
    let expandedSlots: ScheduleTimeSlot[] = [];
    
    if (isInstructor) {
      let current = startOfMonth;
      while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
        const dayOfWeek = current.day();
        
        instructorSlotsGroups.forEach(({ inst, slots }) => {
          // Filter by instructor if needed
          if (activeFilters.instructorId && inst.id !== activeFilters.instructorId) return;
          
          // Filter by day of week if needed
          if (activeFilters.dayOfWeek !== null && dayOfWeek !== activeFilters.dayOfWeek) return;

          const dailyTemplates = slots.filter((s: InstructorAvailability) => s.dayOfWeek === dayOfWeek);
          
          dailyTemplates.forEach((template: InstructorAvailability) => {
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

      // Add actual bookings that might fall outside or mismatch the availability templates
      monthBookings.forEach(b => {
         const alreadyAdded = expandedSlots.some(s => 
            s.instructorId === b.instructorId && 
            s.scheduledDate === b.scheduledDate && 
            s.startTime === b.startTime
         );

         if (!alreadyAdded) {
             // Filter by instructor if needed
             if (activeFilters.instructorId && b.instructorId !== activeFilters.instructorId) return;
             // Filter by day of week if needed
             const dayOfWeek = dayjs(b.scheduledDate).day();
             if (activeFilters.dayOfWeek !== null && dayOfWeek !== activeFilters.dayOfWeek) return;

             expandedSlots.push({
                id: `booking-${b.id}`, // Custom pseudo-ID
                instructorId: b.instructorId,
                dayOfWeek: dayOfWeek,
                startTime: b.startTime,
                endTime: b.endTime,
                instructorName: b.instructorName,
                dayName: DAY_NAMES[dayOfWeek],
                isBooked: true,
                studentName: b.studentName,
                courseName: b.courseName,
                courseId: b.courseId,
                scheduledDate: b.scheduledDate
             });
         }
      });
    } else {
      // Student view: simply map the actual monthBookings directly to TimeSlots
      expandedSlots = monthBookings.map(b => ({
          id: `slot-${b.id}`, // mapping booking ID to slot ID
          instructorId: b.instructorId,
          dayOfWeek: dayjs(b.scheduledDate).day(),
          startTime: b.startTime,
          endTime: b.endTime,
          instructorName: b.instructorName,
          dayName: DAY_NAMES[dayjs(b.scheduledDate).day()],
          isBooked: true,
          studentName: b.studentName || profile?.fullName || 'ฉัน (ผู้เรียน)',
          courseName: b.courseName,
          courseId: b.courseId,
          scheduledDate: b.scheduledDate
      }));
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

  async addAvailability(instructorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<boolean> {
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
}
