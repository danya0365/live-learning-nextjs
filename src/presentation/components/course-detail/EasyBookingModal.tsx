import { WizardSlot } from '@/src/application/repositories/IBookingWizardRepository';
import { useEasyBookingPresenter } from '@/src/presentation/presenters/course-detail/useEasyBookingPresenter';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface EasyBookingModalProps {
  course: {
    id: string;
    title: string;
    price: number;
    categoryName: string;
    level: string;
  };
  instructor: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
  };
  initialSlotId?: string; // If opened from a specific slot
  onClose: () => void;
}

const DAY_LABELS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const DAY_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

function getNextDateForDay(dayOfWeek: number): string {
  const now = new Date();
  const currentDay = now.getDay();
  let diff = dayOfWeek - currentDay;
  if (diff <= 0) diff += 7;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + diff);
  return nextDate.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function EasyBookingModal({ course, instructor, initialSlotId, onClose }: EasyBookingModalProps) {
  const { state, actions } = useEasyBookingPresenter();
  const { slots, loading, isBooking, bookingSuccess, error } = state;
  const [selectedSlot, setSelectedSlot] = useState<WizardSlot | null>(null);

  useEffect(() => {
    actions.loadSlots(instructor.id);
  }, [instructor.id]);

  useEffect(() => {
    if (slots.length > 0 && initialSlotId) {
      const found = slots.find((s) => s.id === initialSlotId);
      if (found) setSelectedSlot(found);
    }
  }, [slots, initialSlotId]);

  const handleConfirm = () => {
    if (selectedSlot) {
      actions.confirmBooking(course.id, instructor.id, selectedSlot);
    }
  };

  // Group slots by day
  const slotsByDay = slots.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = [];
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {} as Record<number, WizardSlot[]>);

  const days = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
          
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce-soft">🎉</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">จองสำเร็จ!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              คุณได้ลงทะเบียนเรียนคอร์ส <br/>
              <span className="font-bold text-primary">{course.title}</span> เรียบร้อยแล้ว
            </p>

            <div className="space-y-3">
              <Link
                href="/my-bookings" 
                className="block w-full py-3.5 rounded-xl btn-game text-white font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
              >
                📋 ดูการจองของฉัน
              </Link>
              <button
                onClick={onClose}
                className="block w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col relative shadow-2xl border border-white/10 animate-slideUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">ลงทะเบียนเรียน</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">เลือกเวลาเรียนกับ {instructor.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-12 space-y-4">
               <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               <p className="text-slate-500">กำลังโหลดตารางเรียน...</p>
             </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-slate-500 mb-4">{error}</p>
              <button 
                onClick={() => actions.loadSlots(instructor.id)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                ลองใหม่
              </button>
            </div>
          ) : (
            <>
              {/* Selected Course Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                  📚
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{course.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {course.categoryName} • ฿{course.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                📅 เลือกเวลาเรียน
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  เวลาไทย (GMT+7)
                </span>
              </h3>

              {/* Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {days.map((day) => {
                  const daySlots = slotsByDay[day] || [];
                  if (daySlots.length === 0) return null;

                  return (
                    <div key={day} className="space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-slate-900 py-2 z-10">
                        {getDayLabel(day)}
                      </div>
                      {daySlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        const isAvailable = slot.status === 'available';
                        
                        return (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full text-left p-3 rounded-xl border transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : isAvailable
                                  ? 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60' // Booked but joinable? Logic says yes
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-bold ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                isAvailable 
                                  ? 'bg-success/10 text-success'
                                  : 'bg-warning/10 text-warning'
                              }`}>
                                {isAvailable ? 'ว่าง' : 'จองแล้ว'}
                              </span>
                            </div>
                            {slot.bookedCourseName && (
                               <p className="text-[10px] text-warning mt-1 truncate">📌 {slot.bookedCourseName}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500">ยอดรวม</span>
            <span className="text-2xl font-extrabold text-primary">฿{course.price.toLocaleString()}</span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot || isBooking}
            className="w-full py-3.5 rounded-xl btn-game text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform shadow-lg shadow-primary/20"
          >
            {isBooking ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                กำลังยืนยัน...
              </span>
            ) : (
              'ยืนยันการลงทะเบียน'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function getDayLabel(day: number) {
   switch(day) {
       case 0: return 'วันอาทิตย์';
       case 1: return 'วันจันทร์';
       case 2: return 'วันอังคาร';
       case 3: return 'วันพุธ';
       case 4: return 'วันพฤหัสบดี';
       case 5: return 'วันศุกร์';
       case 6: return 'วันเสาร์';
       default: return '';
   }
}
