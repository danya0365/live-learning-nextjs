/**
 * CoursesView
 * Courses listing page with filters, search, sorting, and course cards
 * Pure CSS — no react-spring
 */

'use client';

import { CourseSortOption, CoursesViewModel } from '@/src/presentation/presenters/courses/CoursesPresenter';
import { useCoursesPresenter } from '@/src/presentation/presenters/courses/useCoursesPresenter';
import Link from 'next/link';
import CoursesSkeleton from './CoursesSkeleton';

interface CoursesViewProps {
  initialViewModel?: CoursesViewModel;
}

export function CoursesView({ initialViewModel }: CoursesViewProps) {
  const [state, actions] = useCoursesPresenter(initialViewModel);
  const vm = state.viewModel;

  if (state.loading && !vm) {
    return <CoursesSkeleton />;
  }

  if (state.error && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-text-secondary mb-4">{state.error}</p>
          <button onClick={() => actions.loadData()} className="btn-game px-6 py-2 text-white rounded-xl">ลองใหม่</button>
        </div>
      </div>
    );
  }

  if (!vm) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          📚 คอร์สเรียนทั้งหมด
        </h1>
        <p className="text-text-secondary">
          สำรวจคอร์สเรียนสดออนไลน์ {vm.stats.totalItems} คอร์ส จากหมวดหมู่ต่างๆ
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass rounded-2xl p-4 sm:p-6 mb-8 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          <input
            type="text"
            placeholder="ค้นหาคอร์ส เช่น React, Python, UX..."
            value={vm.filters.search}
            onChange={(e) => actions.setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => actions.setCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !vm.filters.categoryId
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
              }`}
            >
              ทั้งหมด
            </button>
            {vm.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => actions.setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vm.filters.categoryId === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Level filter */}
          <div className="flex gap-2 ml-auto">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => actions.setLevel(vm.filters.level === level ? null : level)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vm.filters.level === level
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
                }`}
              >
                {level === 'beginner' ? '🟢 เริ่มต้น' : level === 'intermediate' ? '🟡 ปานกลาง' : '🔴 ขั้นสูง'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">เรียงตาม:</span>
          {([
            { value: 'popular' as CourseSortOption, label: '🔥 ยอดนิยม' },
            { value: 'rating' as CourseSortOption, label: '⭐ คะแนน' },
            { value: 'price-asc' as CourseSortOption, label: '💰 ราคา ↑' },
            { value: 'price-desc' as CourseSortOption, label: '💰 ราคา ↓' },
            { value: 'newest' as CourseSortOption, label: '🆕 ใหม่ล่าสุด' },
          ]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => actions.setSort(opt.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                vm.filters.sort === opt.value
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-muted">
          แสดงผล <span className="font-bold text-text-primary">{vm.courses.length}</span> คอร์ส
        </p>
      </div>

      {/* Course Grid */}
      {vm.courses.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-text-secondary text-lg mb-2">ไม่พบคอร์สที่ค้นหา</p>
          <p className="text-text-muted text-sm">ลองเปลี่ยนตัวกรองหรือคำค้นหาใหม่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vm.courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, index }: { course: CoursesViewModel['courses'][0]; index: number }) {
  const levelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return '🟢 เริ่มต้น';
      case 'intermediate': return '🟡 ปานกลาง';
      case 'advanced': return '🔴 ขั้นสูง';
      default: return level;
    }
  };

  const tagIcon = (tag: string) => {
    const icons: Record<string, string> = { React: '⚛️', Python: '🐍', UX: '🎨', Flutter: '📱', Cybersecurity: '🛡️', 'Node.js': '🟢' };
    return icons[tag] || '📚';
  };

  return (
    <Link href={`/courses/${course.id}`} className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform block">
      {/* Thumbnail */}
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: `linear-gradient(135deg, hsl(${index * 45 + 200}, 70%, 60%), hsl(${index * 45 + 240}, 70%, 45%))` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform">
            {tagIcon(course.tags[0])}
          </span>
        </div>
        {course.isLiveFeature && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/90 text-white text-[10px] font-bold shadow-lg backdrop-blur-sm">
            <span>📡 คลาสเรียนสด</span>
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md glass text-xs font-medium text-white">
          {levelLabel(course.level)}
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1">
          {course.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-black/30 text-white text-[10px] font-medium backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-text-primary mb-2 line-clamp-2 leading-snug">{course.title}</h3>
        <p className="text-xs text-text-muted mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm">👨‍🏫</div>
          <span className="text-sm text-text-secondary truncate">อาจารย์ {course.instructorCount} คน</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
          <span>⏱️ {Math.round(course.durationMinutes / 60)} ชม.</span>
          <span>👥 {course.totalStudents.toLocaleString()} คน</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1">
            <span className="text-warning">⭐</span>
            <span className="text-sm font-bold text-text-primary">{course.rating}</span>
          </div>
          <span className="text-lg font-extrabold text-primary">฿{course.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
