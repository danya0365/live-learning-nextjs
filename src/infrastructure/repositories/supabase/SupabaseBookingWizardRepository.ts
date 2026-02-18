/**
 * SupabaseBookingWizardRepository
 * Implementation of IBookingWizardRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import { Booking } from "@/src/application/repositories/IBookingRepository";
import {
    CreateWizardBookingData,
    IBookingWizardRepository,
    WizardCourse,
    WizardInstructor,
    WizardSlot
} from "@/src/application/repositories/IBookingWizardRepository";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseBookingRepository } from "./SupabaseBookingRepository";
import { SupabaseCourseRepository } from "./SupabaseCourseRepository";
import { SupabaseInstructorRepository } from "./SupabaseInstructorRepository";

export class SupabaseBookingWizardRepository implements IBookingWizardRepository {
    private courseRepo: SupabaseCourseRepository;
    private instructorRepo: SupabaseInstructorRepository;
    private bookingRepo: SupabaseBookingRepository;

    constructor(private readonly supabase: SupabaseClient<Database>) {
        this.courseRepo = new SupabaseCourseRepository(supabase);
        this.instructorRepo = new SupabaseInstructorRepository(supabase);
        this.bookingRepo = new SupabaseBookingRepository(supabase);
    }

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
            durationMinutes: 120, 
            categoryName: c.categoryName || 'General',
        }));
    }

    async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
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
            hourlyRate: instructor.hourlyRate, 
            isOnline: instructor.isOnline,
            coursesForSelected: [courseId] 
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
        }));
    }

    async createBooking(data: CreateWizardBookingData): Promise<Booking> {
        // 🔒 Server-Injected Identity: resolve studentId from auth session
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: profile } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('auth_id', user.id)
            .single();

        if (!profile) throw new Error('Profile not found');
        
        // Pass studentId as separate parameter (Option A)
        return this.bookingRepo.create({
            instructorId: data.instructorId,
            courseId: data.courseId,
            timeSlotId: data.slotId,
            scheduledDate: data.date
        }, profile.id);
    }
}
