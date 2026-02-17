
/**
 * QA Checklist Store
 * Zustand store for tracking manual testing progress
 * Persisted to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TestCase {
  id: string;
  category: string;
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  completed: boolean;
  testedAt?: string;
  notes?: string;
}

export interface QAChecklistState {
  testCases: TestCase[];
  resetAll: () => void;
  toggleTest: (id: string) => void;
  addNote: (id: string, note: string) => void;
  getProgress: () => { completed: number; total: number; percentage: number };
  getCategoryProgress: (category: string) => { completed: number; total: number };
}

// Default test cases for Live Learning System
const defaultTestCases: TestCase[] = [
  // ============================================================
  // FLOW 1: STUDENT JOURNEY
  // ============================================================
  {
    id: 'st-1',
    category: '1. Student: Onboarding',
    title: 'Register New Student',
    description: 'Create a new student account',
    steps: [
      'Go to /auth/register',
      'Fill in Name, Email, Password',
      'Submit Form',
      'Verify Redirect to Home or Onboarding',
    ],
    expectedResult: 'Account created, logged in as Student',
    completed: false,
  },
  {
    id: 'st-2',
    category: '1. Student: Onboarding',
    title: 'Profile Setup',
    description: 'Complete student profile',
    steps: [
      'Go to /settings/profile',
      'Upload Avatar',
      'Fill Bio and Interests',
      'Save Changes',
    ],
    expectedResult: 'Profile updated, Avatar shows in Header',
    completed: false,
  },
  {
    id: 'st-3',
    category: '2. Student: Learning Flow',
    title: 'Browse & Search Courses',
    description: 'Find a course to book',
    steps: [
      'Go to /courses',
      'Search for "React" or "Design"',
      'Filter by Category',
      'Click on a result',
    ],
    expectedResult: 'Search results are accurate, Card click opens Detail',
    completed: false,
  },
  {
    id: 'st-4',
    category: '2. Student: Learning Flow',
    title: 'Book a Class',
    description: 'Complete booking process',
    steps: [
      'On Course Detail page, click "Book Now"',
      'Select Instructor',
      'Select Date & Time (Time Slot)',
      'Confirm Booking',
    ],
    expectedResult: 'Booking created, Redirect to Payment or Success',
    completed: false,
  },
  {
    id: 'st-5',
    category: '2. Student: Learning Flow',
    title: 'Payment (Mock)',
    description: 'Pay for the booking',
    steps: [
      'On Payment Page',
      'Enter Mock Card (4242...)',
      'Click Pay',
    ],
    expectedResult: 'Payment Success, Booking status -> Confirmed',
    completed: false,
  },
  {
    id: 'st-6',
    category: '2. Student: Learning Flow',
    title: 'Join Live Session',
    description: 'Attend the class',
    steps: [
      'Go to /my-bookings',
      'Find the confirmed booking',
      'Click "Join Live" (Test when time matches)',
      'Check Video/Audio',
    ],
    expectedResult: 'Successfully entered Live Room',
    completed: false,
  },

  // ============================================================
  // FLOW 2: INSTRUCTOR JOURNEY
  // ============================================================
  {
    id: 'in-1',
    category: '3. Instructor: Onboarding',
    title: 'Instructor Registration',
    description: 'Register as instructor (or switch role)',
    steps: [
      'Register new account OR use "Demo Instructor"',
      'If upgrading: Go to /settings -> Upgrade to Instructor',
      'Verify Header Badge shows "Instructor"',
    ],
    expectedResult: 'Logged in as Instructor',
    completed: false,
  },
  {
    id: 'in-2',
    category: '3. Instructor: Onboarding',
    title: 'Setup Public Profile',
    description: 'Configure teaching profile',
    steps: [
      'Go to /settings/instructor-profile (or equiv)',
      'Set Hourly Rate',
      'Set Expertises / Tags',
      'Save',
    ],
    expectedResult: 'Profile publicly visible in Instructor Directory',
    completed: false,
  },
  {
    id: 'in-3',
    category: '4. Instructor: Teaching',
    title: 'Manage Availability',
    description: 'Set time slots for teaching',
    steps: [
      'Go to /schedule (Manage)',
      'Select available days/times',
      'Save Schedule',
    ],
    expectedResult: 'Time slots appear in Student Booking flow',
    completed: false,
  },
  {
    id: 'in-4',
    category: '4. Instructor: Teaching',
    title: 'Dashboard & Earnings',
    description: 'Check dashboard stats',
    steps: [
      'Go to / (Instructor Home)',
      'Check "Upcoming Classes"',
      'Check "Total Earnings" (if implemented)',
    ],
    expectedResult: 'Stats match actual bookings',
    completed: false,
  },

  // ============================================================
  // FLOW 3: CONSULTATION SYSTEM (NEW)
  // ============================================================
  {
    id: 'cs-1',
    category: '5. Consultation Flow',
    title: '[Student] Post Request',
    description: 'Student asks for help',
    steps: [
      'Student: Go to /consultations',
      'Click "Post Request"',
      'Fill Title, Budget, Time',
      'Submit',
    ],
    expectedResult: 'Request appears in "My Requests" and Public Board',
    completed: false,
  },
  {
    id: 'cs-2',
    category: '5. Consultation Flow',
    title: '[Instructor] View & Offer',
    description: 'Instructor finds and offers help',
    steps: [
      'Instructor: Go to /consultations/board',
      'Find the Student\'s request',
      'Click "Make Offer"',
      'Submit Price & Message',
    ],
    expectedResult: 'Offer sent, Status updates',
    completed: false,
  },
  {
    id: 'cs-3',
    category: '5. Consultation Flow',
    title: '[Student] Accept Offer',
    description: 'Student accepts the offer',
    steps: [
      'Student: Open Request Detail',
      'See Instructor\'s Offer',
      'Click "Accept"',
    ],
    expectedResult: 'Booking created automatically',
    completed: false,
  },

  // ============================================================
  // EDGE CASES & EXTRAS
  // ============================================================
  {
    id: 'ex-1',
    category: '6. Edge Cases',
    title: 'Cancel Booking',
    description: 'Cancel a confirmed class',
    steps: [
      'Student: Go to My Bookings',
      'Click Cancel',
      'Verify status updates',
      'Instructor: Check Schedule (slot should be free)',
    ],
    expectedResult: 'Booking cancelled, Slot freed',
    completed: false,
  },
  {
    id: 'ex-2',
    category: '6. Edge Cases',
    title: 'Concurrent Profiles',
    description: 'Switch roles mid-session',
    steps: [
      'Login as User with BOTH roles',
      'Switch to Student -> Check Menu',
      'Switch to Instructor -> Check Menu',
    ],
    expectedResult: 'Context switches correctly without relogin',
    completed: false,
  },
];

export const useQAChecklistStore = create<QAChecklistState>()(
  persist(
    (set, get) => ({
      testCases: defaultTestCases,

      resetAll: () => {
        set({
          testCases: defaultTestCases.map(tc => ({
            ...tc,
            completed: false,
            testedAt: undefined,
            notes: undefined,
          })),
        });
      },

      toggleTest: (id: string) => {
        set(state => ({
          testCases: state.testCases.map(tc =>
            tc.id === id
              ? {
                  ...tc,
                  completed: !tc.completed,
                  testedAt: !tc.completed ? new Date().toISOString() : undefined,
                }
              : tc
          ),
        }));
      },

      addNote: (id: string, note: string) => {
        set(state => ({
          testCases: state.testCases.map(tc =>
            tc.id === id ? { ...tc, notes: note } : tc
          ),
        }));
      },

      getProgress: () => {
        const { testCases } = get();
        const completed = testCases.filter(tc => tc.completed).length;
        const total = testCases.length;
        return {
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      },

      getCategoryProgress: (category: string) => {
        const { testCases } = get();
        const categoryTests = testCases.filter(tc => tc.category === category);
        const completed = categoryTests.filter(tc => tc.completed).length;
        return { completed, total: categoryTests.length };
      },
    }),
    {
      name: 'qa-checklist-storage-live-learning', // Unique name for this app
    }
  )
);
