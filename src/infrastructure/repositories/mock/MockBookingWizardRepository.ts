import { Booking } from '@/src/application/repositories/IBookingRepository';
import {
    CreateWizardBookingData,
    IBookingWizardRepository,
    WizardCourse,
    WizardInstructor,
    WizardSlot,
} from '@/src/application/repositories/IBookingWizardRepository';

const ALL_COURSES: WizardCourse[] = [
  { id: 'course-001', title: 'พื้นฐาน React.js สำหรับผู้เริ่มต้น', level: 'beginner', rating: 4.8, totalStudents: 2450, price: 1990, tags: ['React', 'JavaScript', 'Frontend'], instructorId: 'inst-001', instructorName: 'อ.สมชาย พัฒนาเว็บ', durationMinutes: 120, categoryName: 'Web Development' },
  { id: 'course-002', title: 'Python AI & Machine Learning', level: 'intermediate', rating: 4.9, totalStudents: 1890, price: 3490, tags: ['Python', 'AI', 'Machine Learning'], instructorId: 'inst-002', instructorName: 'ดร.นภา AI วิจัย', durationMinutes: 120, categoryName: 'Data Science & AI' },
  { id: 'course-003', title: 'UX/UI Design Masterclass', level: 'beginner', rating: 4.7, totalStudents: 1560, price: 2490, tags: ['UX', 'UI', 'Figma', 'Design'], instructorId: 'inst-003', instructorName: 'อ.พิมพ์ลดา ดีไซน์', durationMinutes: 120, categoryName: 'Design' },
  { id: 'course-004', title: 'Node.js & Express Backend', level: 'intermediate', rating: 4.6, totalStudents: 980, price: 2990, tags: ['Node.js', 'Express', 'MongoDB'], instructorId: 'inst-001', instructorName: 'อ.สมชาย พัฒนาเว็บ', durationMinutes: 120, categoryName: 'Web Development' },
  { id: 'course-005', title: 'Flutter Mobile App Development', level: 'intermediate', rating: 4.5, totalStudents: 720, price: 2790, tags: ['Flutter', 'Dart', 'Mobile'], instructorId: 'inst-004', instructorName: 'อ.ธนกร โมบาย', durationMinutes: 120, categoryName: 'Mobile Development' },
  { id: 'course-006', title: 'Cybersecurity Fundamentals', level: 'advanced', rating: 4.9, totalStudents: 350, price: 4990, tags: ['Cybersecurity', 'Hacking', 'Security'], instructorId: 'inst-005', instructorName: 'อ.วีรภัทร ไซเบอร์', durationMinutes: 180, categoryName: 'Cybersecurity' },
];

const ALL_INSTRUCTORS: WizardInstructor[] = [
  { id: 'inst-001', name: 'อ.สมชาย พัฒนาเว็บ', specializations: ['React', 'Node.js', 'TypeScript'], rating: 4.8, totalStudents: 3430, hourlyRate: 800, isOnline: true, coursesForSelected: ['course-001', 'course-004', 'course-005'] },
  { id: 'inst-002', name: 'ดร.นภา AI วิจัย', specializations: ['Python', 'Machine Learning', 'Deep Learning'], rating: 4.9, totalStudents: 1890, hourlyRate: 1200, isOnline: false, coursesForSelected: ['course-002', 'course-006'] },
  { id: 'inst-003', name: 'อ.พิมพ์ลดา ดีไซน์', specializations: ['UX Design', 'UI Design', 'Figma'], rating: 4.7, totalStudents: 1560, hourlyRate: 700, isOnline: true, coursesForSelected: ['course-003', 'course-001', 'course-005'] },
  { id: 'inst-004', name: 'อ.ธนกร โมบาย', specializations: ['Flutter', 'React Native', 'Dart'], rating: 4.5, totalStudents: 720, hourlyRate: 650, isOnline: true, coursesForSelected: ['course-005', 'course-001', 'course-003'] },
  { id: 'inst-005', name: 'อ.วีรภัทร ไซเบอร์', specializations: ['Cybersecurity', 'Ethical Hacking'], rating: 4.9, totalStudents: 350, hourlyRate: 1500, isOnline: false, coursesForSelected: ['course-006', 'course-004', 'course-002'] },
];

const ALL_SLOTS: Record<string, WizardSlot[]> = {
  'inst-001': [
    { id: 'ts-001', dayOfWeek: 1, startTime: '09:00', endTime: '11:00', status: 'available' },
    { id: 'ts-002', dayOfWeek: 1, startTime: '13:00', endTime: '15:00', status: 'booked', bookedCourseId: 'course-001', bookedCourseName: 'พื้นฐาน React.js' },
    { id: 'ts-003', dayOfWeek: 3, startTime: '09:00', endTime: '11:00', status: 'available' },
    { id: 'ts-004', dayOfWeek: 3, startTime: '14:00', endTime: '16:00', status: 'available' },
    { id: 'ts-005', dayOfWeek: 5, startTime: '14:00', endTime: '16:00', status: 'booked', bookedCourseId: 'course-004', bookedCourseName: 'Node.js & Express' },
    { id: 'ts-006', dayOfWeek: 5, startTime: '09:00', endTime: '11:00', status: 'available' },
  ],
  'inst-002': [
    { id: 'ts-007', dayOfWeek: 2, startTime: '10:00', endTime: '12:00', status: 'booked', bookedCourseId: 'course-002', bookedCourseName: 'Python AI & ML' },
    { id: 'ts-008', dayOfWeek: 4, startTime: '10:00', endTime: '12:00', status: 'available' },
    { id: 'ts-009', dayOfWeek: 4, startTime: '14:00', endTime: '16:00', status: 'available' },
  ],
  'inst-003': [
    { id: 'ts-010', dayOfWeek: 1, startTime: '10:00', endTime: '12:00', status: 'booked', bookedCourseId: 'course-003', bookedCourseName: 'UX/UI Masterclass' },
    { id: 'ts-011', dayOfWeek: 3, startTime: '13:00', endTime: '15:00', status: 'available' },
    { id: 'ts-012', dayOfWeek: 6, startTime: '09:00', endTime: '12:00', status: 'available' },
  ],
  'inst-004': [
    { id: 'ts-013', dayOfWeek: 2, startTime: '18:00', endTime: '20:00', status: 'booked', bookedCourseId: 'course-005', bookedCourseName: 'Flutter Mobile' },
    { id: 'ts-014', dayOfWeek: 4, startTime: '18:00', endTime: '20:00', status: 'available' },
    { id: 'ts-015', dayOfWeek: 6, startTime: '10:00', endTime: '12:00', status: 'available' },
  ],
  'inst-005': [
    { id: 'ts-016', dayOfWeek: 6, startTime: '09:00', endTime: '12:00', status: 'booked', bookedCourseId: 'course-006', bookedCourseName: 'Cybersecurity' },
    { id: 'ts-017', dayOfWeek: 0, startTime: '13:00', endTime: '16:00', status: 'available' },
  ],
};

export class MockBookingWizardRepository implements IBookingWizardRepository {
  async getCourses(): Promise<WizardCourse[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return ALL_COURSES;
  }

  async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return ALL_INSTRUCTORS.filter((inst) => inst.coursesForSelected.includes(courseId));
  }

  async getSlotsByInstructor(instructorId: string): Promise<WizardSlot[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return ALL_SLOTS[instructorId] || [];
  }

  async createBooking(data: CreateWizardBookingData): Promise<Booking> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Mock createBooking:', data);
    
    const course = ALL_COURSES.find(c => c.id === data.courseId);
    const instructor = ALL_INSTRUCTORS.find(i => i.id === data.instructorId);
    const slot = ALL_SLOTS[data.instructorId]?.find(s => s.id === data.slotId);

    return {
      id: `booking-${Date.now()}`,
      studentId: 'user-001',
      studentName: 'Current User',
      instructorId: data.instructorId,
      instructorName: instructor?.name || '',
      courseId: data.courseId,
      courseName: course?.title || '',
      timeSlotId: data.slotId,
      scheduledDate: data.date,
      startTime: slot?.startTime || '',
      endTime: slot?.endTime || '',
      status: 'pending',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
