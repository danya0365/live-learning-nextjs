'use client';

import { ApiEnrollmentRepository } from '@/src/infrastructure/repositories/api/ApiEnrollmentRepository';
import { ApiPaymentRepository } from '@/src/infrastructure/repositories/api/ApiPaymentRepository';
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
  const [isEnrolling, setIsEnrolling] = useState(false);

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

  const { course, instructor, instructorTimeSlots, relatedCourses, enrollment, remainingHours } = vm;
  const isEnrolled = enrollment?.status === 'active';
  const hasRemainingHours = remainingHours > 0;

  const levelLabel = (l: string) =>
    l === 'beginner' ? '🟢 เริ่มต้น' : l === 'intermediate' ? '🟡 ปานกลาง' : '🔴 ขั้นสูง';

  const handleOpenBooking = (slotId?: string) => {
    if (!isEnrolled) return; // Payment gate
    setSelectedSlotId(slotId);
    setIsBookingModalOpen(true);
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const enrollmentRepo = new ApiEnrollmentRepository();
      const newEnrollment = await enrollmentRepo.createEnrollment({ courseId: course.id });

      if (course.price > 0) {
        // Redirect to Stripe checkout for enrollment payment
        const paymentRepo = new ApiPaymentRepository();
        const result = await paymentRepo.createCheckoutSession(newEnrollment.id);
        if (result.url) {
          window.location.href = result.url;
          return;
        }
      }

      // Free course → reload to show enrolled state
      window.location.reload();
    } catch (err) {
      console.error('Enrollment error:', err);
      setIsEnrolling(false);
    }
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
            {course.isLiveFeature && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/90 text-white text-sm font-bold shadow-lg backdrop-blur-sm">
                <span>📡 คลาสเรียนสด</span>
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

          {/* Interactive Lab CTA */}
          {course.hasInteractiveLab && (
            <div className="glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
              <div className="relative z-10 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">✨</span> ระบบเรียนรู้แบบ Interactive
                </h3>
                <p className="text-text-secondary text-sm sm:text-base">
                  คอร์สนี้มาพร้อมกับห้องปฏิบัติการจำลอง ให้คุณฝึกเขียนโค้ดและดูผลลัพธ์ได้ทันที
                </p>
              </div>
              <div className="relative z-10 w-full sm:w-auto shrink-0">
                <Link 
                  href={`/courses/${course.id}/learn`}
                  className="btn-game px-6 py-3 w-full sm:w-auto text-white rounded-xl font-bold text-center block shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] transition-shadow"
                >
                  🚀 เข้าสู่ Interactive Lab
                </Link>
              </div>
            </div>
          )}

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
                    className="glass rounded-xl p-4 border-l-4 border-l-success hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-text-primary text-sm">
                        วัน{DAY_NAMES[slot.dayOfWeek]}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold">✅ ว่าง</span>
                    </div>
                    <div className="text-lg font-bold text-text-primary">{slot.startTime} - {slot.endTime}</div>
                    
                    {isEnrolled && hasRemainingHours ? (
                        <button
                          onClick={() => handleOpenBooking(slot.id)}
                          className="mt-2 w-full btn-game py-1.5 text-xs text-white rounded-lg font-medium"
                        >
                          📅 จองเวลานี้
                        </button>
                      ) : isEnrolled && !hasRemainingHours ? (
                        <button
                          disabled
                          className="mt-2 w-full py-1.5 text-xs rounded-lg font-medium bg-border/30 text-text-muted cursor-not-allowed"
                        >
                          ⏱️ ชั่วโมงเรียนครบแล้ว
                        </button>
                      ) : (
                        <button
                          disabled
                          className="mt-2 w-full py-1.5 text-xs rounded-lg font-medium bg-border/30 text-text-muted cursor-not-allowed"
                        >
                          🔒 ต้องลงทะเบียนก่อนจอง
                        </button>
                      )
                    }
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* About Course */}
          {course.aboutCourse && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-4">📖 เกี่ยวกับคอร์สนี้</h2>
              <div className="glass rounded-2xl p-6 text-text-secondary leading-relaxed space-y-4">
                {course.aboutCourse.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-4">🎯 สิ่งที่คุณจะได้เรียนรู้</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3 glass rounded-xl p-4">
                    <span className="text-success mt-0.5">✅</span>
                    <span className="text-text-primary text-sm">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements & Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {course.requirements && course.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">⚠️ พื้นฐานที่ควรมี</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary inline-flex w-full">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {course.targetAudience && course.targetAudience.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">🧑‍💻 เหมาะสำหรับใคร</h2>
                <ul className="space-y-2">
                  {course.targetAudience.map((target, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary inline-flex w-full">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{target}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Syllabus */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-4">📋 เนื้อหาหลักสูตร</h2>
              <div className="space-y-3">
                {course.syllabus.map((module: any, i: number) => {
                  const hasLessons = module.lessons && module.lessons.length > 0;
                  
                  if (!hasLessons) {
                    return (
                      <div key={i} className="glass rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 font-bold text-text-primary">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                              {i + 1}
                            </span>
                            <span>{module.title}</span>
                          </div>
                          {module.duration && (
                            <span className="text-sm text-text-muted font-normal">{module.duration}</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <details key={i} className="group glass rounded-2xl overflow-hidden cursor-pointer" open={i === 0}>
                      <summary className="flex items-center justify-between p-5 font-bold text-text-primary hover:bg-white/5 transition-colors list-none">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                            {i + 1}
                          </span>
                          <span>{module.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-muted font-normal">
                          <span>{module.lessons?.length || 0} บทเรียน</span>
                          {module.duration && <span>{module.duration}</span>}
                          <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                        </div>
                      </summary>
                      <div className="p-5 pt-0 border-t border-white/5">
                        <ul className="space-y-3 mt-4">
                          {module.lessons?.map((lesson: string, j: number) => (
                            <li key={j} className="flex items-start justify-between text-sm text-text-secondary group/lesson">
                              <div className="flex items-start gap-3">
                                <span className="mt-0.5 opacity-50">▶</span>
                                <span className="group-hover/lesson:text-primary transition-colors">{lesson}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          )}

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
          {/* Price & Enrollment card */}
          <div className="glass rounded-2xl p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="text-3xl font-extrabold text-primary mb-1">฿{course.price.toLocaleString()}</div>
              <p className="text-xs text-text-muted">ราคาต่อคอร์ส</p>
            </div>

            {/* Enrollment Status Section */}
            {isEnrolled ? (
              <>
                {/* Enrolled — show status + hour tracking */}
                <div className="w-full py-3 rounded-xl bg-success/10 border border-success/30 text-center mb-3">
                  <div className="text-success font-bold text-lg">✅ ลงทะเบียนแล้ว</div>
                </div>

                {/* Hour tracking bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5">
                    <span>เรียนไปแล้ว</span>
                    <span className="font-bold text-text-primary">{enrollment!.usedHours} / {enrollment!.totalHours} ชม.</span>
                  </div>
                  <div className="w-full bg-border/30 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (enrollment!.usedHours / enrollment!.totalHours) * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    เหลืออีก <span className="font-bold text-primary">{remainingHours} ชม.</span>
                  </div>
                </div>
              </>
            ) : enrollment?.status === 'pending' ? (
              /* Pending payment */
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full btn-game py-3 text-white rounded-xl font-bold text-lg mb-3 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isEnrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังดำเนินการ...
                  </span>
                ) : (
                  '💳 ชำระเงินเพื่อเริ่มเรียน'
                )}
              </button>
            ) : (
              /* Not enrolled — Show enroll button */
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full btn-game py-3 text-white rounded-xl font-bold text-lg mb-3 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isEnrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังดำเนินการ...
                  </span>
                ) : (
                  '🎓 ลงทะเบียนเรียน'
                )}
              </button>
            )}

            {course.isLiveFeature && isEnrolled && (
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
          enrollment={enrollment!}
          initialSlotId={selectedSlotId}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
