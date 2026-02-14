import {
    Booking,
    BookingStats,
    IBookingRepository,
} from '@/src/application/repositories/IBookingRepository';
import {
    Course,
    ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';
import { Achievement, IProfileRepository, StudentProfile } from '@/src/application/repositories/IProfileRepository';

export interface LearningStats {
  totalHours: number;
  coursesCompleted: number;
  coursesInProgress: number;
  achievements: Achievement[];
}

export interface ProfileViewModel {
  profile: StudentProfile;
  bookingStats: BookingStats;
  learningStats: LearningStats;
  recentBookings: Booking[];
  recommendedCourses: Course[];
}

export class ProfilePresenter {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly profileRepository: IProfileRepository,
  ) {}

  async getViewModel(studentId: string): Promise<ProfileViewModel> {
    const [bookings, stats, allCourses, profile, achievements] = await Promise.all([
      this.bookingRepository.getByStudentId(studentId),
      this.bookingRepository.getStats(),
      this.courseRepository.getAll(),
      this.profileRepository.getProfile(studentId),
      this.profileRepository.getAchievements(studentId),
    ]);

    if (!profile) {
      throw new Error('Profile not found');
    }

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
      achievements,
    };

    return {
      profile,
      bookingStats: stats,
      learningStats,
      recentBookings,
      recommendedCourses,
    };
  }
}
