'use client';

import Link from 'next/link';

export function PaymentCancelView() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-slideUp">
        <div className="text-8xl mb-6 grayscale opacity-80">💸</div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          ยกเลิกการชำระเงิน
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          รายการชำระเงินถูกยกเลิก หรือทำรายการไม่สำเร็จ<br/>
          คุณสามารถทำรายการใหม่ได้อีกครั้ง
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full py-4 rounded-xl btn-primary bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
