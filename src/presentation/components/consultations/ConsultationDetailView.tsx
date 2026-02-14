/**
 * ConsultationDetailView
 * Student's view of a single consultation request with all offers
 * Allows accept/reject offers
 */

'use client';

import { ConsultationOffer, ConsultationRequest } from '@/src/application/repositories/IConsultationRepository';
import { createClientConsultationsPresenter } from '@/src/presentation/presenters/consultations/ConsultationsPresenterClientFactory';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ConsultationDetailSkeleton from './ConsultationDetailSkeleton';

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  open: { label: 'เปิดรับข้อเสนอ', icon: '🟢', color: 'text-success', bg: 'bg-success/10 border-success/30' },
  in_progress: { label: 'กำลังดำเนินการ', icon: '🔄', color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
  closed: { label: 'เสร็จสิ้น', icon: '✅', color: 'text-text-muted', bg: 'bg-surface-secondary border-border' },
  cancelled: { label: 'ยกเลิก', icon: '❌', color: 'text-error', bg: 'bg-error/10 border-error/30' },
};

const LEVEL_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  beginner: { label: 'เริ่มต้น', color: 'text-success', icon: '🌱' },
  intermediate: { label: 'ปานกลาง', color: 'text-warning', icon: '📈' },
  advanced: { label: 'ขั้นสูง', color: 'text-error', icon: '🚀' },
};

const OFFER_STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  pending: { label: 'รอตอบรับ', icon: '⏳', color: 'text-warning', bg: 'bg-warning/10 border-warning/30' },
  accepted: { label: 'ตอบรับแล้ว', icon: '✅', color: 'text-success', bg: 'bg-success/10 border-success/30' },
  rejected: { label: 'ปฏิเสธ', icon: '❌', color: 'text-error', bg: 'bg-error/10 border-error/30' },
  withdrawn: { label: 'ถอนข้อเสนอ', icon: '↩️', color: 'text-text-muted', bg: 'bg-surface-secondary border-border' },
};

interface ConsultationDetailViewProps {
  requestId: string;
}

export function ConsultationDetailView({ requestId }: ConsultationDetailViewProps) {
  const presenter = useMemo(() => createClientConsultationsPresenter(), []);
  const [request, setRequest] = useState<ConsultationRequest | null>(null);
  const [offers, setOffers] = useState<ConsultationOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const detail = await presenter.getRequestDetail(requestId);
      setRequest(detail.request);
      setOffers(detail.offers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [requestId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccept = async (offerId: string) => {
    setActionLoading(offerId);
    try {
      await presenter.acceptOffer(offerId);
      await loadData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (offerId: string) => {
    setActionLoading(offerId);
    try {
      await presenter.rejectOffer(offerId);
      await loadData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!request) return;
    setActionLoading('cancel');
    try {
      await presenter.cancelRequest(request.id);
      await loadData();
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <ConsultationDetailSkeleton />;
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-text-secondary text-lg mb-4">ไม่พบคำขอปรึกษานี้</p>
          <Link href="/consultations" className="btn-game px-6 py-2 text-white rounded-xl">← กลับ</Link>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.open;
  const levelCfg = LEVEL_CONFIG[request.level] || LEVEL_CONFIG.beginner;
  const acceptedOffer = offers.find((o) => o.status === 'accepted');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <Link href="/consultations" className="text-text-muted hover:text-text-secondary text-sm mb-6 inline-flex items-center gap-1">
        ← กลับไปรายการคำขอ
      </Link>

      {/* Header card */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
              {request.categoryIcon}
            </div>
            <div>
              <span className="text-sm text-text-muted">{request.categoryName}</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">{request.title}</h1>
            </div>
          </div>
          <span className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border ${statusCfg.bg} ${statusCfg.color}`}>
            {statusCfg.icon} {statusCfg.label}
          </span>
        </div>

        <p className="text-text-secondary mb-6">{request.description}</p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xs text-text-muted mb-1">{levelCfg.icon} ระดับ</div>
            <div className={`text-sm font-bold ${levelCfg.color}`}>{levelCfg.label}</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xs text-text-muted mb-1">💰 งบประมาณ</div>
            <div className="text-sm font-bold text-text-primary">฿{request.budgetMin.toLocaleString()} - ฿{request.budgetMax.toLocaleString()}</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xs text-text-muted mb-1">📩 ข้อเสนอ</div>
            <div className="text-sm font-bold text-primary">{request.offersCount}</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xs text-text-muted mb-1">📅 ถูกสร้าง</div>
            <div className="text-sm font-bold text-text-primary">{new Date(request.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</div>
          </div>
        </div>

        {/* Preferred schedule */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-text-muted font-medium">📅 วันที่สะดวก:</span>
          {request.preferredDates.map((d) => (
            <span key={d} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
              {new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
            </span>
          ))}
          <span className="text-xs text-text-muted font-medium ml-2">🕐 เวลา:</span>
          {request.preferredTimes.map((t, i) => (
            <span key={i} className="px-3 py-1 rounded-lg bg-warning/10 text-warning text-xs font-medium">
              {t.start} - {t.end}
            </span>
          ))}
        </div>

        {/* Cancel button */}
        {request.status === 'open' && (
          <button
            onClick={handleCancel}
            disabled={actionLoading === 'cancel'}
            className="px-4 py-2 rounded-xl bg-error/10 border border-error/30 text-error text-sm font-bold hover:bg-error/20 transition-colors disabled:opacity-50"
          >
            {actionLoading === 'cancel' ? '⏳ กำลังยกเลิก...' : '❌ ยกเลิกคำขอนี้'}
          </button>
        )}
      </div>

      {/* Accepted offer highlight */}
      {acceptedOffer && (
        <div className="glass rounded-2xl p-6 mb-6 border-2 border-success/30 bg-success/5">
          <h3 className="text-lg font-bold text-success mb-3">✅ อาจารย์ที่ตอบรับแล้ว</h3>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{acceptedOffer.instructorAvatar}</div>
            <div className="flex-1">
              <div className="text-lg font-bold text-text-primary">{acceptedOffer.instructorName}</div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                <span className="text-yellow-500">⭐ {acceptedOffer.instructorRating}</span>
                <span>•</span>
                <span>💰 ฿{acceptedOffer.offeredPrice.toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {acceptedOffer.instructorSpecializations.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>
                ))}
              </div>
              <p className="text-text-secondary text-sm mb-2">{acceptedOffer.message}</p>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span>📅 {new Date(acceptedOffer.offeredDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long' })}</span>
                <span>🕐 {acceptedOffer.offeredStartTime} - {acceptedOffer.offeredEndTime}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All offers */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text-primary">
          📩 ข้อเสนอทั้งหมด ({offers.length})
        </h3>
      </div>

      {offers.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-5xl mb-3">⏳</div>
          <p className="text-text-secondary text-lg mb-1">ยังไม่มีข้อเสนอจากอาจารย์</p>
          <p className="text-text-muted text-sm">อาจารย์กำลังตรวจสอบคำขอของคุณ โปรดรอสักครู่</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const os = OFFER_STATUS_CONFIG[offer.status] || OFFER_STATUS_CONFIG.pending;
            const isActing = actionLoading === offer.id;

            return (
              <div key={offer.id} className={`glass rounded-2xl p-5 sm:p-6 transition-transform ${offer.status === 'accepted' ? 'border-2 border-success/30' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{offer.instructorAvatar}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="text-lg font-bold text-text-primary">{offer.instructorName}</span>
                        <span className="text-yellow-500 ml-2 text-sm">⭐ {offer.instructorRating}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${os.bg} ${os.color}`}>
                        {os.icon} {os.label}
                      </span>
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {offer.instructorSpecializations.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>
                      ))}
                    </div>

                    {/* Message */}
                    <p className="text-text-secondary text-sm mb-3">{offer.message}</p>

                    {/* Offer details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                      <div className="glass rounded-lg px-3 py-2 text-center">
                        <div className="text-xs text-text-muted">💰 ราคา</div>
                        <div className="font-bold text-text-primary">฿{offer.offeredPrice.toLocaleString()}</div>
                      </div>
                      <div className="glass rounded-lg px-3 py-2 text-center">
                        <div className="text-xs text-text-muted">📅 วันที่</div>
                        <div className="font-bold text-text-primary">{new Date(offer.offeredDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</div>
                      </div>
                      <div className="glass rounded-lg px-3 py-2 text-center">
                        <div className="text-xs text-text-muted">🕐 เวลา</div>
                        <div className="font-bold text-text-primary">{offer.offeredStartTime} - {offer.offeredEndTime}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    {offer.status === 'pending' && request.status === 'open' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(offer.id)}
                          disabled={isActing}
                          className="px-6 py-2 rounded-xl bg-success text-white text-sm font-bold hover:bg-success/90 transition-colors shadow-lg shadow-success/25 disabled:opacity-50"
                        >
                          {isActing ? '⏳' : '✅ ตอบรับข้อเสนอ'}
                        </button>
                        <button
                          onClick={() => handleReject(offer.id)}
                          disabled={isActing}
                          className="px-6 py-2 rounded-xl bg-error/10 border border-error/30 text-error text-sm font-bold hover:bg-error/20 transition-colors disabled:opacity-50"
                        >
                          {isActing ? '⏳' : '❌ ปฏิเสธ'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
