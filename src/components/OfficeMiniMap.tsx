import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Compass,
  Zap,
  Maximize2,
  Minimize2,
  Navigation,
  CheckCircle2,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { OfficeStation } from '../types';
import { audioSystem } from '../utils/audioSynthesizer';

export interface StationMapNode {
  id: string;
  x: number; // percentage in SVG coordinate space (0-100)
  y: number; // percentage in SVG coordinate space (0-100)
  roomCode: string;
  zone: string;
  areaM2: number;
  orientation: number; // angle in degrees for camera view cone
}

// Spatial coordinates within the studio layout
export const STATION_MAP_NODES: Record<string, StationMapNode> = {
  'bim-hub': {
    id: 'bim-hub',
    x: 22,
    y: 26,
    roomCode: 'A-101',
    zone: 'Direzione & Coordinamento 5D',
    areaM2: 38,
    orientation: 135,
  },
  'revit-design-hub': {
    id: 'revit-design-hub',
    x: 50,
    y: 22,
    roomCode: 'B-102',
    zone: 'Authoring BIM & Modelli 3D',
    areaM2: 54,
    orientation: 180,
  },
  'revit-plugins-hub': {
    id: 'revit-plugins-hub',
    x: 78,
    y: 26,
    roomCode: 'C-103',
    zone: 'Dev Lab C# / pyRevit / Python',
    areaM2: 32,
    orientation: 225,
  },
  'computo-hub': {
    id: 'computo-hub',
    x: 22,
    y: 62,
    roomCode: 'D-104',
    zone: 'Desk Computi Estimativi & WBS',
    areaM2: 35,
    orientation: 45,
  },
  'cad-to-bim-hub': {
    id: 'cad-to-bim-hub',
    x: 50,
    y: 52,
    roomCode: 'E-105',
    zone: 'Isola Digitalizzazione CAD → BIM',
    areaM2: 42,
    orientation: 90,
  },
  'rendering-hub': {
    id: 'rendering-hub',
    x: 78,
    y: 62,
    roomCode: 'F-106',
    zone: 'Visual Studio & Virtual Tour 360°',
    areaM2: 36,
    orientation: 315,
  },
  'approfondimenti-hub': {
    id: 'approfondimenti-hub',
    x: 30,
    y: 84,
    roomCode: 'G-107',
    zone: 'Lounge Ricerca Normativa & R&D',
    areaM2: 24,
    orientation: 0,
  },
  'contacts-hub': {
    id: 'contacts-hub',
    x: 70,
    y: 84,
    roomCode: 'H-108',
    zone: 'Reception & Sala Riunioni Committenti',
    areaM2: 45,
    orientation: 270,
  },
};

interface OfficeMiniMapProps {
  isOpen: boolean;
  onClose: () => void;
  stations: OfficeStation[];
  currentStationIndex: number;
  onSelectStation: (index: number) => void;
}

export const OfficeMiniMap: React.FC<OfficeMiniMapProps> = ({
  isOpen,
  onClose,
  stations,
  currentStationIndex,
  onSelectStation,
}) => {
  const [isExpandedModal, setIsExpandedModal] = useState<boolean>(false);
  const [hoveredStationId, setHoveredStationId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentStation = stations[currentStationIndex];
  const currentNode = currentStation ? STATION_MAP_NODES[currentStation.id] : null;

  // Calculate distance in simulated meters from current location
  const calculateDistance = (targetNode: StationMapNode | undefined): number => {
    if (!currentNode || !targetNode) return 0;
    const dx = ((targetNode.x - currentNode.x) / 100) * 35; // 35 meters office width
    const dy = ((targetNode.y - currentNode.y) / 100) * 22; // 22 meters office length
    return Math.round(Math.hypot(dx, dy));
  };

  const handleStationClick = (index: number) => {
    audioSystem.playClick(680);
    onSelectStation(index);
  };

  // Filter categories
  const categories = [
    { id: 'all', label: 'Tutte le Aree' },
    { id: 'bim', label: 'BIM & Revit' },
    { id: 'dev', label: 'Sviluppo & API' },
    { id: 'services', label: 'Consulenza & Stime' },
  ];

  const matchesCategory = (station: OfficeStation): boolean => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'bim') {
      return (
        station.id === 'bim-hub' ||
        station.id === 'revit-design-hub' ||
        station.id === 'cad-to-bim-hub'
      );
    }
    if (selectedCategory === 'dev') {
      return station.id === 'revit-plugins-hub';
    }
    if (selectedCategory === 'services') {
      return (
        station.id === 'computo-hub' ||
        station.id === 'rendering-hub' ||
        station.id === 'approfondimenti-hub' ||
        station.id === 'contacts-hub'
      );
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. ON-SCREEN HUD OVERLAY MINI-MAP (Docked bottom-left above canvas, always visible when isOpen is true) */}
      <motion.div
        id="office-minimap-hud-card"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="fixed bottom-20 sm:bottom-24 left-3 sm:left-6 z-30 flex flex-col w-[260px] sm:w-[290px] rounded-2xl border border-white/20 bg-stone-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl text-stone-100 overflow-hidden"
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-300">
              Mappa Studio BIM
            </span>
            <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
              RADAR
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Expand to Fullscreen Blueprint Modal */}
            <button
              type="button"
              id="btn-expand-minimap"
              onClick={() => {
                audioSystem.playClick(600);
                setIsExpandedModal(true);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Ingrandisci planimetria a schermo intero"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>

            {/* Close / Hide Mini-Map */}
            <button
              type="button"
              id="btn-close-hud-minimap"
              onClick={() => {
                audioSystem.playClick(500);
                onClose();
              }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Nascondi mappa (riapribile dal menu in alto)"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mini Blueprint Map Canvas */}
        <div className="relative w-full aspect-[16/11] bg-stone-900/80 p-1.5 overflow-hidden select-none">
          {/* Blueprint Architectural Grid Background */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="mini-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mini-grid)" />
          </svg>

          {/* SVG Blueprint Walls */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Outer Perimeter */}
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              rx="3"
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.2"
            />
            {/* Dividing partitions */}
            <line x1="5" y1="42" x2="95" y2="42" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="2 1.5" />
            <line x1="5" y1="74" x2="95" y2="74" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="2 1.5" />
            <line x1="36" y1="5" x2="36" y2="74" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <line x1="64" y1="5" x2="64" y2="74" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <line x1="50" y1="74" x2="50" y2="95" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />

            {/* Central Circulation Path */}
            <rect
              x="38"
              y="44"
              width="24"
              height="28"
              rx="2"
              fill="rgba(245,158,11,0.03)"
              stroke="rgba(245,158,11,0.25)"
              strokeWidth="0.6"
              strokeDasharray="1.5 1.5"
            />

            {/* Camera Vision Cone from current station */}
            {currentNode && (
              <g transform={`translate(${currentNode.x}, ${currentNode.y}) rotate(${currentNode.orientation})`}>
                <path
                  d="M 0 0 L -12 -22 A 25 25 0 0 1 12 -22 Z"
                  fill="rgba(245,158,11,0.3)"
                  stroke="rgba(245,158,11,0.7)"
                  strokeWidth="0.6"
                />
              </g>
            )}
          </svg>

          {/* Interactive Clickable Station Pins on Blueprint */}
          {stations.map((station, idx) => {
            const node = STATION_MAP_NODES[station.id];
            if (!node) return null;

            const isCurrent = idx === currentStationIndex;
            const isHovered = hoveredStationId === station.id;

            return (
              <div
                key={`mini-pin-${station.id}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20"
                onMouseEnter={() => setHoveredStationId(station.id)}
                onMouseLeave={() => setHoveredStationId(null)}
              >
                {/* Active Pulsing Ring */}
                {isCurrent && (
                  <div className="absolute -inset-2.5 rounded-full bg-amber-400/40 animate-ping duration-1000 pointer-events-none" />
                )}

                <button
                  type="button"
                  id={`hud-pin-${station.id}`}
                  onClick={() => handleStationClick(idx)}
                  className={`group relative flex items-center justify-center rounded-xl transition-all focus:outline-none ${
                    isCurrent
                      ? 'h-7 w-7 sm:h-8 sm:w-8 bg-amber-400 text-stone-950 font-bold shadow-lg shadow-amber-500/50 ring-2 ring-amber-300 scale-110 z-30'
                      : 'h-5 w-5 sm:h-6 sm:w-6 bg-stone-900/90 text-white border border-white/30 hover:border-amber-400 hover:scale-125 hover:bg-stone-800'
                  }`}
                  title={`${station.shortName} • Clicca per salto rapido`}
                >
                  <span className="text-xs select-none">{station.emoji}</span>
                </button>

                {/* Micro Label on hover or active */}
                {(isHovered || isCurrent) && (
                  <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap z-30">
                    <span
                      className={`px-1 py-0.2 rounded text-[8px] font-semibold border ${
                        isCurrent
                          ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                          : 'bg-stone-950/90 text-stone-200 border-white/20'
                      }`}
                    >
                      {station.shortName}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Station Info Footer Bar */}
        <div className="px-3 py-2 bg-stone-900/90 border-t border-white/10 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-stone-300 truncate">
              Posizione: <b className="text-amber-300 font-semibold">{currentStation.shortName}</b>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              audioSystem.playClick(600);
              setIsExpandedModal(true);
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5 shrink-0 ml-2"
          >
            <span>Apri</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </motion.div>

      {/* 2. EXPANDED FULL-SCREEN ARCHITECTURAL BLUEPRINT MODAL */}
      <AnimatePresence>
        {isExpandedModal && (
          <div
            id="office-minimap-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Planimetria Ufficio e Salto Rapido Postazioni"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md"
          >
            {/* Backdrop dismiss */}
            <div
              className="absolute inset-0"
              onClick={() => setIsExpandedModal(false)}
              aria-hidden="true"
            />

            {/* Main MiniMap Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/20 bg-stone-950/95 shadow-2xl backdrop-blur-2xl text-stone-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-4 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold shadow-md">
                    <Compass className="h-5 w-5 animate-[spin_12s_linear_infinite]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        Planimetria Studio BIM & Layout Ufficio
                      </h2>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 border border-emerald-500/30">
                        LIVE RADAR
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 hidden xs:block">
                      Mappa interattiva • Clicca sui punti della pianta per il salto rapido tra postazioni distanti
                    </p>
                  </div>
                </div>

                {/* Close Modal Button */}
                <button
                  type="button"
                  id="btn-close-expanded-modal"
                  onClick={() => {
                    audioSystem.playClick(500);
                    setIsExpandedModal(false);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-stone-400 hover:bg-white/20 hover:text-white transition-all active:scale-95"
                  title="Riduci a mini-mappa"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>

              {/* Content Body: Planimetria + Quick Jump Sidebar */}
              <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto min-h-0">
                {/* Left Column: Interactive Architectural Floor Plan Blueprint */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center bg-stone-900/40">
                  {/* Floor Plan Header Stats */}
                  <div className="w-full flex items-center justify-between text-xs text-stone-400 mb-3 px-1">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-amber-400 font-semibold">LIVELLO 01</span>
                      <span>•</span>
                      <span>SUP. TOTALE: 280 m²</span>
                      <span>•</span>
                      <span className="text-stone-300">H: 3.20 m</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                      <Navigation className="h-3 w-3 text-amber-400 rotate-45" />
                      <span>NORD GEOGRAFICO 0°</span>
                    </div>
                  </div>

                  {/* SVG Blueprint Canvas */}
                  <div className="relative w-full aspect-[16/11] max-h-[380px] sm:max-h-[420px] rounded-2xl border border-white/15 bg-stone-950/80 p-2 overflow-hidden shadow-inner select-none">
                    {/* Architectural Blueprint Grid Background */}
                    <svg
                      className="absolute inset-0 h-full w-full pointer-events-none opacity-20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern id="modal-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                        </pattern>
                        <pattern id="modal-grid-pattern-large" width="80" height="80" patternUnits="userSpaceOnUse">
                          <rect width="80" height="80" fill="url(#modal-grid-pattern)" />
                          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#modal-grid-pattern-large)" />
                    </svg>

                    {/* Architectural Walls & Rooms SVG */}
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 h-full w-full pointer-events-none"
                      preserveAspectRatio="none"
                    >
                      {/* Outer Perimeter Wall */}
                      <rect
                        x="4"
                        y="4"
                        width="92"
                        height="92"
                        rx="3"
                        fill="rgba(255,255,255,0.02)"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="1.2"
                      />

                      {/* Room Partitions */}
                      <line x1="4" y1="42" x2="96" y2="42" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="1.5 1" />
                      <line x1="4" y1="74" x2="96" y2="74" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="1.5 1" />

                      <line x1="36" y1="4" x2="36" y2="42" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                      <line x1="64" y1="4" x2="64" y2="42" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

                      <line x1="36" y1="42" x2="36" y2="74" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="1 1" />
                      <line x1="64" y1="42" x2="64" y2="74" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="1 1" />

                      <line x1="50" y1="74" x2="50" y2="96" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

                      {/* Central Circulation Path (Hallway) */}
                      <rect
                        x="38"
                        y="44"
                        width="24"
                        height="28"
                        rx="2"
                        fill="rgba(245,158,11,0.03)"
                        stroke="rgba(245,158,11,0.25)"
                        strokeWidth="0.6"
                        strokeDasharray="1.5 1.5"
                      />

                      {/* Entrance door marker */}
                      <path
                        d="M 66 96 A 6 6 0 0 0 74 96"
                        fill="none"
                        stroke="rgba(52,211,153,0.8)"
                        strokeWidth="1.2"
                      />
                      <text x="69" y="99" fill="rgba(52,211,153,0.9)" fontSize="2.8" textAnchor="middle" fontFamily="monospace">
                        INGRESSO
                      </text>

                      {/* Room Architectural Codes */}
                      <text x="7" y="10" fill="rgba(255,255,255,0.4)" fontSize="2.6" fontFamily="monospace">LOC. A-101 (38m²)</text>
                      <text x="38" y="10" fill="rgba(255,255,255,0.4)" fontSize="2.6" fontFamily="monospace">LOC. B-102 (54m²)</text>
                      <text x="66" y="10" fill="rgba(255,255,255,0.4)" fontSize="2.6" fontFamily="monospace">LOC. C-103 (32m²)</text>
                      <text x="7" y="48" fill="rgba(255,255,255,0.4)" fontSize="2.6" fontFamily="monospace">LOC. D-104 (35m²)</text>
                      <text x="40" y="48" fill="rgba(245,158,11,0.6)" fontSize="2.6" fontFamily="monospace">ISOLA E-105</text>
                      <text x="66" y="48" fill="rgba(255,255,255,0.4)" fontSize="2.6" fontFamily="monospace">LOC. F-106 (36m²)</text>
                      <text x="7" y="79" fill="rgba(255,255,255,0.4)" fontSize="2.6" fontFamily="monospace">LOC. G-107 (24m²)</text>
                      <text x="53" y="79" fill="rgba(255,255,255,0.4)" fontSize="2.6" fontFamily="monospace">LOC. H-108 (45m²)</text>

                      {/* Current User Camera Viewing Cone / Frustum */}
                      {currentNode && (
                        <g transform={`translate(${currentNode.x}, ${currentNode.y}) rotate(${currentNode.orientation})`}>
                          <path
                            d="M 0 0 L -12 -24 A 26 26 0 0 1 12 -24 Z"
                            fill="rgba(245,158,11,0.25)"
                            stroke="rgba(245,158,11,0.6)"
                            strokeWidth="0.5"
                          />
                          <line x1="0" y1="0" x2="0" y2="-24" stroke="rgba(245,158,11,0.9)" strokeWidth="0.8" strokeDasharray="1 1" />
                        </g>
                      )}
                    </svg>

                    {/* Interactive Station Nodes */}
                    {stations.map((station, idx) => {
                      const node = STATION_MAP_NODES[station.id];
                      if (!node) return null;

                      const isCurrent = idx === currentStationIndex;
                      const isHovered = hoveredStationId === station.id;
                      const distance = calculateDistance(node);

                      return (
                        <div
                          key={station.id}
                          style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          className="absolute z-20"
                          onMouseEnter={() => setHoveredStationId(station.id)}
                          onMouseLeave={() => setHoveredStationId(null)}
                        >
                          {/* Pulsing Radar Ring for Current Location */}
                          {isCurrent && (
                            <>
                              <div className="absolute -inset-4 rounded-full bg-amber-400/30 animate-ping duration-1000 pointer-events-none" />
                              <div className="absolute -inset-2 rounded-full bg-amber-400/20 animate-pulse pointer-events-none" />
                            </>
                          )}

                          {/* Node Button */}
                          <button
                            type="button"
                            id={`map-pin-${station.id}`}
                            onClick={() => {
                              handleStationClick(idx);
                              setIsExpandedModal(false);
                            }}
                            className={`group relative flex items-center justify-center rounded-2xl p-1.5 transition-all duration-300 focus:outline-none ${
                              isCurrent
                                ? 'h-10 w-10 sm:h-12 sm:w-12 bg-amber-500 text-stone-950 shadow-xl shadow-amber-500/40 ring-4 ring-amber-400/60 scale-110 z-30 font-bold'
                                : 'h-8 w-8 sm:h-9 sm:w-9 bg-stone-900/90 text-white border border-white/30 hover:border-amber-400 hover:scale-125 hover:bg-stone-800 shadow-md'
                            }`}
                            title={`${station.shortName} • Clicca per salto rapido`}
                          >
                            <span className="text-base sm:text-lg select-none">
                              {station.emoji}
                            </span>

                            {/* Pin Status dot */}
                            <span
                              className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-stone-950 ${
                                isCurrent ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500 group-hover:bg-amber-400'
                              }`}
                            />
                          </button>

                          {/* Station Label Chip */}
                          <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap z-20">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold border ${
                                isCurrent
                                  ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-md'
                                  : 'bg-stone-950/80 text-stone-300 border-white/20'
                              }`}
                            >
                              {station.shortName}
                            </span>
                          </div>

                          {/* Hover Tooltip Card */}
                          {isHovered && !isCurrent && (
                            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 rounded-xl border border-amber-400/40 bg-stone-900/95 p-2.5 text-left text-xs text-white shadow-2xl backdrop-blur-xl z-40">
                              <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono mb-1">
                                <span>{node.roomCode}</span>
                                <span className="text-emerald-400 font-bold">
                                  {distance} m di distanza
                                </span>
                              </div>
                              <div className="font-semibold text-white flex items-center gap-1 text-[11px]">
                                <span>{station.emoji}</span>
                                <span className="truncate">{station.shortName}</span>
                              </div>
                              <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5">
                                {station.tagline}
                              </p>
                              <div className="mt-1.5 flex items-center gap-1 text-[9px] text-amber-400 font-semibold">
                                <Zap className="h-3 w-3" />
                                <span>Clicca per teletrasportarti</span>
                              </div>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b border-amber-400/40 bg-stone-900/95" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Map Legend */}
                  <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-400 px-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-medium">Tu Sei Qui (Attivo)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-stone-500" />
                        <span>Postazioni Raggiungibili</span>
                      </span>
                    </div>
                    <span className="text-amber-400/80 font-mono">
                      Clicca su una stanza per il salto rapido
                    </span>
                  </div>
                </div>

                {/* Right Column: Quick Jumping Station Browser */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 p-4 sm:p-5 flex flex-col bg-stone-950/60">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                        Salto Rapido Postazioni
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">
                      {stations.length} Hub
                    </span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Stations List for Distant Jumping */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[260px] lg:max-h-none">
                    {stations.map((station, idx) => {
                      const node = STATION_MAP_NODES[station.id];
                      const isCurrent = idx === currentStationIndex;
                      const distance = calculateDistance(node);
                      const isVisible = matchesCategory(station);

                      if (!isVisible) return null;

                      return (
                        <button
                          key={station.id}
                          type="button"
                          id={`quickjump-station-${station.id}`}
                          onClick={() => {
                            handleStationClick(idx);
                            setIsExpandedModal(false);
                          }}
                          onMouseEnter={() => setHoveredStationId(station.id)}
                          onMouseLeave={() => setHoveredStationId(null)}
                          className={`group w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                            isCurrent
                              ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-400/40'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
                                isCurrent ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-white/10 text-white'
                              }`}
                            >
                              {station.emoji}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-xs font-semibold truncate ${
                                    isCurrent ? 'text-amber-300 font-bold' : 'text-white'
                                  }`}
                                >
                                  {station.shortName}
                                </span>
                                {isCurrent && (
                                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[8px] font-bold text-emerald-400 border border-emerald-500/30">
                                    QUI
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-400 truncate">
                                {node?.zone || station.category}
                              </p>
                            </div>
                          </div>

                          {/* Distance / Jump indicator */}
                          <div className="shrink-0 text-right font-mono ml-2">
                            {isCurrent ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto" />
                            ) : (
                              <div className="flex items-center gap-1 text-[10px] text-amber-400/90 group-hover:text-amber-300">
                                <span>{distance}m</span>
                                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer Hint */}
                  <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-stone-400 flex items-center justify-between">
                    <span>Premi <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white">ESC</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white">M</kbd> per chiudere</span>
                    <span className="text-amber-400 font-semibold">{stations.length} Aree Esplorabili</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
