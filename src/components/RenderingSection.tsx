import React, { useState } from 'react';
import {
  Camera,
  SunMedium,
  Layers,
  Sparkles,
  Maximize2,
  CheckCircle2,
  Monitor,
  Eye,
  Sliders,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';
import {
  RenderPresetData,
  formatDriveOrDirectUrl,
  extractDriveId,
} from './RenderingImageManagerModal';

const DEFAULT_RENDER_PRESETS: RenderPresetData[] = [
  {
    id: 'ext-villa',
    title: 'Esterno Residenziale & Paesaggio',
    category: 'ESTERNI // FOTOREALISMO',
    software: 'Twinmotion / Unreal Engine + Revit',
    description:
      'Studio della luce naturale zenitale e tramonto, ambientazione con vegetazione autoctona dinamica e riflessi fisici su superfici vetrate e calcestruzzo a vista.',
    resolution: '4K Ultra-HD (3840x2160)',
    pbrImage: 'https://lh3.googleusercontent.com/d/1c2TkqbRPV_PApjYrt1PcMue4rMU8EHf2=w2048',
    nightImage: 'https://lh3.googleusercontent.com/d/15STZ7yfKexRqGGA4P7eLcCGbp-Dgr8iV=w2048',
    clayImage: 'https://lh3.googleusercontent.com/d/1hGIgUaSTBdFCOfM8Rzgo08E47esVAtiT=w2048',
    specs: ['Illuminazione HDRI Fisica', 'Materiali PBR Calibrati', 'Vegetazione 3D Scatter'],
  },
  {
    id: 'int-living',
    title: 'Interior Design & Spazi Living',
    category: 'INTERNI // VIRTUAL STAGING',
    software: 'Autodesk Revit + Twinmotion',
    description:
      'Inserimento di arredi di design su misura, studio illuminotecnico con sorgenti IES realistiche e valorizzazione dei contrasti tra legni caldi e pietre naturali.',
    resolution: 'UHD Print Ready (300 DPI)',
    pbrImage: 'https://lh3.googleusercontent.com/d/1tqrfRuGxsxo2ySxrxMHTdK8vh9usf_fK=w2048',
    nightImage: 'https://lh3.googleusercontent.com/d/1takxvmx2Kks7ksUpYFmLavbLFhKKCofq=w2048',
    clayImage: 'https://lh3.googleusercontent.com/d/1j5pTCnLXkWainw1vF5UsJpQ9JinStxvS=w2048',
    specs: ['Luci IES Artificiali', 'Finiture e Tessuti Materici', 'Occlusione Ambientale Accurata'],
  },
  {
    id: 'ind-complex',
    title: 'Hub Commerciale & Direzionale',
    category: 'COMMERCIALE & RETAIL // STILE ITALIANO',
    software: 'BIM Revit + Twinmotion / Unreal Engine',
    description:
      'Complessi commerciali e direzionali stile italiano ispirati alle eccellenze di Milano CityLife e Porta Nuova: piazze pedonali, vetrate strutturali, facciate continue e grande impatto visivo scenografico.',
    resolution: '4K Panoramic Walkthrough',
    pbrImage: 'https://lh3.googleusercontent.com/d/16l6TzCl2RIOnU7kKpfaieUvsCKyDzRyG=w2048',
    nightImage: 'https://lh3.googleusercontent.com/d/1hHrAm8IP59tPl6pZJeNuHqXmsRgE-6gF=w2048',
    clayImage: 'https://lh3.googleusercontent.com/d/199FYXsBhYByWfFqhQawHwK22D4b1_rYh=w2048',
    specs: ['Facciate Vetrate Continue', 'Piazze & Spazi Pedonali', 'Illuminazione Architetturale LED'],
  },
];

export const RenderingSection: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<'pbr' | 'clay' | 'night'>('pbr');

  const presets = DEFAULT_RENDER_PRESETS;
  const current = presets[selectedPreset] || presets[0];

  const renderingFeatures = [
    {
      icon: <Camera className="w-5 h-5 text-cyan-400" />,
      title: 'Rendering Fotorealistico Esterni & Interni',
      desc: 'Composizioni fotografiche ad alto impatto emotivo con bilanciamento cromatico, ottiche realistiche, profondità di campo (DoF) e materiali calibrati fisicamente.',
    },
    {
      icon: <SunMedium className="w-5 h-5 text-amber-400" />,
      title: 'Twinmotion & Real-Time ArchViz',
      desc: 'Simulazioni di luce naturale ed artificiale in tempo reale, animazioni architettoniche, studi d’ombra solare stagionali e passeggiate virtuali interattive.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      title: 'Virtual Staging & Riqualificazione',
      desc: 'Valorizzazione visiva di fabbricati esistenti o cantieri al grezzo tramite foto-inserimento di finiture, pavimentazioni e arredi d’interni fotorealistici.',
    },
    {
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      title: 'Integrazione Diretta Modelli BIM Revit',
      desc: 'Flusso di lavoro senza interruzioni: esportazione e sincronizzazione diretta delle geometrie parametriche di Revit verso il motore di rendering.',
    },
  ];

  const activeImage =
    renderMode === 'pbr'
      ? formatDriveOrDirectUrl(current.pbrImage)
      : renderMode === 'clay'
      ? formatDriveOrDirectUrl(current.clayImage)
      : formatDriveOrDirectUrl(current.nightImage);

  return (
    <section
      id="rendering"
      className="py-24 px-6 md:px-16 select-none relative z-10 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>VISUALIZZAZIONE ARCHITETTONICA & FOTOREALISMO // ARCHVIZ</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              REALIZZAZIONE RENDERING
            </h2>
          </div>

          <div className="font-mono text-xs text-white/50 text-left md:text-right max-w-md">
            Produzione di immagini e animazioni ad alta definizione a partire da modelli BIM,
            con studio di luce, materiali fisici PBR e post-produzione cromatica.
          </div>
        </div>

        {/* Interactive Rendering Showcase Card */}
        <div className="bg-stone-950/70 border border-white/15 backdrop-blur-md overflow-hidden mb-12 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          {/* Top Bar with Mode Controls */}
          <div className="p-4 md:px-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-bold">VIEWPORT //</span>
              <span className="text-white uppercase font-bold">{current.title}</span>
            </div>

            {/* Render Mode Switcher */}
            <div className="flex items-center gap-1 bg-black/60 border border-white/10 p-1">
              <button
                onClick={() => {
                  audioSystem.playClick(600);
                  setRenderMode('pbr');
                }}
                className={`px-3 py-1 flex items-center gap-1.5 transition-all cursor-pointer ${
                  renderMode === 'pbr'
                    ? 'bg-cyan-400 text-stone-950 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <SunMedium className="w-3.5 h-3.5" />
                <span>PBR DIURNO</span>
              </button>

              <button
                onClick={() => {
                  audioSystem.playClick(500);
                  setRenderMode('night');
                }}
                className={`px-3 py-1 flex items-center gap-1.5 transition-all cursor-pointer ${
                  renderMode === 'night'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>NOTTURNO / TRAMONTO</span>
              </button>

              <button
                onClick={() => {
                  audioSystem.playClick(400);
                  setRenderMode('clay');
                }}
                className={`px-3 py-1 flex items-center gap-1.5 transition-all cursor-pointer ${
                  renderMode === 'clay'
                    ? 'bg-purple-400 text-stone-950 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>CLAY (VOLUMETRIA)</span>
              </button>
            </div>
          </div>

          {/* Main Visual Display */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-black group select-none">
            <img
              src={activeImage}
              alt={current.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                const driveId = extractDriveId(
                  renderMode === 'pbr'
                    ? current.pbrImage
                    : renderMode === 'clay'
                    ? current.clayImage
                    : current.nightImage
                );
                if (driveId && !target.src.includes('drive.google.com/thumbnail')) {
                  target.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w2048`;
                }
              }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Ambient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/30 pointer-events-none" />

            {/* Bottom HUD Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4 font-mono text-xs z-10">
              <div className="bg-black/70 backdrop-blur-md border border-white/10 p-3 max-w-lg">
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold mb-1">
                  {current.category}
                </span>
                <p className="text-white/90 text-xs font-sans leading-relaxed">
                  {current.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 bg-black/80 border border-white/20 text-white/80 text-[11px]">
                  {current.resolution}
                </span>
                <span className="px-3 py-1.5 bg-black/80 border border-cyan-400/40 text-cyan-300 text-[11px]">
                  {current.software}
                </span>
              </div>
            </div>
          </div>

          {/* Preset Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-white/10 bg-stone-950/80">
            {presets.map((preset, idx) => (
              <button
                key={preset.id}
                onClick={() => {
                  audioSystem.playClick(600 + idx * 80);
                  setSelectedPreset(idx);
                }}
                className={`p-4 text-left transition-all flex flex-col justify-between cursor-pointer ${
                  selectedPreset === idx
                    ? 'bg-white/10 border-l-2 md:border-l-0 md:border-t-2 border-cyan-400 shadow-[inset_0_0_20px_rgba(0,240,255,0.15)]'
                    : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider block mb-1">
                    SCENARIO 0{idx + 1}
                  </span>
                  <h4 className="font-mono text-sm font-bold text-white mb-2">
                    {preset.title}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-white/50">
                  {preset.specs.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/10">
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4 Architectural Visualisation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderingFeatures.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="p-6 bg-stone-950/40 border border-white/10 hover:border-cyan-400 transition-all group backdrop-blur-[2px] shadow-[0_6px_25px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border border-white/10 bg-white/5 group-hover:border-cyan-400/50 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-mono text-base font-bold text-white tracking-wide">
                  {item.title}
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
