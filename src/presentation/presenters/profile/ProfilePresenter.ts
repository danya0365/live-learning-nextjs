/**
 * ProfilePresenter
 * Student profile with learning stats, achievements, and recent activity
 */

import {
    Booking,
    BookingStats,
    IBookingRepository,
} from '@/src/application/repositories/IBookingRepository';
import {
    Course,
    ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  level: string;
}

export interface LearningStats {
  totalHours: number;
  coursesCompleted: number;
  coursesInProgress: number;
  achievements: { icon: string; label: string; description: string }[];
}

export interface ProfileViewModel {
  profile: StudentProfile;
  bookingStats: BookingStats;
  learningStats: LearningStats;
  recentBookings: Booking[];
  recommendedCourses: Course[];
}

const DEMO_PROFILE: StudentProfile = {
  id: 'student-001',
  name: 'น้องมิน',
  email: 'min@example.com',
  avatar: '🧑‍💻',
  joinDate: '2025-09-15',
  level: 'Intermediate',
};

const DEMO_ACHIEVEMENTS = [
  { icon: '🎯', label: 'เรียนครบ 10 ชม.', description: 'เรียนสะสมครบ 10 ชั่วโมง' },
  { icon: '🔥', label: 'เข้าเรียน 7 วันติด', description: 'เข้าเรียนต่อเนื่อง 7 วัน' },
  { icon: '⭐', label: 'จองคอร์สแรก', description: 'จองคอร์สเรียนครั้งแรก' },
  { icon: '🏆', label: 'Top Student', description: 'ได้คะแนนสูงสุดในคลาส' },
];

export class ProfilePresenter {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async getViewModel(studentId: string): Promise<ProfileViewModel> {
    const [bookings, stats, allCourses] = await Promise.all([
      this.bookingRepository.getByStudentId(studentId),
      this.bookingRepository.getStats(),
      this.courseRepository.getAll(),
    ]);

    const recentBookings = bookings
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);

    const bookedCourseIds = new Set(bookings.map((b) => b.courseId));
    const recommendedCourses = allCourses
      .filter((c) => c.isActive && !bookedCourseIds.has(c.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    const learningStats: LearningStats = {
      totalHours: bookings.filter((b) => b.status === 'completed').length * 2,
      coursesCompleted: bookings.filter((b) => b.status === 'completed').length,
      coursesInProgress: bookings.filter((b) => b.status === 'confirmed').length,
      achievements: DEMO_ACHIEVEMENTS,
    };

    return {
      profile: DEMO_PROFILE,
      bookingStats: stats,
      learningStats,
      recentBookings,
      recommendedCourses,
    };
  }
}
