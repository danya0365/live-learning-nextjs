'use client';

import { CourseDetailViewModel } from '@/src/presentation/presenters/course-detail/CourseDetailPresenter';
import { useCourseDetailPresenter } from '@/src/presentation/presenters/course-detail/useCourseDetailPresenter';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CourseDetailSkeleton from './CourseDetailSkeleton';
import { EasyBookingModal } from './EasyBookingModal';

const DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

interface CourseDetailViewProps {
  courseId: string;
  initialViewModel?: CourseDetailViewModel;
}

export function CourseDetailView({ courseId, initialViewModel }: CourseDetailViewProps) {
  const router = useRouter();
  const state = useCourseDetailPresenter(courseId, initialViewModel);
  const vm = state.viewModel;

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);

  if (state.loading && !vm) {
    return <CourseDetailSkeleton />;
  }

  if (state.error || !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่พบคอร์สนี้</h1>
          <p className="text-text-muted mb-6">{state.error || 'คอร์สที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่'}</p>
          <Link href="/courses" className="btn-game px-6 py-3 text-white rounded-xl inline-block">
            ← กลับไปดูคอร์สทั้งหมด
          </Link>
        </div>
      </div>
    );
  }

  const { course, instructor, instructorTimeSlots, relatedCourses } = vm;

  const levelLabel = (l: string) =>
    l === 'beginner' ? '🟢 เริ่มต้น' : l === 'intermediate' ? '🟡 ปานกลาง' : '🔴 ขั้นสูง';
  
  const handleOpenBooking = (slotId?: string) => {
    setSelectedSlotId(slotId);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/courses" className="hover:text-primary transition-colors">📚 คอร์สเรียน</Link>
        <span>/</span>
        <span className="text-text-primary truncate">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - left 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero banner */}
          <div
            className="relative rounded-3xl overflow-hidden h-56 sm:h-72"
            style={{ background: `linear-gradient(135deg, hsl(${course.id.charCodeAt(course.id.length - 1) * 15 + 200}, 70%, 55%), hsl(${course.id.charCodeAt(course.id.length - 1) * 15 + 250}, 60%, 40%))` }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-60">{course.tags[0] === 'React' ? '⚛️' : course.tags[0] === 'Python' ? '🐍' : course.tags[0] === 'UX' ? '🎨' : course.tags[0] === 'Flutter' ? '📱' : '📚'}</span>
            </div>
            {course.isLive && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error/90 text-white text-sm font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                LIVE NOW
              </div>
            )}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg glass text-white text-sm font-medium">
              {levelLabel(course.level)}
            </div>
          </div>

          {/* Title & tags */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">{course.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{tag}</span>
              ))}
            </div>
            <p className="text-text-secondary leading-relaxed">{course.description}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '⭐', value: course.rating.toString(), label: 'คะแนน' },
              { icon: '👥', value: course.totalStudents.toLocaleString(), label: 'นักเรียน' },
              { icon: '⏱️', value: `${Math.round(course.durationMinutes / 60)} ชม.`, label: 'ระยะเวลา' },
              { icon: '🏷️', value: course.categoryName, label: 'หมวดหมู่' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-bold text-text-primary text-lg">{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Instructor timeslots */}
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-4">🕐 ตารางสอนของอาจารย์</h2>
            {instructorTimeSlots.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center">
                <p className="text-text-muted">ไม่มีช่วงเวลาสอนในขณะนี้</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {instructorTimeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`glass rounded-xl p-4 border-l-4 ${slot.isBooked ? 'border-l-warning' : 'border-l-success'} hover:scale-[1.01] transition-transform`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-text-primary text-sm">
                        วัน{DAY_NAMES[slot.dayOfWeek]}
                      </span>
                      {slot.isBooked ? (
                        <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-bold">📌 จองแล้ว</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold">✅ ว่าง</span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-text-primary">{slot.startTime} - {slot.endTime}</div>
                    {slot.isBooked && slot.bookedCourseName && (
                      <p className="text-xs text-text-muted mt-1">กำลังสอน: {slot.bookedCourseName}</p>
                    )}
                    {!slot.isBooked && (
                      <button
                        onClick={() => handleOpenBooking(slot.id)}
                        className="mt-2 w-full btn-game py-1.5 text-xs text-white rounded-lg font-medium"
                      >
                        จองเวลานี้
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related courses */}
          {relatedCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-4">📚 คอร์สที่เกี่ยวข้อง</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedCourses.map((rc) => (
                  <Link key={rc.id} href={`/courses/${rc.id}`} className="glass rounded-xl p-4 hover:scale-[1.02] transition-transform block">
                    <h3 className="font-bold text-text-primary text-sm mb-1 line-clamp-2">{rc.title}</h3>
                    <p className="text-xs text-text-muted mb-2 line-clamp-2">{rc.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">⭐ {rc.rating}</span>
                      <span className="font-bold text-primary">฿{rc.price.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - right col */}
        <div className="space-y-6">
          {/* Price card */}
          <div className="glass rounded-2xl p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="text-3xl font-extrabold text-primary mb-1">฿{course.price.toLocaleString()}</div>
              <p className="text-xs text-text-muted">ราคาต่อคอร์ส</p>
            </div>
            <button
              onClick={() => handleOpenBooking()}
              className="w-full btn-game py-3 text-white rounded-xl font-bold text-lg mb-3 hover:scale-105 transition-transform"
            >
              🎓 ลงทะเบียนเรียน
            </button>
            {course.isLive && (
              <button
                onClick={() => router.push(`/live/${course.id}`)}
                className="w-full py-3 rounded-xl border-2 border-error text-error font-bold hover:bg-error/10 transition-colors"
              >
                🔴 เข้าห้องเรียนสด
              </button>
            )}

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span>⏱️ ระยะเวลา</span>
                <span className="font-medium text-text-primary">{Math.round(course.durationMinutes / 60)} ชั่วโมง</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>📊 ระดับ</span>
                <span className="font-medium text-text-primary">{levelLabel(course.level)}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>👥 นักเรียน</span>
                <span className="font-medium text-text-primary">{course.totalStudents.toLocaleString()} คน</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>⭐ คะแนน</span>
                <span className="font-medium text-text-primary">{course.rating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Instructor card */}
          <Link href={`/instructors/${instructor.id}`} className="glass rounded-2xl p-6 block hover:scale-[1.02] transition-transform">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-4">👨‍🏫 อาจารย์ผู้สอน</h3>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-lg">
                👨‍🏫
              </div>
              <h4 className="font-bold text-text-primary text-lg">{instructor.name}</h4>
              <div className="flex items-center justify-center gap-1 mt-1 mb-3">
                <span className="text-warning">⭐</span>
                <span className="font-bold text-text-primary">{instructor.rating}</span>
              </div>
              {instructor.isOnline && (
                <div className="flex items-center justify-center gap-1 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <span className="text-xs font-bold text-success">ออนไลน์อยู่</span>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-1">
                {instructor.specializations.slice(0, 3).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {isBookingModalOpen && (
        <EasyBookingModal
          course={course}
          instructor={instructor}
          initialSlotId={selectedSlotId}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
}

