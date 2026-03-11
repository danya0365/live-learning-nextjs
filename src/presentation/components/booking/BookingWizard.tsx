'use client';

import { WizardCourse, WizardInstructor, WizardSlot } from '@/src/application/repositories/IBookingWizardRepository';
import { Level } from '@/src/application/repositories/IConfigRepository';
import { useBookingWizardPresenter } from '@/src/presentation/presenters/booking/useBookingWizardPresenter';
import { useMemo, useState } from 'react';
import BookingSkeleton from './BookingSkeleton';

/* ── UI Constants ──────────────────────────── */

const DAY_LABELS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const DAY_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

function getLevelBadgeClass(levelValue: string, levels: { value: string; color?: string }[]) {
  const level = levels.find((l) => l.value === levelValue);
  const colorClass = level?.color || 'text-primary';
  
  if (colorClass.includes('success')) return 'bg-success/10 text-success border-success/30';
  if (colorClass.includes('warning')) return 'bg-warning/10 text-warning border-warning/30';
  if (colorClass.includes('error')) return 'bg-error/10 text-error border-error/30';
  return 'bg-primary/10 text-primary border-primary/30';
}

type Step = 'course' | 'instructor' | 'calendar' | 'confirm';

const STEP_META: Record<Step, { number: number; label: string; icon: string }> = {
  course: { number: 1, label: 'เลือกคอร์ส', icon: '📚' },
  instructor: { number: 2, label: 'เลือกอาจารย์', icon: '👨‍🏫' },
  calendar: { number: 3, label: 'ดูปฏิทิน', icon: '📅' },
  confirm: { number: 4, label: 'ยืนยัน', icon: '✅' },
};

/* ── Helper: Get next dates for day of week ── */
function getNextDateForDay(dayOfWeek: number): string {
  const now = new Date();
  const currentDay = now.getDay();
  let diff = dayOfWeek - currentDay;
  if (diff <= 0) diff += 7;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + diff);
  return nextDate.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Component ─────────────────────────────── */
export function BookingWizard() {
  const { state, actions } = useBookingWizardPresenter();
  
  const {
    step,
    courses,
    availableInstructors,
    calendarSlots,
    selectedCourse,
    selectedInstructor,
    selectedSlot,
    bookingAction,
    isBooking,
    bookingDone,
    loading,
    levels,
    couponCode,
    isApplyingCoupon,
    couponError,
    discountAmount,
    finalPrice,
    isEnrolled
  } = state;

  const steps: Step[] = ['course', 'instructor', 'calendar', 'confirm'];
  const currentIdx = steps.indexOf(step);

  if (loading) {
    return <BookingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30 glass border-b border-border/50 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => window.location.href = '/'} 
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-medium">กลับหน้าหลัก</span>
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span>{STEP_META[step].icon}</span>
            <span className="font-bold text-text-primary">{STEP_META[step].label}</span>
            <span className="text-text-muted">({currentIdx + 1}/{steps.length})</span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => {
              const meta = STEP_META[s];
              const isActive = i === currentIdx;
              const isDone = i < currentIdx || bookingDone;
              return (
                <div key={s} className="flex items-center gap-1.5 flex-1">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-300 flex-shrink-0 ${
                    isDone ? 'bg-success text-white' : isActive ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-surface text-text-muted border border-border'
                  }`}>
                    {isDone ? '✓' : meta.number}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block transition-colors ${
                    isActive ? 'text-primary' : isDone ? 'text-success' : 'text-text-muted'
                  }`}>
                    {meta.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                      isDone ? 'bg-success' : 'bg-border/50'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="animate-fadeIn">
          {step === 'course' && (
            <StepCourse courses={courses} levels={levels} onSelect={actions.handleCourseSelect} />
          )}
          {step === 'instructor' && selectedCourse && (
            <StepInstructor
              course={selectedCourse}
              instructors={availableInstructors}
              onSelect={actions.handleInstructorSelect}
              onBack={actions.goBack}
              isEnrolled={isEnrolled}
            />
          )}
          {step === 'calendar' && selectedCourse && selectedInstructor && (
            <StepCalendar
              course={selectedCourse}
              instructor={selectedInstructor}
              slots={calendarSlots}
              onSelect={actions.handleSlotSelect}
              onBack={actions.goBack}
              isEnrolled={isEnrolled}
            />
          )}
          {step === 'confirm' && selectedCourse && selectedInstructor && selectedSlot && (
            <StepConfirm
              course={selectedCourse}
              instructor={selectedInstructor}
              slot={selectedSlot}
              action={bookingAction}
              isBooking={isBooking}
              bookingDone={bookingDone}
              levels={levels}
              couponCode={couponCode}
              isApplyingCoupon={isApplyingCoupon}
              couponError={couponError}
              discountAmount={discountAmount}
              finalPrice={finalPrice}
              setCouponCode={actions.setCouponCode}
              applyCoupon={actions.applyCoupon}
              onConfirm={actions.handleConfirm}
              onBack={actions.goBack}
              onFinish={actions.handleFinish}
              onNewBooking={actions.handleNewBooking}
              isEnrolled={isEnrolled}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Step 1: เลือกคอร์ส
   ════════════════════════════════════════════ */
function StepCourse({ courses, levels, onSelect }: { courses: WizardCourse[]; levels: Level[]; onSelect: (c: WizardCourse) => void }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.categoryName.toLowerCase().includes(q),
    );
  }, [search, courses]);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-2">
          📚 เลือกคอร์สที่ต้องการจอง
        </h1>
        <p className="text-text-secondary text-sm">เลือกคอร์สเรียนที่คุณสนใจ</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาคอร์ส..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl glass border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
        />
      </div>

      {/* Course list */}
      <div className="space-y-3">
        {filtered.map((course) => {
          const lv = levels.find((l) => l.value === course.level) || levels[0];
          const badgeClass = getLevelBadgeClass(course.level, levels);
          return (
            <button
              key={course.id}
              onClick={() => onSelect(course)}
              className="w-full text-left glass rounded-2xl p-4 sm:p-5 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.01] transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-text-primary text-base mb-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-text-muted text-xs mb-2">
                    {course.instructorName} • {course.categoryName}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                      {lv.label}
                    </span>
                    {course.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-surface text-[10px] text-text-muted font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-extrabold text-primary">
                    ฿{course.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                    <span>⭐ {course.rating}</span>
                    <span>•</span>
                    <span>👥 {course.totalStudents.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-primary font-medium">เลือกคอร์สนี้ →</span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-text-muted">ไม่พบคอร์สที่ค้นหา</p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   Step 2: เลือกอาจารย์
   ════════════════════════════════════════════ */
function StepInstructor({
  course,
  instructors,
  onSelect,
  onBack,
  isEnrolled,
}: {
  course: WizardCourse;
  instructors: WizardInstructor[];
  onSelect: (i: WizardInstructor) => void;
  onBack: () => void;
  isEnrolled: boolean;
}) {
  return (
    <div>
      {/* Context banner */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>เปลี่ยนคอร์ส</span>
      </button>

      <div className="glass rounded-2xl p-4 border border-primary/20 bg-primary/5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">📚</div>
          <div className="min-w-0">
            <p className="text-xs text-primary font-medium">คอร์สที่เลือก</p>
            <p className="font-bold text-text-primary text-sm truncate">{course.title}</p>
          </div>
          {isEnrolled && (
            <div className="ml-auto px-2 py-1 rounded-lg bg-success/10 border border-success/30 text-[10px] font-bold text-success animate-pulse">
               👑 OWNED
            </div>
          )}
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-text-primary mb-2">
          👨‍🏫 เลือกอาจารย์ผู้สอน
        </h2>
        <p className="text-text-secondary text-sm">อาจารย์ที่สอนคอร์สนี้</p>
      </div>

      <div className="space-y-3">
        {instructors.map((inst) => (
          <button
            key={inst.id}
            onClick={() => onSelect(inst)}
            className="w-full text-left glass rounded-2xl p-5 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.01] transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                👨‍🏫
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                    {inst.name}
                  </h3>
                  {inst.isOnline && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 border border-success/30 text-[10px] font-bold text-success">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                      </span>
                      ONLINE
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {inst.specializations.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-surface text-[10px] text-text-muted font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>⭐ {inst.rating}</span>
                  <span>👥 {inst.totalStudents.toLocaleString()} นักเรียน</span>
                  <span>💰 ฿{inst.hourlyRate}/ชม.</span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0">
                →
              </div>
            </div>
          </button>
        ))}
      </div>

      {instructors.length === 0 && (
        <div className="text-center py-12 glass rounded-2xl">
          <div className="text-4xl mb-3">👨‍🏫</div>
          <p className="text-text-muted">ไม่พบอาจารย์สำหรับคอร์สนี้</p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   Step 3: ดูปฏิทิน
   ════════════════════════════════════════════ */
function StepCalendar({
  course,
  instructor,
  slots,
  onSelect,
  onBack,
  isEnrolled,
}: {
  course: WizardCourse;
  instructor: WizardInstructor;
  slots: WizardSlot[];
  onSelect: (slot: WizardSlot) => void;
  onBack: () => void;
  isEnrolled: boolean;
}) {
  // Group slots by day of week
  const slotsByDay = useMemo(() => {
    const grouped: Record<number, WizardSlot[]> = {};
    for (const slot of slots) {
      if (!grouped[slot.dayOfWeek]) grouped[slot.dayOfWeek] = [];
      grouped[slot.dayOfWeek].push(slot);
    }
    return grouped;
  }, [slots]);

  // All 7 days for the calendar
  const days = [1, 2, 3, 4, 5, 6, 0]; // จันทร์-อาทิตย์

  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>เปลี่ยนอาจารย์</span>
      </button>

      {/* Context */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 glass rounded-xl p-3 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <span className="text-sm">📚</span>
            <div className="min-w-0">
              <p className="text-[10px] text-primary font-medium">คอร์ส</p>
              <p className="text-xs font-bold text-text-primary truncate">{course.title}</p>
            </div>
            {isEnrolled && (
              <div className="ml-auto px-1.5 py-0.5 rounded bg-success/10 border border-success/30 text-[8px] font-bold text-success animate-pulse">
                👑 OWNED
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 glass rounded-xl p-3 border border-purple-500/20 bg-purple-500/5">
          <div className="flex items-center gap-2">
            <span className="text-sm">👨‍🏫</span>
            <div className="min-w-0">
              <p className="text-[10px] text-purple-500 font-medium">อาจารย์</p>
              <p className="text-xs font-bold text-text-primary truncate">{instructor.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-text-primary mb-2">
          📅 เลือกเวลาเรียน
        </h2>
        <p className="text-text-secondary text-sm">คลิกช่องเพื่อจองหรือเข้าร่วม</p>
      </div>

      {slots.length === 0 ? (
        <div className="glass rounded-2xl p-8 border border-warning/30 bg-warning/5 text-center my-8 animate-fadeIn">
          <div className="text-5xl mb-4">🗓️</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            ยังไม่มีตารางสอน
          </h3>
          <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
            อ๊ะ! ดูเหมือนว่าอาจารย์ท่านนี้ยังไม่ได้เปิดช่วงเวลาสอนในขณะนี้ กรุณาเลือกอาจารย์ท่านอื่น หรือกลับมาตรวจสอบใหม่ภายหลังครับ
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl btn-game text-white text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            ← เลือกอาจารย์ท่านอื่น
          </button>
        </div>
      ) : (
        <>
          {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-success/20 border border-success/50" />
          <span className="text-text-secondary">ว่าง — จองใหม่</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-warning/20 border border-warning/50" />
          <span className="text-text-secondary">คอร์สเดียวกัน — เข้าร่วม</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-surface border border-border" />
          <span className="text-text-secondary">ติดสอนคลาสอื่น / ไม่มีคลาส</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {days.map((day) => {
          const daySlots = slotsByDay[day] || [];
          return (
            <div key={day} className="glass rounded-2xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {DAY_SHORT[day]}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{DAY_LABELS[day]}</p>
                  <p className="text-[10px] text-text-muted">{getNextDateForDay(day)}</p>
                </div>
              </div>

              {daySlots.length === 0 ? (
                <div className="text-center py-4 rounded-xl bg-surface/50 border border-border/30">
                  <span className="text-xs text-text-muted">— ไม่มีคลาส —</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => {
                    const isAvailable = slot.status === 'available';
                    const isJoinable = slot.status === 'booked' && slot.bookedCourseId === course.id;
                    const isUnavailable = slot.status === 'booked' && slot.bookedCourseId !== course.id;
                    
                    return (
                    <button
                      key={slot.id}
                      onClick={() => !isUnavailable && onSelect(slot)}
                      disabled={isUnavailable}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                        isAvailable
                          ? 'bg-success/10 border-success/40 hover:bg-success/20 hover:shadow-md hover:shadow-success/10 hover:scale-[1.02] cursor-pointer'
                          : isJoinable
                          ? 'bg-warning/10 border-warning/40 hover:bg-warning/20 hover:shadow-md hover:shadow-warning/10 hover:scale-[1.02] cursor-pointer'
                          : 'bg-surface/50 border-border/30 opacity-70 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm ${isAvailable ? 'text-success' : isJoinable ? 'text-warning' : 'text-text-muted'}`}>
                              {isAvailable ? '🟢' : isJoinable ? '🟡' : '🔴'}
                            </span>
                            <span className={`text-sm font-bold ${isUnavailable ? 'text-text-muted' : 'text-text-primary'}`}>
                              {slot.startTime} — {slot.endTime}
                            </span>
                          </div>
                          {slot.status === 'booked' && slot.bookedCourseName && (
                            <p className={`text-[10px] ml-5 mt-0.5 ${isJoinable ? 'text-warning' : 'text-text-muted'}`}>
                              📌 {slot.bookedCourseName}
                            </p>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAvailable
                            ? 'bg-success/20 text-success'
                            : isJoinable
                            ? 'bg-warning/20 text-warning'
                            : 'bg-surface text-text-muted'
                        }`}>
                          {isAvailable ? 'จองใหม่' : isJoinable ? 'เข้าร่วม' : 'ไม่ว่าง'}
                        </span>
                      </div>
                    </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   Step 4: ยืนยัน
   ════════════════════════════════════════════ */
function StepConfirm({
  course,
  instructor,
  slot,
  action,
  isBooking,
  bookingDone,
  onConfirm,
  onBack,
  onFinish,
  onNewBooking,
  levels,
  couponCode,
  isApplyingCoupon,
  couponError,
  discountAmount,
  finalPrice,
  setCouponCode,
  applyCoupon,
  isEnrolled,
}: {
  course: WizardCourse;
  instructor: WizardInstructor;
  slot: WizardSlot;
  action: 'new' | 'join';
  isBooking: boolean;
  bookingDone: boolean;
  onConfirm: () => void;
  onBack: () => void;
  onFinish: () => void;
  onNewBooking: () => void;
  levels: Level[];
  couponCode: string;
  isApplyingCoupon: boolean;
  couponError: string | null;
  discountAmount: number;
  finalPrice: number | null;
  setCouponCode: (c: string) => void;
  applyCoupon: () => void;
  isEnrolled: boolean;
}) {
  if (bookingDone) {
    return (
      <div className="text-center py-8 animate-fadeIn">
        <div className="text-7xl mb-4 animate-bounce-soft">
          {action === 'new' ? '🎉' : '🤝'}
        </div>
        <h2 className="text-2xl font-extrabold text-text-primary mb-2">
          {action === 'new' ? 'จองสำเร็จ!' : 'เข้าร่วมสำเร็จ!'}
        </h2>
        <p className="text-text-secondary text-sm mb-2">
          {action === 'new'
            ? 'ระบบได้จองเวลาเรียนให้คุณเรียบร้อยแล้ว'
            : 'คุณได้เข้าร่วมห้องเรียนเรียบร้อยแล้ว'}
        </p>
        <p className="text-text-muted text-xs mb-8">
          ✉️ {isEnrolled ? 'คุณสามารถดูตารางเรียนทั้งหมดได้ในหน้าการจอง' : 'อีเมลยืนยันจะถูกส่งไปยังอีเมลของคุณ'}
        </p>

        {/* Summary card */}
        <div className="glass rounded-2xl p-5 border border-success/30 bg-success/5 text-left mb-8 max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">📚</span>
              <div>
                <p className="text-[10px] text-text-muted">คอร์ส</p>
                <p className="text-sm font-bold text-text-primary">
                  {action === 'join' && slot.bookedCourseName ? slot.bookedCourseName : course.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">👨‍🏫</span>
              <div>
                <p className="text-[10px] text-text-muted">อาจารย์</p>
                <p className="text-sm font-bold text-text-primary">{instructor.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-[10px] text-text-muted">วัน-เวลา</p>
                <p className="text-sm font-bold text-text-primary">
                  {DAY_LABELS[slot.dayOfWeek]} {slot.startTime} — {slot.endTime}
                </p>
                <p className="text-[10px] text-text-muted">{getNextDateForDay(slot.dayOfWeek)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={onNewBooking}
            className="flex-1 px-4 py-3 rounded-xl glass border border-border text-sm font-medium text-text-secondary hover:text-primary hover:border-primary/50 transition-colors"
          >
            📚 จองคอร์สอื่น
          </button>
          <button
            onClick={onFinish}
            className="flex-1 px-4 py-3 rounded-xl btn-game text-white text-sm font-bold hover:scale-[1.02] active:scale-95 transition-transform"
          >
            📋 ดูการจองของฉัน
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>เปลี่ยนเวลา</span>
      </button>

      <div className="text-center mb-6">
        <div className="text-5xl mb-3">
          {action === 'new' ? '📝' : '🤝'}
        </div>
        <h2 className="text-2xl font-extrabold text-text-primary mb-2">
          {action === 'new' ? 'ยืนยันการจอง' : 'ยืนยันเข้าร่วม'}
        </h2>
        <p className="text-text-secondary text-sm">
          {isEnrolled 
            ? '✨ คุณเป็นเจ้าของคอร์สนี้แล้ว สามารถจองเวลาเรียนได้ฟรี' 
            : action === 'new'
              ? 'ตรวจสอบข้อมูลก่อนยืนยัน'
              : 'คุณจะเข้าร่วมห้องเรียนที่มีคนจองไว้แล้ว'}
        </p>
      </div>

      {/* Summary */}
      <div className="glass rounded-2xl p-6 border border-border/50 mb-6 space-y-4">
        <div className="flex items-start gap-3 pb-4 border-b border-border/30">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">📚</div>
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">คอร์ส</p>
            <p className="font-bold text-text-primary">
              {action === 'join' && slot.bookedCourseName ? slot.bookedCourseName : course.title}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {(levels.find(l => l.value === course.level) || levels[0])?.label} 
              {action !== 'join' && ` • ${course.categoryName}`}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 pb-4 border-b border-border/30">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-lg shrink-0">👨‍🏫</div>
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">อาจารย์</p>
            <p className="font-bold text-text-primary">{instructor.name}</p>
            <p className="text-xs text-text-muted mt-0.5">
              ⭐ {instructor.rating} • 💰 ฿{instructor.hourlyRate}/ชม.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 pb-4 border-b border-border/30">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-lg shrink-0">📅</div>
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">วัน-เวลา</p>
            <p className="font-bold text-text-primary">
              {DAY_LABELS[slot.dayOfWeek]} {slot.startTime} — {slot.endTime}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{getNextDateForDay(slot.dayOfWeek)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
            action === 'new' ? 'bg-success/10' : 'bg-warning/10'
          }`}>
            {action === 'new' ? '🟢' : '🟡'}
          </div>
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">ประเภท</p>
            <p className={`font-bold ${action === 'new' ? 'text-success' : 'text-warning'}`}>
              {action === 'new' ? 'จองใหม่' : 'เข้าร่วมห้องที่มีคนจองแล้ว'}
            </p>
            {action === 'join' && slot.bookedCourseName && (
              <p className="text-xs text-text-muted mt-0.5">📌 {slot.bookedCourseName}</p>
            )}
          </div>
        </div>
    </div>

      {/* Enrollment Badge - Modern & Premium */}
      {isEnrolled && (
        <div className="mb-6 animate-slideIn">
          <div className="glass border border-success/30 bg-success/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl shadow-success/5">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center text-2xl">
              👑
            </div>
            <div>
              <p className="text-success font-black text-sm uppercase tracking-tight">VIP STATUS: ENROLLED</p>
              <p className="text-text-secondary text-xs">คุณเป็นเจ้าของคอร์สนี้แล้ว สิทธิพิเศษจองเวลาเรียนได้ไม่จำกัดตามโควตาชั่วโมงของคุณ</p>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Input */}
      {!bookingDone && !isEnrolled && (
        <div className="glass rounded-2xl p-4 border border-border/50 mb-6 bg-surface/30">
          <p className="text-xs font-bold text-text-primary mb-3">🏷️ มีโค้ดส่วนลดไหม?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="กรอกรหัสคูปอง"
              disabled={isApplyingCoupon || discountAmount > 0}
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
            />
            <button
              onClick={applyCoupon}
              disabled={!couponCode || isApplyingCoupon || discountAmount > 0 || isBooking}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {isApplyingCoupon ? '⏳' : discountAmount > 0 ? '✅' : 'ใช้โค้ด'}
            </button>
          </div>
          {couponError && <p className="text-[10px] text-error mt-2 ml-1">❌ {couponError}</p>}
          {discountAmount > 0 && (
            <div className="text-[10px] text-success mt-2 ml-1 flex items-center justify-between">
              <span>✨ ประหยัดไปได้ ฿{discountAmount.toLocaleString()}</span>
              <button 
                onClick={() => setCouponCode('')} 
                className="underline opacity-60 hover:opacity-100"
              >
                เปลี่ยนโค้ด
              </button>
            </div>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      <div className={`glass rounded-2xl p-5 border mb-6 shadow-lg transition-all duration-500 ${
        isEnrolled 
          ? 'border-success/30 bg-success/5 shadow-success/5' 
          : 'border-primary/20 bg-primary/5 shadow-primary/5'
      }`}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>ยอดชำระเบื้องต้น</span>
            <span className={isEnrolled ? 'line-through opacity-50' : ''}>฿{course.price.toLocaleString()}</span>
          </div>
          {(discountAmount > 0 || isEnrolled) && (
            <div className="flex justify-between text-sm text-success font-medium">
              <span>ส่วนลด {isEnrolled && '(สิทธิพิเศษของผู้เรียน)'}</span>
              <span>-฿{course.price.toLocaleString()}</span>
            </div>
          )}
          <div className={`pt-2 border-t flex justify-between items-center ${
            isEnrolled ? 'border-success/10' : 'border-primary/10'
          }`}>
            <span className="font-bold text-text-primary">ยอดที่ต้องชำระ</span>
            <span className={`text-2xl font-black animate-fadeIn ${
              isEnrolled ? 'text-success' : 'text-primary'
            }`}>
              ฿0
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 rounded-xl glass border border-border text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          ย้อนกลับ
        </button>
        <button
          onClick={onConfirm}
          disabled={isBooking}
          className={`flex-1 px-4 py-3 rounded-xl text-white text-sm font-bold transition-all ${
            (finalPrice === 0 || (course.price - discountAmount === 0))
              ? 'bg-success hover:bg-success/90 hover:scale-[1.02] active:scale-95'
              : 'btn-game hover:scale-[1.02] active:scale-95'
          } disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20`}
        >
          {isBooking ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin text-lg">⏳</span> กำลังดำเนินการ...
            </span>
          ) : (finalPrice === 0 || (course.price - discountAmount === 0)) ? (
            '✅ ยืนยันจองฟรี'
          ) : (
            `💳 ชำระเงิน ฿${(finalPrice !== null ? finalPrice : course.price).toLocaleString()}`
          )}
        </button>
      </div>
    </div>
  );
}
