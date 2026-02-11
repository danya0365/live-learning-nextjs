/**
 * ICourseRepository
 * Repository interface for Course data access
 * Following Clean Architecture - Application layer
 */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  categoryName: string;
  level: CourseLevel;
  durationMinutes: number;
  price: number;
  rating: number;
  totalStudents: number;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  isLive: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseStats {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  totalStudents: number;
  averageRating: number;
}

export interface CreateCourseData {
  title: string;
  description: string;
  thumbnail?: string;
  categoryId: string;
  level: CourseLevel;
  durationMinutes: number;
  price: number;
  instructorId: string;
  tags?: string[];
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  thumbnail?: string;
  categoryId?: string;
  level?: CourseLevel;
  durationMinutes?: number;
  price?: number;
  isActive?: boolean;
  tags?: string[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface ICourseRepository {
  getById(id: string): Promise<Course | null>;
  getAll(): Promise<Course[]>;
  getPaginated(page: number, perPage: number): Promise<PaginatedResult<Course>>;
  getByCategory(categoryId: string): Promise<Course[]>;
  getByInstructorId(instructorId: string): Promise<Course[]>;
  getFeatured(): Promise<Course[]>;
  create(data: CreateCourseData): Promise<Course>;
  update(id: string, data: UpdateCourseData): Promise<Course>;
  delete(id: string): Promise<boolean>;
  getStats(): Promise<CourseStats>;
}
