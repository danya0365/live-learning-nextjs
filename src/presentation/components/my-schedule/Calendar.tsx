'use client';

import { ScheduleTimeSlot } from '@/src/presentation/presenters/schedule/SchedulePresenter';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarProps {
  month: number;
  year: number;
  timeSlots: ScheduleTimeSlot[];
  onMonthChange: (month: number, year: number) => void;
  onDateClick: (date: string) => void;
  isInstructor?: boolean;
}

export default function Calendar({
  month,
  year,
  timeSlots,
  onMonthChange,
  onDateClick,
  isInstructor
}: CalendarProps) {
  const startOfMonth = dayjs(`${year}-${month}-01`);
  const daysInMonth = startOfMonth.daysInMonth();
  const startDay = startOfMonth.day(); // 0 = Sunday

  const prevMonth = () => {
    const d = startOfMonth.subtract(1, 'month');
    onMonthChange(d.month() + 1, d.year());
  };

  const nextMonth = () => {
    const d = startOfMonth.add(1, 'month');
    onMonthChange(d.month() + 1, d.year());
  };

  const days = [];
  // Fill empty days at start
  for (let i = 0; i < startDay; i++) days.push(null);
  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getDayActivities = (day: number) => {
    const dateStr = startOfMonth.date(day).format('YYYY-MM-DD');
    return timeSlots.filter(s => s.scheduledDate === dateStr);
  };

  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/20">
      {/* Calendar Header */}
      <div className="bg-white/5 p-6 flex items-center justify-between border-b border-white/10">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
          <span className="text-2xl">📅</span>
          {startOfMonth.format('MMMM YYYY')}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-text-muted py-2 uppercase tracking-tight">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;
            
            const activities = getDayActivities(day);
            const hasAvailability = activities.some(s => !s.isBooked);
            const hasBookings = activities.some(s => s.isBooked);

            return (
              <button
                key={day}
                onClick={() => onDateClick(startOfMonth.date(day).format('YYYY-MM-DD'))}
                className={`aspect-square relative rounded-xl sm:rounded-2xl transition-all group flex flex-col items-center justify-center border ${
                  day === dayjs().date() && month === dayjs().month() + 1 && year === dayjs().year()
                    ? 'bg-primary/20 border-primary/50'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className={`text-base sm:text-xl font-bold ${
                   day === dayjs().date() && month === dayjs().month() + 1 && year === dayjs().year()
                   ? 'text-primary'
                   : 'text-text-primary'
                }`}>
                  {day}
                </span>

                {/* Status Indicators */}
                <div className="absolute bottom-2 flex gap-1">
                  {hasAvailability && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  )}
                  {hasBookings && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-warning shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  )}
                </div>

                {/* Hover Add Button for Instructor */}
                {isInstructor && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white p-0.5 rounded-lg">
                    <Plus size={12} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="px-6 py-4 bg-white/5 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-text-muted">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>ว่าง</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted">
          <div className="w-2 h-2 rounded-full bg-warning" />
          <span>มีสอน / ถูกจอง</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted">
           <div className="w-3 h-3 rounded-lg border border-primary/50 bg-primary/20" />
           <span>วันนี้</span>
        </div>
      </div>
    </div>
  );
}
