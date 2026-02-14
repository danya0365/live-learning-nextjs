import { WizardCourse, WizardInstructor, WizardSlot } from '@/src/application/repositories/IBookingWizardRepository';
import { Level } from '@/src/application/repositories/IConfigRepository';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClientConfigPresenter } from '../config/ConfigPresenterClientFactory';
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
  bookingDone: boolean;
  loading: boolean;
  levels: Level[];
}

export interface BookingWizardActions {
  handleCourseSelect: (course: WizardCourse) => void;
  handleInstructorSelect: (instructor: WizardInstructor) => void;
  handleSlotSelect: (slot: WizardSlot) => void;
  handleConfirm: () => void;
  goBack: () => void;
  handleFinish: () => void;
  handleNewBooking: () => void;
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

  // Initial Load
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const configPresenter = createClientConfigPresenter();
        const [c, l] = await Promise.all([
            presenter.getCourses(),
            configPresenter.getLevels()
        ]);
        setCourses(c);
        setLevels(l);
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
    
    // Fetch instructors
    const insts = await presenter.getInstructorsByCourse(course.id);
    setAvailableInstructors(insts);

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
    // Mock booking call
    const booking = await presenter.createBooking({ // Using mock createBooking
        courseId: selectedCourse.id,
        instructorId: selectedInstructor.id,
        slotId: selectedSlot.id,
        date: new Date().toISOString(),
        action: bookingAction
    });
    
    if (booking) {
        setIsBooking(false);
        setBookingDone(true);
    }
  }, [selectedCourse, selectedInstructor, selectedSlot, bookingAction, presenter]);

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
  }, []);

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
      levels
    },
    actions: {
      handleCourseSelect,
      handleInstructorSelect,
      handleSlotSelect,
      handleConfirm,
      goBack,
      handleFinish,
      handleNewBooking
    }
  };
}
