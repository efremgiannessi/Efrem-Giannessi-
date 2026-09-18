import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FlyingEmojiTransitionProps {
  emoji: string | null;
  stationName: string | null;
  direction: 'left' | 'right' | 'direct';
}

export const FlyingEmojiTransition: React.FC<FlyingEmojiTransitionProps> = ({
  emoji,
  stationName,
  direction,
}) => {
  if (!emoji) return null;

  const startX = direction === 'left' ? -280 : direction === 'right' ? 280 : 0;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${emoji}-${direction}`}
          initial={{
            opacity: 0,
            scale: 0.2,
            y: 220,
            x: startX,
            rotate: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1.8, 1.2, 2.4],
            y: [220, -10, 0, -80],
            x: [startX, startX * 0.4, 0, 0],
            rotate: [direction === 'left' ? -25 : 25, 0, 5, 0],
          }}
          transition={{
            duration: 0.95,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.35, 0.7, 1],
          }}
          className="flex flex-col items-center justify-center"
        >
          {/* Glowing Aura Ring */}
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: [1, 2.2, 3], opacity: [0.8, 0.4, 0] }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute h-32 w-32 rounded-full bg-white/25 blur-2xl filter"
            />
            {/* Main Emoji with dynamic 3D drop shadow */}
            <span
              className="text-8xl select-none filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {emoji}
            </span>
          </div>

          {/* Floating station title badge */}
          {stationName && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: [0, 1, 1, 0], y: [15, 0, -5, -20] }}
              transition={{ duration: 0.9, times: [0, 0.3, 0.75, 1] }}
              className="mt-3 rounded-full border border-white/30 bg-black/60 px-5 py-1.5 text-sm font-semibold tracking-wide text-white shadow-2xl backdrop-blur-md"
            >
              Teletrasporto verso {stationName}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
