import React, { useEffect } from 'react';
import { Clock, Sun, Sunset, Moon, Sparkles, X } from 'lucide-react';
import { LightingMode } from '../types';

interface LightTimeToastProps {
  message: string | null;
  mode: LightingMode;
  onDismiss: () => void;
  onOpenModal?: () => void;
}

export const LightTimeToast: React.FC<LightTimeToastProps> = ({
  message,
  mode,
  onDismiss,
  onOpenModal,
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[90%] sm:w-auto"
    >
      <div className="flex items-center justify-between gap-3 rounded-none border border-white/15 bg-stone-950/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl animate-fade-in text-stone-100 relative">
        <div className="pointer-events-none absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-400" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-400" />

        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-none border ${
              mode === 'day'
                ? 'bg-amber-400 border-amber-300 text-stone-950'
                : mode === 'sunset'
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'bg-indigo-600 border-indigo-500 text-white'
            }`}
          >
            {mode === 'day' && <Sun className="h-4 w-4" />}
            {mode === 'sunset' && <Sunset className="h-4 w-4" />}
            {mode === 'night' && <Moon className="h-4 w-4" />}
          </div>
          <div>
            <p className="font-mono text-xs font-semibold text-white leading-tight">{message}</p>
            {onOpenModal && (
              <button
                type="button"
                onClick={onOpenModal}
                className="font-mono text-[10px] text-amber-400 hover:text-amber-300 underline uppercase tracking-wider"
              >
                Configura orario & simulatore
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="rounded-none border border-transparent hover:border-white/20 p-1 text-stone-400 hover:text-white transition-all ml-1"
          title="Chiudi notifica"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
