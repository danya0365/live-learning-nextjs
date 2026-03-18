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
}

export interface BookingWizardActions {
  handleCourseSelect: (course: WizardCourse) => void;
  handleInstructorSelect: (instructor: WizardInstructor) => void;
  handleSlotSelect: (slot: WizardSlot) => void;
  handleConfirm: () => void;
  goBack: () => void;
  handleFinish: () => void;
  handleNewBooking: () => void;
  setCouponCode: (code: string) => void;
  applyCoupon: () => Promise<void>;
  setPaymentMethod: (method: 'stripe' | 'wallet') => void;
}

export function useBookingWizardPresenter() {
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

        const [c, l] = await Promise.all([
            presenter.getCourses(),
            configPresenter.getLevels()
        ]);
        setCourses(c);
        setLevels(l);
        setWalletBalance(initialWalletBalance);
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
    } else {
        setIsEnrolled(false);
        setFinalPrice(null);
        setDiscountAmount(0);
    }

    setStep('instructor');
  }, [presenter]);

  const handleInstructorSelect = useCallback(async (instructor: WizardInstructor) => {
    setSelectedInstructor(instructor);
    setSelectedSlot(null);
    
    // Fetch slots
    const slots = await presenter.getSlotsByInstructor(instructor.id);
    setCalendarSlots(slots);
    
    setStep('calendar');
  }, [presenter]);

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
        // Calculate the actual calendar date from the dayOfWeek
        const now = new Date();
        const currentDay = now.getDay();
        let diff = selectedSlot.dayOfWeek - currentDay;
        // If the day has already passed this week, schedule for next week
        if (diff <= 0) diff += 7;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + diff);
        
        // If joining an existing class, book the course that is actively being taught
        const courseIdPayload = bookingAction === 'join' && selectedSlot.bookedCourseId
             ? selectedSlot.bookedCourseId
             : selectedCourse.id;

        const result = await presenter.createBooking({
            courseId: courseIdPayload,
            instructorId: selectedInstructor.id,
            slotId: selectedSlot.id, // This is the instructor_availability_id
            date: targetDate.toISOString(),
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
      paymentMethod
    },
    actions: {
      handleCourseSelect,
      handleInstructorSelect,
      handleSlotSelect,
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
