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
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-stone-950 p-6 text-white shadow-2xl backdrop-blur-2xl"
      >
        {/* Background glow */}
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          id="close-hotspot-modal"
          onClick={() => {
            audioSystem.playClick(450);
            onClose();
          }}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hotspot Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-4xl shadow-inner">
            {hotspot.emoji}
          </div>
          <div>
            {hotspot.badge && (
              <span className="inline-block rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-400/30">
                {hotspot.badge}
              </span>
            )}
            <h3 id="hotspot-modal-title" className="text-xl font-bold tracking-tight text-white mt-1">
              {hotspot.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-stone-300 leading-relaxed">
          {hotspot.description}
        </p>

        {/* Detailed Bullet Points from efremgiannessi.org */}
        {hotspot.detailBullets && hotspot.detailBullets.length > 0 && (
          <div className="mt-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Punti Chiave & Metodologia:
            </h4>
            <ul className="space-y-1.5">
              {hotspot.detailBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-stone-200">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
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
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-98"
            >
              <span>{hotspot.actionLabel || 'Visita il sito'}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : hotspot.actionLabel ? (
            <button
              type="button"
              id="execute-hotspot-action"
              onClick={handleAction}
              disabled={actionDone}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-98 disabled:opacity-80"
            >
              {actionDone ? (
                <>
                  <Check className="h-4 w-4" />
                  Azione Eseguita!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {hotspot.actionLabel}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
          >
            Chiudi
          </button>
        </div>
      </motion.div>
    </div>
  );
};
