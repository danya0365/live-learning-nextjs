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
import ProfileSkeleton from './ProfileSkeleton';

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

  if (state.loading && !vm) {
    return <ProfileSkeleton />;
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

  const isAdmin = profile.role === 'admin';
  const isInstructor = profile.role === 'instructor';
  const { learningStats, instructorStats, recentBookings, recommendedCourses } = vm;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Standard Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          👤 โปรไฟล์ส่วนตัว
        </h1>
        <p className="text-text-secondary">
          จัดการข้อมูลส่วนตัว ประวัติการเรียน และการตั้งค่าบัญชีของคุณ
        </p>
      </div>

      {/* Profile Card Summary */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-8 border border-border/50">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-lg shadow-primary/25 border-4 border-surface">
            {profile.avatar}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1">{profile.name}</h2>
            <p className="text-text-secondary mb-3">{profile.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1 ${
                isAdmin 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                  : 'bg-primary/10 border-primary/30 text-primary'
              }`}>
                {isAdmin ? '🛡️ Role: Administrator' : `📊 Level: ${profile.level}`}
              </span>
              <span className="text-xs text-text-muted flex items-center gap-1">
                🗓️ เข้าร่วมเมื่อ {new Date(profile.joinDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
            {isAdmin ? (
              <>
                <Link href="/courses" className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all text-center">
                  📚 คอร์สทั้งหมด
                </Link>
                <Link href="/instructors" className="flex-1 sm:flex-none btn-game px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 text-center">
                  👨‍🏫 จัดการผู้สอน
                </Link>
              </>
            ) : isInstructor ? (
              <>
                <Link href="/schedule" className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all text-center">
                  📅 ตารางสอน
                </Link>
                <Link href="/live" className="flex-1 sm:flex-none btn-game px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 text-center">
                  🔴 เข้าสอน
                </Link>
              </>
            ) : (
              <>
                <Link href="/my-bookings" className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all text-center">
                  📋 การจอง
                </Link>
                <Link href="/courses" className="flex-1 sm:flex-none btn-game px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 text-center">
                  📚 เรียนต่อ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid — hidden for Admins */}
      {!isAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {isInstructor && instructorStats ? (
            <>
              {[
                { icon: '🏫', value: `${instructorStats.classesThisWeek} คลาส`, label: 'สอนสัปดาห์นี้', color: 'text-primary' },
                { icon: '👥', value: `${instructorStats.totalStudents} คน`, label: 'นักเรียนทั้งหมด', color: 'text-success' },
                { icon: '⏱️', value: `${instructorStats.totalTeachingHours} ชม.`, label: 'ชั่วโมงสอนรวม', color: 'text-warning' },
                { icon: '⭐', value: instructorStats.averageRating.toString(), label: 'คะแนนเฉลี่ย', color: 'text-secondary' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform border border-border/50">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-extrabold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-text-muted font-medium">{stat.label}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                { icon: '⏱️', value: `${learningStats.totalHours} ชม.`, label: 'เวลาเรียนรวม', color: 'text-primary' },
                { icon: '🎓', value: learningStats.coursesCompleted, label: 'เรียนจบแล้ว', color: 'text-success' },
                { icon: '📖', value: learningStats.coursesInProgress, label: 'กำลังเรียน', color: 'text-warning' },
                { icon: '🏅', value: learningStats.achievements.filter(a => !!a.unlockedAt).length, label: 'เหรียญรางวัล', color: 'text-secondary' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform border border-border/50">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-extrabold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-text-muted font-medium">{stat.label}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Tools */}
          <div className="glass rounded-2xl p-6 border border-border/50 h-fit">
            <h3 className="text-xl font-bold text-text-primary mb-4">🔗 เครื่องมือจัดการระบบ</h3>
            <div className="space-y-2">
              {[
                { href: '/courses', icon: '📚', label: 'จัดการคอร์สเรียนทั้งหมด', desc: 'เพิ่ม ลบ แก้ไข ข้อมูลคอร์ส' },
                { href: '/instructors', icon: '👨‍🏫', label: 'จัดการข้อมูลอาจารย์', desc: 'ตั้งค่าและดูรายชื่อผู้สอน' },
                { href: '/schedule', icon: '📅', label: 'ดูตารางเรียนทั้งหมด', desc: 'ดูการนัดหมายและตารางเวลาภาพรวม' },
                { href: '/live', icon: '🔴', label: 'ห้องเรียนสด', desc: 'ตรวจสอบคลาสที่กำลังสอน' },
                { href: '/settings', icon: '⚙️', label: 'ตั้งค่าระบบ', desc: 'ตั้งค่าพื้นฐานของแพลตฟอร์ม' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface/50 border border-border/30 hover:bg-surface hover:border-primary/30 transition-all text-text-secondary hover:text-text-primary group"
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform bg-surface p-2 rounded-lg border border-border">{link.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{link.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{link.desc}</p>
                  </div>
                  <span className="text-text-muted group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Admin System Status / Quick Metrics */}
          <div className="glass rounded-2xl p-6 border border-border/50 h-fit">
            <h3 className="text-xl font-bold text-text-primary mb-4">🛡️ สถานะแพลตฟอร์ม</h3>
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-success/10 border border-success/20 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-success text-lg mb-1">ระบบทำงานปกติ (All Systems Operational)</p>
                <p className="text-sm text-text-muted">ตรวจสอบล่าสุดเมื่อ: {new Date().toLocaleTimeString('th-TH')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-surface/50 border border-border/30 p-4 rounded-xl text-center">
                  <p className="text-xs text-text-muted font-bold mb-1 uppercase tracking-wider">แอดมินที่ล็อกอิน</p>
                  <p className="text-2xl font-extrabold text-text-primary">1 <span className="text-sm font-normal text-text-secondary">คน</span></p>
                </div>
                <div className="bg-surface/50 border border-border/30 p-4 rounded-xl text-center">
                  <p className="text-xs text-text-muted font-bold mb-1 uppercase tracking-wider">เซิร์ฟเวอร์</p>
                  <p className="text-lg font-extrabold text-primary flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Achievements + Recent */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements / Instructor accomplishments */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  {isInstructor ? '🏆 ผลงานของฉัน' : '🏆 เหรียญรางวัล'}
                </h3>
                <Link href="/achievements" className="text-xs font-bold text-primary hover:underline">ดูทั้งหมด →</Link>
              </div>
             
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[...learningStats.achievements]
                  .sort((a, b) => {
                    const aUnlocked = a.unlockedAt ? 1 : 0;
                    const bUnlocked = b.unlockedAt ? 1 : 0;
                    return bUnlocked - aUnlocked; // unlocked first
                  })
                  .slice(0, 8)
                  .map((ach) => {
                    const isUnlocked = !!ach.unlockedAt;
                    const progress = ach.progress ?? 0;
                    const max = ach.maxProgress ?? 1;
                    const pct = max > 0 ? Math.round((progress / max) * 100) : 0;

                    return (
                      <div
                        key={ach.label}
                        className={`glass rounded-xl p-3 text-center hover:scale-105 transition-transform border ${
                          isUnlocked
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-border/30 bg-surface/30 opacity-60'
                        }`}
                      >
                        <div className={`text-4xl mb-2 drop-shadow-sm ${isUnlocked ? '' : 'grayscale'}`}>
                          {ach.icon}
                        </div>
                        <p className={`text-xs font-bold mb-1 line-clamp-1 ${isUnlocked ? 'text-text-primary' : 'text-text-muted'}`}>
                          {ach.label}
                          {isUnlocked && <span className="ml-1 text-success">✓</span>}
                          {!isUnlocked && <span className="ml-1">🔒</span>}
                        </p>
                        {/* Mini progress bar */}
                        <div className="h-1 rounded-full bg-surface-elevated overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isUnlocked
                                ? 'bg-gradient-to-r from-success to-primary'
                                : 'bg-text-muted/30'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-text-muted mt-1">
                          {progress}/{max}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Recent bookings / classes */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  📋 {isInstructor ? 'คลาสล่าสุด' : 'กิจกรรมล่าสุด'}
                </h3>
                <Link href={isInstructor ? '/schedule' : '/my-bookings'} className="text-xs font-bold text-primary hover:underline">ดูทั้งหมด →</Link>
              </div>
              {recentBookings.length === 0 ? (
                <div className="text-center py-10 bg-surface/30 rounded-xl border border-dashed border-border/30">
                  <div className="text-4xl mb-2 opacity-50">📅</div>
                  <p className="text-text-muted text-sm">
                    {isInstructor ? 'ยังไม่มีคลาสเร็วๆ นี้' : 'ยังไม่มีกิจกรรมเร็วๆ นี้'}
                  </p>
                  <Link href={isInstructor ? '/schedule' : '/courses'} className="text-primary text-xs font-bold hover:underline mt-2 inline-block">
                    {isInstructor ? 'จัดตารางสอน' : 'ค้นหาคอร์สเรียน'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking) => {
                    const st = STATUS_LABEL[booking.status] || { label: booking.status, color: 'text-text-muted' };
                    return (
                      <Link key={booking.id} href={`/courses/${booking.courseId}`} className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 border border-border/30 hover:bg-surface hover:border-primary/30 transition-all group block">
                        <div className="flex-shrink-0 text-center w-14 bg-surface rounded-lg py-2 border border-border/50 group-hover:border-primary/20 transition-colors">
                          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{new Date(booking.scheduledDate).toLocaleDateString('th-TH', { month: 'short' })}</div>
                          <div className="text-xl font-extrabold text-text-primary">{new Date(booking.scheduledDate).getDate()}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">{booking.courseName}</p>
                          <p className="text-sm text-text-secondary flex items-center gap-2 mt-0.5">
                            <span>{isInstructor ? `👤 ${booking.studentName}` : `👨‍🏫 ${booking.instructorName}`}</span>
                            <span className="text-text-muted">•</span>
                            <span>⏰ {booking.startTime}-{booking.endTime}</span>
                          </p>
                        </div>
                        <div className={`text-xs font-bold px-3 py-1 rounded-full bg-surface ${st.color} border border-border/50`}>
                          {st.label}
                        </div>
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
              <div className="glass rounded-2xl p-6 border border-border/50">
                <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  ✨ คอร์สแนะนำ
                </h3>
                {recommendedCourses.length === 0 ? (
                   <p className="text-text-muted text-sm text-center py-6">ไม่มีคอร์สแนะนำในขณะนี้</p>
                ) : (
                  <div className="space-y-3">
                    {recommendedCourses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="block glass rounded-xl p-4 hover:scale-[1.02] hover:shadow-lg transition-all border border-border/30 group"
                      >
                        <h4 className="text-sm font-bold text-text-primary mb-1 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                          <span className="flex items-center gap-1">⭐ {course.rating}</span>
                          <span className="flex items-center gap-1">👥 {course.totalStudents.toLocaleString()}</span>
                        </div>
                      
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
                           <div className="flex gap-1">
                            {course.tags.slice(0, 1).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-medium text-text-muted">{tag}</span>
                            ))}
                          </div>
                          <div className="text-sm font-extrabold text-primary">
                            ฿{course.price.toLocaleString()}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick links — role-aware */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <h3 className="text-xl font-bold text-text-primary mb-4">🔗 ลิงก์ด่วน</h3>
              <div className="space-y-2">
                {(isInstructor
                  ? [
                      { href: '/schedule', icon: '📅', label: 'ตารางสอนของฉัน' },
                      { href: '/live', icon: '🔴', label: 'ห้องเรียนสด' },
                      { href: '/courses', icon: '📚', label: 'คอร์สทั้งหมด' },
                      { href: '/settings', icon: '⚙️', label: 'ตั้งค่าบัญชี' },
                      { href: '/support', icon: '🆘', label: 'ศูนย์ช่วยเหลือ' },
                    ]
                  : [
                      { href: '/book', icon: '➕', label: 'จองคลาสใหม่' },
                      { href: '/my-bookings', icon: '📋', label: 'การจองของฉัน' },
                      { href: '/courses', icon: '📚', label: 'คอร์สทั้งหมด' },
                      { href: '/live', icon: '🔴', label: 'ห้องเรียนสด' },
                      { href: '/settings', icon: '⚙️', label: 'ตั้งค่าบัญชี' },
                      { href: '/support', icon: '🆘', label: 'ศูนย์ช่วยเหลือ' },
                    ]
                ).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface/50 border border-border/30 hover:bg-surface hover:border-primary/30 transition-all text-sm font-bold text-text-secondary hover:text-text-primary group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span>{link.label}</span>
                    <span className="ml-auto text-text-muted group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
