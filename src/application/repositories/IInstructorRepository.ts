/**
 * IInstructorRepository
 * Repository interface for Instructor data access
 * Following Clean Architecture - Application layer
 */

export interface TimeSlot {
  id: string;
  instructorId: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isBooked: boolean;
  bookedCourseId?: string;
  bookedCourseName?: string;
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
  getAll(): Promise<Instructor[]>;
  getPaginated(page: number, perPage: number): Promise<{ data: Instructor[]; total: number; page: number; perPage: number }>;
  getAvailable(): Promise<Instructor[]>;
  getTopRated(limit: number): Promise<Instructor[]>;
  getTimeSlots(instructorId: string): Promise<TimeSlot[]>;
  create(data: CreateInstructorData): Promise<Instructor>;
  update(id: string, data: UpdateInstructorData): Promise<Instructor>;
  delete(id: string): Promise<boolean>;
  getStats(): Promise<InstructorStats>;
}
