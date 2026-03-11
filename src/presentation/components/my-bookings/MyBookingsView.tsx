/**
 * MyBookingsView
 * Student's bookings dashboard with status filters and booking cards
 * Pure CSS — no react-spring
 */

'use client';

import { BookingFilter, MyBookingsViewModel } from '@/src/presentation/presenters/my-bookings/MyBookingsPresenter';
import { useMyBookingsPresenter } from '@/src/presentation/presenters/my-bookings/useMyBookingsPresenter';
import Link from 'next/link';
import MyBookingsSkeleton from './MyBookingsSkeleton';

interface MyBookingsViewProps {
  initialViewModel?: MyBookingsViewModel;
}

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  confirmed: { label: 'ยืนยันแล้ว', icon: '✅', color: 'text-success', bg: 'bg-success/10 border-success/30' },
  pending: { label: 'รอยืนยัน', icon: '⏳', color: 'text-warning', bg: 'bg-warning/10 border-warning/30' },
  completed: { label: 'เรียนจบแล้ว', icon: '🎓', color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
  cancelled: { label: 'ยกเลิก', icon: '❌', color: 'text-error', bg: 'bg-error/10 border-error/30' },
};

const FILTER_OPTIONS: { value: BookingFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'ทั้งหมด', icon: '📋' },
  { value: 'confirmed', label: 'ยืนยันแล้ว', icon: '✅' },
  { value: 'pending', label: 'รอยืนยัน', icon: '⏳' },
  { value: 'completed', label: 'เรียนจบ', icon: '🎓' },
  { value: 'cancelled', label: 'ยกเลิก', icon: '❌' },
];

export function MyBookingsView({ initialViewModel }: MyBookingsViewProps) {
  const [state, actions] = useMyBookingsPresenter(initialViewModel);
  const vm = state.viewModel;

  if (state.loading && !vm) {
    return <MyBookingsSkeleton />;
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
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          📋 การจองของฉัน
        </h1>
        <p className="text-text-secondary">
          ติดตามคอร์สเรียนและนัดหมายของคุณ • มี {vm.upcomingCount} คอร์สที่กำลังจะถึง
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📊', value: vm.stats.totalItems, label: 'ทั้งหมด', color: 'text-text-primary' },
          { icon: '✅', value: vm.stats.confirmedCount, label: 'ยืนยันแล้ว', color: 'text-success' },
          { icon: '⏳', value: vm.stats.pendingCount, label: 'รอยืนยัน', color: 'text-warning' },
          { icon: '🎓', value: vm.stats.completedCount, label: 'เรียนจบ', color: 'text-primary' },
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

      {/* Booking cards */}
      {vm.bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-text-secondary text-lg mb-2">ยังไม่มีการจอง</p>
          <p className="text-text-muted text-sm mb-6">เลือกคอร์สที่สนใจแล้วจองเลย!</p>
          <Link href="/courses" className="btn-game px-6 py-3 text-white rounded-xl inline-block">
            📚 ดูคอร์สทั้งหมด
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {vm.bookings.map((booking) => {
            const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
            return (
              <div key={booking.id} className="glass rounded-2xl p-5 sm:p-6 hover:scale-[1.005] transition-transform">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Date column */}
                  <div className="flex-shrink-0 text-center sm:w-24">
                    <div className="glass rounded-xl p-3">
                      <div className="text-xs text-text-muted uppercase">
                        {new Date(booking.scheduledDate).toLocaleDateString('th-TH', { month: 'short' })}
                      </div>
                      <div className="text-2xl font-extrabold text-text-primary">
                        {new Date(booking.scheduledDate).getDate()}
                      </div>
                      <div className="text-xs text-text-muted">
                        {new Date(booking.scheduledDate).toLocaleDateString('th-TH', { weekday: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Info column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link href={`/courses/${booking.courseId}`} className="text-lg font-bold text-text-primary hover:text-primary transition-colors line-clamp-1">
                        {booking.courseName}
                      </Link>
                      <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-3">
                      <Link href={`/instructors/${booking.instructorId}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">👨‍🏫</span>
                        {booking.instructorName}
                      </Link>
                      <span className="text-text-muted">•</span>
                      <span>🕐 {booking.startTime} - {booking.endTime}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {booking.status === 'confirmed' && (
                        <Link href="/live" className="px-4 py-1.5 rounded-lg bg-error/10 border border-error/30 text-error text-xs font-bold hover:bg-error/20 transition-colors">
                          🔴 เข้าห้องเรียนสด
                        </Link>
                      )}
                      {booking.status === 'pending' && (
                        <button className="px-4 py-1.5 rounded-lg bg-warning/10 border border-warning/30 text-warning text-xs font-bold">
                          ⏳ รอการยืนยัน
                        </button>
                      )}
                      <Link href={`/courses/${booking.courseId}`} className="px-4 py-1.5 rounded-lg glass text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
                        📖 รายละเอียดคอร์ส
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
