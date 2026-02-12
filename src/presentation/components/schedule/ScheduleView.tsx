/**
 * ScheduleView
 * Weekly schedule view showing instructor timeslots
 * Shows booked vs available, with ability to join booked courses
 * Pure CSS — no react-spring
 */

'use client';

import { ScheduleTimeSlot, ScheduleViewModel } from '@/src/presentation/presenters/schedule/SchedulePresenter';
import { useSchedulePresenter } from '@/src/presentation/presenters/schedule/useSchedulePresenter';

const DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

interface ScheduleViewProps {
  initialViewModel?: ScheduleViewModel;
}

export function ScheduleView({ initialViewModel }: ScheduleViewProps) {
  const [state, actions] = useSchedulePresenter(initialViewModel);
  const vm = state.viewModel;

  if (state.loading && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">📅</div>
          <p className="text-text-secondary text-lg">กำลังโหลดตารางเรียน...</p>
        </div>
      </div>
    );
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

  // Group timeslots by day
  const slotsByDay: Record<number, ScheduleTimeSlot[]> = {};
  vm.timeSlots.forEach((slot) => {
    if (!slotsByDay[slot.dayOfWeek]) slotsByDay[slot.dayOfWeek] = [];
    slotsByDay[slot.dayOfWeek].push(slot);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          📅 ตารางเรียน
        </h1>
        <p className="text-text-secondary">
          ดูตารางเวลาสอน จองเรียนสด หรือเข้าร่วมคอร์สที่มีอยู่
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-text-primary">{vm.totalSlots}</div>
          <div className="text-xs text-text-muted">📅 ช่วงเวลาทั้งหมด</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-success">{vm.availableSlots}</div>
          <div className="text-xs text-text-muted">✅ ว่าง</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-extrabold text-warning">{vm.bookedSlots}</div>
          <div className="text-xs text-text-muted">📌 ถูกจองแล้ว</div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 sm:p-6 mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {/* Instructor filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => actions.setInstructor(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !vm.filters.instructorId
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
              }`}
            >
              👨‍🏫 ทุกอาจารย์
            </button>
            {vm.instructors.map((inst) => (
              <button
                key={inst.id}
                onClick={() => actions.setInstructor(inst.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vm.filters.instructorId === inst.id
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
                }`}
              >
                {inst.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Day filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => actions.setDay(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                vm.filters.dayOfWeek === null
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
              }`}
            >
              ทุกวัน
            </button>
            {DAY_NAMES.map((day, index) => (
              <button
                key={day}
                onClick={() => actions.setDay(index)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vm.filters.dayOfWeek === index
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-text-secondary hover:border-primary/50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => actions.toggleShowAvailableOnly()}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
              vm.filters.showAvailableOnly
                ? 'bg-success/10 text-success border border-success/30'
                : 'bg-surface border border-border text-text-secondary hover:border-success/50'
            }`}
          >
            ✅ ว่างเท่านั้น
          </button>
          <button
            onClick={() => actions.toggleShowBookedOnly()}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
              vm.filters.showBookedOnly
                ? 'bg-warning/10 text-warning border border-warning/30'
                : 'bg-surface border border-border text-text-secondary hover:border-warning/50'
            }`}
          >
            📌 ถูกจองแล้วเท่านั้น
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-muted mb-6">
        แสดงผล <span className="font-bold text-text-primary">{vm.timeSlots.length}</span> ช่วงเวลา
      </p>

      {/* Schedule by day */}
      {vm.timeSlots.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-text-secondary text-lg mb-2">ไม่พบช่วงเวลาที่ค้นหา</p>
          <p className="text-text-muted text-sm">ลองเปลี่ยนตัวกรองใหม่</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(slotsByDay)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([dayIndex, slots]) => (
              <div key={dayIndex}>
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {DAY_NAMES[Number(dayIndex)].charAt(0)}
                  </span>
                  วัน{DAY_NAMES[Number(dayIndex)]}
                  <span className="text-xs text-text-muted font-normal ml-2">({slots.length} ช่วง)</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slots.map((slot) => (
                    <TimeSlotCard key={slot.id} slot={slot} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function TimeSlotCard({ slot }: { slot: ScheduleTimeSlot }) {
  return (
    <div
      className={`glass rounded-2xl p-5 relative hover:scale-[1.02] transition-transform border-l-4 ${
        slot.isBooked ? 'border-l-warning' : 'border-l-success'
      }`}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        {slot.isBooked ? (
          <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-bold border border-warning/30">
            📌 ถูกจองแล้ว
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-bold border border-success/30">
            ✅ ว่าง
          </span>
        )}
      </div>

      {/* Instructor */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm">
          👨‍🏫
        </div>
        <span className="font-semibold text-text-primary text-sm">{slot.instructorName}</span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 text-text-primary mb-2">
        <span className="text-lg">🕐</span>
        <span className="text-lg font-bold">{slot.startTime} - {slot.endTime}</span>
      </div>

      {/* Booked course info */}
      {slot.isBooked && slot.bookedCourseName && (
        <div className="mt-3 p-3 rounded-xl bg-warning/5 border border-warning/20">
          <p className="text-xs text-text-muted mb-1">กำลังสอนคอร์ส:</p>
          <p className="text-sm font-semibold text-text-primary">{slot.bookedCourseName}</p>
          <button className="mt-2 text-xs text-primary font-medium hover:underline">
            🎥 สมัครเข้าร่วมเรียนออนไลน์ →
          </button>
        </div>
      )}

      {/* Book button for available slots */}
      {!slot.isBooked && (
        <button className="mt-3 w-full btn-game py-2 text-sm text-white rounded-xl font-medium hover:scale-105 transition-transform">
          📅 จองเวลาเรียน
        </button>
      )}
    </div>
  );
}
