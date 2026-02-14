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
    levels
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
            />
          )}
          {step === 'calendar' && selectedCourse && selectedInstructor && (
            <StepCalendar
              course={selectedCourse}
              instructor={selectedInstructor}
              slots={calendarSlots}
              onSelect={actions.handleSlotSelect}
              onBack={actions.goBack}
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
              onConfirm={actions.handleConfirm}
              onBack={actions.goBack}
              onFinish={actions.handleFinish}
              onNewBooking={actions.handleNewBooking}
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
}: {
  course: WizardCourse;
  instructors: WizardInstructor[];
  onSelect: (i: WizardInstructor) => void;
  onBack: () => void;
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
}: {
  course: WizardCourse;
  instructor: WizardInstructor;
  slots: WizardSlot[];
  onSelect: (slot: WizardSlot) => void;
  onBack: () => void;
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

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-6 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-success/20 border border-success/50" />
          <span className="text-text-secondary">ว่าง — จองใหม่</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-warning/20 border border-warning/50" />
          <span className="text-text-secondary">มีคนจอง — เข้าร่วม</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-surface border border-border" />
          <span className="text-text-secondary">ไม่มีคลาส</span>
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
                  {daySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => onSelect(slot)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                        slot.status === 'available'
                          ? 'bg-success/10 border-success/40 hover:bg-success/20 hover:shadow-md hover:shadow-success/10'
                          : 'bg-warning/10 border-warning/40 hover:bg-warning/20 hover:shadow-md hover:shadow-warning/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm ${slot.status === 'available' ? 'text-success' : 'text-warning'}`}>
                              {slot.status === 'available' ? '🟢' : '🟡'}
                            </span>
                            <span className="text-sm font-bold text-text-primary">
                              {slot.startTime} — {slot.endTime}
                            </span>
                          </div>
                          {slot.status === 'booked' && slot.bookedCourseName && (
                            <p className="text-[10px] text-warning ml-5 mt-0.5">
                              📌 {slot.bookedCourseName}
                            </p>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          slot.status === 'available'
                            ? 'bg-success/20 text-success'
                            : 'bg-warning/20 text-warning'
                        }`}>
                          {slot.status === 'available' ? 'จองใหม่' : 'เข้าร่วม'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
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
          ✉️ อีเมลยืนยันจะถูกส่งไปยังอีเมลของคุณ
        </p>

        {/* Summary card */}
        <div className="glass rounded-2xl p-5 border border-success/30 bg-success/5 text-left mb-8 max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">📚</span>
              <div>
                <p className="text-[10px] text-text-muted">คอร์ส</p>
                <p className="text-sm font-bold text-text-primary">{course.title}</p>
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
          {action === 'new'
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
            <p className="font-bold text-text-primary">{course.title}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {(levels.find(l => l.value === course.level) || levels[0])?.label} • {course.categoryName}
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

      {/* Price */}
      <div className="glass rounded-2xl p-4 border border-primary/20 bg-primary/5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-secondary">💰 ค่าเรียน</span>
          <span className="text-xl font-extrabold text-primary">
            ฿{course.price.toLocaleString()}
          </span>
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
            action === 'new'
              ? 'btn-game hover:scale-[1.02] active:scale-95'
              : 'bg-warning hover:bg-warning/90 hover:scale-[1.02] active:scale-95'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isBooking ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> กำลังดำเนินการ...
            </span>
          ) : action === 'new' ? (
            '✅ ยืนยันจอง'
          ) : (
            '🤝 ยืนยันเข้าร่วม'
          )}
        </button>
      </div>
    </div>
  );
}
