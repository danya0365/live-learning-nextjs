/**
 * HomePresenter
 * Handles business logic for the Home page
 * Aggregates data from multiple repositories
 */

import { Booking, IBookingRepository } from '@/src/application/repositories/IBookingRepository';
import { Category, ICategoryRepository } from '@/src/application/repositories/ICategoryRepository';
import { Course, ICourseRepository } from '@/src/application/repositories/ICourseRepository';
import { IInstructorRepository, Instructor } from '@/src/application/repositories/IInstructorRepository';
import { Metadata } from 'next';

export interface HomeViewModel {
  featuredCourses: Course[];
  topInstructors: Instructor[];
  categories: Category[];
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalInstructors: number;
    averageRating: number;
    onlineNow: number;
  };
}

export class HomePresenter {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly instructorRepository: IInstructorRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async getViewModel(): Promise<HomeViewModel> {
    try {
      const [featuredCourses, topInstructors, categories, courseStats, instructorStats] =
        await Promise.all([
          this.courseRepository.getFeatured(),
          this.instructorRepository.getTopRated(5),
          this.categoryRepository.getAll(),
          this.courseRepository.getStats(),
          this.instructorRepository.getStats(),
        ]);

      return {
        featuredCourses,
        topInstructors,
        categories,
        stats: {
          totalCourses: courseStats.totalItems,
          totalStudents: courseStats.totalStudents,
          totalInstructors: instructorStats.totalItems,
          averageRating: courseStats.averageRating,
          onlineNow: instructorStats.onlineNow,
        },
      };
    } catch (error) {
      console.error('Error getting home view model:', error);
      throw error;
    }
  }

  async getStudentDashboardData(studentId: string): Promise<{ bookings: Booking[] }> {
    try {
      const bookings = await this.bookingRepository.getByStudentId(studentId);
      return { bookings };
    } catch (error) {
      console.error('Error getting student dashboard data:', error);
      return { bookings: [] };
    }
  }

  async getInstructorDashboardData(instructorId: string): Promise<{ schedule: Booking[] }> {
    try {
      const schedule = await this.bookingRepository.getByInstructorId(instructorId);
      return { schedule };
    } catch (error) {
      console.error('Error getting instructor dashboard data:', error);
      return { schedule: [] };
    }
  }

  generateMetadata(): Metadata {
    return {
      title: 'Live Learning — เรียนสดออนไลน์กับอาจารย์ตัวจริง',
      description:
        'แพลตฟอร์มเรียนรู้สดออนไลน์ เลือกคอร์สที่ชอบ จองเวลาเรียนกับอาจารย์ผู้เชี่ยวชาญ พร้อมระบบจัดการเวลาอัจฉริยะ',
    };
  }
}
