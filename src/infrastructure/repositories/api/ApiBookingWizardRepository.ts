/**
 * ApiBookingWizardRepository
 * Implements IBookingWizardRepository by orchestrating other API Repositories
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import { Booking } from "@/src/application/repositories/IBookingRepository";
import {
    CreateWizardBookingData,
    IBookingWizardRepository,
    WizardCourse,
    WizardInstructor,
    WizardSlot
} from "@/src/application/repositories/IBookingWizardRepository";
import { ApiBookingRepository } from "./ApiBookingRepository";
import { ApiCourseRepository } from "./ApiCourseRepository";
import { ApiInstructorRepository } from "./ApiInstructorRepository";

export class ApiBookingWizardRepository implements IBookingWizardRepository {
    private courseRepo = new ApiCourseRepository();
    private instructorRepo = new ApiInstructorRepository();
    private bookingRepo = new ApiBookingRepository();

    async getCourses(): Promise<WizardCourse[]> {
        const courses = await this.courseRepo.getAll();
        
        return courses.map(c => ({
            id: c.id,
            title: c.title,
            level: c.level,
            rating: c.rating,
            totalStudents: c.totalStudents,
            price: c.price,
            tags: c.tags,
            instructorId: c.instructorId || '',
            instructorName: c.instructorName || '',
            durationMinutes: 120, // TODO: Add duration to Course entity?
            categoryName: c.categoryName || 'General',
        }));
    }

    async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
        // Since schema is 1 course = 1 instructor, we fetch the course first
        const course = await this.courseRepo.getById(courseId);
        if (!course || !course.instructorId) return [];

        const instructor = await this.instructorRepo.getById(course.instructorId);
        if (!instructor) return [];

        return [{
            id: instructor.id,
            name: instructor.name,
            specializations: instructor.specializations,
            rating: instructor.rating,
            totalStudents: instructor.totalStudents,
            hourlyRate: instructor.hourlyRate, // TODO: Add to Instructor entity if missing
            isOnline: instructor.isOnline,
            coursesForSelected: [courseId] // Since we found via courseId
        }];
    }

    async getSlotsByInstructor(instructorId: string): Promise<WizardSlot[]> {
        const slots = await this.instructorRepo.getTimeSlots(instructorId);
        
        return slots.map(s => ({
            id: s.id,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            status: s.isBooked ? 'booked' : 'available',
            bookedCourseId: s.bookedCourseId
            // bookedCourseName: ... fetching this would require more N+1 calls, skipping for optimized wizard
        }));
    }

    async createBooking(data: CreateWizardBookingData): Promise<Booking> {
        // 🔒 Server-Injected Identity: studentId is resolved server-side from session
        return this.bookingRepo.create({
            instructorId: data.instructorId,
            courseId: data.courseId,
            timeSlotId: data.slotId,
            scheduledDate: data.date
        });
    }
}
