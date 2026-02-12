/**
 * ProfileView
 * Role-aware profile dashboard:
 * - Student: learning stats, achievements, recent bookings, course recommendations
 * - Instructor: teaching stats, upcoming classes, quick links to schedule/live
 * Pure CSS — no react-spring
 */

'use client';

import { ProfileViewModel } from '@/src/presentation/presenters/profile/ProfilePresenter';
import { useProfilePresenter } from '@/src/presentation/presenters/profile/useProfilePresenter';
import { useAuthStore, type AuthUser } from '@/src/stores/authStore';
import Link from 'next/link';

interface ProfileViewProps {
  initialViewModel?: ProfileViewModel;
  /** If provided, overlays auth user info on the profile */
  authUser?: AuthUser | null;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'ยืนยันแล้ว', color: 'text-success' },
  pending: { label: 'รอยืนยัน', color: 'text-warning' },
  completed: { label: 'เรียนจบ', color: 'text-primary' },
  cancelled: { label: 'ยกเลิก', color: 'text-error' },
};

export function ProfileView({ initialViewModel, authUser }: ProfileViewProps) {
  const state = useProfilePresenter(initialViewModel);
  const vm = state.viewModel;
  const { user: storeUser } = useAuthStore();
  const currentUser = authUser || storeUser;
  const isInstructor = currentUser?.role === 'instructor';

  if (state.loading && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">🧑‍💻</div>
          <p className="text-text-secondary text-lg">กำลังโหลดโปรไฟล์...</p>
        </div>
      </div>
    );
  }

  if (state.error && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error font-medium mb-2">เกิดข้อผิดพลาด</p>
          <button onClick={() => state.loadData()} className="btn-game px-6 py-2 text-white rounded-xl">ลองใหม่</button>
        </div>
      </div>
    );
  }

  if (!vm) return null;

  // Overlay auth user info if available
  const profile = authUser
    ? { ...vm.profile, name: authUser.name, email: authUser.email, avatar: authUser.avatar, level: authUser.level, joinDate: authUser.joinDate }
    : vm.profile;
  const { learningStats, recentBookings, recommendedCourses } = vm;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile header */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-lg shadow-primary/25">
            {profile.avatar}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1">{profile.name}</h1>
            <p className="text-text-secondary mb-2">{profile.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
                📊 {profile.level}
              </span>
              <span className="text-xs text-text-muted">
                🗓️ เข้าร่วมเมื่อ {new Date(profile.joinDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {isInstructor ? (
              <>
                <Link href="/schedule" className="px-4 py-2 rounded-xl glass text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                  📅 ตารางสอน
                </Link>
                <Link href="/live" className="btn-game px-4 py-2 text-white rounded-xl text-sm font-bold">
                  🔴 เข้าสอน
                </Link>
              </>
            ) : (
              <>
                <Link href="/my-bookings" className="px-4 py-2 rounded-xl glass text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                  📋 การจอง
                </Link>
                <Link href="/courses" className="btn-game px-4 py-2 text-white rounded-xl text-sm font-bold">
                  📚 เรียนต่อ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid — role-aware */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {isInstructor ? (
          <>
            {[
              { icon: '🏫', value: '12 คลาส', label: 'สอนสัปดาห์นี้', color: 'text-primary' },
              { icon: '👥', value: '48 คน', label: 'นักเรียนทั้งหมด', color: 'text-success' },
              { icon: '⏱️', value: '156 ชม.', label: 'ชั่วโมงสอนรวม', color: 'text-warning' },
              { icon: '⭐', value: '4.8', label: 'คะแนนเฉลี่ย', color: 'text-secondary' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center hover:scale-[1.02] transition-transform">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </>
        ) : (
          <>
            {[
              { icon: '⏱️', value: `${learningStats.totalHours} ชม.`, label: 'เวลาเรียนรวม', color: 'text-primary' },
              { icon: '🎓', value: learningStats.coursesCompleted, label: 'เรียนจบแล้ว', color: 'text-success' },
              { icon: '📖', value: learningStats.coursesInProgress, label: 'กำลังเรียน', color: 'text-warning' },
              { icon: '🏅', value: learningStats.achievements.length, label: 'เหรียญรางวัล', color: 'text-secondary' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center hover:scale-[1.02] transition-transform">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Achievements + Recent */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              🏆 เหรียญรางวัล
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {learningStats.achievements.map((ach) => (
                <div key={ach.label} className="glass rounded-xl p-3 text-center hover:scale-105 transition-transform">
                  <div className="text-3xl mb-2">{ach.icon}</div>
                  <p className="text-xs font-bold text-text-primary mb-0.5">{ach.label}</p>
                  <p className="text-[10px] text-text-muted">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent bookings */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                📋 กิจกรรมล่าสุด
              </h2>
              <Link href="/my-bookings" className="text-xs text-primary hover:underline">ดูทั้งหมด →</Link>
            </div>
            {recentBookings.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">ยังไม่มีกิจกรรม</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => {
                  const st = STATUS_LABEL[booking.status] || { label: booking.status, color: 'text-text-muted' };
                  return (
                    <Link key={booking.id} href={`/courses/${booking.courseId}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface/50 transition-colors block">
                      <div className="flex-shrink-0 text-center w-14">
                        <div className="text-xs text-text-muted">{new Date(booking.scheduledDate).toLocaleDateString('th-TH', { month: 'short' })}</div>
                        <div className="text-lg font-bold text-text-primary">{new Date(booking.scheduledDate).getDate()}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary line-clamp-1">{booking.courseName}</p>
                        <p className="text-xs text-text-muted">{booking.instructorName} • {booking.startTime}-{booking.endTime}</p>
                      </div>
                      <span className={`text-xs font-bold ${st.color}`}>{st.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Recommendations / Quick links */}
        <div className="space-y-6">
          {!isInstructor && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                ✨ คอร์สแนะนำ
              </h2>
              {recommendedCourses.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-8">ไม่มีคอร์สแนะนำ</p>
              ) : (
                <div className="space-y-3">
                  {recommendedCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="block glass rounded-xl p-4 hover:scale-[1.02] transition-transform"
                    >
                      <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                        <span>⭐ {course.rating}</span>
                        <span>•</span>
                        <span>👥 {course.totalStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-1">
                        {course.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-surface text-[10px] text-text-muted">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm font-bold text-primary">
                        ฿{course.price.toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick links — role-aware */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4">🔗 ลิงก์ด่วน</h2>
            <div className="space-y-2">
              {(isInstructor
                ? [
                    { href: '/schedule', icon: '📅', label: 'ตารางสอนของฉัน' },
                    { href: '/live', icon: '🔴', label: 'ห้องเรียนสด' },
                    { href: '/courses', icon: '📚', label: 'คอร์สทั้งหมด' },
                    { href: '/settings', icon: '⚙️', label: 'ตั้งค่า' },
                  ]
                : [
                    { href: '/book', icon: '➕', label: 'จองคลาสใหม่' },
                    { href: '/my-bookings', icon: '📋', label: 'การจองของฉัน' },
                    { href: '/courses', icon: '📚', label: 'คอร์สทั้งหมด' },
                    { href: '/live', icon: '🔴', label: 'ห้องเรียนสด' },
                    { href: '/settings', icon: '⚙️', label: 'ตั้งค่า' },
                  ]
              ).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface/60 transition-colors text-sm text-text-secondary hover:text-text-primary"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                  <span className="ml-auto text-text-muted">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
