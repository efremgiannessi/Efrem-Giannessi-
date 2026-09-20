import React from 'react';
import { motion } from 'motion/react';
import { TransitionStyle } from '../types';

interface MotionBlurStreaksProps {
  isTransitioning: boolean;
  direction: 'left' | 'right' | 'direct';
  transitionStyle: TransitionStyle;
}

export const MotionBlurStreaks: React.FC<MotionBlurStreaksProps> = ({
  isTransitioning,
  direction,
  transitionStyle,
}) => {
  if (!isTransitioning) return null;

  const isLeft = direction === 'left';
  const isRight = direction === 'right';

  return (
    <div className="pointer-events-none absolute inset-0 z-25 overflow-hidden">
      {/* 1. Directional Motion Blur Streaks (for 'motion-blur' style) */}
      {transitionStyle === 'motion-blur' && (
        <>
          {/* High speed horizontal light streaks overlay */}
          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0.6,
              x: isLeft ? -150 : isRight ? 150 : 0,
            }}
            animate={{
              opacity: [0, 0.7, 0.9, 0],
              scaleX: [0.8, 1.6, 2.2, 1.0],
              x: isLeft ? [150, 0, -180] : isRight ? [-150, 0, 180] : [0, 0, 0],
            }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 h-full w-full mix-blend-screen pointer-events-none"
            style={{
              background: `linear-gradient(${isRight ? '90deg' : isLeft ? '-90deg' : '0deg'}, transparent 0%, rgba(245,158,11,0.2) 25%, rgba(255,255,255,0.4) 50%, rgba(245,158,11,0.2) 75%, transparent 100%)`,
              filter: 'blur(12px)',
            }}
          />

          {/* Fine architectural speed lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0.6, 0] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(245, 158, 11, 0.12) 41px, transparent 42px)',
              transform: isRight ? 'skewX(-18deg)' : isLeft ? 'skewX(18deg)' : 'none',
              filter: 'blur(2px)',
            }}
          />

          {/* Anamorphic cinematic horizontal flare */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0.2 }}
            animate={{
              opacity: [0, 0.85, 0.5, 0],
              scaleY: [0.2, 1.8, 0.4, 0],
              x: isRight ? [-100, 0, 100] : isLeft ? [100, 0, -100] : [0, 0, 0],
            }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-16 pointer-events-none mix-blend-screen"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(217,119,6,0.25) 20%, rgba(255,255,255,0.7) 50%, rgba(217,119,6,0.25) 80%, transparent 100%)',
              filter: 'blur(6px)',
            }}
          />
        </>
      )}

      {/* 2. Soft Cross-Dissolve Velvet Veil (for 'cross-dissolve' style) */}
      {transitionStyle === 'cross-dissolve' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.7, 0] }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="absolute inset-0 bg-stone-950/50 backdrop-blur-[4px] pointer-events-none"
        />
      )}

      {/* 3. High-velocity Warp Zoom Tunnel (for 'warp-zoom' style) */}
      {transitionStyle === 'warp-zoom' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: [0, 0.85, 0],
            scale: [0.85, 1.4, 1.8],
          }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at center, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.15) 45%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      )}
    </div>
  );
};
