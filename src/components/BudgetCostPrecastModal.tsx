import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Smartphone, Maximize2, Minimize2, Wifi, Signal, Battery, 
  ExternalLink
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';
import { BudgetCostPrecastApp } from './BudgetCostPrecastApp';

interface BudgetCostPrecastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LIVE_APP_URL = "https://ai.studio/apps/3ec675e1-e843-43c5-89f6-e4b51305a93e";

export const BudgetCostPrecastModal: React.FC<BudgetCostPrecastModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentTime, setCurrentTime] = useState<string>('12:45');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Update clock every 30 seconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        audioSystem.playClick(450);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => {
            audioSystem.playClick(450);
            onClose();
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative z-10 flex flex-col items-center max-h-[96vh] my-auto"
        >
          {/* External Controls Top Bar */}
          <div className={`w-full ${isExpanded ? 'max-w-6xl' : 'max-w-[440px]'} flex items-center justify-between px-3 py-2 text-stone-300 font-mono text-xs select-none gap-2 transition-all duration-300`}>
            {/* Left: Mode Title & Indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              <span className="text-[11px] tracking-wider uppercase text-cyan-300 font-bold">
                {isExpanded ? 'Modalità Desktop Dashboard' : 'Android OS // Smartphone Simulator'}
              </span>
            </div>

            {/* Right: Actions (Expand, External Link, Close) */}
            <div className="flex items-center gap-1.5">
              <a
                href={LIVE_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Apri sorgente su ai.studio in nuova scheda"
                className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-cyan-400 border border-stone-700 transition text-[11px]"
              >
                <span>ai.studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => {
                  audioSystem.playClick(600);
                  setIsExpanded(!isExpanded);
                }}
                title={isExpanded ? "Torna a vista Smartphone Android" : "Ingrandisci a schermo intero (Desktop)"}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition text-[11px]"
              >
                {isExpanded ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Smartphone</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Espandi</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  audioSystem.playClick(400);
                  onClose();
                }}
                title="Chiudi pop up (Esc)"
                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/40 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Device Shell (Android Smartphone Frame / Expanded Desktop View) */}
          <div
            className={`transition-all duration-300 relative bg-[#121316] border-[6px] sm:border-[8px] border-[#22242a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,240,255,0.12)] flex flex-col overflow-hidden ${
              isExpanded
                ? 'w-[96vw] max-w-6xl h-[90vh] rounded-2xl'
                : 'w-[94vw] max-w-[420px] h-[86vh] max-h-[840px] rounded-[44px]'
            }`}
          >
            {/* Physical Button Accents on Phone Frame Edge */}
            {!isExpanded && (
              <>
                <div className="absolute -left-[10px] top-28 w-[4px] h-12 bg-stone-600 rounded-l-md pointer-events-none" />
                <div className="absolute -left-[10px] top-44 w-[4px] h-12 bg-stone-600 rounded-l-md pointer-events-none" />
                <div className="absolute -right-[10px] top-32 w-[4px] h-16 bg-stone-500 rounded-r-md pointer-events-none" />
              </>
            )}

            {/* Android Status Bar */}
            <div className="h-8 w-full bg-slate-950/95 px-5 flex items-center justify-between text-white/80 text-[11px] font-mono shrink-0 select-none z-20 border-b border-white/5">
              {/* Clock */}
              <span className="font-semibold text-white tracking-wide">{currentTime}</span>

              {/* Camera Punch-hole Notch */}
              <div className="flex items-center justify-center p-1">
                <div className="w-3.5 h-3.5 rounded-full bg-black ring-2 ring-stone-800/90 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80 ring-1 ring-cyan-900/60" />
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-1.5 text-white/90">
                <Wifi className="w-3 h-3" />
                <Signal className="w-3 h-3" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] text-white/70">94%</span>
                  <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                </div>
              </div>
            </div>

            {/* Smartphone Scrollable Screen Content: Executes Native Application */}
            <div className="flex-1 overflow-y-auto bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 relative">
              <BudgetCostPrecastApp isMobileFrame={!isExpanded} />
            </div>

            {/* Android Bottom Navigation Gesture Bar */}
            <div className="h-6 w-full bg-slate-950 flex items-center justify-center shrink-0 border-t border-white/5 select-none z-20">
              <div className="w-28 h-1 bg-white/40 rounded-full active:bg-white/80 transition-colors" />
            </div>
          </div>

          {/* Hint Footer */}
          <div className="mt-2 text-[11px] font-mono text-stone-400 flex flex-wrap items-center justify-center gap-2 select-none text-center">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Budget Cost Precast • Motore Nativo Parametrico</span>
            <span className="text-white/20">•</span>
            <span className="text-stone-500">Premi [Esc] per uscire</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
