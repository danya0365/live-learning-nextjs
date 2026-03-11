'use client';

import { useFeedbackPresenter } from '@/src/presentation/presenters/feedback/useFeedbackPresenter';
import { useState } from 'react';

export function FeedbackView() {
  const { loading, submitted, error, submitFeedback } = useFeedbackPresenter();
  const [formData, setFormData] = useState({
    topic: '',
    email: '',
    message: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(formData.topic, formData.email, formData.message, formData.category);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex items-center justify-center min-h-[50vh]">
        <div className="text-center glass rounded-3xl p-12 hover:scale-[1.02] transition-transform animate-fade-in border border-border/50 max-w-xl w-full">
          <div className="text-6xl mb-6">📝✅</div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            ขอบคุณสำหรับความคิดเห็น!
          </h1>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            เราได้รับข้อมูลของคุณเรียบร้อยแล้ว ทีมงานจะนำไปพิจารณาเพื่อปรับปรุงบริการให้ดียิ่งขึ้น
          </p>
          <a
            href="/"
            className="btn-game px-8 py-3 rounded-xl text-white font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            🏠 กลับหน้าแรก
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          💬 แจ้งปัญหา / แนะนำบริการ
        </h1>
        <p className="text-text-secondary">
          ความคิดเห็นของคุณมีค่าสำหรับเรา ช่วยให้เราพัฒนา Live Learning ให้ดียิ่งขึ้น
        </p>
      </div>

      <div className="glass rounded-3xl p-8 sm:p-12 max-w-2xl border border-border/50 shadow-lg">
        {error && (
          <div className="bg-error/10 text-error p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-text-primary mb-2">
              หัวข้อเรื่อง
            </label>
            <select
              id="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            >
              <option value="">เลือกหัวข้อ...</option>
              <option value="bug">แจ้งปัญหาการใช้งาน (Bug)</option>
              <option value="feature">เสนอแนะฟีเจอร์ใหม่</option>
              <option value="content">เนื้อหาคอร์สเรียน</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              อีเมลติดต่อกลับ (ไม่บังคับ)
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
              รายละเอียด
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y transition-all"
              placeholder="บอกเล่าปัญหาหรือข้อเสนอแนะของคุณ..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-game py-3.5 rounded-xl text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                กำลังส่ง...
              </>
            ) : (
              'ส่งความคิดเห็น 🚀'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
