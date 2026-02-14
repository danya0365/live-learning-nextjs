/**
 * ConsultationBoardView
 * Instructor's view — browse open student requests, link to detail pages
 * Pure CSS — glassmorphism style
 */

'use client';

import { useConsultationBoardPresenter } from '@/src/presentation/presenters/consultation-board/useConsultationBoardPresenter';
import Link from 'next/link';
import ConsultationsSkeleton from '../consultations/ConsultationsSkeleton';

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  beginner: { label: 'เริ่มต้น', color: 'text-success' },
  intermediate: { label: 'ปานกลาง', color: 'text-warning' },
  advanced: { label: 'ขั้นสูง', color: 'text-error' },
};

const CATEGORY_FILTERS = [
  { id: null, label: 'ทั้งหมด', icon: '📋' },
  { id: 'cat-001', label: 'Web Dev', icon: '🌐' },
  { id: 'cat-002', label: 'AI', icon: '🤖' },
  { id: 'cat-003', label: 'Design', icon: '🎨' },
  { id: 'cat-004', label: 'Mobile', icon: '📱' },
  { id: 'cat-005', label: 'Security', icon: '🛡️' },
  { id: 'cat-006', label: 'DevOps', icon: '☁️' },
];

export function ConsultationBoardView() {
  const [state, actions] = useConsultationBoardPresenter();
  const vm = state.viewModel;

  if (state.loading && !vm) {
    return <ConsultationsSkeleton />;
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

  // Check which requests I've already offered on
  const myOfferRequestIds = new Set(vm.myOffers.map((o) => o.requestId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          📋 บอร์ดคำขอปรึกษา
        </h1>
        <p className="text-text-secondary">
          นักเรียนกำลังมองหาอาจารย์ — เลือกคำขอที่สนใจแล้วเสนอรับสอนได้เลย!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-2xl font-extrabold text-text-primary">{vm.openRequests.length}</div>
          <div className="text-xs text-text-muted">คำขอที่เปิดอยู่</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">📩</div>
          <div className="text-2xl font-extrabold text-primary">{vm.myOffers.length}</div>
          <div className="text-xs text-text-muted">ข้อเสนอของฉัน</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-2xl font-extrabold text-success">{vm.myOffers.filter((o) => o.status === 'accepted').length}</div>
          <div className="text-xs text-text-muted">ได้รับเลือก</div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.id || 'all'}
            onClick={() => actions.setCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              vm.selectedCategoryId === cat.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'glass text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Request cards */}
      {vm.openRequests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-text-secondary text-lg mb-2">ยังไม่มีคำขอในหมวดนี้</p>
          <p className="text-text-muted text-sm">ลองเลือกหมวดอื่นดู</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {vm.openRequests.map((req) => {
            const levelCfg = LEVEL_CONFIG[req.level] || LEVEL_CONFIG.beginner;
            const alreadyOffered = myOfferRequestIds.has(req.id);

            return (
              <Link key={req.id} href={`/consultations/board/${req.id}`} className="block glass rounded-2xl p-5 sm:p-6 hover:scale-[1.01] transition-transform">
                {/* Category + student */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">{req.categoryIcon}</span>
                    <div>
                      <span className="text-xs text-text-muted">{req.categoryName}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{req.studentAvatar}</span>
                        <span className="text-xs text-text-secondary">{req.studentName}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${levelCfg.color}`}>
                    {levelCfg.label}
                  </span>
                </div>

                {/* Title + description */}
                <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">
                  {req.title}
                </h3>
                <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                  {req.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-4">
                  <span className="glass px-2 py-1 rounded">💰 ฿{req.budgetMin.toLocaleString()} - ฿{req.budgetMax.toLocaleString()}</span>
                  <span className="glass px-2 py-1 rounded">📅 {req.preferredDates.length} วัน</span>
                  <span className="glass px-2 py-1 rounded">📩 {req.offersCount} ข้อเสนอ</span>
                </div>

                {/* Preferred dates */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {req.preferredDates.map((d) => (
                    <span key={d} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                      {new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                    </span>
                  ))}
                  {req.preferredTimes.map((t, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-warning/10 text-warning text-xs font-medium">
                      🕐 {t.start}-{t.end}
                    </span>
                  ))}
                </div>

                {/* Status badge */}
                {alreadyOffered ? (
                  <div className="w-full py-2.5 rounded-xl glass text-text-muted text-sm font-medium text-center">
                    ✅ ส่งข้อเสนอแล้ว
                  </div>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold text-center shadow-lg shadow-primary/25">
                    🤝 ดูรายละเอียด & เสนอรับสอน →
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
