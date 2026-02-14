export interface WizardCourse {
  id: string;
  title: string;
  level: string;
  rating: number;
  totalStudents: number;
  price: number;
  tags: string[];
  instructorId: string;
  instructorName: string;
  durationMinutes: number;
  categoryName: string;
}

export interface WizardInstructor {
  id: string;
  name: string;
  specializations: string[];
  rating: number;
  totalStudents: number;
  hourlyRate: number;
  isOnline: boolean;
  coursesForSelected: string[];
}

export interface WizardSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'none';
  bookedCourseName?: string;
  bookedCourseId?: string;
}

export interface CreateWizardBookingData {
  courseId: string;
  instructorId: string;
  slotId: string;
  date: string;
  action: 'new' | 'join';
}

import { Booking } from './IBookingRepository';

export interface IBookingWizardRepository {
  getCourses(): Promise<WizardCourse[]>;
  getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]>;
  getSlotsByInstructor(instructorId: string): Promise<WizardSlot[]>;
  createBooking(data: CreateWizardBookingData): Promise<Booking>;
}
