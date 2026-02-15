'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = 'กำลังโหลด...' }: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md animate-fadeIn">
       {/* Background Orbs (CSS Only - Safer) */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-[70%] left-[70%] w-[400px] h-[400px] rounded-full bg-secondary/20 blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
       </div>

       <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Custom Spinner */}
          <div className="relative w-24 h-24">
             {/* Rotating outer ring */}
             <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             
             {/* Inner bouncing icon */}
             <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
                🎮
             </div>
          </div>
          
          <div className="text-center">
             <h3 className="text-2xl font-bold gradient-text mb-2">Live Learning</h3>
             <p className="text-text-secondary animate-pulse">{message}</p>
          </div>
       </div>
    </div>,
    document.body
  );
}
