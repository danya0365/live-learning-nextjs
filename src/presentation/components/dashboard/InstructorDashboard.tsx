/**
 * InstructorDashboard — Focused view for instructors
 *
 * Priority order:
 * 1. 🟢 Active/starting classes → "เข้าสอนเลย"
 * 2. 📅 Upcoming classes to teach (with student count)
 * 3. ⏰ Manage schedule CTA
 */

'use client';

import Link from 'next/link';

/* ── Component ─────────────────────────────── */

import { Booking } from '@/src/application/repositories/IBookingRepository';

interface InstructorDashboardProps {
  userName: string;
  schedule?: Booking[];
}

function normalizeStatus(booking: Booking, now: Date): 'live' | 'upcoming' {
    // Basic logic: if confirmed and time matches, it's live. Otherwise upcoming.
    // For demo/mock: 
    return 'upcoming';
}

export function InstructorDashboard({ userName, schedule = [] }: InstructorDashboardProps) {
  // In a real app, we would process the schedule to determine live vs upcoming based on current time
  // For this refactor, we will rely on the passed props or simple logic
  
  const liveClasses = schedule.filter(c => c.status === 'confirmed' && /* logic for live */ false);
  // For demo, assuming all confirmed bookings are upcoming for now unless we add specific live logic
  const upcomingClasses = schedule.filter(c => c.status === 'confirmed');
  
  const totalStudents = schedule.length; // Simplified: 1 booking = 1 student (or aggregate if course based)
  
  // Group bookings by course/time might be needed for a real dashboard, 
  // but for now we map 1:1 to keep it simple and matching the previous UI structure 
  // which showed "classes" not individual bookings. 
  // However, the repo returns Bookings.
  // The previous mock was "ScheduledClass" which implies a group.
  // We will map Bookings to the UI list.
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1">
          สวัสดีครับ, {userName} 👨‍🏫
        </h1>
        <p className="text-text-secondary text-sm">
          {liveClasses.length > 0
            ? 'มีนักเรียนรอเรียนอยู่ — เข้าสอนได้เลย!'
            : `มี ${upcomingClasses.length} คลาสที่ต้องสอน • ${totalStudents} นักเรียนรอ`}
        </p>
      </div>

      {/* ---- Quick Stats ---- */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass rounded-xl p-3 border border-border/50 text-center">
          <p className="text-xl font-extrabold text-primary">{upcomingClasses.length}</p>
          <p className="text-[10px] text-text-muted font-medium">คลาสสัปดาห์นี้</p>
        </div>
        <div className="glass rounded-xl p-3 border border-border/50 text-center">
          <p className="text-xl font-extrabold text-success">{totalStudents}</p>
          <p className="text-[10px] text-text-muted font-medium">นักเรียนรอ</p>
        </div>
        <div className="glass rounded-xl p-3 border border-border/50 text-center">
          <p className="text-xl font-extrabold text-warning">{liveClasses.length}</p>
          <p className="text-[10px] text-text-muted font-medium">กำลังสอน</p>
        </div>
      </div>

      {/* ---- 🟢 LIVE NOW ---- */}
      {liveClasses.length > 0 && (
        <div className="mb-6">
          {liveClasses.map((cls) => (
            <Link
              key={cls.id}
              href={`/live/${cls.courseId}`}
              className="block glass rounded-2xl p-5 border-2 border-green-500/40 bg-green-500/5 hover:bg-green-500/10 hover:shadow-xl hover:shadow-green-500/10 hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider">ห้องเรียนเปิดอยู่</span>
                <span className="text-xs text-text-muted ml-auto">👥 1 นักเรียนรอ</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-green-500 transition-colors mb-1">
                {cls.courseName}
              </h3>
              <p className="text-text-muted text-sm mb-4">
                {cls.startTime}—{cls.endTime} • {cls.scheduledDate}
              </p>
              <div className="bg-green-500 hover:bg-green-600 text-center py-3 rounded-xl text-white font-bold text-sm transition-colors">
                🟢 เข้าสอนเลย
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ---- 📅 Upcoming classes ---- */}
      {upcomingClasses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            📅 คลาสที่ต้องสอน
          </h2>
          <div className="space-y-3">
            {upcomingClasses.map((cls) => {
              const dateObj = new Date(cls.scheduledDate);
              const dayName = dateObj.toLocaleDateString('th-TH', { weekday: 'long' });
              const dateStr = dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

              return (
                <div
                  key={cls.id}
                  className="glass rounded-2xl p-4 border border-border/50 flex items-center gap-4"
                >
                  {/* Date badge */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary/10 shrink-0">
                    <span className="text-[10px] text-primary font-bold uppercase">
                      {dayName.slice(0, 2)}
                    </span>
                    <span className="text-lg font-extrabold text-primary leading-none">
                      {dateStr.split(' ')[0]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary text-sm truncate">
                      {cls.courseName}
                    </h3>
                    <p className="text-text-muted text-xs">
                      {cls.startTime}—{cls.endTime} • 👥 1 นักเรียน
                    </p>
                  </div>

                  {/* Day label */}
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- ⏰ Manage Schedule CTA ---- */}
      <Link
        href="/schedule"
        className="block glass rounded-2xl p-5 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
      >
        <div className="text-3xl mb-2">⏰</div>
        <h3 className="font-bold text-text-primary text-base group-hover:text-primary transition-colors mb-1">
          จัดตารางสอน
        </h3>
        <p className="text-text-muted text-xs">
          กำหนดเวลาที่ว่างสอนให้นักเรียนจอง
        </p>
      </Link>
    </div>
  );
}
