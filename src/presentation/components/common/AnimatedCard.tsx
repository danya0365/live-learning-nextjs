/**
 * AnimatedCard
 * Reusable card with react-spring hover tilt + scale effects
 * Glassmorphism design with mouse-position-based 3D tilt
 */

'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { type ReactNode, useCallback, useRef } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  enableTilt?: boolean;
  enableGlow?: boolean;
}

export function AnimatedCard({
  children,
  className = '',
  onClick,
  enableTilt = true,
  enableGlow = true,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [spring, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    shadow: 8,
    config: config.gentle,
  }));

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableTilt || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      api.start({ rotateX, rotateY, scale: 1.02, shadow: 20 });
    },
    [api, enableTilt]
  );

  const handleMouseLeave = useCallback(() => {
    api.start({ rotateX: 0, rotateY: 0, scale: 1, shadow: 8 });
  }, [api]);

  const handleClick = useCallback(() => {
    if (onClick) {
      api.start({
        scale: 0.97,
        config: { tension: 300, friction: 10 },
      });
      setTimeout(() => {
        api.start({ scale: 1, config: config.wobbly });
        onClick();
      }, 100);
    }
  }, [api, onClick]);

  return (
    <animated.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: spring.rotateX.to(
          (rx) =>
            `perspective(800px) rotateX(${rx}deg) rotateY(${spring.rotateY.get()}deg) scale(${spring.scale.get()})`
        ),
        boxShadow: spring.shadow.to(
          (s) =>
            `0 ${s}px ${s * 2}px rgba(100, 100, 200, ${enableGlow ? 0.15 : 0.08})`
        ),
      }}
      className={`glass rounded-2xl p-6 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </animated.div>
  );
}
