'use client';

import { useWalletPresenter } from '@/src/presentation/presenters/wallet/useWalletPresenter';
import { WalletViewModel } from '@/src/presentation/presenters/wallet/WalletPresenter';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import WalletSkeleton from './WalletSkeleton';
import { useAlertModal } from '@/src/presentation/components/ui/AlertModal';

interface WalletViewProps {
  initialViewModel?: WalletViewModel;
}

export function WalletView({ initialViewModel }: WalletViewProps) {
  const [{ viewModel, loading, error, isToppingUp }, { topUp, loadData }] = useWalletPresenter(initialViewModel);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showAlert, AlertComponent } = useAlertModal();

  const [showTopUpOptions, setShowTopUpOptions] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Top-up state for UI input (Test Bypass)
  const [topUpAmount, setTopUpAmount] = useState<string>('');

  useEffect(() => {
    if (searchParams.get('success')) {
      showAlert('เติมเงินลงกระเป๋าสำเร็จ!', 'success');
      router.replace('/wallet'); // Clear search params
    } else if (searchParams.get('canceled')) {
      showAlert('คุณได้ยกเลิกการเติมเงิน', 'warning');
      router.replace('/wallet');
    }
  }, [searchParams, router]);

  const wallet = viewModel?.wallet;
  const transactions = viewModel?.transactions || [];

  // Handle Test Top Up (Bypass)
  const handleTestTopUp = async () => {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) {
      showAlert('Please enter a valid amount', 'warning');
      return;
    }

    try {
      await topUp(amount, 'Test Top-up via UI', true); // Pass isTestMode=true
      setTopUpAmount('');
      showAlert(`Successfully topped up ${amount} ฿`, 'success');
    } catch (err: any) {
      showAlert(`Error: ${err.message}`, 'error');
    }
  };

  const handleRealTopUp = async (amount: number) => {
    if (!amount || amount <= 0) {
      showAlert('กรุณาระบุจำนวนเงินที่ถูกต้อง', 'warning');
      return;
    }
    try {
      await topUp(amount, 'เติมเงินเข้ากระเป๋า');
    } catch (err: any) {
      showAlert(`ไม่สามารถทำรายการได้: ${err.message}`, 'error');
    }
  };

  if (loading && !viewModel) {
    return <WalletSkeleton />
  }

  if (error && !viewModel) {
    return <div className="text-center text-error p-8 bg-error/10 rounded-2xl">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up">
      {/* Standard Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          💳 กระเป๋าเงิน
        </h1>
        <p className="text-text-secondary">
          จัดการยอดเงินคงเหลือ เติมเงิน และตรวจสอบประวัติการทำรายการของคุณ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Balance & Topup Action */}
        <div className="lg:col-span-1 space-y-6">
          {/* Balance Card */}
          <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 relative overflow-hidden">
             {/* Decorative */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <p className="text-text-secondary font-bold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
               <span>💰</span> ยอดเงินคงเหลือ
             </p>
             <div className="flex items-baseline gap-2 mb-6">
               <span className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                 {wallet?.balance?.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
               </span>
               <span className="text-2xl font-bold text-text-secondary">฿</span>
             </div>
             
             {showTopUpOptions ? (
               <div className="space-y-4 mt-2 animate-fadeIn">
                 <p className="text-sm font-bold text-text-primary">เลือกจำนวนเงินเริ่มต้น (บาท)</p>
                 <div className="grid grid-cols-3 gap-2">
                   {[100, 300, 500, 1000, 2000, 5000].map(amount => (
                     <button
                       key={amount}
                       onClick={() => handleRealTopUp(amount)}
                       disabled={isToppingUp}
                       className="py-2 text-sm font-bold rounded-lg border border-border/50 hover:border-primary hover:bg-primary/10 text-text-primary transition-all disabled:opacity-50"
                     >
                       {amount.toLocaleString()}
                     </button>
                   ))}
                 </div>
                 <div className="flex gap-2 isolate pt-2">
                   <input
                     type="number"
                     placeholder="ระบุจำนวนเงิน..."
                     value={customAmount}
                     onChange={(e) => setCustomAmount(e.target.value)}
                     className="w-full px-3 py-2 rounded-lg text-text-primary bg-surface/50 border border-border/50 focus:outline-none focus:border-primary text-sm font-medium"
                   />
                   <button
                     onClick={() => handleRealTopUp(Number(customAmount))}
                     disabled={isToppingUp || !customAmount || Number(customAmount) <= 0}
                     className="px-4 py-2 btn-game text-white rounded-lg text-sm font-bold whitespace-nowrap disabled:opacity-50"
                   >
                     {isToppingUp ? '...' : 'ยืนยัน'}
                   </button>
                 </div>
                 <button
                   onClick={() => setShowTopUpOptions(false)}
                   className="w-full py-2 text-sm text-text-muted hover:text-text-primary transition-colors mt-2"
                 >
                   ยกเลิก
                 </button>
               </div>
             ) : (
               <button
                 className="w-full btn-game px-4 py-3 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                 onClick={() => setShowTopUpOptions(true)}
               >
                 <span>➕</span> เติมเงินเข้ากระเป๋า
               </button>
             )}

             {/* TEST BTN: Only visible in dev/test */}
             {process.env.NODE_ENV !== 'production' && (
               <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-3">
                 <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase flex items-center gap-1">
                   <span>🚧</span> Test Bypass (Non-Prod)
                 </p>
                 <div className="flex gap-2">
                   <input
                     type="number"
                     value={topUpAmount}
                     onChange={(e) => setTopUpAmount(e.target.value)}
                     placeholder="Amount"
                     className="w-full px-3 py-2 rounded-lg text-text-primary bg-surface border border-border/50 text-sm font-medium focus:outline-none focus:border-amber-500/50"
                   />
                   <button
                     onClick={handleTestTopUp}
                     disabled={isToppingUp || !topUpAmount}
                     className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 disabled:opacity-50 transition-colors whitespace-nowrap"
                   >
                     {isToppingUp ? '...' : 'เติมเงิน'}
                   </button>
                 </div>
               </div>
             )}
          </div>
          
          {/* Quick Info / Stats */}
          <div className="glass rounded-2xl p-6 border border-border/50">
             <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><span>💡</span> รู้หรือไม่?</h3>
             <ul className="text-sm text-text-secondary space-y-3">
               <li className="flex items-start gap-2">
                 <span className="text-success mt-0.5">✓</span>
                 <span>เติมเงินเข้าระบบ จะไม่มีค่าธรรมเนียมเพิ่มเติม</span>
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-success mt-0.5">✓</span>
                 <span>ยอดเงินในกระเป๋าสามารถใช้ชำระค่าคอร์สเรียนได้ทันที</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Right Column: Transactions History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <span>📝</span> ประวัติการทำรายการ
              </h3>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-16 bg-surface/30 rounded-xl border border-dashed border-border/30">
                 <div className="text-4xl mb-4 opacity-50">📭</div>
                 <p className="text-text-muted text-sm font-medium">ยังไม่มีประวัติการทำรายการ</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => {
                  const date = new Date(tx.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  let icon = '🔄';
                  let colorText = 'text-text-primary';
                  let colorBg = 'bg-surface';
                  let iconColor = 'text-text-primary';
                  let amountPrefix = '';

                  if (tx.type === 'topup' || tx.type === 'refund') {
                    icon = tx.type === 'topup' ? '↗️' : '↪️';
                    colorText = 'text-success';
                    colorBg = 'bg-success/5 border-success/20';
                    iconColor = 'text-success';
                    amountPrefix = '+';
                  } else if (tx.type === 'purchase' || tx.type === 'withdrawal') {
                    icon = tx.type === 'purchase' ? '🛒' : '↘️';
                    colorText = 'text-text-primary';
                    colorBg = 'bg-surface border-border/50';
                    iconColor = 'text-primary';
                    amountPrefix = '-';
                  }

                  return (
                    <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface/50 border border-border/30 hover:bg-surface hover:border-primary/30 transition-all group gap-4 sm:gap-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${colorBg} ${iconColor} shadow-sm`}>
                          {icon}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary group-hover:text-primary transition-colors">
                            {tx.type === 'topup' ? 'เติมเงินเข้ากระเป๋า' :
                             tx.type === 'purchase' ? 'ชำระค่าคอร์สเรียน' :
                             tx.type === 'refund' ? 'คืนเงิน' : 
                             tx.type === 'withdrawal' ? 'ถอนเงิน' : tx.type}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <p className="text-xs text-text-muted font-medium">{date}</p>
                             {tx.description && (
                               <>
                                 <span className="text-text-muted/50">•</span>
                                 <p className="text-xs text-text-muted/80">{tx.description}</p>
                               </>
                             )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-left sm:text-right pl-16 sm:pl-0">
                        <p className={`font-extrabold text-lg ${colorText}`}>
                          {amountPrefix}{Number(tx.amount).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
                        </p>
                        <p className="text-[10px] font-bold mt-1 uppercase">
                          {tx.status === 'completed' && <span className="text-success px-2 py-0.5 rounded-full bg-success/10 border border-success/20">สำเร็จ</span>}
                          {tx.status === 'pending' && <span className="text-warning px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20">รอดำเนินการ</span>}
                          {tx.status === 'failed' && <span className="text-error px-2 py-0.5 rounded-full bg-error/10 border border-error/20">ล้มเหลว</span>}
                          {tx.status === 'cancelled' && <span className="text-text-muted px-2 py-0.5 rounded-full bg-surface-elevated border border-border/50">ยกเลิก</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Alert Modal Portal */}
      <AlertComponent />
    </div>
  );
}
