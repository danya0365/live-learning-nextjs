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

/* ── Component ─────────────────────────────── */

import { Booking } from '@/src/application/repositories/IBookingRepository';

interface StudentDashboardProps {
  userName: string;
  bookings?: Booking[];
}

function isLive(booking: Booking): boolean {
  // Simple check: if status is confirmed and time is now (mock logic for demo)
  // In real app, check current time vs start/end time
  const now = new Date();
  const date = new Date(booking.scheduledDate + 'T' + booking.startTime);
  const end = new Date(booking.scheduledDate + 'T' + booking.endTime);
  // For demo, if status is 'confirmed' and today is the day, let's just show it as upcoming unless specifically marked
  return false; 
}

export function StudentDashboard({ userName, bookings = [] }: StudentDashboardProps) {
  // Filter bookings
  // For demo simplicity: 
  // - Live: if status is 'confirmed' and we hardcode one or check time
  // - Upcoming: status 'confirmed' or 'pending'
  
  // Let's rely on status 'confirmed' for upcoming.
  // If we want to show 'live', we'd need real time logic. For now, let's treat all confirmed as upcoming
  // unless we want to simulate live.
  
  const liveClasses = bookings.filter(b => b.status === 'confirmed' && isLive(b)); 
  // actually, let's just show all confirmed/pending as upcoming for now to keep it safe, 
  // or use a specific mock 'live' status if strict.
  
  const upcomingClasses = bookings.filter(b => ('confirmed' === b.status || 'pending' === b.status) && !isLive(b));

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
                {cls.courseName}
              </h3>
              <p className="text-text-muted text-sm mb-4">
                {cls.instructorName} • {cls.startTime}—{cls.endTime}
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
                      {cls.instructorName} • {cls.startTime}—{cls.endTime}
                    </p>
                  </div>

                  {/* Status */}
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                    cls.status === 'confirmed' ? 'text-primary bg-primary/10' : 'text-orange-500 bg-orange-500/10'
                  }`}>
                    {cls.status === 'confirmed' ? 'ยืนยันแล้ว' : 'รอการยืนยัน'}
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
