/**
 * InstructorsView
 * Instructor listing page with search, specialty filter, online toggle, sort
 * Pure CSS — no react-spring
 */

'use client';

import { InstructorSortOption, InstructorsViewModel } from '@/src/presentation/presenters/instructors/InstructorsPresenter';
import { useInstructorsPresenter } from '@/src/presentation/presenters/instructors/useInstructorsPresenter';
import Link from 'next/link';
import InstructorsSkeleton from './InstructorsSkeleton';

interface InstructorsViewProps {
  initialViewModel?: InstructorsViewModel;
}

export function InstructorsView({ initialViewModel }: InstructorsViewProps) {
  const [state, actions] = useInstructorsPresenter(initialViewModel);
  const vm = state.viewModel;

  if (state.loading && !vm) {
    return <InstructorsSkeleton />;
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
          🌟 อาจารย์ผู้เชี่ยวชาญ
        </h1>
        <p className="text-text-secondary">
          รวมอาจารย์ {vm.totalCount} ท่านจากหลากหลายสาขา พร้อมสอนสดออนไลน์
        </p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 sm:p-6 mb-8 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          <input
            type="text"
            placeholder="ค้นหาอาจารย์ ชื่อ สาขาเชี่ยวชาญ..."
            value={vm.filters.search}
            onChange={(e) => actions.setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Specialization filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => actions.setSpecialization(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !vm.filters.specialization
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
              }`}
            >
              ทั้งหมด
            </button>
            {vm.allSpecializations.map((spec) => (
              <button
                key={spec}
                onClick={() => actions.setSpecialization(spec)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vm.filters.specialization === spec
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Online only toggle */}
          <button
            onClick={() => actions.toggleOnlineOnly()}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ml-auto ${
              vm.filters.onlineOnly
                ? 'bg-success/10 text-success border border-success/30'
                : 'bg-surface border border-border text-text-secondary hover:border-success/50'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`${vm.filters.onlineOnly ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-success opacity-75`} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            ออนไลน์เท่านั้น
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">เรียงตาม:</span>
          {([
            { value: 'rating' as InstructorSortOption, label: '⭐ คะแนน' },
            { value: 'students' as InstructorSortOption, label: '👥 นักเรียน' },
            { value: 'courses' as InstructorSortOption, label: '📚 คอร์ส' },
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
      <p className="text-sm text-text-muted mb-6">
        แสดงผล <span className="font-bold text-text-primary">{vm.instructors.length}</span> อาจารย์
      </p>

      {/* Instructor Grid */}
      {vm.instructors.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-text-secondary text-lg mb-2">ไม่พบอาจารย์ที่ค้นหา</p>
          <p className="text-text-muted text-sm">ลองเปลี่ยนตัวกรองหรือคำค้นหาใหม่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vm.instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      )}
    </div>
  );
}

function InstructorCard({ instructor }: { instructor: InstructorsViewModel['instructors'][0] }) {
  return (
    <Link href={`/instructors/${instructor.id}`} className="glass rounded-2xl p-6 relative hover:scale-[1.02] transition-transform group block">
      {/* Online status */}
      {instructor.isOnline && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 border border-success/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-[10px] font-bold text-success">ONLINE</span>
        </div>
      )}

      <div className="text-center mb-4">
        {/* Avatar */}
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform">
          👨‍🏫
        </div>
        <h3 className="text-lg font-bold text-text-primary">{instructor.name}</h3>
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className="text-warning">⭐</span>
          <span className="font-bold text-text-primary">{instructor.rating}</span>
          <span className="text-xs text-text-muted">({instructor.totalStudents.toLocaleString()} นักเรียน)</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-text-secondary mb-4 line-clamp-3 text-center leading-relaxed">{instructor.bio}</p>

      {/* Specializations */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
        {instructor.specializations.map((spec) => (
          <span key={spec} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {spec}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/50 text-sm">
        <div className="text-center">
          <div className="font-bold text-text-primary">{instructor.totalStudents.toLocaleString()}</div>
          <div className="text-xs text-text-muted">👥 นักเรียน</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-text-primary">{instructor.totalCourses}</div>
          <div className="text-xs text-text-muted">📚 คอร์ส</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-primary">฿{instructor.hourlyRate.toLocaleString()}</div>
          <div className="text-xs text-text-muted">💰 ต่อชม.</div>
        </div>
      </div>
    </Link>
  );
}
