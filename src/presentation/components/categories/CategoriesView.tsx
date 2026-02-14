/**
 * CategoriesView
 * Browse courses by category with vibrant category cards
 * Pure CSS — no react-spring
 */

'use client';

import { CategoriesViewModel } from '@/src/presentation/presenters/categories/CategoriesPresenter';
import { useCategoriesPresenter } from '@/src/presentation/presenters/categories/useCategoriesPresenter';
import Link from 'next/link';
import CategoriesSkeleton from './CategoriesSkeleton';

interface CategoriesViewProps {
  initialViewModel?: CategoriesViewModel;
}

export function CategoriesView({ initialViewModel }: CategoriesViewProps) {
  const state = useCategoriesPresenter(initialViewModel);
  const vm = state.viewModel;

  if (state.loading && !vm) {
    return <CategoriesSkeleton />;
  }

  if (state.error && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-text-secondary mb-4">{state.error}</p>
          <button onClick={() => state.loadData()} className="btn-game px-6 py-2 text-white rounded-xl">ลองใหม่</button>
        </div>
      </div>
    );
  }

  if (!vm) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
          📂 หมวดหมู่คอร์สเรียน
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          เลือกหมวดหมู่ที่สนใจ • {vm.totalCategories} หมวดหมู่ • {vm.totalCourses} คอร์สทั้งหมด
        </p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vm.categories.map((item) => {
          const cat = item.category;
          return (
            <div key={cat.id} className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform">
              {/* Banner */}
              <div
                className="relative h-32 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}88)` }}
              >
                <span className="text-6xl group-hover:scale-110 transition-transform drop-shadow-lg">
                  {cat.icon}
                </span>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-white text-xs font-bold">
                  {cat.courseCount} คอร์ส
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-text-primary mb-1">{cat.name}</h2>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{cat.description}</p>

                {/* Top courses */}
                {item.topCourses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-text-muted font-semibold uppercase mb-2">คอร์สยอดนิยม</p>
                    <div className="space-y-2">
                      {item.topCourses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/${course.id}`}
                          className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                        >
                          <span className="text-xs">📖</span>
                          <span className="line-clamp-1">{course.title}</span>
                          <span className="ml-auto text-xs text-text-muted">⭐ {course.rating}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href={`/courses?category=${encodeURIComponent(cat.name)}`}
                  className="btn-game w-full py-2.5 text-white rounded-xl font-bold text-sm text-center block hover:scale-105 transition-transform"
                >
                  ดูคอร์สทั้งหมด →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
