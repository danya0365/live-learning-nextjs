import { Booking } from '@/src/application/repositories/IBookingRepository';
import {
  CreateWizardBookingData,
  IBookingWizardRepository,
  WizardCourse,
  WizardInstructor,
  WizardSlot,
} from '@/src/application/repositories/IBookingWizardRepository';
import { ALL_COURSES, ALL_INSTRUCTORS, ALL_SLOTS } from '@/src/data/mock/booking-wizard';

export class MockBookingWizardRepository implements IBookingWizardRepository {
  async getCourses(): Promise<WizardCourse[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return ALL_COURSES;
  }

  async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return ALL_INSTRUCTORS.filter((inst) => inst.coursesForSelected.includes(courseId));
  }

  async getSlotsByInstructor(instructorId: string): Promise<WizardSlot[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return ALL_SLOTS[instructorId] || [];
  }

  async createBooking(data: CreateWizardBookingData): Promise<Booking> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Mock createBooking:', data);
    
    const course = ALL_COURSES.find(c => c.id === data.courseId);
    const instructor = ALL_INSTRUCTORS.find(i => i.id === data.instructorId);
    const slot = ALL_SLOTS[data.instructorId]?.find(s => s.id === data.slotId);

    return {
      id: `booking-${Date.now()}`,
      studentId: 'user-001',
      studentName: 'Current User',
      instructorId: data.instructorId,
      instructorName: instructor?.name || '',
      courseId: data.courseId,
      courseName: course?.title || '',
      timeSlotId: data.slotId,
      scheduledDate: data.date,
      startTime: slot?.startTime || '',
      endTime: slot?.endTime || '',
      bookedHours: 0,
      status: 'pending',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
