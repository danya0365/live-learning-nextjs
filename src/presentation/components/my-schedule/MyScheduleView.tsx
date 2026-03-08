'use client';

import { MyScheduleViewModel } from '@/src/presentation/presenters/schedule/MySchedulePresenter';
import { ScheduleTimeSlot } from '@/src/presentation/presenters/schedule/SchedulePresenter';
import { useMySchedulePresenter } from '@/src/presentation/presenters/schedule/useMySchedulePresenter';
import { useAuthStore } from '@/src/stores/authStore';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Filter, List, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AvailabilityModal from './AvailabilityModal';
import Calendar from './Calendar';
import MyScheduleSkeleton from './MyScheduleSkeleton';

const DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

interface MyScheduleViewProps {
  initialViewModel?: MyScheduleViewModel;
}

export function MyScheduleView({ initialViewModel }: MyScheduleViewProps) {
  const [state, actions] = useMySchedulePresenter(initialViewModel);
  const vm = state.viewModel;
  const { user } = useAuthStore();
  const router = useRouter();
  const isInstructor = user?.role === 'instructor';

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (state.loading && !vm) {
    return <MyScheduleSkeleton />;
  }

  if (state.error && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 rounded-3xl text-center max-w-md">
          <div className="text-6xl mb-6">⚠️</div>
          <p className="text-error font-bold text-xl mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-text-secondary mb-8">{state.error}</p>
          <button onClick={() => actions.loadData()} className="btn-game w-full py-3 text-white rounded-xl font-bold">ลองใหม่อีกครั้ง</button>
        </div>
      </div>
    );
  }

  if (!vm) return null;

  const displaySlots = vm.timeSlots;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary mb-4 tracking-tight">
            {isInstructor ? (
              <span className="flex items-center gap-3">📅 ตารางสอน<span className="text-primary text-2xl">ของฉัน</span></span>
            ) : (
              <span className="flex items-center gap-3">📅 ตารางเรียน<span className="text-primary text-2xl">ของฉัน</span></span>
            )}
          </h1>
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
            {isInstructor
              ? 'จัดการเวลาว่างของคุณ และตรวจสอบคลาสที่มีนักเรียนจองเข้ามา'
              : 'ตรวจสอบคลาสที่คุณจองเอาไว้และเข้าร่วมห้องเรียนออนไลน์'}
          </p>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 self-center sm:self-auto">
          <button 
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === 'calendar' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary hover:bg-white/5'
            }`}
          >
            <CalendarIcon size={18} /> ปฏิทิน
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary hover:bg-white/5'
            }`}
          >
            <List size={18} /> รายการ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="glass p-5 rounded-3xl border-l-4 border-l-success">
              <div className="text-3xl font-black text-text-primary mb-1">{vm.availableSlots}</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider">ช่วงว่างทั้งหมด</div>
            </div>
            <div className="glass p-5 rounded-3xl border-l-4 border-l-warning">
              <div className="text-3xl font-black text-text-primary mb-1">{vm.bookedSlots}</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider">คลาสที่มีการจอง</div>
            </div>
          </div>

          {/* Filters */}
          <div className="glass p-6 rounded-3xl space-y-8 sticky top-24 border border-white/10">
            <div>
              <h3 className="text-sm font-black text-text-primary mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Filter size={16} className="text-primary" /> ตัวกรองอาจารย์
              </h3>
              {!isInstructor ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => actions.setInstructor(null)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      !vm.filters.instructorId
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white/5 text-text-muted hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    👨‍🏫 ทุกอาจารย์
                  </button>
                  {vm.instructors.map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => actions.setInstructor(inst.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        vm.filters.instructorId === inst.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white/5 text-text-muted hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                         {inst.name}
                         <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded opacity-50">★ {inst.rating}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-xs text-text-muted font-medium mb-1">มุมมอง</p>
                   <p className="text-sm font-bold text-text-primary italic">ตารางสอนของคุณเอง</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-black text-text-primary mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Search size={16} className="text-primary" /> สถานะ
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => actions.toggleShowAvailableOnly()}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                    vm.filters.showAvailableOnly
                      ? 'bg-success/10 text-success border-success/30'
                      : 'bg-white/5 text-text-muted border-white/5'
                  }`}
                >
                  ✅ เฉพาะช่วงว่าง
                </button>
                <button
                  onClick={() => actions.toggleShowBookedOnly()}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                    vm.filters.showBookedOnly
                      ? 'bg-warning/10 text-warning border-warning/30'
                      : 'bg-white/5 text-text-muted border-white/5'
                  }`}
                >
                  📌 {isInstructor ? 'คลาสที่จองแล้ว' : 'ถูกจองแล้วเท่านั้น'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {viewMode === 'calendar' ? (
            <Calendar 
              month={vm.filters.month}
              year={vm.filters.year}
              timeSlots={displaySlots}
              onMonthChange={(m, y) => actions.setMonth(m, y)}
              onDateClick={(d) => setSelectedDate(d)}
              isInstructor={isInstructor}
            />
          ) : (
            <div className="space-y-12">
              {displaySlots.length === 0 ? (
                <div className="glass py-24 rounded-3xl text-center border border-white/10 border-dashed">
                  <div className="text-7xl mb-6">📅</div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">ไม่พบคลาสที่ค้นหา</h3>
                  <p className="text-text-muted">ลองปรับตัวกรอง หรือเปลี่ยนเป็นมุมมองปฏิทิน</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {displaySlots.map((slot) => (
                      <TimeSlotCard key={`${slot.scheduledDate}-${slot.id}`} slot={slot} />
                   ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDate && (
        <AvailabilityModal 
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          date={selectedDate}
          slots={displaySlots.filter(s => s.scheduledDate === selectedDate)}
          onAdd={actions.addAvailability}
          onDelete={actions.deleteAvailability}
          isInstructor={isInstructor}
        />
      )}
    </div>
  );
}

function TimeSlotCard({ slot }: { slot: ScheduleTimeSlot }) {
  const router = useRouter();
  const isBooked = slot.isBooked;
  
  return (
    <div
      className={`glass rounded-3xl p-6 relative group transition-all duration-300 border-l-8 ${
        isBooked ? 'border-l-warning' : 'border-l-primary shadow-lg shadow-primary/5'
      } hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <span className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">
            {dayjs(slot.scheduledDate).format('D MMM YYYY')}
          </span>
          <h3 className="text-2xl font-black text-text-primary flex items-center gap-2">
            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
          </h3>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${
          isBooked ? 'bg-warning/10 text-warning border-warning/30' : 'bg-success/10 text-success border-success/30'
        }`}>
          {isBooked ? '📌 ถูกจองแล้ว' : '✅ ว่าง'}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg shadow-lg">
            👨‍🏫
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">ผู้สอน</p>
            <p className="text-sm font-bold text-text-primary">{slot.instructorName}</p>
          </div>
        </div>

        {isBooked && (
          <div className="bg-warning/5 rounded-2xl p-4 border border-warning/10">
            <p className="text-xs text-warning/80 font-bold uppercase tracking-widest mb-1">วิชาที่สอน</p>
            <p className="text-sm font-bold text-text-primary line-clamp-1">{slot.courseName || 'ไม่ระบุวิชา'}</p>
            {slot.studentName && (
               <p className="text-[10px] text-text-muted mt-2">โดย: {slot.studentName}</p>
            )}
          </div>
        )}
      </div>

      {!isBooked && (
        <button
          onClick={() => router.push(`/book?instructorId=${slot.instructorId}&date=${slot.scheduledDate}&slotId=${slot.id}`)}
          className="w-full btn-game py-3 text-sm text-white rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
        >
          📅 จองเวลาเรียน
        </button>
      )}
      
      {isBooked && (
        <button
          className="w-full bg-white/5 text-text-muted py-3 rounded-xl text-xs font-bold border border-white/5 cursor-not-allowed"
        >
          เข้าร่วมห้องเรียนออนไลน์
        </button>
      )}
    </div>
  );
}
