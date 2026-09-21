import React, { useEffect, useRef, useState } from 'react';
import {
  Crosshair,
  PenTool,
  Eraser,
  X,
  Share2,
  Presentation,
  Check,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Trash2,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface LivePitchMeetingOverlayProps {
  isActive: boolean;
  onClose: () => void;
  currentStationName: string;
  onNextStation: () => void;
  onPrevStation: () => void;
}

export const LivePitchMeetingOverlay: React.FC<LivePitchMeetingOverlayProps> = ({
  isActive,
  onClose,
  currentStationName,
  onNextStation,
  onPrevStation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pointer' | 'pen' | 'highlighter' | 'laser'>('laser');
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#f59e0b'); // amber

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive]);

  if (!isActive) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === 'laser') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = tool === 'highlighter' ? 14 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'highlighter') {
      ctx.globalAlpha = 0.35;
    } else {
      ctx.globalAlpha = 0.95;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setLaserPos({ x: e.clientX, y: e.clientY });

    if (!isDrawing || tool === 'laser') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleClearBoard = () => {
    audioSystem.playClick(400);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none select-none">
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full ${
          tool === 'laser' ? 'pointer-events-auto cursor-none' : 'pointer-events-auto cursor-crosshair'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* Laser Pointer dot effect */}
      {tool === 'laser' && laserPos && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: laserPos.x, top: laserPos.y }}
        >
          <div className="relative flex h-6 w-6 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 shadow-[0_0_12px_#f43f5e]" />
          </div>
        </div>
      )}

      {/* Floating Presenter Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-50 flex items-center gap-2 rounded-none border border-white/20 bg-stone-950/95 p-2 shadow-2xl backdrop-blur-xl text-stone-100 font-mono text-xs">
        <div className="pointer-events-none absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-400" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-400" />

        <div className="flex items-center gap-1.5 px-2 border-r border-white/10">
          <Presentation className="h-4 w-4 text-amber-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            PITCH MODE
          </span>
        </div>

        {/* Station Prev/Next */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              audioSystem.playClick(600);
              onPrevStation();
            }}
            className="p-1 rounded-none border border-transparent hover:border-white/20 text-stone-300 hover:text-white"
            title="Postazione precedente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-white px-1 max-w-[140px] truncate font-sans">
            {currentStationName}
          </span>
          <button
            type="button"
            onClick={() => {
              audioSystem.playClick(600);
              onNextStation();
            }}
            className="p-1 rounded-none border border-transparent hover:border-white/20 text-stone-300 hover:text-white"
            title="Postazione successiva"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-white/15" />

        {/* Laser Pointer */}
        <button
          type="button"
          onClick={() => {
            audioSystem.playClick(700);
            setTool('laser');
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-none text-[11px] uppercase tracking-wider font-semibold transition-all border ${
            tool === 'laser'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
              : 'border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/5'
          }`}
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span>Laser</span>
        </button>

        {/* Freehand Pen */}
        <button
          type="button"
          onClick={() => {
            audioSystem.playClick(700);
            setTool('pen');
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-none text-[11px] uppercase tracking-wider font-semibold transition-all border ${
            tool === 'pen'
              ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
              : 'border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/5'
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          <span>Disegna</span>
        </button>

        {/* Highlighter */}
        <button
          type="button"
          onClick={() => {
            audioSystem.playClick(700);
            setTool('highlighter');
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-none text-[11px] uppercase tracking-wider font-semibold transition-all border ${
            tool === 'highlighter'
              ? 'bg-amber-400/20 text-amber-300 font-bold border-amber-400 shadow-sm'
              : 'border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/5'
          }`}
        >
          <span>Evidenzia</span>
        </button>

        {/* Clear Annotations */}
        <button
          type="button"
          onClick={handleClearBoard}
          className="p-1 rounded-none border border-transparent hover:border-rose-500/40 text-stone-400 hover:text-rose-400 transition-colors"
          title="Cancella tutti i tratti"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-white/15" />

        {/* Exit Pitch Mode */}
        <button
          type="button"
          onClick={() => {
            audioSystem.playClick(500);
            onClose();
          }}
          className="p-1 rounded-none border border-transparent hover:border-white/20 text-stone-400 hover:text-white transition-colors"
          title="Esci dalla modalità Pitch"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
