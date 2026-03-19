export interface WizardCourse {
  id: string;
  title: string;
  level: string;
  rating: number;
  totalStudents: number;
  price: number;
  tags: string[];
  instructorId: string;
  instructorName: string;
  durationMinutes: number;
  categoryName: string;
}

export interface WizardInstructor {
  id: string;
  name: string;
  specializations: string[];
  rating: number;
  totalStudents: number;
  hourlyRate: number;
  isOnline: boolean;
  coursesForSelected: string[];
}

export interface WizardSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'none';
  bookedCourseName?: string;
  bookedCourseId?: string;
  bookedByCurrentUser?: boolean;
}

export interface InitiateWizardTransactionData {
  courseId: string;
  instructorId: string;
  slotId: string;
  date: string;
  action: 'new' | 'join';
  couponCode?: string;
  paymentMethod?: 'stripe' | 'wallet';
}

export interface WizardTransactionResult {
  bookingId?: string;
  paymentId?: string;
  finalPrice: number;
  status: 'success' | 'awaiting_payment';
  checkoutUrl?: string;
}

export interface IBookingWizardRepository {
  getCourses(): Promise<WizardCourse[]>;
  getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]>;
  getSlotsByInstructor(instructorId: string, startDateIso?: string, endDateIso?: string): Promise<WizardSlot[]>;
  initiateBookingTransaction(data: InitiateWizardTransactionData): Promise<WizardTransactionResult>;
}
