/**
 * MockBookingRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    Booking,
    BookingStats,
    CreateBookingData,
    IBookingRepository,
    UpdateBookingData,
} from '@/src/application/repositories/IBookingRepository';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'book-001',
    studentId: 'student-001',
    studentName: 'น้องมิน',
    instructorId: 'inst-001',
    instructorName: 'อ.สมชาย พัฒนาเว็บ',
    courseId: 'course-001',
    courseName: 'พื้นฐาน React.js สำหรับผู้เริ่มต้น',
    timeSlotId: 'ts-002',
    scheduledDate: '2025-12-15',
    startTime: '13:00',
    endTime: '15:00',
    status: 'confirmed',
    isActive: true,
    createdAt: '2025-12-01T08:00:00.000Z',
    updatedAt: '2025-12-02T10:00:00.000Z',
  },
  {
    id: 'book-002',
    studentId: 'student-002',
    studentName: 'น้องเบล',
    instructorId: 'inst-002',
    instructorName: 'ดร.นภา AI วิจัย',
    courseId: 'course-002',
    courseName: 'Python AI & Machine Learning',
    timeSlotId: 'ts-005',
    scheduledDate: '2025-12-17',
    startTime: '10:00',
    endTime: '12:00',
    status: 'confirmed',
    isActive: true,
    createdAt: '2025-12-03T09:00:00.000Z',
    updatedAt: '2025-12-04T11:00:00.000Z',
  },
  {
    id: 'book-003',
    studentId: 'student-001',
    studentName: 'น้องมิน',
    instructorId: 'inst-003',
    instructorName: 'อ.พิมพ์ลดา ดีไซน์',
    courseId: 'course-003',
    courseName: 'UX/UI Design Masterclass',
    timeSlotId: 'ts-008',
    scheduledDate: '2025-12-16',
    startTime: '10:00',
    endTime: '12:00',
    status: 'pending',
    isActive: true,
    createdAt: '2025-12-05T07:30:00.000Z',
    updatedAt: '2025-12-05T07:30:00.000Z',
  },
  {
    id: 'book-004',
    studentId: 'student-003',
    studentName: 'น้องบอส',
    instructorId: 'inst-005',
    instructorName: 'อ.วีรภัทร ไซเบอร์',
    courseId: 'course-006',
    courseName: 'Cybersecurity Fundamentals',
    timeSlotId: 'ts-014',
    scheduledDate: '2025-12-20',
    startTime: '09:00',
    endTime: '12:00',
    status: 'completed',
    isActive: true,
    createdAt: '2025-11-25T06:00:00.000Z',
    updatedAt: '2025-12-20T12:00:00.000Z',
  },
  {
    id: 'book-005',
    studentId: 'student-004',
    studentName: 'น้องฟ้า',
    instructorId: 'inst-004',
    instructorName: 'อ.ธนกร โมบาย',
    courseId: 'course-005',
    courseName: 'Flutter Mobile App Development',
    timeSlotId: 'ts-011',
    scheduledDate: '2025-12-18',
    startTime: '18:00',
    endTime: '20:00',
    status: 'cancelled',
    isActive: false,
    createdAt: '2025-12-10T14:00:00.000Z',
    updatedAt: '2025-12-12T16:00:00.000Z',
  },
];

export class MockBookingRepository implements IBookingRepository {
  private items: Booking[] = [...MOCK_BOOKINGS];

  async getById(id: string): Promise<Booking | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(): Promise<Booking[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number) {
    await this.delay(100);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return { data: this.items.slice(start, end), total: this.items.length, page, perPage };
  }

  async getByStudentId(studentId: string): Promise<Booking[]> {
    await this.delay(100);
    return this.items.filter((item) => item.studentId === studentId);
  }

  async getByInstructorId(instructorId: string): Promise<Booking[]> {
    await this.delay(100);
    return this.items.filter((item) => item.instructorId === instructorId);
  }

  async getByCourseId(courseId: string): Promise<Booking[]> {
    await this.delay(100);
    return this.items.filter((item) => item.courseId === courseId);
  }

  async create(data: CreateBookingData): Promise<Booking> {
    await this.delay(200);
    const newItem: Booking = {
      id: `book-${Date.now()}`,
      ...data,
      studentName: '',
      instructorName: '',
      courseName: '',
      startTime: '',
      endTime: '',
      status: 'pending',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateBookingData): Promise<Booking> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Booking not found');
    const updatedItem: Booking = { ...this.items[index], ...data, updatedAt: new Date().toISOString() };
    this.items[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  async getStats(): Promise<BookingStats> {
    await this.delay(100);
    const totalItems = this.items.length;
    const activeItems = this.items.filter((i) => i.isActive).length;
    return {
      totalItems,
      activeItems,
      inactiveItems: totalItems - activeItems,
      pendingCount: this.items.filter((i) => i.status === 'pending').length,
      confirmedCount: this.items.filter((i) => i.status === 'confirmed').length,
      completedCount: this.items.filter((i) => i.status === 'completed').length,
      cancelledCount: this.items.filter((i) => i.status === 'cancelled').length,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockBookingRepository = new MockBookingRepository();
