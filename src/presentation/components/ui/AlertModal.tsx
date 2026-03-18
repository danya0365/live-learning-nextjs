'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
}

export function AlertModal({ isOpen, title, message, type = 'info', onClose }: AlertModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const config = {
    success: { icon: '✅', color: 'text-success bg-success/10 border-success/20', glow: 'bg-success', defaultTitle: 'สำเร็จ' },
    error: { icon: '❌', color: 'text-error bg-error/10 border-error/20', glow: 'bg-error', defaultTitle: 'ข้อผิดพลาด' },
    info: { icon: 'ℹ️', color: 'text-primary bg-primary/10 border-primary/20', glow: 'bg-primary', defaultTitle: 'ข้อมูล' },
    warning: { icon: '⚠️', color: 'text-warning bg-warning/10 border-warning/20', glow: 'bg-warning', defaultTitle: 'แจ้งเตือน' }
  };

  const currentConfig = config[type];
  const displayTitle = title || currentConfig.defaultTitle;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative shadow-2xl border border-white/10 animate-slideUp z-10 flex flex-col items-center text-center isolate">
        
        {/* Decorative background glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 ${currentConfig.glow}`}></div>

        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 border shadow-sm ${currentConfig.color}`}>
          {currentConfig.icon}
        </div>
        
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
          {displayTitle}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm font-medium whitespace-pre-line">
          {message}
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl btn-game text-white font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
        >
          ตกลง
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Hook to easily use this modal in components
export function useAlertModal() {
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean; title?: string; message: string; type: AlertType}>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showAlert = (message: string, type: AlertType = 'info', title?: string) => {
    setAlertConfig({ isOpen: true, message, type, title });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  const AlertComponent = () => (
    <AlertModal 
      isOpen={alertConfig.isOpen}
      title={alertConfig.title}
      message={alertConfig.message}
      type={alertConfig.type}
      onClose={closeAlert}
    />
  );

  return { showAlert, closeAlert, AlertComponent };
}
