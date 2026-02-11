/**
 * MockInstructorRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    CreateInstructorData,
    IInstructorRepository,
    Instructor,
    InstructorStats,
    TimeSlot,
    UpdateInstructorData,
} from '@/src/application/repositories/IInstructorRepository';

const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-001',
    name: 'อ.สมชาย พัฒนาเว็บ',
    avatar: '/images/instructors/somchai.jpg',
    bio: 'Full-Stack Developer มากกว่า 10 ปี เชี่ยวชาญ React, Node.js, TypeScript อดีตวิศวกรที่ Google และสอนมามากกว่า 5,000 นักเรียน',
    specializations: ['React', 'Node.js', 'TypeScript', 'Next.js'],
    rating: 4.8,
    totalStudents: 3430,
    totalCourses: 5,
    isOnline: true,
    isActive: true,
    hourlyRate: 800,
    languages: ['ไทย', 'English'],
    createdAt: '2024-06-01T08:00:00.000Z',
    updatedAt: '2025-10-01T12:00:00.000Z',
  },
  {
    id: 'inst-002',
    name: 'ดร.นภา AI วิจัย',
    avatar: '/images/instructors/napa.jpg',
    bio: 'นักวิจัย AI ระดับปริญญาเอก จาก MIT เชี่ยวชาญ Machine Learning, Deep Learning, NLP ตีพิมพ์งานวิจัยระดับนานาชาติ 20+ บทความ',
    specializations: ['Python', 'Machine Learning', 'Deep Learning', 'NLP'],
    rating: 4.9,
    totalStudents: 1890,
    totalCourses: 3,
    isOnline: false,
    isActive: true,
    hourlyRate: 1200,
    languages: ['ไทย', 'English', '中文'],
    createdAt: '2024-08-15T09:00:00.000Z',
    updatedAt: '2025-09-20T15:00:00.000Z',
  },
  {
    id: 'inst-003',
    name: 'อ.พิมพ์ลดา ดีไซน์',
    avatar: '/images/instructors/pimlada.jpg',
    bio: 'UX/UI Designer อาวุโส จาก LINE MAN Wongnai เชี่ยวชาญ Figma, Design System, User Research และ Design Thinking',
    specializations: ['UX Design', 'UI Design', 'Figma', 'Design System'],
    rating: 4.7,
    totalStudents: 1560,
    totalCourses: 4,
    isOnline: true,
    isActive: true,
    hourlyRate: 700,
    languages: ['ไทย', 'English'],
    createdAt: '2024-10-01T10:00:00.000Z',
    updatedAt: '2025-11-05T14:00:00.000Z',
  },
  {
    id: 'inst-004',
    name: 'อ.ธนกร โมบาย',
    avatar: '/images/instructors/thanakorn.jpg',
    bio: 'Mobile Developer ผู้เชี่ยวชาญ Flutter & React Native พัฒนาแอปที่มียอดดาวน์โหลดรวมกว่า 1 ล้านครั้ง',
    specializations: ['Flutter', 'React Native', 'Dart', 'Swift'],
    rating: 4.5,
    totalStudents: 720,
    totalCourses: 2,
    isOnline: true,
    isActive: true,
    hourlyRate: 650,
    languages: ['ไทย', 'English'],
    createdAt: '2025-01-10T07:00:00.000Z',
    updatedAt: '2025-10-15T10:00:00.000Z',
  },
  {
    id: 'inst-005',
    name: 'อ.วีรภัทร ไซเบอร์',
    avatar: '/images/instructors/weerapat.jpg',
    bio: 'Cybersecurity Expert & Ethical Hacker ใบรับรอง CISSP, CEH, OSCP ที่ปรึกษาด้านความปลอดภัยให้หน่วยงานรัฐและธนาคาร',
    specializations: ['Cybersecurity', 'Ethical Hacking', 'Network Security', 'Penetration Testing'],
    rating: 4.9,
    totalStudents: 350,
    totalCourses: 2,
    isOnline: false,
    isActive: true,
    hourlyRate: 1500,
    languages: ['ไทย', 'English'],
    createdAt: '2025-03-01T06:00:00.000Z',
    updatedAt: '2025-11-20T08:00:00.000Z',
  },
];

const MOCK_TIME_SLOTS: TimeSlot[] = [
  // อ.สมชาย - Mon, Wed, Fri mornings
  { id: 'ts-001', instructorId: 'inst-001', dayOfWeek: 1, startTime: '09:00', endTime: '11:00', isBooked: false },
  { id: 'ts-002', instructorId: 'inst-001', dayOfWeek: 1, startTime: '13:00', endTime: '15:00', isBooked: true, bookedCourseId: 'course-001', bookedCourseName: 'พื้นฐาน React.js สำหรับผู้เริ่มต้น' },
  { id: 'ts-003', instructorId: 'inst-001', dayOfWeek: 3, startTime: '09:00', endTime: '11:00', isBooked: false },
  { id: 'ts-004', instructorId: 'inst-001', dayOfWeek: 5, startTime: '14:00', endTime: '16:00', isBooked: true, bookedCourseId: 'course-004', bookedCourseName: 'Node.js & Express Backend' },
  // ดร.นภา - Tue, Thu
  { id: 'ts-005', instructorId: 'inst-002', dayOfWeek: 2, startTime: '10:00', endTime: '12:00', isBooked: true, bookedCourseId: 'course-002', bookedCourseName: 'Python AI & Machine Learning' },
  { id: 'ts-006', instructorId: 'inst-002', dayOfWeek: 4, startTime: '10:00', endTime: '12:00', isBooked: false },
  { id: 'ts-007', instructorId: 'inst-002', dayOfWeek: 4, startTime: '14:00', endTime: '16:00', isBooked: false },
  // อ.พิมพ์ลดา - Mon, Wed, Sat
  { id: 'ts-008', instructorId: 'inst-003', dayOfWeek: 1, startTime: '10:00', endTime: '12:00', isBooked: true, bookedCourseId: 'course-003', bookedCourseName: 'UX/UI Design Masterclass' },
  { id: 'ts-009', instructorId: 'inst-003', dayOfWeek: 3, startTime: '13:00', endTime: '15:00', isBooked: false },
  { id: 'ts-010', instructorId: 'inst-003', dayOfWeek: 6, startTime: '09:00', endTime: '12:00', isBooked: false },
  // อ.ธนกร - Tue, Thu, Sat
  { id: 'ts-011', instructorId: 'inst-004', dayOfWeek: 2, startTime: '18:00', endTime: '20:00', isBooked: true, bookedCourseId: 'course-005', bookedCourseName: 'Flutter Mobile App Development' },
  { id: 'ts-012', instructorId: 'inst-004', dayOfWeek: 4, startTime: '18:00', endTime: '20:00', isBooked: false },
  { id: 'ts-013', instructorId: 'inst-004', dayOfWeek: 6, startTime: '10:00', endTime: '12:00', isBooked: false },
  // อ.วีรภัทร - Sat, Sun
  { id: 'ts-014', instructorId: 'inst-005', dayOfWeek: 6, startTime: '09:00', endTime: '12:00', isBooked: true, bookedCourseId: 'course-006', bookedCourseName: 'Cybersecurity Fundamentals' },
  { id: 'ts-015', instructorId: 'inst-005', dayOfWeek: 0, startTime: '13:00', endTime: '16:00', isBooked: false },
];

export class MockInstructorRepository implements IInstructorRepository {
  private items: Instructor[] = [...MOCK_INSTRUCTORS];
  private timeSlots: TimeSlot[] = [...MOCK_TIME_SLOTS];

  async getById(id: string): Promise<Instructor | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(): Promise<Instructor[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number) {
    await this.delay(100);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      data: this.items.slice(start, end),
      total: this.items.length,
      page,
      perPage,
    };
  }

  async getAvailable(): Promise<Instructor[]> {
    await this.delay(100);
    return this.items.filter((item) => item.isActive && item.isOnline);
  }

  async getTopRated(limit: number): Promise<Instructor[]> {
    await this.delay(100);
    return [...this.items]
      .filter((item) => item.isActive)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  async getTimeSlots(instructorId: string): Promise<TimeSlot[]> {
    await this.delay(100);
    return this.timeSlots.filter((slot) => slot.instructorId === instructorId);
  }

  async create(data: CreateInstructorData): Promise<Instructor> {
    await this.delay(200);
    const newItem: Instructor = {
      id: `inst-${Date.now()}`,
      ...data,
      avatar: data.avatar || '',
      rating: 0,
      totalStudents: 0,
      totalCourses: 0,
      isOnline: false,
      isActive: true,
      languages: data.languages || ['ไทย'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateInstructorData): Promise<Instructor> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Instructor not found');
    const updatedItem: Instructor = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
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

  async getStats(): Promise<InstructorStats> {
    await this.delay(100);
    const totalItems = this.items.length;
    const activeItems = this.items.filter((item) => item.isActive).length;
    const onlineNow = this.items.filter((item) => item.isOnline).length;
    const averageRating = this.items.reduce((sum, item) => sum + item.rating, 0) / totalItems;
    return {
      totalItems,
      activeItems,
      inactiveItems: totalItems - activeItems,
      onlineNow,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockInstructorRepository = new MockInstructorRepository();
