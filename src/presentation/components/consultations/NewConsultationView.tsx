/**
 * NewConsultationView
 * Student form to create a new consultation request
 * Full form with category, level, budget, schedule, and description
 */

'use client';

import { ConsultationLevel, PreferredTime } from '@/src/application/repositories/IConsultationRepository';
import { createClientConsultationsPresenter } from '@/src/presentation/presenters/consultations/ConsultationsPresenterClientFactory';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'cat-001', label: 'Web Development', icon: '🌐' },
  { id: 'cat-002', label: 'Data Science & AI', icon: '🤖' },
  { id: 'cat-003', label: 'Design', icon: '🎨' },
  { id: 'cat-004', label: 'Mobile Development', icon: '📱' },
  { id: 'cat-005', label: 'Cybersecurity', icon: '🛡️' },
  { id: 'cat-006', label: 'DevOps & Cloud', icon: '☁️' },
];

const LEVELS: { value: ConsultationLevel; label: string; icon: string; desc: string }[] = [
  { value: 'beginner', label: 'เริ่มต้น', icon: '🌱', desc: 'ยังไม่มีพื้นฐาน อยากเรียนจาก 0' },
  { value: 'intermediate', label: 'ปานกลาง', icon: '📈', desc: 'มีพื้นฐานแล้ว อยากเรียนเชิงลึก' },
  { value: 'advanced', label: 'ขั้นสูง', icon: '🚀', desc: 'มีประสบการณ์ ต้องการระดับ Expert' },
];

export function NewConsultationView() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: topic, 2: schedule, 3: confirm

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState<ConsultationLevel>('beginner');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredDates, setPreferredDates] = useState<string[]>(['']);
  const [preferredTimes, setPreferredTimes] = useState<PreferredTime[]>([{ start: '09:00', end: '12:00' }]);

  const addDate = () => setPreferredDates([...preferredDates, '']);
  const removeDate = (i: number) => setPreferredDates(preferredDates.filter((_, idx) => idx !== i));
  const updateDate = (i: number, val: string) => {
    const updated = [...preferredDates];
    updated[i] = val;
    setPreferredDates(updated);
  };

  const addTimeSlot = () => setPreferredTimes([...preferredTimes, { start: '13:00', end: '16:00' }]);
  const removeTimeSlot = (i: number) => setPreferredTimes(preferredTimes.filter((_, idx) => idx !== i));
  const updateTime = (i: number, field: 'start' | 'end', val: string) => {
    const updated = [...preferredTimes];
    updated[i] = { ...updated[i], [field]: val };
    setPreferredTimes(updated);
  };

  const canGoStep2 = title.trim() && categoryId && description.trim();
  const canGoStep3 = preferredDates.some((d) => d) && preferredTimes.length > 0 && budgetMin && budgetMax;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const presenter = createClientConsultationsPresenter();
      await presenter.createRequest({
        studentId: 'student-001',
        categoryId,
        title: title.trim(),
        description: description.trim(),
        level,
        budgetMin: parseInt(budgetMin) || 0,
        budgetMax: parseInt(budgetMax) || 0,
        preferredDates: preferredDates.filter((d) => d),
        preferredTimes,
      });
      router.push('/consultations');
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/consultations" className="text-text-muted hover:text-text-secondary text-sm mb-4 inline-flex items-center gap-1">
          ← กลับไปรายการคำขอ
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          ✍️ สร้างคำขอปรึกษาใหม่
        </h1>
        <p className="text-text-secondary">
          บอกเราว่าคุณอยากเรียนอะไร แล้วอาจารย์จะมาเสนอรับสอน
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: 'หัวข้อ' },
          { n: 2, label: 'ตารางเวลา & งบ' },
          { n: 3, label: 'ยืนยัน' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s.n
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'glass text-text-muted'
              }`}
            >
              {step > s.n ? '✓' : s.n}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step >= s.n ? 'text-text-primary' : 'text-text-muted'}`}>
              {s.label}
            </span>
            {i < 2 && (
              <div className={`flex-1 h-0.5 ${step > s.n ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Topic */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-text-primary mb-3">📂 เลือกหมวดหมู่ *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    categoryId === cat.id
                      ? 'bg-primary/10 border-2 border-primary shadow-lg shadow-primary/10'
                      : 'glass hover:scale-[1.02]'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-medium text-text-primary">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-text-primary mb-1.5">📝 หัวข้อที่อยากเรียน *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น สอน Next.js App Router + Server Components"
              className="w-full px-4 py-3 rounded-xl glass border-0 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/50 outline-none text-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-text-primary mb-1.5">📋 รายละเอียดเพิ่มเติม *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="อธิบายว่าคุณอยากเรียนอะไร มีพื้นฐานแค่ไหน คาดหวังอะไรจากอาจารย์..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl glass border-0 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-bold text-text-primary mb-3">📊 ระดับความรู้ปัจจุบัน</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LEVELS.map((lv) => (
                <button
                  key={lv.value}
                  onClick={() => setLevel(lv.value)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    level === lv.value
                      ? 'bg-primary/10 border-2 border-primary shadow-lg shadow-primary/10'
                      : 'glass hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{lv.icon}</span>
                    <span className="text-sm font-bold text-text-primary">{lv.label}</span>
                  </div>
                  <div className="text-xs text-text-muted">{lv.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canGoStep2}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ถัดไป: ตารางเวลา & งบ →
          </button>
        </div>
      )}

      {/* Step 2: Schedule & Budget */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Preferred dates */}
          <div>
            <label className="block text-sm font-bold text-text-primary mb-3">📅 วันที่สะดวก *</label>
            <div className="space-y-2">
              {preferredDates.map((date, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => updateDate(i, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl glass border-0 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                  {preferredDates.length > 1 && (
                    <button
                      onClick={() => removeDate(i)}
                      className="w-10 h-10 rounded-xl glass text-error hover:bg-error/10 flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addDate}
              className="mt-2 text-sm text-primary hover:text-primary/80 font-medium"
            >
              + เพิ่มวันที่
            </button>
          </div>

          {/* Preferred times */}
          <div>
            <label className="block text-sm font-bold text-text-primary mb-3">🕐 ช่วงเวลาที่สะดวก *</label>
            <div className="space-y-2">
              {preferredTimes.map((time, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time.start}
                    onChange={(e) => updateTime(i, 'start', e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl glass border-0 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                  <span className="text-text-muted">ถึง</span>
                  <input
                    type="time"
                    value={time.end}
                    onChange={(e) => updateTime(i, 'end', e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl glass border-0 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                  {preferredTimes.length > 1 && (
                    <button
                      onClick={() => removeTimeSlot(i)}
                      className="w-10 h-10 rounded-xl glass text-error hover:bg-error/10 flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addTimeSlot}
              className="mt-2 text-sm text-primary hover:text-primary/80 font-medium"
            >
              + เพิ่มช่วงเวลา
            </button>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-bold text-text-primary mb-3">💰 งบประมาณ (THB) *</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-text-muted mb-1 block">ขั้นต่ำ</label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="500"
                  className="w-full px-4 py-2.5 rounded-xl glass border-0 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <span className="text-text-muted mt-5">—</span>
              <div className="flex-1">
                <label className="text-xs text-text-muted mb-1 block">สูงสุด</label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="2000"
                  className="w-full px-4 py-2.5 rounded-xl glass border-0 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl glass text-text-secondary font-medium hover:text-text-primary transition-colors"
            >
              ← ย้อนกลับ
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canGoStep3}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ถัดไป: ยืนยัน →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">📋 สรุปคำขอปรึกษา</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedCategory?.icon}</span>
                <div>
                  <div className="text-xs text-text-muted">หมวดหมู่</div>
                  <div className="text-sm font-medium text-text-primary">{selectedCategory?.label}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-text-muted mb-1">📝 หัวข้อ</div>
                <div className="text-lg font-bold text-text-primary">{title}</div>
              </div>

              <div>
                <div className="text-xs text-text-muted mb-1">📋 รายละเอียด</div>
                <div className="text-sm text-text-secondary">{description}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-text-muted mb-1">📊 ระดับ</div>
                  <div className="text-sm font-bold text-text-primary">
                    {LEVELS.find((l) => l.value === level)?.icon} {LEVELS.find((l) => l.value === level)?.label}
                  </div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-text-muted mb-1">💰 งบประมาณ</div>
                  <div className="text-sm font-bold text-text-primary">
                    ฿{parseInt(budgetMin).toLocaleString()} - ฿{parseInt(budgetMax).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-text-muted mb-2">📅 วันที่สะดวก</div>
                <div className="flex flex-wrap gap-2">
                  {preferredDates.filter((d) => d).map((d) => (
                    <span key={d} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                      {new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-text-muted mb-2">🕐 เวลาที่สะดวก</div>
                <div className="flex flex-wrap gap-2">
                  {preferredTimes.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-warning/10 text-warning text-sm font-medium">
                      {t.start} - {t.end}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl glass text-text-secondary font-medium hover:text-text-primary transition-colors"
            >
              ← ย้อนกลับ
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-success text-white font-bold hover:bg-success/90 transition-colors shadow-lg shadow-success/25 disabled:opacity-50"
            >
              {submitting ? '⏳ กำลังส่ง...' : '✅ ส่งคำขอปรึกษา'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
