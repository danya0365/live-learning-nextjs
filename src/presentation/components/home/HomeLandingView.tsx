'use client';

import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import Link from 'next/link';

interface HomeLandingViewProps {
  viewModel: HomeViewModel;
}

export function HomeLandingView({ viewModel }: HomeLandingViewProps) {
  if (!viewModel) return null;

  return (
    <div className="flex flex-col">
      <HeroSection stats={viewModel.stats} />
      <CategoriesSection categories={viewModel.categories} />
      <FeaturedCoursesSection courses={viewModel.featuredCourses} />
      <InstructorsSection instructors={viewModel.topInstructors} />
      <StatsSection stats={viewModel.stats} />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}

/* ============================================
   Hero Section
   ============================================ */
function HeroSection({ stats }: { stats: HomeViewModel['stats'] }) {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-16 left-[10%] text-4xl opacity-40 animate-float">⭐</span>
        <span className="absolute top-24 right-[15%] text-3xl opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>🎯</span>
        <span className="absolute bottom-20 left-[20%] text-3xl opacity-25 animate-float" style={{ animationDelay: '1s' }}>🚀</span>
        <span className="absolute bottom-32 right-[25%] text-4xl opacity-35 animate-float" style={{ animationDelay: '0.3s' }}>💡</span>
        <span className="absolute top-40 left-[60%] text-2xl opacity-30 animate-float" style={{ animationDelay: '0.8s' }}>✨</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-sm font-medium text-primary">
              🎮 อาจารย์ออนไลน์ตอนนี้ {stats.onlineNow} คน
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in">
            <span className="text-text-primary">เรียนสด</span>
            <br />
            <span className="gradient-text">กับอาจารย์ตัวจริง</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            เลือกคอร์สที่ชอบ จองเวลาเรียนกับอาจารย์ผู้เชี่ยวชาญ
            <br className="hidden sm:block" />
            พร้อมระบบจัดการเวลาอัจฉริยะ ✨
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/courses" className="btn-game px-8 py-3.5 text-lg text-white rounded-2xl inline-flex items-center gap-2 font-semibold hover:scale-105 transition-transform">
              <span>📚</span> สำรวจคอร์สเรียน
            </Link>
            <Link href="/instructors" className="px-8 py-3.5 text-lg rounded-2xl inline-flex items-center gap-2 font-semibold bg-surface-elevated border border-border text-text-primary hover:border-primary/50 hover:scale-105 transition-all">
              <span>👨‍🏫</span> ดูอาจารย์ทั้งหมด
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <QuickStat icon="📚" value={`${stats.totalCourses}+`} label="คอร์สเรียน" />
            <QuickStat icon="👨‍🏫" value={`${stats.totalInstructors}+`} label="อาจารย์" />
            <QuickStat icon="👥" value={`${(stats.totalStudents / 1000).toFixed(1)}K+`} label="นักเรียน" />
            <QuickStat icon="⭐" value={`${stats.averageRating}`} label="คะแนนเฉลี่ย" />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-lg">{icon}</span>
      <span className="font-bold text-text-primary">{value}</span>
      <span className="text-text-muted">{label}</span>
    </div>
  );
}

/* ============================================
   Categories Section
   ============================================ */
function CategoriesSection({ categories }: { categories: HomeViewModel['categories'] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="หมวดหมู่ยอดนิยม" subtitle="เลือกสาขาที่สนใจแล้วเริ่มเรียนรู้ได้เลย" icon="🏷️" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="glass rounded-2xl p-4 text-center group hover:scale-105 transition-transform cursor-pointer">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="text-sm font-semibold text-text-primary mb-1 truncate">{cat.name}</h3>
              <p className="text-xs text-text-muted">{cat.courseCount} คอร์ส</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Featured Courses Section
   ============================================ */
function FeaturedCoursesSection({ courses }: { courses: HomeViewModel['featuredCourses'] }) {
  const levelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return '🟢 เริ่มต้น';
      case 'intermediate': return '🟡 ปานกลาง';
      case 'advanced': return '🔴 ขั้นสูง';
      default: return level;
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="คอร์สแนะนำ"
          subtitle="คอร์สยอดนิยมที่ได้รับคะแนนสูงสุดจากนักเรียน"
          icon="🔥"
          action={{ href: '/courses', label: 'ดูทั้งหมด' }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="block glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform">
              {/* Thumbnail */}
              <div className="relative h-40 overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${index * 60 + 200}, 70%, 60%), hsl(${index * 60 + 240}, 70%, 50%))` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform">
                    {course.tags[0] === 'React' ? '⚛️' :
                     course.tags[0] === 'Python' ? '🐍' :
                     course.tags[0] === 'UX' ? '🎨' :
                     course.tags[0] === 'Flutter' ? '📱' :
                     course.tags[0] === 'Cybersecurity' ? '🛡️' :
                     course.tags[0] === 'Node.js' ? '🟢' : '📚'}
                  </span>
                </div>
                {course.isLive && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-error/90 text-white text-xs font-bold">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                    </span>
                    LIVE
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md glass text-xs font-medium text-white">
                  {levelLabel(course.level)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2 leading-snug">{course.title}</h3>
                <p className="text-xs text-text-muted mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">👨‍🏫</div>
                  <span className="text-xs text-text-secondary truncate">{course.instructorName}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <span className="text-warning text-sm">⭐</span>
                    <span className="text-sm font-bold text-text-primary">{course.rating}</span>
                    <span className="text-xs text-text-muted">({course.totalStudents.toLocaleString()})</span>
                  </div>
                  <span className="text-sm font-bold text-primary">฿{course.price.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Instructors Section
   ============================================ */
function InstructorsSection({ instructors }: { instructors: HomeViewModel['topInstructors'] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="อาจารย์ผู้เชี่ยวชาญ"
          subtitle="เรียนรู้กับอาจารย์ระดับมืออาชีพจากสถาบันชั้นนำ"
          icon="🌟"
          action={{ href: '/instructors', label: 'ดูทั้งหมด' }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="glass rounded-2xl p-6 text-center relative hover:scale-[1.02] transition-transform">
              {instructor.isOnline && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 border border-success/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <span className="text-[10px] font-bold text-success">ONLINE</span>
                </div>
              )}

              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">👨‍🏫</div>
              <h3 className="text-sm font-bold text-text-primary mb-1 truncate">{instructor.name}</h3>

              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-warning text-sm">⭐</span>
                <span className="text-sm font-bold text-text-primary">{instructor.rating}</span>
              </div>

              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {instructor.specializations.slice(0, 2).map((spec) => (
                  <span key={spec} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 text-xs text-text-muted">
                <span>👥 {instructor.totalStudents.toLocaleString()}</span>
                <span>📚 {instructor.totalCourses}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Stats Section
   ============================================ */
function StatsSection({ stats }: { stats: HomeViewModel['stats'] }) {
  const STAT_ITEMS = [
    { icon: '📚', value: stats.totalCourses, suffix: '+', label: 'คอร์สเรียน', color: 'from-blue-500 to-cyan-400' },
    { icon: '👨‍🏫', value: stats.totalInstructors, suffix: '+', label: 'อาจารย์ผู้เชี่ยวชาญ', color: 'from-purple-500 to-pink-400' },
    { icon: '👥', value: stats.totalStudents, suffix: '+', label: 'นักเรียนทั้งหมด', color: 'from-green-500 to-emerald-400' },
    { icon: '⭐', value: stats.averageRating, suffix: '/5', label: 'คะแนนเฉลี่ย', color: 'from-yellow-500 to-orange-400' },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_ITEMS.map((item) => (
            <div key={item.label} className="glass rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform">
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} items-center justify-center text-2xl mb-4 shadow-lg`}>
                {item.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-1">
                {typeof item.value === 'number' && item.value >= 1000
                  ? `${(item.value / 1000).toFixed(1)}K`
                  : item.value}
                <span className="text-primary">{item.suffix}</span>
              </div>
              <p className="text-sm text-text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   How It Works Section
   ============================================ */
function HowItWorksSection() {
  const STEPS = [
    { icon: '🔍', title: 'เลือกคอร์ส', description: 'ค้นหาและเลือกคอร์สเรียนที่คุณสนใจจากหมวดหมู่ต่างๆ' },
    { icon: '👨‍🏫', title: 'เลือกอาจารย์', description: 'ดูโปรไฟล์อาจารย์ ตรวจสอบคะแนนรีวิว และความเชี่ยวชาญ' },
    { icon: '📅', title: 'จองเวลาเรียน', description: 'เลือกช่วงเวลาที่อาจารย์ว่างและทำการจองเรียนสด' },
    { icon: '🎥', title: 'เรียนสดออนไลน์', description: 'เข้าร่วมคลาสเรียนสดผ่านวิดีโอ พร้อมโต้ตอบแบบเรียลไทม์' },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="เริ่มต้นใช้งานง่ายๆ" subtitle="เพียง 4 ขั้นตอน ก็สามารถเริ่มเรียนกับอาจารย์ตัวจริงได้" icon="🎯" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => (
            <div key={step.title} className="glass rounded-2xl p-6 relative hover:scale-[1.02] transition-transform">
              <div className="absolute -top-3 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-md">
                {index + 1}
              </div>
              <div className="text-4xl mb-4 mt-2">{step.icon}</div>
              <h3 className="text-base font-bold text-text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   CTA Section
   ============================================ */
function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl text-center py-12 sm:py-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10 blur-2xl" style={{ background: 'var(--gradient-primary)' }} />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10 blur-2xl" style={{ background: 'linear-gradient(135deg, hsl(330, 80%, 70%), hsl(280, 70%, 60%))' }} />
          </div>

          <div className="relative z-10">
            <span className="text-5xl inline-block animate-float">🚀</span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary mt-4 mb-4">
              พร้อมเริ่มเรียนรู้แล้วหรือยัง?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
              สมัครสมาชิกฟรี เลือกคอร์สที่ชอบ แล้วเริ่มเรียนกับอาจารย์ตัวจริงวันนี้!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/courses" className="btn-game px-8 py-3.5 text-lg text-white rounded-2xl inline-flex items-center gap-2 font-semibold hover:scale-105 transition-transform">
                <span>🎮</span> เริ่มเรียนเลย!
              </Link>
              <Link href="/schedule" className="px-8 py-3.5 text-lg rounded-2xl inline-flex items-center gap-2 font-semibold text-text-secondary hover:text-text-primary hover:bg-surface transition-all">
                <span>📅</span> ดูตารางเรียน
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Shared: Section Header
   ============================================ */
function SectionHeader({ title, subtitle, icon, action }: {
  title: string;
  subtitle: string;
  icon: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between mb-8 sm:mb-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">{title}</h2>
        </div>
        <p className="text-text-secondary text-sm sm:text-base">{subtitle}</p>
      </div>
      {action && (
        <Link href={action.href} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
          {action.label} →
        </Link>
      )}
    </div>
  );
}
