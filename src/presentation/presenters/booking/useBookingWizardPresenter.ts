import { WizardCourse, WizardInstructor, WizardSlot } from '@/src/application/repositories/IBookingWizardRepository';
import { Level } from '@/src/application/repositories/IConfigRepository';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClientConfigPresenter } from '../config/ConfigPresenterClientFactory';
import { createServerWalletPresenter } from '../wallet/WalletPresenterServerFactory'; // We need a way to get wallet from client, we'll use API or a separate fetch
// Since it's a client component, we'll fetch wallet via API
import { createClientBookingWizardPresenter } from './BookingWizardPresenterClientFactory';

export type BookingWizardStep = 'course' | 'instructor' | 'calendar' | 'confirm';

export interface BookingWizardState {
  step: BookingWizardStep;
  courses: WizardCourse[];
  availableInstructors: WizardInstructor[];
  calendarSlots: WizardSlot[];
  selectedCourse: WizardCourse | null;
  selectedInstructor: WizardInstructor | null;
  selectedSlot: WizardSlot | null;
  bookingAction: 'new' | 'join';
  isBooking: boolean;
  loading: boolean;
  levels: Level[];
  couponCode: string;
  isApplyingCoupon: boolean;
  couponError: string | null;
  discountAmount: number;
  finalPrice: number | null;
  isEnrolled: boolean;
  walletBalance: number;
  paymentMethod: 'stripe' | 'wallet';
  enrolledCourseIds: string[];
  enrollmentRemainingHours: number | null;
  weekOffset: number;
}

export interface BookingWizardActions {
  handleCourseSelect: (course: WizardCourse) => void;
  handleInstructorSelect: (instructor: WizardInstructor) => void;
  handleSlotSelect: (slot: WizardSlot) => void;
  nextWeek: () => void;
  prevWeek: () => void;
  resetWeek: () => void;
  handleConfirm: () => void;
  goBack: () => void;
  handleFinish: () => void;
  handleNewBooking: () => void;
  setCouponCode: (code: string) => void;
  applyCoupon: () => Promise<void>;
  setPaymentMethod: (method: 'stripe' | 'wallet') => void;
}

export function useBookingWizardPresenter(initialCourseId?: string | null) {
  const router = useRouter();
  const presenter = useMemo(() => createClientBookingWizardPresenter(), []);

  // State
  const [step, setStep] = useState<BookingWizardStep>('course');
  const [courses, setCourses] = useState<WizardCourse[]>([]);
  const [availableInstructors, setAvailableInstructors] = useState<WizardInstructor[]>([]);
  const [calendarSlots, setCalendarSlots] = useState<WizardSlot[]>([]);
  
  const [selectedCourse, setSelectedCourse] = useState<WizardCourse | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<WizardInstructor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<WizardSlot | null>(null);
  
  const [bookingAction, setBookingAction] = useState<'new' | 'join'>('new');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [levels, setLevels] = useState<Level[]>([]);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [enrollmentRemainingHours, setEnrollmentRemainingHours] = useState<number | null>(null);
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Initial Load
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const configPresenter = createClientConfigPresenter();
        
        // Fetch wallet balance
        const walletRes = await fetch('/api/wallet');
        let initialWalletBalance = 0;
        if (walletRes.ok) {
           const walletData = await walletRes.json();
           initialWalletBalance = walletData.wallet?.balance || 0;
        }

        const [c, l, enrollments] = await Promise.all([
            presenter.getCourses(),
            configPresenter.getLevels(),
            presenter.getMyEnrollments().catch(() => [])
        ]);
        setCourses(c);
        setLevels(l);
        setWalletBalance(initialWalletBalance);
        setEnrolledCourseIds(enrollments.map(e => e.courseId));
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [presenter]);

  // Actions
  const handleCourseSelect = useCallback(async (course: WizardCourse) => {
    setSelectedCourse(course);
    // Reset subsequent
    setSelectedInstructor(null);
    setSelectedSlot(null);
    setAvailableInstructors([]); 
    setIsEnrolled(false);
    
    // 2. Proactive Enrollment Check
    const [insts, enrollment] = await Promise.all([
        presenter.getInstructorsByCourse(course.id),
        presenter.checkEnrollment(course.id)
    ]);

    setAvailableInstructors(insts);
    if (enrollment && enrollment.isActive) {
        setIsEnrolled(true);
        setFinalPrice(0);
        setDiscountAmount(course.price);
        
        // Compute remaining hours (handle mapping if it comes back as snake_case from direct API calls)
        const total = enrollment.totalHours ?? (enrollment as any).total_hours ?? 0;
        const used = enrollment.usedHours ?? (enrollment as any).used_hours ?? 0;
        setEnrollmentRemainingHours(total - used);
    } else {
        setIsEnrolled(false);
        setFinalPrice(null);
        setDiscountAmount(0);
        setEnrollmentRemainingHours(null);
    }

    setStep('instructor');
  }, [presenter]);

  // Auto-select course if passed from URL
  useEffect(() => {
    if (initialCourseId && courses.length > 0 && !selectedCourse) {
      const match = courses.find(c => c.id === initialCourseId);
      if (match) {
        handleCourseSelect(match);
      }
    }
  }, [initialCourseId, courses, selectedCourse, handleCourseSelect]);

  const getWeekDates = useCallback((offset: number) => {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() + (offset * 7));
      
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      
      // Use Local Time formatting to avoid UTC boundary shifts (e.g. Midnight +7 timezone becomes previous day in UTC)
      const toLocalDateString = (d: Date) => {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
      };
      
      return { 
          startDateIso: toLocalDateString(start) + 'T00:00:00.000Z', 
          endDateIso: toLocalDateString(end) + 'T23:59:59.999Z' 
      };
  }, []);

  const fetchSlotsForWeek = useCallback(async (instructorId: string, offset: number) => {
      const { startDateIso, endDateIso } = getWeekDates(offset);
      const slots = await presenter.getSlotsByInstructor(instructorId, startDateIso, endDateIso);
      setCalendarSlots(slots);
  }, [presenter, getWeekDates]);

  const handleInstructorSelect = useCallback(async (instructor: WizardInstructor) => {
    setSelectedInstructor(instructor);
    setSelectedSlot(null);
    setWeekOffset(0);
    setStep('calendar');
  }, []);

  const nextWeek = useCallback(() => {
    setWeekOffset(prev => prev + 1);
  }, []);

  const prevWeek = useCallback(() => {
    setWeekOffset(prev => Math.max(0, prev - 1));
  }, []);

  const resetWeek = useCallback(() => {
    setWeekOffset(0);
  }, []);

  // Use a proper React effect to fetch slots when selection or offset changes
  useEffect(() => {
      if (selectedInstructor && step === 'calendar') {
          fetchSlotsForWeek(selectedInstructor.id, weekOffset);
      }
  }, [selectedInstructor, weekOffset, step, fetchSlotsForWeek]);

  const handleSlotSelect = useCallback((slot: WizardSlot) => {
    setSelectedSlot(slot);
    setBookingAction(slot.status === 'booked' ? 'join' : 'new');
    setStep('confirm');
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedCourse || !selectedInstructor || !selectedSlot) return;
    
    setIsBooking(true);
    // Create booking via API
    try {
        // Calculate the actual calendar date from the dayOfWeek and weekOffset
        const now = new Date();
        const currentDay = now.getDay();
        let diff = selectedSlot.dayOfWeek - currentDay;
        // If the day has already passed this week, schedule for next week
        if (diff < 0) diff += 7;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + diff + (weekOffset * 7));
        
        // Format to strict YYYY-MM-DD for backend to avoid timezone cast issues
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(targetDate.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        
        // If joining an existing class, book the course that is actively being taught
        const courseIdPayload = bookingAction === 'join' && selectedSlot.bookedCourseId
             ? selectedSlot.bookedCourseId
             : selectedCourse.id;

        const result = await presenter.initiateBookingTransaction({
            courseId: courseIdPayload,
            instructorId: selectedInstructor.id,
            slotId: selectedSlot.id, // This is the instructor_availability_id
            date: formattedDate,
            action: bookingAction,
            couponCode: couponCode ? couponCode : undefined,
            paymentMethod: paymentMethod // Pass the selected payment method
        });

        if (result.status === 'awaiting_payment' && result.checkoutUrl && paymentMethod === 'stripe') {
            // Redirect to Stripe
            window.location.href = result.checkoutUrl;
            return;
        }

        // If returned status is awaiting_payment but no checkout URL is here for Stripe,
        // or if it was wallet but error was thrown, it's caught in catch.
        // If wallet pays successfully, the backend sets status = 'succeeded' and finishes the flow, so we land here.
        
        setIsBooking(false);
        setBookingDone(true);

        // Update local wallet balance after successful wallet payment
        if (paymentMethod === 'wallet' && result.status !== 'awaiting_payment' && finalPrice !== 0 && (finalPrice || selectedCourse.price)) {
            setWalletBalance(prev => prev - (finalPrice !== null ? finalPrice : selectedCourse.price));
        }

    } catch (error: any) {
        console.error('Booking failed', error);
        alert(error.message || 'เกิดข้อผิดพลาดในการทำการจอง');
        setIsBooking(false);
    }
  }, [selectedCourse, selectedInstructor, selectedSlot, bookingAction, presenter, couponCode, paymentMethod, finalPrice]);

  const goBack = useCallback(() => {
    if (step === 'instructor') { setStep('course'); setSelectedInstructor(null); setAvailableInstructors([]); }
    else if (step === 'calendar') { setStep('instructor'); setSelectedSlot(null); setCalendarSlots([]); }
    else if (step === 'confirm') { setStep('calendar'); setSelectedSlot(null); }
  }, [step]);
  
  const handleFinish = useCallback(() => {
    router.push('/my-bookings');
  }, [router]);

  const handleNewBooking = useCallback(() => {
    setStep('course');
    setSelectedCourse(null);
    setSelectedInstructor(null);
    setSelectedSlot(null);
    setAvailableInstructors([]);
    setCalendarSlots([]);
    setBookingDone(false);
    setCouponCode('');
    setDiscountAmount(0);
    setFinalPrice(null);
    setCouponError(null);
    setIsEnrolled(false);
    setEnrollmentRemainingHours(null);
    setWeekOffset(0);
    setPaymentMethod('stripe'); // Reset to default
  }, []);

  const applyCoupon = useCallback(async () => {
    if (!couponCode || !selectedCourse) return;
    
    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          purchaseAmount: selectedCourse.price
        })
      });

      const data = await res.json();

      if (!res.ok || !data.isValid) {
        setCouponError(data.errorMessage || 'Invalid coupon code');
        setDiscountAmount(0);
        setFinalPrice(null);
      } else {
        setDiscountAmount(data.discountAmount);
        setFinalPrice(data.finalPrice);
        setCouponError(null);
      }
    } catch (e) {
      setCouponError('Failed to validate coupon');
      setDiscountAmount(0);
      setFinalPrice(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponCode, selectedCourse]);

  return {
    state: {
      step,
      courses,
      availableInstructors,
      calendarSlots,
      selectedCourse,
      selectedInstructor,
      selectedSlot,
      bookingAction,
      isBooking,
      bookingDone,
      loading,
      levels,
      couponCode,
      isApplyingCoupon,
      couponError,
      discountAmount,
      finalPrice,
      isEnrolled,
      walletBalance,
      paymentMethod,
      enrolledCourseIds,
      enrollmentRemainingHours,
      weekOffset
    },
    actions: {
      handleCourseSelect,
      handleInstructorSelect,
      handleSlotSelect,
      nextWeek,
      prevWeek,
      resetWeek,
      handleConfirm,
      goBack,
      handleFinish,
      handleNewBooking,
      setCouponCode,
      applyCoupon,
      setPaymentMethod
    }
  };
}
