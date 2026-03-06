import { StudyRoomPage } from '@/src/presentation/components/study-room/StudyRoomPage';

export const metadata = {
  title: 'ห้องอ่านหนังสือ (Study Room) | Live Learning',
  description: 'โฟกัสกับการอ่านหนังสือด้วย Pomodoro Timer พร้อมบรรยากาศห้องเรียนเสมือนจริง',
};

export default function Page() {
  return <StudyRoomPage />;
}
