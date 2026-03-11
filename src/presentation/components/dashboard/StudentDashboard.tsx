/**
 * StudentDashboard — Redesigned to be consistent with HomeLandingView
 *
 * Layout pattern: max-w-7xl, page header, stat cards, sectioned content
 * 
 * Priority order:
 * 1. 🔴 Active/starting classes → "เข้าเรียนเลย"
 * 2. 📅 Upcoming booked classes
 * 3. ➕ Book a new class CTA
 */

'use client';

import { Booking } from '@/src/application/repositories/IBookingRepository';
import Link from 'next/link';

interface StudentDashboardProps {
  userName: string;
  bookings?: Booking[];
}

function isLive(_booking: Booking): boolean {
  // In real app, check current time vs start/end time
  return false;
}

export function StudentDashboard({ userName, bookings = [] }: StudentDashboardProps) {
  const liveClasses = bookings.filter(b => b.status === 'confirmed' && isLive(b));
  const upcomingClasses = bookings.filter(b => ('confirmed' === b.status || 'pending' === b.status) && !isLive(b));
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header — consistent with ScheduleView / HomeLandingView */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          สวัสดี, {userName} 👋
        </h1>
        <p className="text-text-secondary">
          {liveClasses.length > 0
            ? 'มีคลาสกำลังเริ่ม — เข้าเรียนได้เลย!'
            : upcomingClasses.length > 0
              ? `มี ${upcomingClasses.length} คลาสที่รอเรียน`
              : 'ยังไม่มีคลาส — จองเรียนเลย!'}
        </p>
      </div>

      {/* Stats Row — consistent with ScheduleView */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-text-primary">{bookings.length}</div>
          <div className="text-xs text-text-muted">📚 คลาสทั้งหมด</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-primary">{confirmedCount}</div>
          <div className="text-xs text-text-muted">✅ ยืนยันแล้ว</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-warning">{pendingCount}</div>
          <div className="text-xs text-text-muted">⏳ รอการยืนยัน</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-error">{liveClasses.length}</div>
          <div className="text-xs text-text-muted">🔴 กำลังสอนอยู่</div>
        </div>
      </div>

      {/* Main content — 2-column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Classes */}
        <div className="lg:col-span-2 space-y-8">
          {/* 🔴 LIVE NOW */}
          {liveClasses.length > 0 && (
            <div>
              <SectionLabel icon="🔴" label="กำลังสอนอยู่" count={liveClasses.length} />
              <div className="space-y-4">
                {liveClasses.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/live/${cls.courseId}`}
                    className="block glass rounded-2xl p-5 border-2 border-error/40 bg-error/5 hover:bg-error/10 hover:shadow-xl hover:shadow-error/10 hover:scale-[1.01] transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
                      </span>
                      <span className="text-xs font-bold text-error uppercase tracking-wider">กำลังสอนอยู่</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-error transition-colors mb-1">
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
            </div>
          )}

          {/* 📅 Upcoming — in a glass card container */}
          {upcomingClasses.length > 0 && (
            <div className="glass rounded-2xl p-5 sm:p-6">
              <SectionLabel icon="📅" label="คลาสที่จองไว้" count={upcomingClasses.length} />
              <div className="space-y-3 mt-4">
                {upcomingClasses.map((cls) => {
                  const dateObj = new Date(cls.scheduledDate);
                  const dayName = dateObj.toLocaleDateString('th-TH', { weekday: 'long' });
                  const dateStr = dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

                  return (
                    <div
                      key={cls.id}
                      className="rounded-xl p-4 bg-surface/50 border border-border/30 flex items-center gap-4 hover:bg-surface/80 transition-colors"
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
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        cls.status === 'confirmed' ? 'text-primary bg-primary/10' : 'text-warning bg-warning/10'
                      }`}>
                        {cls.status === 'confirmed' ? '✅ ยืนยัน' : '⏳ รอ'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {liveClasses.length === 0 && upcomingClasses.length === 0 && (
            <div className="glass rounded-2xl text-center py-16 px-6">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">ยังไม่มีคลาสที่จอง</h3>
              <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                จองคลาสเรียนกับอาจารย์ผู้เชี่ยวชาญ เลือกคอร์สแล้วจองเวลาได้เลย
              </p>
              <Link
                href="/book"
                className="inline-block btn-game px-8 py-3 text-white font-bold text-sm rounded-xl hover:scale-105 transition-transform"
              >
                📅 จองคลาสแรก
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          {/* Book CTA */}
          <Link
            href="/book"
            className="block glass rounded-2xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all text-center group"
          >
            <div className="text-3xl mb-3">➕</div>
            <h3 className="font-bold text-text-primary text-base group-hover:text-primary transition-colors mb-1">
              จองคลาสใหม่
            </h3>
            <p className="text-text-muted text-xs">
              เลือกคอร์ส → อาจารย์ → เวลา → เข้าเรียน
            </p>
          </Link>

          {/* Quick links */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-3">
              ลิงก์ด่วน
            </p>
            <div className="space-y-2">
              <QuickLink href="/courses" icon="📚" label="สำรวจคอร์สเรียน" />
              <QuickLink href="/instructors" icon="👨‍🏫" label="ดูอาจารย์ทั้งหมด" />
              <QuickLink href="/my-bookings" icon="📋" label="การจองของฉัน" />
              <QuickLink href="/schedule" icon="📅" label="ตารางเรียน" />
              <QuickLink href="/consultations" icon="💬" label="ปรึกษาอาจารย์" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared Sub-components ─────────────────── */

function SectionLabel({ icon, label, count }: { icon: string; label: string; count?: number }) {
  return (
    <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
      <span>{icon}</span> {label}
      {count !== undefined && (
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </h2>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-all duration-150"
    >
      <span className="text-base">{icon}</span>
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-text-muted text-xs">→</span>
    </Link>
  );
}
