/**
 * AchievementsView
 * Premium achievements showcase with category filters + progress bars
 * Pure CSS — no react-spring
 */

'use client';

import { AchievementCategory, AchievementDetail } from '@/src/application/repositories/IAchievementRepository';
import { AchievementsViewModel } from '@/src/presentation/presenters/achievements/AchievementsPresenter';
import { useAchievementsPresenter } from '@/src/presentation/presenters/achievements/useAchievementsPresenter';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface AchievementsViewProps {
  initialViewModel?: AchievementsViewModel;
}

const CATEGORY_LABELS: Record<AchievementCategory, { label: string; icon: string }> = {
  learning: { label: 'การเรียนรู้', icon: '📚' },
  consistency: { label: 'ความสม่ำเสมอ', icon: '🔥' },
  social: { label: 'สังคม', icon: '🤝' },
  milestone: { label: 'ไมล์สโตน', icon: '🏆' },
};

export function AchievementsView({ initialViewModel }: AchievementsViewProps) {
  const { viewModel: vm, loading, error, loadData } = useAchievementsPresenter(initialViewModel);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');

  if (loading && !vm) {
    return <AchievementsSkeleton />;
  }

  if (error && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error font-medium mb-2">เกิดข้อผิดพลาด</p>
          <button onClick={loadData} className="btn-game px-6 py-2 text-white rounded-xl">ลองใหม่</button>
        </div>
      </div>
    );
  }

  if (!vm) return null;

  const { achievements, stats, categories } = vm;

  const filtered = activeCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === activeCategory);

  // Separate into unlocked and locked
  const unlocked = filtered.filter((a) => a.unlockedAt !== null);
  const locked = filtered.filter((a) => a.unlockedAt === null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/profile" className="text-text-muted hover:text-primary transition-colors text-sm flex items-center gap-1 group">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> โปรไฟล์
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          🏆 เหรียญรางวัลทั้งหมด
        </h1>
        <p className="text-text-secondary">
          สะสมเหรียญรางวัลจากกิจกรรมต่างๆ บนแพลตฟอร์ม
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '🎖️', value: stats.total, label: 'ทั้งหมด', color: 'text-text-primary' },
          { icon: '✅', value: stats.unlocked, label: 'ปลดล็อกแล้ว', color: 'text-success' },
          { icon: '🔒', value: stats.locked, label: 'ยังไม่ปลดล็อก', color: 'text-warning' },
          { icon: '📊', value: `${stats.completionPercent}%`, label: 'ความสำเร็จ', color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform border border-border/50">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-extrabold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-text-muted font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Completion Progress Bar */}
      <div className="glass rounded-2xl p-6 mb-8 border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-text-primary">ความก้าวหน้าทั้งหมด</span>
          <span className="text-sm font-extrabold text-primary">{stats.unlocked}/{stats.total}</span>
        </div>
        <div className="h-3 rounded-full bg-surface-elevated overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
            style={{ width: `${stats.completionPercent}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeCategory === 'all'
              ? 'btn-game text-white shadow-lg shadow-primary/20'
              : 'bg-surface border border-border/50 text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
          }`}
        >
          🎯 ทั้งหมด ({achievements.length})
        </button>
        {categories.map((cat) => {
          const info = CATEGORY_LABELS[cat];
          const count = achievements.filter((a) => a.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCategory === cat
                  ? 'btn-game text-white shadow-lg shadow-primary/20'
                  : 'bg-surface border border-border/50 text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
              }`}
            >
              {info.icon} {info.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Unlocked Achievements */}
      {unlocked.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            ✅ ปลดล็อกแล้ว <span className="text-sm font-medium text-text-muted">({unlocked.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map((ach, i) => (
              <AchievementCard key={ach.id} achievement={ach} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            🔒 ยังไม่ปลดล็อก <span className="text-sm font-medium text-text-muted">({locked.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map((ach, i) => (
              <AchievementCard key={ach.id} achievement={ach} index={i} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-surface/30 rounded-2xl border border-dashed border-border/30">
          <div className="text-5xl mb-3 opacity-50">🏅</div>
          <p className="text-text-muted font-medium">ไม่มีเหรียญรางวัลในหมวดนี้</p>
        </div>
      )}
    </div>
  );
}

/* ── Achievement Card ────────────────────────────────── */

function AchievementCard({ achievement: ach, index }: { achievement: AchievementDetail; index: number }) {
  const isUnlocked = ach.unlockedAt !== null;
  const progressPercent = ach.maxProgress > 0 ? Math.round((ach.progress / ach.maxProgress) * 100) : 0;
  const catInfo = CATEGORY_LABELS[ach.category];

  return (
    <div
      className={`glass rounded-2xl p-5 border transition-all hover:shadow-lg group ${
        isUnlocked
          ? 'border-border/50 hover:border-primary/40 hover:scale-[1.02]'
          : 'border-border/30 opacity-70 hover:opacity-90'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 ${
          isUnlocked
            ? 'bg-gradient-to-br from-primary/15 to-secondary/15 shadow-inner'
            : 'bg-surface-elevated grayscale'
        }`}>
          {ach.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-sm line-clamp-1 ${isUnlocked ? 'text-text-primary' : 'text-text-muted'}`}>
              {ach.label}
            </h3>
            {isUnlocked && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-success/10 text-success font-bold shrink-0">
                ✓
              </span>
            )}
          </div>
          <p className={`text-xs mb-2 line-clamp-2 ${isUnlocked ? 'text-text-secondary' : 'text-text-muted'}`}>
            {ach.description}
          </p>

          {/* Category badge */}
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-surface border border-border/30 text-text-muted font-medium">
            {catInfo.icon} {catInfo.label}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-text-muted">ความก้าวหน้า</span>
          <span className={`text-[10px] font-extrabold ${isUnlocked ? 'text-success' : 'text-text-muted'}`}>
            {ach.progress}/{ach.maxProgress}
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isUnlocked
                ? 'bg-gradient-to-r from-success to-primary'
                : 'bg-gradient-to-r from-text-muted/40 to-text-muted/20'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Unlocked date */}
      {isUnlocked && ach.unlockedAt && (
        <div className="mt-3 text-[10px] text-text-muted flex items-center gap-1">
          🗓️ ปลดล็อกเมื่อ {new Date(ach.unlockedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────── */

function AchievementsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse">
      <div className="mb-8">
        <div className="h-4 w-16 bg-surface-elevated rounded mb-4" />
        <div className="h-10 w-80 bg-surface-elevated rounded-xl mb-2" />
        <div className="h-4 w-64 bg-surface-elevated rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl p-4 border border-border/50">
            <div className="h-8 w-8 bg-surface-elevated rounded-full mx-auto mb-2" />
            <div className="h-6 w-12 bg-surface-elevated rounded mx-auto mb-1" />
            <div className="h-3 w-20 bg-surface-elevated rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="h-16 bg-surface-elevated rounded-2xl mb-8" />
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-surface-elevated rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass rounded-2xl p-5 border border-border/50">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-surface-elevated rounded-xl shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-surface-elevated rounded mb-2" />
                <div className="h-3 w-full bg-surface-elevated rounded mb-2" />
                <div className="h-4 w-16 bg-surface-elevated rounded" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-surface-elevated rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
