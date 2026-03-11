'use client';

import { ScheduleTimeSlot } from '@/src/presentation/presenters/schedule/SchedulePresenter';
import dayjs from 'dayjs';
import { Clock, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  slots: ScheduleTimeSlot[];
  onAdd: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  isInstructor?: boolean;
}

export default function AvailabilityModal({
  isOpen,
  onClose,
  date,
  slots,
  onAdd,
  onDelete,
  isInstructor
}: AvailabilityModalProps) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dayOfWeek = dayjs(date).day();
    const success = await onAdd(dayOfWeek, startTime + ':00', endTime + ':00');
    if (success) {
      // Reset or just stay? Usually reset is good.
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md glass rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              {dayjs(date).format('D MMMM YYYY')}
            </h3>
            <p className="text-sm text-text-muted">จัดการตารางเวลา</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* List of existing slots */}
        <div className="p-6 max-h-[40vh] overflow-y-auto space-y-3 custom-scrollbar">
          {slots.length === 0 ? (
            <div className="text-center py-8 text-text-muted italic">ไม่มีการกำหนดเวลาสำหรับวันนี้</div>
          ) : (
            slots.map((slot) => (
              <div 
                key={slot.id} 
                className={`flex items-center justify-between p-4 rounded-2xl border ${
                  slot.isBooked 
                    ? 'bg-warning/10 border-warning/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${slot.isBooked ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}</p>
                    {slot.isBooked && (
                      <p className="text-xs text-warning font-medium">ถูกจองแล้ว: {slot.courseName}</p>
                    )}
                  </div>
                </div>
                
                {isInstructor && !slot.isBooked && (
                  <button 
                    onClick={() => onDelete(slot.id)}
                    className="p-2 hover:bg-error/20 text-error rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add new availability form (Instructor only) */}
        {isInstructor && (
          <form onSubmit={handleAdd} className="p-6 bg-white/5 border-t border-white/10">
            <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Plus size={16} className="text-primary" />
              เพิ่มช่วงเวลาว่างใหม่
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">เวลาเริ่ม</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">เวลาสิ้นสุด</label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full btn-game py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกเวลาว่าง'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
