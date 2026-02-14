/**
 * ConsultationBoardDetailView
 * Instructor's view of a single consultation request — view details + submit offer
 */

'use client';

import { useConsultationBoardDetailPresenter } from '@/src/presentation/presenters/consultation-board/useConsultationBoardDetailPresenter';
import Link from 'next/link';
import ConsultationDetailSkeleton from '../consultations/ConsultationDetailSkeleton';

const LEVEL_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  beginner: { label: 'เริ่มต้น', color: 'text-success', icon: '🌱' },
  intermediate: { label: 'ปานกลาง', color: 'text-warning', icon: '📈' },
  advanced: { label: 'ขั้นสูง', color: 'text-error', icon: '🚀' },
};

interface ConsultationBoardDetailViewProps {
  requestId: string;
}

export function ConsultationBoardDetailView({ requestId }: ConsultationBoardDetailViewProps) {
  const { state, actions } = useConsultationBoardDetailPresenter(requestId);
  
  const {
    request, offers, loading, submitting, showForm, submitted,
    offerForm, myOffer, hasOffered
  } = state;
  
  const {
      setShowForm, setOfferForm, submitOffer, withdrawOffer
  } = actions;

  if (loading) {
    return <ConsultationDetailSkeleton />;
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-text-secondary text-lg mb-4">ไม่พบคำขอปรึกษานี้</p>
          <Link href="/consultations/board" className="btn-game px-6 py-2 text-white rounded-xl">← กลับ</Link>
        </div>
      </div>
    );
  }

  const levelCfg = LEVEL_CONFIG[request.level] || LEVEL_CONFIG.beginner;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <Link href="/consultations/board" className="text-text-muted hover:text-text-secondary text-sm mb-6 inline-flex items-center gap-1">
        ← กลับไปบอร์ดคำขอ
      </Link>

      {/* Student info + request */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
        {/* Student */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{request.studentAvatar}</div>
          <div>
            <div className="font-bold text-text-primary">{request.studentName}</div>
            <div className="text-sm text-text-muted">โพสต์เมื่อ {new Date(request.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Category + title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">{request.categoryIcon}</span>
          <span className="text-sm text-text-muted">{request.categoryName}</span>
          <span className={`ml-auto text-xs font-bold ${levelCfg.color}`}>{levelCfg.icon} {levelCfg.label}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary mb-3">{request.title}</h1>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">{request.description}</p>

        {/* Details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xs text-text-muted mb-1">💰 งบประมาณ</div>
            <div className="text-sm font-bold text-text-primary">฿{request.budgetMin.toLocaleString()} - ฿{request.budgetMax.toLocaleString()}</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xs text-text-muted mb-1">📩 ข้อเสนอ</div>
            <div className="text-sm font-bold text-primary">{request.offersCount} คน</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xs text-text-muted mb-1">📊 ระดับ</div>
            <div className={`text-sm font-bold ${levelCfg.color}`}>{levelCfg.label}</div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-text-primary mb-2">📅 วันเวลาที่นักเรียนสะดวก</h3>
          <div className="flex flex-wrap gap-2">
            {request.preferredDates.map((d) => (
              <span key={d} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                📅 {new Date(d).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            ))}
            {request.preferredTimes.map((t, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-sm font-medium">
                🕐 {t.start} - {t.end}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action area */}
      {request.status === 'open' && !hasOffered && !submitted && (
        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 rounded-2xl bg-primary text-white text-lg font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
            >
              🤝 ฉันอยากสอน — ส่งข้อเสนอ
            </button>
          ) : (
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-text-primary mb-4">🤝 ส่งข้อเสนอรับสอน</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">💬 ข้อความแนะนำตัว *</label>
                  <textarea
                    value={offerForm.message}
                    onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                    placeholder="แนะนำตัว ประสบการณ์ที่เกี่ยวข้อง และบอกว่าคุณจะช่วยนักเรียนได้อย่างไร..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl glass border-0 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">💰 ราคาเสนอ (THB) *</label>
                  <input
                    type="number"
                    value={offerForm.offeredPrice}
                    onChange={(e) => setOfferForm({ ...offerForm, offeredPrice: e.target.value })}
                    placeholder={`งบนักเรียน: ${request.budgetMin} - ${request.budgetMax}`}
                    className="w-full px-4 py-3 rounded-xl glass border-0 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                  <p className="text-xs text-text-muted mt-1">💡 งบนักเรียน: ฿{request.budgetMin.toLocaleString()} - ฿{request.budgetMax.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">📅 วันที่ *</label>
                    <select
                      value={offerForm.offeredDate}
                      onChange={(e) => setOfferForm({ ...offerForm, offeredDate: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl glass border-0 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none"
                    >
                      {request.preferredDates.map((d) => (
                        <option key={d} value={d}>
                          {new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">🕐 เริ่ม</label>
                    <input
                      type="time"
                      value={offerForm.offeredStartTime}
                      onChange={(e) => setOfferForm({ ...offerForm, offeredStartTime: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl glass border-0 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">🕐 ถึง</label>
                    <input
                      type="time"
                      value={offerForm.offeredEndTime}
                      onChange={(e) => setOfferForm({ ...offerForm, offeredEndTime: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl glass border-0 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </div>

                {/* Existing offers info */}
                {offers.length > 0 && (
                  <div className="glass rounded-lg p-3 text-sm text-text-muted">
                    📩 มีข้อเสนอ {offers.length} ข้อเสนอแล้ว • ราคาเฉลี่ย ฿{Math.round(offers.reduce((s, o) => s + o.offeredPrice, 0) / offers.length).toLocaleString()}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl glass text-text-secondary font-medium hover:text-text-primary transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={submitOffer}
                    disabled={submitting || !offerForm.message || !offerForm.offeredPrice || !offerForm.offeredDate}
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? '⏳ กำลังส่ง...' : '✅ ส่งข้อเสนอ'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Already offered */}
      {(hasOffered || submitted) && (
        <div className="glass rounded-2xl p-6 mb-6 border-2 border-success/30 bg-success/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-success mb-1">✅ คุณส่งข้อเสนอแล้ว</h3>
              {myOffer && (
                <p className="text-sm text-text-secondary">
                  💰 ฿{myOffer.offeredPrice.toLocaleString()} •
                  📅 {new Date(myOffer.offeredDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} •
                  🕐 {myOffer.offeredStartTime} - {myOffer.offeredEndTime}
                </p>
              )}
            </div>
            {myOffer?.status === 'pending' && (
              <button
                onClick={withdrawOffer}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-error/10 border border-error/30 text-error text-sm font-bold hover:bg-error/20 transition-colors disabled:opacity-50"
              >
                ↩️ ถอนข้อเสนอ
              </button>
            )}
          </div>
        </div>
      )}

      {/* Other offers (anonymized for instructor view) */}
      {offers.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-3">📊 ข้อเสนออื่นๆ ({offers.length})</h3>
          <div className="space-y-3">
            {offers.map((offer, i) => (
              <div key={offer.id} className={`glass rounded-xl p-4 ${offer.instructorId === 'inst-001' ? 'border-2 border-primary/30' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center text-lg">
                      {offer.instructorId === 'inst-001' ? offer.instructorAvatar : `👤`}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text-primary">
                        {offer.instructorId === 'inst-001' ? 'ข้อเสนอของคุณ' : `อาจารย์ #${i + 1}`}
                      </span>
                      {offer.instructorId === 'inst-001' && (
                        <span className="ml-2 text-xs text-primary font-medium">✨ คุณ</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-text-primary">฿{offer.offeredPrice.toLocaleString()}</div>
                    <div className="text-xs text-text-muted">
                      {new Date(offer.offeredDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
