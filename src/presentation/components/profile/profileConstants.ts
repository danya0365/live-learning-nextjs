export const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'ยืนยันแล้ว', color: 'text-success' },
  pending: { label: 'รอยืนยัน', color: 'text-warning' },
  completed: { label: 'เรียนจบ', color: 'text-primary' },
  cancelled: { label: 'ยกเลิก', color: 'text-error' },
};

export const ADMIN_TOOLS = [
  { href: '/courses', icon: '📚', label: 'จัดการคอร์สเรียนทั้งหมด', desc: 'เพิ่ม ลบ แก้ไข ข้อมูลคอร์ส' },
  { href: '/instructors', icon: '👨‍🏫', label: 'จัดการข้อมูลอาจารย์', desc: 'ตั้งค่าและดูรายชื่อผู้สอน' },
  { href: '/schedule', icon: '📅', label: 'ดูตารางเรียนทั้งหมด', desc: 'ดูการนัดหมายและตารางเวลาภาพรวม' },
  { href: '/live', icon: '🔴', label: 'ห้องเรียนสด', desc: 'ตรวจสอบคลาสที่กำลังสอน' },
  { href: '/settings', icon: '⚙️', label: 'ตั้งค่าระบบ', desc: 'ตั้งค่าพื้นฐานของแพลตฟอร์ม' },
];

export const INSTRUCTOR_QUICK_LINKS = [
  { href: '/schedule', icon: '📅', label: 'ตารางสอนของฉัน' },
  { href: '/live', icon: '🔴', label: 'ห้องเรียนสด' },
  { href: '/courses', icon: '📚', label: 'คอร์สทั้งหมด' },
  { href: '/settings', icon: '⚙️', label: 'ตั้งค่าบัญชี' },
  { href: '/support', icon: '🆘', label: 'ศูนย์ช่วยเหลือ' },
];

export const STUDENT_QUICK_LINKS = [
  { href: '/book', icon: '➕', label: 'จองคลาสใหม่' },
  { href: '/my-bookings', icon: '📋', label: 'การจองของฉัน' },
  { href: '/courses', icon: '📚', label: 'คอร์สทั้งหมด' },
  { href: '/live', icon: '🔴', label: 'ห้องเรียนสด' },
  { href: '/settings', icon: '⚙️', label: 'ตั้งค่าบัญชี' },
  { href: '/support', icon: '🆘', label: 'ศูนย์ช่วยเหลือ' },
];
