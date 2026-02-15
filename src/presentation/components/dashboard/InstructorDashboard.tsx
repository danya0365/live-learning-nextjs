/**
 * InstructorDashboard — Redesigned to be consistent with HomeLandingView
 *
 * Layout pattern: max-w-7xl, page header, stat cards, sectioned content
 *
 * Priority order:
 * 1. 🟢 Active/starting classes → "เข้าสอนเลย"
 * 2. 📅 Upcoming classes to teach (with student count)
 * 3. ⏰ Manage schedule CTA
 */

'use client';

import { Booking } from '@/src/application/repositories/IBookingRepository';
import Link from 'next/link';

interface InstructorDashboardProps {
  userName: string;
  schedule?: Booking[];
}

export function InstructorDashboard({ userName, schedule = [] }: InstructorDashboardProps) {
  const liveClasses = schedule.filter(c => c.status === 'confirmed' && /* live logic */ false);
  const upcomingClasses = schedule.filter(c => c.status === 'confirmed');
  const totalStudents = schedule.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header — consistent with ScheduleView / HomeLandingView */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          สวัสดีครับ, {userName} 👨‍🏫
        </h1>
        <p className="text-text-secondary">
          {liveClasses.length > 0
            ? 'มีนักเรียนรอเรียนอยู่ — เข้าสอนได้เลย!'
            : `มี ${upcomingClasses.length} คลาสที่ต้องสอน • ${totalStudents} นักเรียนรอ`}
        </p>
      </div>

      {/* Stats Row — consistent with ScheduleView */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-text-primary">{schedule.length}</div>
          <div className="text-xs text-text-muted">📅 คลาสทั้งหมด</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-primary">{upcomingClasses.length}</div>
          <div className="text-xs text-text-muted">📋 คลาสสัปดาห์นี้</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-success">{totalStudents}</div>
          <div className="text-xs text-text-muted">👥 นักเรียนรอ</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-warning">{liveClasses.length}</div>
          <div className="text-xs text-text-muted">🟢 กำลังสอน</div>
        </div>
      </div>

      {/* Main content — 2-column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Classes */}
        <div className="lg:col-span-2 space-y-8">
          {/* 🟢 LIVE NOW */}
          {liveClasses.length > 0 && (
            <div>
              <SectionLabel icon="🟢" label="ห้องเรียนเปิดอยู่" count={liveClasses.length} />
              <div className="space-y-4 mt-4">
                {liveClasses.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/live/${cls.courseId}`}
                    className="block glass rounded-2xl p-5 border-2 border-success/40 bg-success/5 hover:bg-success/10 hover:shadow-xl hover:shadow-success/10 hover:scale-[1.01] transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
                      </span>
                      <span className="text-xs font-bold text-success uppercase tracking-wider">ห้องเรียนเปิดอยู่</span>
                      <span className="text-xs text-text-muted ml-auto">👥 1 นักเรียนรอ</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-success transition-colors mb-1">
                      {cls.courseName}
                    </h3>
                    <p className="text-text-muted text-sm mb-4">
                      {cls.startTime}—{cls.endTime} • {cls.scheduledDate}
                    </p>
                    <div className="bg-success hover:bg-success/90 text-center py-3 rounded-xl text-white font-bold text-sm transition-colors">
                      🟢 เข้าสอนเลย
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 📅 Upcoming classes — in a glass card container */}
          {upcomingClasses.length > 0 && (
            <div className="glass rounded-2xl p-5 sm:p-6">
              <SectionLabel icon="📅" label="คลาสที่ต้องสอน" count={upcomingClasses.length} />
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
                          {cls.startTime}—{cls.endTime} • 👥 1 นักเรียน
                        </p>
                      </div>

                      {/* Day label */}
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
                        {dayName}
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
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">ยังไม่มีคลาสที่ต้องสอน</h3>
              <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                กำหนดเวลาที่ว่างสอนเพื่อให้นักเรียนจองเรียนได้
              </p>
              <Link
                href="/schedule"
                className="inline-block btn-game px-8 py-3 text-white font-bold text-sm rounded-xl hover:scale-105 transition-transform"
              >
                ⏰ จัดตารางสอน
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          {/* Manage Schedule CTA */}
          <Link
            href="/schedule"
            className="block glass rounded-2xl p-6 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
          >
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-bold text-text-primary text-base group-hover:text-primary transition-colors mb-1">
              จัดตารางสอน
            </h3>
            <p className="text-text-muted text-xs">
              กำหนดเวลาที่ว่างสอนให้นักเรียนจอง
            </p>
          </Link>

          {/* Quick links */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-3">
              ลิงก์ด่วน
            </p>
            <div className="space-y-2">
              <QuickLink href="/schedule" icon="📅" label="ตารางสอนของฉัน" />
              <QuickLink href="/courses" icon="📚" label="คอร์สเรียน" />
              <QuickLink href="/consultations/board" icon="📋" label="บอร์ดปรึกษา" />
              <QuickLink href="/profile" icon="👤" label="โปรไฟล์" />
              <QuickLink href="/settings" icon="⚙️" label="ตั้งค่า" />
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
