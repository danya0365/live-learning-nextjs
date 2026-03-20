import Link from 'next/link';
import { useMemo } from 'react';
import { ProfileViewModel } from '@/src/presentation/presenters/profile/ProfilePresenter';
import { STATUS_LABEL, STUDENT_QUICK_LINKS } from './profileConstants';

interface StudentProfileSectionProps {
  vm: ProfileViewModel;
}

export function StudentProfileSection({ vm }: StudentProfileSectionProps) {
  const { learningStats, recentBookings, recommendedCourses } = vm;

  const sortedAchievements = useMemo(() => {
    return [...learningStats.achievements]
      .sort((a, b) => {
        const aUnlocked = a.unlockedAt ? 1 : 0;
        const bUnlocked = b.unlockedAt ? 1 : 0;
        return bUnlocked - aUnlocked; // unlocked first
      })
      .slice(0, 8);
  }, [learningStats.achievements]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '⏱️', value: `${learningStats.totalHours} ชม.`, label: 'เวลาเรียนรวม', color: 'text-primary' },
          { icon: '🎓', value: learningStats.coursesCompleted.toString(), label: 'เรียนจบแล้ว', color: 'text-success' },
          { icon: '📖', value: learningStats.coursesInProgress.toString(), label: 'กำลังเรียน', color: 'text-warning' },
          { icon: '🏅', value: learningStats.achievements.filter(a => !!a.unlockedAt).length.toString(), label: 'เหรียญรางวัล', color: 'text-secondary' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform border border-border/50">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-extrabold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-text-muted font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <div className="glass rounded-2xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                🏆 เหรียญรางวัล
              </h3>
              <Link href="/achievements" className="text-xs font-bold text-primary hover:underline">ดูทั้งหมด →</Link>
            </div>
           
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sortedAchievements.map((ach) => {
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

          {/* Recent bookings */}
          <div className="glass rounded-2xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                📋 กิจกรรมล่าสุด
              </h3>
              <Link href="/my-bookings" className="text-xs font-bold text-primary hover:underline">ดูทั้งหมด →</Link>
            </div>
            {recentBookings.length === 0 ? (
              <div className="text-center py-10 bg-surface/30 rounded-xl border border-dashed border-border/30">
                <div className="text-4xl mb-2 opacity-50">📅</div>
                <p className="text-text-muted text-sm">ยังไม่มีกิจกรรมเร็วๆ นี้</p>
                <Link href="/courses" className="text-primary text-xs font-bold hover:underline mt-2 inline-block">ค้นหาคอร์สเรียน</Link>
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
                          <span>👨‍🏫 {booking.instructorName}</span>
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

          <div className="glass rounded-2xl p-6 border border-border/50">
            <h3 className="text-xl font-bold text-text-primary mb-4">🔗 ลิงก์ด่วน</h3>
            <div className="space-y-2">
              {STUDENT_QUICK_LINKS.map((link) => (
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
    </>
  );
}
