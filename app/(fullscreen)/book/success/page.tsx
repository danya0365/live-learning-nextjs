'use client';

import { ArrowRight, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">จองคลาสเรียนสำเร็จ!</h1>
        <p className="text-slate-600 mb-8">
          การชำระเงินของคุณเสร็จสมบูรณ์และคลาสเรียนได้รับการยืนยันแล้ว เราได้ส่งรายละเอียดการจองไปที่อีเมลของคุณเรียบร้อยครับ
        </p>

        {paymentId && (
          <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">รหัสการชำระเงิน (Payment ID)</p>
            <p className="text-sm font-mono text-slate-700 break-all">{paymentId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/my-bookings"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
          >
            <Calendar className="w-5 h-5" />
            ดูรายการจองของฉัน
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-50 text-slate-600 font-semibold py-4 rounded-2xl transition-all border border-slate-200"
          >
            กลับหน้าแรก
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
