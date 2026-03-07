/**
 * IInstructorRepository
 * Repository interface for Instructor data access
 * Following Clean Architecture - Application layer
 */

export interface InstructorAvailability {
  id: string;
  instructorId: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specializations: string[];
  rating: number;
  totalStudents: number;
  totalCourses: number;
  isOnline: boolean;
  isActive: boolean;
  hourlyRate: number;
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InstructorStats {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  onlineNow: number;
  averageRating: number;
}

export interface InstructorReview {
  id: string;
  instructorId: string;
  studentName: string;
  studentAvatar: string;
  courseTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateInstructorData {
  name: string;
  avatar?: string;
  bio: string;
  specializations: string[];
  hourlyRate: number;
  languages?: string[];
}

export interface UpdateInstructorData {
  name?: string;
  avatar?: string;
  bio?: string;
  specializations?: string[];
  hourlyRate?: number;
  isOnline?: boolean;
  isActive?: boolean;
  languages?: string[];
}

export interface IInstructorRepository {
  getById(id: string): Promise<Instructor | null>;
  getPaginated(page: number, perPage: number): Promise<{ data: Instructor[]; total: number; page: number; perPage: number }>;
  getAvailable(): Promise<Instructor[]>;
  getTopRated(limit: number): Promise<Instructor[]>;
  getAvailabilities(instructorId: string): Promise<InstructorAvailability[]>;
  getCourseInstructors(courseId: string): Promise<Instructor[]>;
  addCourseToInstructor(instructorId: string, courseId: string): Promise<void>;
  removeCourseFromInstructor(instructorId: string, courseId: string): Promise<void>;
  getReviews(instructorId: string): Promise<InstructorReview[]>;
  create(data: CreateInstructorData): Promise<Instructor>;
  update(id: string, data: UpdateInstructorData): Promise<Instructor>;
  deleteAvailability(id: string): Promise<boolean>;
  addAvailability(instructorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<InstructorAvailability>;
  getStats(): Promise<InstructorStats>;
  getByProfileId(profileId: string): Promise<Instructor | null>;
}
