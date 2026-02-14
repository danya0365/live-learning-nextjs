/**
 * ConsultationsView
 * Student's consultation requests dashboard — list with links to detail pages
 * Pure CSS — glassmorphism style
 */

'use client';

import { ConsultationFilter } from '@/src/presentation/presenters/consultations/ConsultationsPresenter';
import { useConsultationsPresenter } from '@/src/presentation/presenters/consultations/useConsultationsPresenter';
import Link from 'next/link';
import ConsultationsSkeleton from './ConsultationsSkeleton';

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  open: { label: 'เปิดรับข้อเสนอ', icon: '🟢', color: 'text-success', bg: 'bg-success/10 border-success/30' },
  in_progress: { label: 'กำลังดำเนินการ', icon: '🔄', color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
  closed: { label: 'เสร็จสิ้น', icon: '✅', color: 'text-text-muted', bg: 'bg-surface-secondary border-border' },
  cancelled: { label: 'ยกเลิก', icon: '❌', color: 'text-error', bg: 'bg-error/10 border-error/30' },
};

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  beginner: { label: 'เริ่มต้น', color: 'text-success' },
  intermediate: { label: 'ปานกลาง', color: 'text-warning' },
  advanced: { label: 'ขั้นสูง', color: 'text-error' },
};

const FILTER_OPTIONS: { value: ConsultationFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'ทั้งหมด', icon: '📋' },
  { value: 'open', label: 'เปิดอยู่', icon: '🟢' },
  { value: 'in_progress', label: 'ดำเนินการ', icon: '🔄' },
  { value: 'closed', label: 'เสร็จสิ้น', icon: '✅' },
  { value: 'cancelled', label: 'ยกเลิก', icon: '❌' },
];

export function ConsultationsView() {
  const [state, actions] = useConsultationsPresenter();
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
            💬 คำขอปรึกษาของฉัน
          </h1>
          <p className="text-text-secondary">
            โพสต์หัวข้อที่อยากเรียน แล้วรอรับข้อเสนอจากอาจารย์
          </p>
        </div>
        <Link
          href="/consultations/new"
          className="btn-game px-6 py-3 text-white rounded-xl font-bold text-center whitespace-nowrap inline-flex items-center gap-2 self-start"
        >
          ✍️ สร้างคำขอใหม่
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📊', value: vm.stats.totalRequests, label: 'ทั้งหมด', color: 'text-text-primary' },
          { icon: '🟢', value: vm.stats.openRequests, label: 'เปิดอยู่', color: 'text-success' },
          { icon: '🔄', value: vm.stats.inProgressRequests, label: 'ดำเนินการ', color: 'text-primary' },
          { icon: '📩', value: vm.stats.totalOffers, label: 'ข้อเสนอรวม', color: 'text-warning' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => actions.setFilter(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              vm.filter === opt.value
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'glass text-text-secondary hover:text-text-primary'
            }`}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      {/* Request cards */}
      {vm.requests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-text-secondary text-lg mb-2">ยังไม่มีคำขอปรึกษา</p>
          <p className="text-text-muted text-sm mb-6">สร้างคำขอใหม่เพื่อให้อาจารย์มาเสนอรับสอน!</p>
          <Link href="/consultations/new" className="btn-game px-6 py-3 text-white rounded-xl inline-block">
            ✍️ สร้างคำขอใหม่
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {vm.requests.map((req) => {
            const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.open;
            const levelCfg = LEVEL_CONFIG[req.level] || LEVEL_CONFIG.beginner;
            return (
              <Link key={req.id} href={`/consultations/${req.id}`} className="block glass rounded-2xl p-5 sm:p-6 hover:scale-[1.005] transition-transform">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Category icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {req.categoryIcon}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-text-primary line-clamp-1">
                        {req.title}
                      </h3>
                      <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </div>

                    <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                      {req.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="glass px-2 py-1 rounded-lg text-xs">
                        {req.categoryIcon} {req.categoryName}
                      </span>
                      <span className={`text-xs font-medium ${levelCfg.color}`}>
                        📊 {levelCfg.label}
                      </span>
                      <span className="text-text-muted text-xs">
                        💰 ฿{req.budgetMin.toLocaleString()} - ฿{req.budgetMax.toLocaleString()}
                      </span>
                      <span className="text-text-muted text-xs">
                        📩 {req.offersCount} ข้อเสนอ
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:flex items-center text-text-muted text-xl">
                    →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
