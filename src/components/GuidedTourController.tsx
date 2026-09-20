import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  X,
  Headphones,
} from 'lucide-react';
import { GUIDED_TOUR_NARRATIONS } from '../data/guidedTourData';
import { audioSystem } from '../utils/audioSynthesizer';

interface GuidedTourControllerProps {
  isActive: boolean;
  currentStationId: string;
  stationName: string;
  stationEmoji: string;
  onStopTour: () => void;
  onNextStation: () => void;
}

export const GuidedTourController: React.FC<GuidedTourControllerProps> = ({
  isActive,
  currentStationId,
  stationName,
  stationEmoji,
  onStopTour,
  onNextStation,
}) => {
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(14);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const narration = GUIDED_TOUR_NARRATIONS[currentStationId] || {
    stationId: currentStationId,
    narratorTitle: stationName,
    audioSpeechText: `Vi trovate nella postazione ${stationName}. Esplorate le metodologie e le tecnologie BIM dello studio.`,
    highlightPoints: ['Progettazione Digitale', 'Precisione Tecnica', 'Efficienza'],
    durationSeconds: 14,
  };

  // Setup Web Speech API Voice synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // When station changes during active guided tour, narrate
  useEffect(() => {
    if (!isActive) {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    setCountdown(narration.durationSeconds || 14);

    // Play chime sound
    audioSystem.playHotspotPing();

    if (speechEnabled && synthRef.current) {
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(narration.audioSpeechText);
      utterance.lang = 'it-IT';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      // Prefer Italian voice if available
      const voices = synthRef.current.getVoices();
      const italianVoice = voices.find((v) => v.lang.startsWith('it'));
      if (italianVoice) {
        utterance.voice = italianVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      try {
        synthRef.current.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis unavailable or blocked by browser:', e);
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isActive, currentStationId, speechEnabled, narration]);

  // Countdown timer per station
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onNextStation();
          return 14;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onNextStation]);

  const toggleSpeech = () => {
    const newState = !speechEnabled;
    setSpeechEnabled(newState);
    if (!newState && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isActive) return null;

  const progressPercentage = Math.round(((14 - countdown) / 14) * 100);

  return (
    <div
      id="guided-tour-controller-banner"
      className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl pointer-events-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-400/80 bg-stone-950/95 p-3.5 sm:p-4 shadow-[0_20px_60px_rgba(245,158,11,0.25)] backdrop-blur-2xl text-stone-100"
      >
        {/* Progress bar along top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-stone-800">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl border border-amber-400/40">
              {stationEmoji}
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-stone-950 text-[10px] animate-bounce font-bold">
                  🎙️
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  <Headphones className="h-3 w-3 animate-pulse" />
                  AUDIO TOUR GUIDATO LIVE • {countdown}s alla prossima tappa
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {narration.narratorTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleSpeech}
              className={`p-2 rounded-xl border transition-colors ${
                speechEnabled
                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
              }`}
              title={speechEnabled ? 'Disattiva voce narrante' : 'Attiva voce narrante'}
            >
              {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                audioSystem.playClick(600);
                onNextStation();
              }}
              className="p-2 rounded-xl bg-white/10 border border-white/20 text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
              title="Passa alla tappa successiva"
            >
              <SkipForward className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                audioSystem.playClick(500);
                onStopTour();
              }}
              className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition-colors"
              title="Esci dal tour guidato"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Narrator Text Display */}
        <div className="mt-2.5 rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs text-stone-300 leading-relaxed">
          <p className="line-clamp-2 sm:line-clamp-3 italic">
            "{narration.audioSpeechText}"
          </p>
        </div>

        {/* Highlight Bullets */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {narration.highlightPoints.map((pt, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900/80 border border-amber-400/30 text-[10px] font-medium text-amber-300"
            >
              <CheckCircle2 className="h-2.5 w-2.5 text-amber-400" />
              {pt}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
