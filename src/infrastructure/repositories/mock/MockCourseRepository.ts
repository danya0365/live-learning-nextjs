/**
 * MockCourseRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    Course,
    CourseStats,
    CreateCourseData,
    ICourseRepository,
    PaginatedResult,
    UpdateCourseData,
} from '@/src/application/repositories/ICourseRepository';

const MOCK_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'พื้นฐาน React.js สำหรับผู้เริ่มต้น',
    description: 'เรียนรู้ React.js ตั้งแต่เริ่มต้น ครอบคลุม Component, State, Props, Hooks และการสร้าง Web App จริง',
    thumbnail: '/images/courses/react-basics.jpg',
    categoryId: 'cat-001',
    categoryName: 'Web Development',
    level: 'beginner',
    durationMinutes: 1200,
    price: 1990,
    rating: 4.8,
    totalStudents: 2450,
    instructorId: 'inst-001',
    instructorName: 'อ.สมชาย พัฒนาเว็บ',
    instructorAvatar: '/images/instructors/somchai.jpg',
    isLive: true,
    isActive: true,
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: '2025-01-15T10:30:00.000Z',
    updatedAt: '2025-06-20T14:00:00.000Z',
  },
  {
    id: 'course-002',
    title: 'Python AI & Machine Learning',
    description: 'เรียน Python สำหรับ AI และ Machine Learning ครบจบในคอร์สเดียว ตั้งแต่พื้นฐานจนถึง Deep Learning',
    thumbnail: '/images/courses/python-ai.jpg',
    categoryId: 'cat-002',
    categoryName: 'Data Science & AI',
    level: 'intermediate',
    durationMinutes: 1800,
    price: 3490,
    rating: 4.9,
    totalStudents: 1890,
    instructorId: 'inst-002',
    instructorName: 'ดร.นภา AI วิจัย',
    instructorAvatar: '/images/instructors/napa.jpg',
    isLive: false,
    isActive: true,
    tags: ['Python', 'AI', 'Machine Learning', 'Deep Learning'],
    createdAt: '2025-02-10T08:00:00.000Z',
    updatedAt: '2025-07-15T16:30:00.000Z',
  },
  {
    id: 'course-003',
    title: 'UX/UI Design Masterclass',
    description: 'ออกแบบ UX/UI อย่างมืออาชีพ เรียนรู้ Figma, Design System และการวิจัยผู้ใช้',
    thumbnail: '/images/courses/uxui-design.jpg',
    categoryId: 'cat-003',
    categoryName: 'Design',
    level: 'beginner',
    durationMinutes: 900,
    price: 2490,
    rating: 4.7,
    totalStudents: 1560,
    instructorId: 'inst-003',
    instructorName: 'อ.พิมพ์ลดา ดีไซน์',
    instructorAvatar: '/images/instructors/pimlada.jpg',
    isLive: true,
    isActive: true,
    tags: ['UX', 'UI', 'Figma', 'Design'],
    createdAt: '2025-03-05T09:00:00.000Z',
    updatedAt: '2025-08-10T11:00:00.000Z',
  },
  {
    id: 'course-004',
    title: 'Node.js & Express Backend',
    description: 'สร้าง RESTful API ด้วย Node.js, Express, MongoDB และ Authentication ระดับ Production',
    thumbnail: '/images/courses/nodejs-backend.jpg',
    categoryId: 'cat-001',
    categoryName: 'Web Development',
    level: 'intermediate',
    durationMinutes: 1500,
    price: 2990,
    rating: 4.6,
    totalStudents: 980,
    instructorId: 'inst-001',
    instructorName: 'อ.สมชาย พัฒนาเว็บ',
    instructorAvatar: '/images/instructors/somchai.jpg',
    isLive: false,
    isActive: true,
    tags: ['Node.js', 'Express', 'MongoDB', 'Backend'],
    createdAt: '2025-04-01T07:30:00.000Z',
    updatedAt: '2025-09-01T10:00:00.000Z',
  },
  {
    id: 'course-005',
    title: 'Flutter Mobile App Development',
    description: 'พัฒนา Mobile App ด้วย Flutter & Dart ทั้ง iOS และ Android พร้อม Firebase',
    thumbnail: '/images/courses/flutter-mobile.jpg',
    categoryId: 'cat-004',
    categoryName: 'Mobile Development',
    level: 'intermediate',
    durationMinutes: 1600,
    price: 2790,
    rating: 4.5,
    totalStudents: 720,
    instructorId: 'inst-004',
    instructorName: 'อ.ธนกร โมบาย',
    instructorAvatar: '/images/instructors/thanakorn.jpg',
    isLive: true,
    isActive: true,
    tags: ['Flutter', 'Dart', 'Mobile', 'Firebase'],
    createdAt: '2025-05-12T06:00:00.000Z',
    updatedAt: '2025-10-05T09:00:00.000Z',
  },
  {
    id: 'course-006',
    title: 'Cybersecurity Fundamentals',
    description: 'เรียนรู้พื้นฐานความปลอดภัยทางไซเบอร์ Ethical Hacking, Network Security และ Penetration Testing',
    thumbnail: '/images/courses/cybersecurity.jpg',
    categoryId: 'cat-005',
    categoryName: 'Cybersecurity',
    level: 'advanced',
    durationMinutes: 2000,
    price: 4990,
    rating: 4.9,
    totalStudents: 350,
    instructorId: 'inst-005',
    instructorName: 'อ.วีรภัทร ไซเบอร์',
    instructorAvatar: '/images/instructors/weerapat.jpg',
    isLive: false,
    isActive: true,
    tags: ['Cybersecurity', 'Hacking', 'Network Security'],
    createdAt: '2025-06-20T08:30:00.000Z',
    updatedAt: '2025-11-10T12:00:00.000Z',
  },
];

export class MockCourseRepository implements ICourseRepository {
  private items: Course[] = [...MOCK_COURSES];

  async getById(id: string): Promise<Course | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(): Promise<Course[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<Course>> {
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

  async getByCategory(categoryId: string): Promise<Course[]> {
    await this.delay(100);
    return this.items.filter((item) => item.categoryId === categoryId);
  }

  async getByInstructorId(instructorId: string): Promise<Course[]> {
    await this.delay(100);
    return this.items.filter((item) => item.instructorId === instructorId);
  }

  async getFeatured(): Promise<Course[]> {
    await this.delay(100);
    return this.items
      .filter((item) => item.isActive && item.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }

  async create(data: CreateCourseData): Promise<Course> {
    await this.delay(200);
    const newItem: Course = {
      id: `course-${Date.now()}`,
      ...data,
      thumbnail: data.thumbnail || '',
      categoryName: '',
      rating: 0,
      totalStudents: 0,
      instructorName: '',
      instructorAvatar: '',
      isLive: false,
      isActive: true,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateCourseData): Promise<Course> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Course not found');
    const updatedItem: Course = {
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

  async getStats(): Promise<CourseStats> {
    await this.delay(100);
    const totalItems = this.items.length;
    const activeItems = this.items.filter((item) => item.isActive).length;
    const totalStudents = this.items.reduce((sum, item) => sum + item.totalStudents, 0);
    const averageRating = this.items.reduce((sum, item) => sum + item.rating, 0) / totalItems;
    return {
      totalItems,
      activeItems,
      inactiveItems: totalItems - activeItems,
      totalStudents,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockCourseRepository = new MockCourseRepository();
