import { ChatMessage, LiveRoom, Participant } from '@/src/application/repositories/ILiveRoomRepository';

export const COURSE_DATA: Record<string, LiveRoom> = {
  'course-001': {
    id: 'course-001',
    title: 'พื้นฐาน React.js สำหรับผู้เริ่มต้น',
    instructor: 'อ.สมชาย พัฒนาเว็บ',
    instructorAvatar: '👨‍🏫',
    tags: ['React', 'JavaScript'],
    color: 'from-blue-500 to-purple-600',
    isLive: true,
    startTime: new Date().toISOString()
  },
  'course-003': {
    id: 'course-003',
    title: 'UX/UI Design Masterclass',
    instructor: 'อ.พิมพ์ลดา ดีไซน์',
    instructorAvatar: '👩‍🎨',
    tags: ['UX', 'UI', 'Figma'],
    color: 'from-pink-500 to-orange-400',
    isLive: true,
    startTime: new Date().toISOString()
  },
  'course-005': {
    id: 'course-005',
    title: 'Flutter Mobile App Development',
    instructor: 'อ.ธนกร โมบาย',
    instructorAvatar: '👨‍💻',
    tags: ['Flutter', 'Dart'],
    color: 'from-cyan-500 to-blue-600',
    isLive: true,
    startTime: new Date().toISOString()
  },
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', user: 'อ.สมชาย', avatar: '👨‍🏫', text: 'สวัสดีครับ ยินดีต้อนรับเข้าห้องเรียนสด!', time: '10:00', isInstructor: true },
  { id: '2', user: 'น้องมิน', avatar: '🧑‍💻', text: 'สวัสดีครับอาจารย์ 🙏', time: '10:01' },
  { id: '3', user: 'น้องแพร', avatar: '👩‍🎓', text: 'พร้อมเรียนค่ะ!', time: '10:01' },
  { id: '4', user: 'อ.สมชาย', avatar: '👨‍🏫', text: 'วันนี้เราจะมาเรียนเรื่อง Component Lifecycle กัน ทุกคนเปิด VS Code ได้เลยครับ', time: '10:02', isInstructor: true },
  { id: '5', user: 'กอล์ฟ', avatar: '🧑', text: 'พร้อมแล้วครับ', time: '10:02' },
];

export const PARTICIPANTS: Participant[] = [
  { id: '1', name: 'อ.สมชาย', avatar: '👨‍🏫', isInstructor: true },
  { id: '2', name: 'น้องมิน', avatar: '🧑‍💻' },
  { id: '3', name: 'น้องแพร', avatar: '👩‍🎓' },
  { id: '4', name: 'กอล์ฟ', avatar: '🧑' },
  { id: '5', name: 'เบลล์', avatar: '👧' },
  { id: '6', name: 'ไบร์ท', avatar: '🧑‍🦱' },
  { id: '7', name: 'มายด์', avatar: '👩' },
  { id: '8', name: 'โอ๊ต', avatar: '🧔' },
];
