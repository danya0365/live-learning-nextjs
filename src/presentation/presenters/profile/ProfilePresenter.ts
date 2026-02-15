import {
    Booking,
    BookingStats,
    IBookingRepository,
} from '@/src/application/repositories/IBookingRepository';
import {
    Course,
    ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';
import { Achievement, IProfileRepository, UserProfile } from '@/src/application/repositories/IProfileRepository';

export interface LearningStats {
  totalHours: number;
  coursesCompleted: number;
  coursesInProgress: number;
  achievements: Achievement[];
}

export interface InstructorStats {
  classesThisWeek: number;
  totalStudents: number;
  totalTeachingHours: number;
  averageRating: number;
}

export interface ProfileViewModel {
  profile: UserProfile;
  bookingStats: BookingStats;
  learningStats: LearningStats;
  instructorStats?: InstructorStats;
  recentBookings: Booking[];
  recommendedCourses: Course[];
}

export class ProfilePresenter {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly profileRepository: IProfileRepository,
  ) {}

  async getViewModel(userId: string, roleOverride?: string): Promise<ProfileViewModel> {
    const [stats, authProfile, achievements] = await Promise.all([
      this.bookingRepository.getStats(),
      this.profileRepository.getById(userId),
      this.profileRepository.getAchievements(userId),
    ]);

    if (!authProfile) {
      throw new Error('Profile not found');
    }

    const role = (roleOverride as 'student' | 'instructor' | 'admin') || authProfile.role || 'student';
    const isInstructor = role === 'instructor';

    const profile: UserProfile = {
      id: authProfile.id,
      name: authProfile.fullName || 'Unknown',
      avatar: authProfile.avatarUrl || '👤',
      joinDate: authProfile.createdAt,
      level: (authProfile as any).level || (isInstructor ? 'Instructor' : 'Student'),
      role,
    };

    // Fetch role-specific booking data
    const bookings = isInstructor
      ? await this.bookingRepository.getByInstructorId(userId)
      : await this.bookingRepository.getByStudentId(userId);

    const recentBookings = bookings
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);

    // Student learning stats
    const learningStats: LearningStats = {
      totalHours: bookings.filter((b) => b.status === 'completed').length * 2,
      coursesCompleted: bookings.filter((b) => b.status === 'completed').length,
      coursesInProgress: bookings.filter((b) => b.status === 'confirmed').length,
      achievements,
    };

    // Instructor stats — computed from real data
    let instructorStats: InstructorStats | undefined;
    if (isInstructor) {
      const courses = await this.courseRepository.getByInstructorId(userId);

      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const classesThisWeek = bookings.filter((b) => {
        const d = new Date(b.scheduledDate);
        return d >= weekStart && d <= now && (b.status === 'confirmed' || b.status === 'completed');
      }).length;

      const uniqueStudents = new Set(bookings.map((b) => b.studentId));
      const totalTeachingHours = bookings.filter((b) => b.status === 'completed').length * 2;
      const averageRating = courses.length > 0
        ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length
        : 0;

      instructorStats = {
        classesThisWeek,
        totalStudents: uniqueStudents.size,
        totalTeachingHours,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    }

    // Recommended courses (student only)
    let recommendedCourses: Course[] = [];
    if (!isInstructor) {
      const allCourses = await this.courseRepository.getAll();
      const bookedCourseIds = new Set(bookings.map((b) => b.courseId));
      recommendedCourses = allCourses
        .filter((c) => c.isActive && !bookedCourseIds.has(c.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    }

    return {
      profile,
      bookingStats: stats,
      learningStats,
      instructorStats,
      recentBookings,
      recommendedCourses,
    };
  }
}
