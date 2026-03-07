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
            instructorId: '',
            instructorName: '',
            durationMinutes: 120, 
            categoryName: c.categoryName || 'General',
        }));
    }

    async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
        // Use junction table to get all instructors for this course
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

    async getSlotsByInstructor(instructorId: string): Promise<WizardSlot[]> {
        // 1. Get the base template availabilities
        const availabilities = await this.instructorRepo.getAvailabilities(instructorId);
        
        // 2. We need to check actual bookings to determine if a slot is REALLY available
        // For simplicity in this wizard, we'll return the templates but mark status 
        // dynamically based on overlapping bookings for the upcoming dates.
        
        // Get all active bookings for this instructor
        const { data: activeBookings } = await this.supabase
            .from('bookings')
            .select(`
                *,
                course:courses(title)
            `)
            .eq('instructor_profile_id', instructorId)
            .in('status', ['pending', 'confirmed']);
            
        // Get active live sessions for this instructor
        const { data: liveSessions } = await this.supabase
            .from('live_sessions')
            .select(`
                *,
                course:courses(title)
            `)
            .eq('instructor_profile_id', instructorId)
            .in('status', ['scheduled', 'live']);

        // Since the wizard currently works on a weekly template level (dayOfWeek), 
        // we'll check if there's ANY upcoming booking that blocks this template slot
        // in the near future (e.g., this week)
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return availabilities.map(a => {
            let status: 'available' | 'booked' | 'none' = 'available';
            let bookedCourseId: string | undefined = undefined;
            let bookedCourseName: string | undefined = undefined;

            // Check if this slot time generally overlaps with an active live session 
            // (very rough check - ideal logic should map specific dates)
            const isLive = liveSessions?.find(ls => {
                const lsDate = new Date(ls.scheduled_start);
                return lsDate.getDay() === a.dayOfWeek && 
                       lsDate.getHours() >= parseInt(a.startTime.split(':')[0]);
            });

            if (isLive) {
                 status = 'booked'; // or 'live' if UI supported it
                 bookedCourseId = isLive.course_id;
                 // Type coercion due to Supabase nested selection typing
                 bookedCourseName = (isLive.course as unknown as { title: string })?.title || 'Live Session';
            } else {
                 // Check if it's booked
                 const isBooked = activeBookings?.find(b => {
                     // Check if booking is for the same daily template
                     return b.instructor_availability_id === a.id;
                 });
                 if (isBooked) {
                     status = 'booked';
                     bookedCourseId = isBooked.course_id;
                     bookedCourseName = (isBooked.course as unknown as { title: string })?.title || 'Booked Class';
                 }
            }

            return {
                id: a.id,
                dayOfWeek: a.dayOfWeek,
                startTime: a.startTime,
                endTime: a.endTime,
                status: status,
                bookedCourseId: bookedCourseId,
                bookedCourseName: bookedCourseName
            };
        });
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
        // Note: SupabaseBookingRepository needs to be updated to accept instructor_availability_id instead of time_slot_id
        return this.bookingRepo.create({
            instructorId: data.instructorId,
            courseId: data.courseId,
            instructorAvailabilityId: data.slotId, // This is now actually an instructor_availability_id in the DB
            scheduledDate: data.date
        }, profile.id);
    }
}
