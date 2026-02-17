
'use client';

import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * AnimatedCard - Uses CSS transitions for better performance
 */
export function AnimatedCard({
  children,
  className = '',
  onClick,
  disabled = false,
}: AnimatedCardProps) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        relative overflow-hidden rounded-2xl 
        bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl 
        border border-zinc-200 dark:border-zinc-800
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-primary-500/10
        hover:border-primary-500/30
        hover:-translate-y-1
        ${onClick && !disabled ? 'cursor-pointer' : ''}
        ${disabled ? 'opacity-50 hover:translate-y-0 hover:shadow-none' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay on hover */}
      <div 
        className="
          absolute inset-0 opacity-0 transition-opacity duration-300
          bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5
          group-hover:opacity-100
        "
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
