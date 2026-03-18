/**
 * ApiBookingWizardRepository
 * Implements IBookingWizardRepository by orchestrating other API Repositories
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    CreateWizardBookingData,
    IBookingWizardRepository,
    WizardBookingResult,
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
            instructorId: '', // No longer on course, resolved via junction table
            instructorName: '',
            durationMinutes: 120,
            categoryName: c.categoryName || 'General',
        }));
    }

    async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
        // Use the junction table to get all instructors for this course
        const instructors = await this.instructorRepo.getCourseInstructors(courseId);

        return instructors.map(instructor => ({
            id: instructor.id,
            name: instructor.name,
            specializations: instructor.specializations,
            rating: instructor.rating,
            totalStudents: instructor.totalStudents,
            hourlyRate: instructor.hourlyRate,
            isOnline: instructor.isOnline,
            coursesForSelected: [courseId]
        }));
    }

    async getSlotsByInstructor(instructorId: string, startDateIso?: string, endDateIso?: string): Promise<WizardSlot[]> {
        const url = new URL(`/api/booking-wizard/instructors/${instructorId}/slots`, window.location.origin);
        if (startDateIso) url.searchParams.append('startDateIso', startDateIso);
        if (endDateIso) url.searchParams.append('endDateIso', endDateIso);

        const res = await fetch(url.toString(), {
            // It's important not to cache date-specific requests by default across differing environments
            // if we are jumping dates fast.
            cache: 'no-store'
        });
        
        if (!res.ok) throw new Error('Failed to fetch wizard slots');
        return res.json();
    }

    async createBooking(data: CreateWizardBookingData): Promise<WizardBookingResult> {
        const res = await fetch('/api/booking-wizard/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create wizard booking');
        }
        
        return res.json();
    }
}
