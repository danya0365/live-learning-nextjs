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
        // TODO: Handle user ID from Auth context? 
        // The Repo should ideally assume the user is authenticated on server side or pass studentId.
        // But CreateWizardBookingData doesn't have studentId.
        // We might need to rely on the backend API to infer studentId from session.
        // But ApiBookingRepository.create expects CreateBookingData which HAS studentId.
        
        // Strategy: We call a specialized endpoint OR we duplicate the logic here.
        // If ApiBookingRepository.create needs studentId, and we don't have it here...
        // We should probably rely on the backend to set studentId from session.
        
        // Let's assume we can pass a placeholder 'me' or similar if API handles it.
        // Or we should update the interface CreateWizardBookingData to include studentId.
        // But for now, let's look at how Mock does it: 'user-001'.
        
        // I will assume for now we can't easily get studentId here without AuthStore.
        // But I can import useAuthStore? No, this is a class.
        
        // Better approach:
        // Use a new route POST /api/bookings/wizard which handles session extraction.
        // OR
        // Just call ApiBookingRepository.create with a placeholder and ensure backend overrides it with session user.
        
        // Let's go with creating via ApiBookingRepository and assume standard CreateBookingData.
        // We'll map CreateWizardBookingData -> CreateBookingData
        
        // Oops, I miss studentId.
        // I'll fetch 'me' profile first? 
        // No, that's slow.
        
        // Let's fetch the current user's profile ID via ApiProfileRepository?
        // const profileRepo = new ApiProfileRepository();
        // const profile = await profileRepo.getProfile();
        
        // This is safe.
        
        // But wait, I can just hardcode strict check or fix the repository interface later.
        // For now, let's fetch profile.
        
        const res = await fetch('/api/profiles/me');
        if(!res.ok) throw new Error('Not authenticated');
        const profile = await res.json();
        
        return this.bookingRepo.create({
            studentId: profile.id,
            instructorId: data.instructorId,
            courseId: data.courseId,
            timeSlotId: data.slotId,
            scheduledDate: data.date
        });
    }
}
