/**
 * LandingView — For non-logged-in users
 *
 * Concise, focused: show popular courses → drive to register/login
 * No distractions, no long scrolling
 */

'use client';

import Link from 'next/link';

/* ── Popular courses (subset) ─────────────── */

const POPULAR_COURSES = [
  {
    id: 'course-001',
    title: 'พื้นฐาน React.js',
    instructor: 'อ.สมชาย',
    rating: 4.8,
    students: 2450,
    price: 1990,
    tag: 'Web',
    emoji: '⚛️',
  },
  {
    id: 'course-002',
    title: 'Python AI & ML',
    instructor: 'ดร.นภา',
    rating: 4.9,
    students: 1890,
    price: 3490,
    tag: 'AI',
    emoji: '🤖',
  },
  {
    id: 'course-003',
    title: 'UX/UI Design',
    instructor: 'อ.พิมพ์ลดา',
    rating: 4.7,
    students: 1560,
    price: 2490,
    tag: 'Design',
    emoji: '🎨',
  },
  {
    id: 'course-006',
    title: 'Cybersecurity',
    instructor: 'อ.วีรภัทร',
    rating: 4.9,
    students: 350,
    price: 4990,
    tag: 'Security',
    emoji: '🔒',
  },
];

/* ── Component ─────────────────────────────── */

export function LandingView() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
      {/* Hero — short & punchy */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🎓</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3 leading-tight">
          เรียนสดกับอาจารย์ตัวจริง
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto mb-6">
          จองคลาส เลือกเวลา แล้วเข้าเรียน Live ได้เลย
        </p>
        <Link
          href="/auth/register"
          className="inline-block btn-game px-8 py-3 text-white font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition-transform"
        >
          เริ่มเรียนฟรี →
        </Link>
      </div>

      {/* Popular courses */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 text-center">
          🔥 คอร์สยอดนิยม
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POPULAR_COURSES.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="glass rounded-2xl p-4 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors truncate">
                    {course.title}
                  </h3>
                  <p className="text-text-muted text-xs">
                    {course.instructor} • ⭐ {course.rating}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-medium text-text-muted bg-surface px-1.5 py-0.5 rounded">
                      {course.tag}
                    </span>
                    <span className="text-sm font-extrabold text-primary">
                      ฿{course.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <p className="text-text-muted text-xs mb-3">มีบัญชีแล้ว?</p>
        <Link
          href="/auth/login"
          className="inline-block px-6 py-2.5 glass border border-primary/30 text-primary font-bold text-sm rounded-xl hover:bg-primary/5 transition-colors"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}
