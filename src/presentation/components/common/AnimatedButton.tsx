/**
 * AnimatedButton
 * Reusable button with react-spring hover/click spring animations
 * Gradient design matching game-style aesthetic
 */

'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { type ReactNode, useCallback } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn-game text-white',
  secondary: 'bg-surface-elevated border border-border text-text-primary hover:border-primary/50',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface',
  accent: 'bg-gradient-to-r from-accent to-primary text-white',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-2.5 text-base rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-lg rounded-2xl gap-2.5',
};

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon,
  fullWidth = false,
}: AnimatedButtonProps) {
  const [spring, api] = useSpring(() => ({
    scale: 1,
    y: 0,
    config: config.wobbly,
  }));

  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      api.start({ scale: 1.05, y: -2 });
    }
  }, [api, disabled]);

  const handleMouseLeave = useCallback(() => {
    api.start({ scale: 1, y: 0 });
  }, [api]);

  const handleClick = useCallback(() => {
    if (disabled || !onClick) return;
    api.start({
      scale: 0.95,
      y: 0,
      config: { tension: 400, friction: 10 },
    });
    setTimeout(() => {
      api.start({ scale: 1, y: 0, config: config.wobbly });
    }, 100);
    onClick();
  }, [api, disabled, onClick]);

  return (
    <animated.button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      style={{
        transform: spring.scale.to(
          (s) => `scale(${s}) translateY(${spring.y.get()}px)`
        ),
      }}
      className={`
        inline-flex items-center justify-center font-semibold transition-colors
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </animated.button>
  );
}
