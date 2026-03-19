/**
 * SupabaseBookingWizardRepository
 * Implementation of IBookingWizardRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */
import {
    InitiateWizardTransactionData,
    IBookingWizardRepository,
    WizardTransactionResult,
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

    private async getActiveProfileId(): Promise<string | undefined> {
        const { data: activeProfiles, error } = await this.supabase.rpc('get_active_profile');
        if (error) {
            console.error('Error fetching active profile:', error);
            return undefined;
        }
        
        type ProfileResult = { id?: string };
        const profiles = activeProfiles as ProfileResult[] | ProfileResult | null;
        
        if (!profiles) return undefined;
        return Array.isArray(profiles) ? profiles[0]?.id : profiles.id;
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

    async getSlotsByInstructor(instructorId: string, startDateIso?: string, endDateIso?: string): Promise<WizardSlot[]> {
        // Get current active profile to check for duplicate bookings
        const activeProfileId = await this.getActiveProfileId();

        // 1. Get the base template availabilities
        const availabilities = await this.instructorRepo.getAvailabilities(instructorId);
        
        // 2. We need to check actual bookings to determine if a slot is REALLY available
        // For simplicity in this wizard, we'll return the templates but mark status 
        // dynamically based on overlapping bookings for the upcoming dates.
        
        // Get all active bookings for this instructor
        let bookingsQuery = this.supabase
            .from('bookings')
            .select(`
                *,
                course:courses(title)
            `)
            .eq('instructor_profile_id', instructorId)
            .in('status', ['pending', 'confirmed']);
            
        if (startDateIso && endDateIso) {
            bookingsQuery = bookingsQuery
                .gte('scheduled_date', startDateIso.split('T')[0])
                .lte('scheduled_date', endDateIso.split('T')[0]);
        }
            
        const { data: activeBookings } = await bookingsQuery;
            
        // Get active live sessions for this instructor
        let liveSessionsQuery = this.supabase
            .from('live_sessions')
            .select(`
                *,
                course:courses(title)
            `)
            .eq('instructor_profile_id', instructorId)
            .in('status', ['scheduled', 'live']);
            
        if (startDateIso && endDateIso) {
            liveSessionsQuery = liveSessionsQuery
                .gte('scheduled_start', startDateIso)
                .lte('scheduled_start', endDateIso);
        }
            
        const { data: liveSessions } = await liveSessionsQuery;

        // Note: The previous logic relied heavily on finding ANY active bookings matching the day of the week.
        // With date-bounded filtering, the queries correctly scope to the requested week!
        // Ensure week logic
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return availabilities.map(a => {
            let status: 'available' | 'booked' | 'none' = 'available';
            let bookedCourseId: string | undefined = undefined;
            let bookedCourseName: string | undefined = undefined;
            let bookedByCurrentUser = false;

            // Check if there's a live session already scheduled
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
                 
                 // Check if the current user has already booked for this availability
                 const userBooking = activeProfileId ? activeBookings?.find(b => 
                     b.instructor_availability_id === a.id && 
                     b.student_profile_id === activeProfileId
                 ) : undefined;
                 bookedByCurrentUser = !!userBooking;
            } else {
                 // Check if it's booked
                 const overlappingBookings = activeBookings?.filter(b => b.instructor_availability_id === a.id) || [];
                 if (overlappingBookings.length > 0) {
                     status = 'booked';
                     bookedCourseId = overlappingBookings[0].course_id;
                     bookedCourseName = (overlappingBookings[0].course as unknown as { title: string })?.title || 'Booked Class';
                     
                     // Check if any of these overlapping bookings belong to the current user
                     const userBooking = activeProfileId ? overlappingBookings.find(b => b.student_profile_id === activeProfileId) : undefined;
                     bookedByCurrentUser = !!userBooking;
                 }
            }

            return {
                id: a.id,
                dayOfWeek: a.dayOfWeek,
                startTime: a.startTime,
                endTime: a.endTime,
                status: status,
                bookedCourseId: bookedCourseId,
                bookedCourseName: bookedCourseName,
                bookedByCurrentUser: bookedByCurrentUser
            };
        });
    }

    async initiateBookingTransaction(data: InitiateWizardTransactionData): Promise<WizardTransactionResult> {
        // Get current active profile to resolve studentId from auth session
        const activeProfileId = await this.getActiveProfileId();
        if (!activeProfileId) throw new Error('Not authenticated');

        // Check finding existing enrollment
        const { data: enrollment, error: enrollError } = await this.supabase
            .from('enrollments')
            .select('total_hours, used_hours')
            .eq('student_profile_id', activeProfileId)
            .eq('course_id', data.courseId)
            .eq('is_active', true)
            .maybeSingle();

        if (enrollError) {
            console.error('Enrollment fetch error:', enrollError);
            throw new Error('เกิดข้อผิดพลาดในการตรวจสอบข้อมูลการลงทะเบียน (Fetch error)');
        }

        // Only check quota if an active enrollment actually exists
        if (enrollment && enrollment.used_hours >= enrollment.total_hours) {
            throw new Error('โควตาชั่วโมงเรียนสำหรับคอร์สนี้หมดแล้ว (Learning hours exhausted)');
        }

        // 1. Execute Atomic Transaction via RPC
        // This handles: Coupon Validation -> Payment (Pending/Succeeded) -> Enrollment -> Booking
        const { data: result, error: rpcError } = await this.supabase.rpc('process_wizard_transaction', {
            p_course_id: data.courseId,
            p_instructor_id: data.instructorId,
            p_slot_id: data.slotId,
            p_date: data.date,
            p_coupon_code: data.couponCode || undefined,
            p_payment_method: 'free' // Default, will be updated if Stripe is used
        });

        if (rpcError) {
            console.error('RPC Error:', rpcError);
            throw new Error(rpcError.message || 'Failed to process booking transaction');
        }

        const typedResult = result as any;

        return {
            bookingId: typedResult.booking_id,
            paymentId: typedResult.payment_id,
            finalPrice: typedResult.final_price,
            status: typedResult.status
        };
    }

    async updatePaymentMethod(paymentId: string, method: string): Promise<void> {
        await this.supabase.from('payments').update({ payment_method: method }).eq('id', paymentId);
    }

    async failPayment(paymentId: string): Promise<void> {
        await this.supabase.from('payments').update({ status: 'failed' }).eq('id', paymentId);
    }

    async payWithWallet(amount: number, paymentId: string, description: string): Promise<string> {
        const activeProfileId = await this.getActiveProfileId();
        if (!activeProfileId) throw new Error('Not authenticated');

        const { data: txId, error: walletError } = await this.supabase.rpc('pay_with_wallet', {
            p_profile_id: activeProfileId,
            p_amount: amount,
            p_reference_type: 'wizard_payment',
            p_reference_id: paymentId,
            p_description: description
        });

        if (walletError || !txId) {
            throw new Error(walletError?.message || 'Insufficient wallet balance');
        }

        return txId as unknown as string;
    }

    async fulfillWalletPayment(paymentId: string, txId: string, instructorId: string, slotId: string, date: string): Promise<{ bookingId?: string; enrollmentId?: string; }> {
        const { data: fulfillment, error: fulfillmentError } = await this.supabase.rpc('fulfill_stripe_payment', {
            p_payment_id: paymentId,
            p_transaction_id: txId,
            p_instructor_id: instructorId,
            p_slot_id: slotId,
            p_scheduled_date: date
        });

        if (fulfillmentError) {
            console.error("Wallet Fulfillment Error:", fulfillmentError);
            throw new Error('Failed to fulfill booking after wallet deduction');
        }

        return {
            bookingId: (fulfillment as any)?.booking_id,
            enrollmentId: (fulfillment as any)?.enrollment_id
        };
    }
}
