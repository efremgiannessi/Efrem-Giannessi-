import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hotspot } from '../types';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface HotspotModalProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({ hotspot, onClose }) => {
  const [actionDone, setActionDone] = useState(false);

  if (!hotspot) return null;

  const handleAction = () => {
    audioSystem.playClick(850);
    setActionDone(true);
    setTimeout(() => {
      setActionDone(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotspot-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md overflow-hidden rounded-none border border-white/20 bg-stone-950/95 p-6 text-white shadow-2xl backdrop-blur-2xl"
      >
        {/* Architectural corner marks */}
        <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400" />
        <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400" />

        {/* Close Button */}
        <button
          type="button"
          id="close-hotspot-modal"
          onClick={() => {
            audioSystem.playClick(450);
            onClose();
          }}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-none border border-white/15 bg-white/5 text-stone-400 hover:border-amber-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hotspot Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-none bg-stone-900 border border-amber-400/40 text-3xl shadow-inner">
            {hotspot.emoji}
          </div>
          <div>
            {hotspot.badge && (
              <span className="inline-block rounded-none bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 border border-amber-400/30 uppercase tracking-wider">
                {hotspot.badge}
              </span>
            )}
            <h3 id="hotspot-modal-title" className="text-lg font-bold tracking-tight text-white mt-1">
              {hotspot.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
          {hotspot.description}
        </p>

        {/* Detailed Bullet Points from efremgiannessi.org */}
        {hotspot.detailBullets && hotspot.detailBullets.length > 0 && (
          <div className="mt-4 rounded-none bg-stone-900/80 border border-white/10 p-3.5">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Punti Chiave & Metodologia:
            </h4>
            <ul className="space-y-1.5">
              {hotspot.detailBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                  <span className="mt-1 h-1 w-1 shrink-0 bg-amber-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action / External Link Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          {hotspot.linkUrl ? (
            <a
              id="open-hotspot-link"
              href={hotspot.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioSystem.playClick(850)}
              className="flex-1 flex items-center justify-center gap-2 rounded-none bg-amber-400 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-stone-950 border border-amber-300 hover:bg-amber-300 transition-all active:scale-98 shadow-md"
            >
              <span>{hotspot.actionLabel || 'Visita il sito'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : hotspot.actionLabel ? (
            <button
              type="button"
              id="execute-hotspot-action"
              onClick={handleAction}
              disabled={actionDone}
              className="flex-1 flex items-center justify-center gap-2 rounded-none bg-amber-400 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-stone-950 border border-amber-300 hover:bg-amber-300 transition-all active:scale-98 disabled:opacity-80 shadow-md"
            >
              {actionDone ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Azione Eseguita!
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  {hotspot.actionLabel}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </>
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="rounded-none border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-mono font-medium uppercase tracking-wider text-stone-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Chiudi
          </button>
        </div>
      </motion.div>
    </div>
  );
};
