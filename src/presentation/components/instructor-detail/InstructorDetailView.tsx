/**
 * InstructorDetailView
 * Instructor profile page with bio, courses, timeslots
 * Pure CSS — no react-spring
 */

'use client';

import { InstructorDetailViewModel } from '@/src/presentation/presenters/instructor-detail/InstructorDetailPresenter';
import { useInstructorDetailPresenter } from '@/src/presentation/presenters/instructor-detail/useInstructorDetailPresenter';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import InstructorDetailSkeleton from './InstructorDetailSkeleton';

const DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

interface InstructorDetailViewProps {
  instructorId: string;
  initialViewModel?: InstructorDetailViewModel;
}

export function InstructorDetailView({ instructorId, initialViewModel }: InstructorDetailViewProps) {
  const state = useInstructorDetailPresenter(instructorId, initialViewModel);
  const vm = state.viewModel;

  if (state.loading && !vm) {
    return <InstructorDetailSkeleton />;
  }

  if (state.error || !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่พบอาจารย์ท่านนี้</h1>
          <p className="text-text-muted mb-6">{state.error || 'ข้อมูลอาจารย์อาจถูกลบหรือไม่มีอยู่'}</p>
          <Link href="/instructors" className="btn-game px-6 py-3 text-white rounded-xl inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> กลับไปดูอาจารย์ทั้งหมด
          </Link>
        </div>
      </div>
    );
  }

  const { instructor, courses, timeSlots, availableSlots, bookedSlots } = vm;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/instructors" className="hover:text-primary transition-colors">🌟 อาจารย์</Link>
        <span>/</span>
        <span className="text-text-primary truncate">{instructor.name}</span>
      </nav>

      {/* Profile Header */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-xl">
              👨‍🏫
            </div>
            {instructor.isOnline && (
              <div className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2 py-1 rounded-full bg-success shadow-lg border-2 border-background">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span className="text-[10px] font-bold text-white">ONLINE</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-2">{instructor.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="text-warning text-xl">⭐</span>
              <span className="text-lg font-bold text-text-primary">{instructor.rating}</span>
              <span className="text-text-muted text-sm">({instructor.totalStudents.toLocaleString()} นักเรียน)</span>
            </div>
            <p className="text-text-secondary leading-relaxed mb-4">{instructor.bio}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {instructor.specializations.map((spec) => (
                <span key={spec} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{spec}</span>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex sm:flex-col gap-4 sm:gap-3">
            <div className="glass rounded-xl p-3 text-center min-w-[80px]">
              <div className="text-xl font-extrabold text-text-primary">{instructor.totalCourses}</div>
              <div className="text-[10px] text-text-muted">📚 คอร์ส</div>
            </div>
            <div className="glass rounded-xl p-3 text-center min-w-[80px]">
              <div className="text-xl font-extrabold text-text-primary">{instructor.totalStudents.toLocaleString()}</div>
              <div className="text-[10px] text-text-muted">👥 นักเรียน</div>
            </div>
            <div className="glass rounded-xl p-3 text-center min-w-[80px]">
              <div className="text-xl font-extrabold text-primary">฿{instructor.hourlyRate.toLocaleString()}</div>
              <div className="text-[10px] text-text-muted">💰 ต่อชม.</div>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="mt-6 pt-6 border-t border-border/30 flex items-center gap-3">
          <span className="text-sm text-text-muted">🌐 ภาษาที่สอน:</span>
          {instructor.languages.map((lang) => (
            <span key={lang} className="px-3 py-1 rounded-full bg-surface border border-border text-text-secondary text-xs font-medium">{lang}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Courses section */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4">📚 คอร์สที่สอน ({courses.length})</h2>
          {courses.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-text-muted">ยังไม่มีคอร์สในขณะนี้</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="glass rounded-xl p-4 flex gap-4 hover:scale-[1.01] transition-transform block"
                >
                  <div
                    className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, hsl(${course.id.charCodeAt(course.id.length - 1) * 15 + 200}, 70%, 55%), hsl(${course.id.charCodeAt(course.id.length - 1) * 15 + 250}, 60%, 40%))` }}
                  >
                    <span className="text-2xl opacity-80">
                      {course.tags[0] === 'React' ? '⚛️' : course.tags[0] === 'Python' ? '🐍' : course.tags[0] === 'UX' ? '🎨' : '📚'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-text-primary text-sm line-clamp-1">{course.title}</h3>
                      {course.isLiveFeature && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold">📡 คลาสเรียนสด</span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{course.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                      <span>⭐ {course.rating}</span>
                      <span>👥 {course.totalStudents.toLocaleString()}</span>
                      <span className="ml-auto font-bold text-primary">฿{course.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Timeslots section */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4">
            🕐 ตารางสอน
            <span className="text-sm font-normal text-text-muted ml-2">
              (ว่าง {availableSlots} / ทั้งหมด {timeSlots.length})
            </span>
          </h2>
          {timeSlots.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-text-muted">ไม่มีช่วงเวลาสอนในขณะนี้</p>
            </div>
          ) : (
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="glass rounded-xl p-4 border-l-4 border-l-success hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-text-primary text-sm">
                      วัน{DAY_NAMES[slot.dayOfWeek]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold">✅ ว่าง</span>
                  </div>
                  <div className="text-lg font-bold text-text-primary mb-1">{slot.startTime} - {slot.endTime}</div>
                  <button className="mt-2 w-full btn-game py-1.5 text-xs text-white rounded-lg font-medium">
                    📅 จองเวลานี้
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
