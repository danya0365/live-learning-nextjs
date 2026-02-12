/**
 * StudentDashboard — Focused view for students
 *
 * Priority order:
 * 1. 🔴 Active/starting classes → "เข้าเรียนเลย"
 * 2. 📅 Upcoming booked classes
 * 3. ➕ Book a new class CTA
 */

'use client';

import Link from 'next/link';
import { useMemo } from 'react';

/* ── Mock booked classes ──────────────────── */

interface BookedClass {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: 'live' | 'upcoming' | 'past';
  studentsJoined: number;
}

const DAY_LABELS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

function getNextDateForDay(dayOfWeek: number): Date {
  const now = new Date();
  const currentDay = now.getDay();
  let diff = dayOfWeek - currentDay;
  if (diff < 0) diff += 7;
  if (diff === 0) return now;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + diff);
  return nextDate;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}

const MOCK_BOOKED: BookedClass[] = [
  {
    id: 'bk-001',
    courseId: 'course-001',
    courseTitle: 'พื้นฐาน React.js สำหรับผู้เริ่มต้น',
    instructorName: 'อ.สมชาย พัฒนาเว็บ',
    dayOfWeek: new Date().getDay(), // today!
    startTime: '13:00',
    endTime: '15:00',
    status: 'live',
    studentsJoined: 5,
  },
  {
    id: 'bk-002',
    courseId: 'course-002',
    courseTitle: 'Python AI & Machine Learning',
    instructorName: 'ดร.นภา AI วิจัย',
    dayOfWeek: (new Date().getDay() + 2) % 7,
    startTime: '10:00',
    endTime: '12:00',
    status: 'upcoming',
    studentsJoined: 3,
  },
  {
    id: 'bk-003',
    courseId: 'course-004',
    courseTitle: 'Node.js & Express Backend',
    instructorName: 'อ.สมชาย พัฒนาเว็บ',
    dayOfWeek: (new Date().getDay() + 5) % 7,
    startTime: '14:00',
    endTime: '16:00',
    status: 'upcoming',
    studentsJoined: 2,
  },
];

/* ── Component ─────────────────────────────── */

export function StudentDashboard({ userName }: { userName: string }) {
  const liveClasses = useMemo(() => MOCK_BOOKED.filter((c) => c.status === 'live'), []);
  const upcomingClasses = useMemo(() => MOCK_BOOKED.filter((c) => c.status === 'upcoming'), []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1">
          สวัสดี, {userName} 👋
        </h1>
        <p className="text-text-secondary text-sm">
          {liveClasses.length > 0
            ? 'มีคลาสกำลังเริ่ม — เข้าเรียนได้เลย!'
            : upcomingClasses.length > 0
              ? `มี ${upcomingClasses.length} คลาสที่รอเรียน`
              : 'ยังไม่มีคลาส — จองเลย!'}
        </p>
      </div>

      {/* ---- 🔴 LIVE NOW ---- */}
      {liveClasses.length > 0 && (
        <div className="mb-6">
          {liveClasses.map((cls) => (
            <Link
              key={cls.id}
              href={`/live/${cls.courseId}`}
              className="block glass rounded-2xl p-5 border-2 border-red-500/40 bg-red-500/5 hover:bg-red-500/10 hover:shadow-xl hover:shadow-red-500/10 hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">กำลังสอนอยู่</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-red-500 transition-colors mb-1">
                {cls.courseTitle}
              </h3>
              <p className="text-text-muted text-sm mb-4">
                {cls.instructorName} • {cls.startTime}—{cls.endTime} • 👥 {cls.studentsJoined} คนในห้อง
              </p>
              <div className="btn-game text-center py-3 rounded-xl text-white font-bold text-sm">
                🔴 เข้าเรียนเลย
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ---- 📅 Upcoming ---- */}
      {upcomingClasses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            📅 คลาสที่จองไว้
          </h2>
          <div className="space-y-3">
            {upcomingClasses.map((cls) => {
              const nextDate = getNextDateForDay(cls.dayOfWeek);
              return (
                <div
                  key={cls.id}
                  className="glass rounded-2xl p-4 border border-border/50 flex items-center gap-4"
                >
                  {/* Date badge */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary/10 shrink-0">
                    <span className="text-[10px] text-primary font-bold uppercase">
                      {DAY_LABELS[cls.dayOfWeek].slice(0, 2)}
                    </span>
                    <span className="text-lg font-extrabold text-primary leading-none">
                      {formatDate(nextDate).split(' ')[0]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary text-sm truncate">
                      {cls.courseTitle}
                    </h3>
                    <p className="text-text-muted text-xs">
                      {cls.instructorName} • {cls.startTime}—{cls.endTime}
                    </p>
                  </div>

                  {/* Status */}
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                    {DAY_LABELS[cls.dayOfWeek]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- ➕ Book CTA ---- */}
      <Link
        href="/book"
        className="block glass rounded-2xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all text-center group"
      >
        <div className="text-3xl mb-2">➕</div>
        <h3 className="font-bold text-text-primary text-base group-hover:text-primary transition-colors mb-1">
          จองคลาสใหม่
        </h3>
        <p className="text-text-muted text-xs">
          เลือกคอร์ส → อาจารย์ → เวลา → เข้าเรียน
        </p>
      </Link>

      {/* ---- Empty state ---- */}
      {liveClasses.length === 0 && upcomingClasses.length === 0 && (
        <div className="text-center py-8 glass rounded-2xl border border-border/30 mt-4">
          <div className="text-5xl mb-3">📭</div>
          <h3 className="font-bold text-text-primary mb-1">ยังไม่มีคลาสที่จอง</h3>
          <p className="text-text-muted text-sm mb-4">จองคลาสเรียนกับอาจารย์ผู้เชี่ยวชาญ</p>
          <Link
            href="/book"
            className="inline-block btn-game px-6 py-2.5 text-white font-bold text-sm rounded-xl"
          >
            จองคลาสแรก
          </Link>
        </div>
      )}
    </div>
  );
}
