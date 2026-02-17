'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PaymentSuccessViewModel } from '../../presenters/payment/PaymentPresenter';

interface PaymentSuccessViewProps {
  viewModel: PaymentSuccessViewModel;
}

export function PaymentSuccessView({ viewModel }: PaymentSuccessViewProps) {
  const { sessionId, payment } = viewModel;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-slideUp">
        <div className="text-8xl mb-6 animate-bounce-soft">🎉</div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          ชำระเงินสำเร็จ!
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          ขอบคุณสำหรับการลงทะเบียน<br/>
          เราได้ยืนยันที่นั่งของคุณเรียบร้อยแล้ว
        </p>

        <div className="space-y-4">
          <Link 
            href="/my-bookings"
            className="block w-full py-4 rounded-xl btn-game text-white font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
          >
            ไปที่คลาสของฉัน
          </Link>
          
          <Link
            href="/"
            className="block w-full py-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            กลับหน้าหลัก
          </Link>
        </div>

        {sessionId && (
            <p className="mt-8 text-xs text-slate-400 font-mono">
                Transaction ID: {sessionId.slice(0, 10)}...
            </p>
        )}
      </div>
    </div>
  );
}
