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

export const RenderingSection: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<'pbr' | 'clay' | 'night'>('pbr');

  const renderPresets = [
    {
      id: 'ext-villa',
      title: 'Esterno Residenziale & Paesaggio',
      category: 'ESTERNI // FOTOREALISMO',
      software: 'Twinmotion / Unreal Engine + Revit',
      description:
        'Studio della luce naturale zenitale e tramonto, ambientazione con vegetazione autoctona dinamica e riflessi fisici su superfici vetrate e calcestruzzo a vista.',
      resolution: '4K Ultra-HD (3840x2160)',
      pbrImage:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      clayImage:
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
      nightImage:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
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
      pbrImage:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      clayImage:
        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85',
      nightImage:
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85',
      specs: ['Luci IES Artificiali', 'Finiture e Tessuti Materici', 'Occlusione Ambientale Accurata'],
    },
    {
      id: 'ind-complex',
      title: 'Hub Commerciale & Polo Produttivo',
      category: 'OPERE COMPLESSE // MASTERPLAN',
      software: 'BIM Revit + Real-Time Engine',
      description:
        'Visualizzazione su larga scala di complessi industriali e prefabbricati, con viste aeree, simulazione viabilità veicolare e contestualizzazione orografica.',
      resolution: '4K Panoramic Walkthrough',
      pbrImage:
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=85',
      clayImage:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
      nightImage:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85',
      specs: ['Masterplan Terreno 3D', 'Simulazione Luce Solare 365gg', 'Foto-inserimento Paesaggistico'],
    },
  ];

  const current = renderPresets[selectedPreset];

  const getActiveImage = () => {
    if (renderMode === 'clay') return current.clayImage;
    if (renderMode === 'night') return current.nightImage;
    return current.pbrImage;
  };

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
            <div className="flex items-center gap-1.5 bg-black/60 p-1 border border-white/10 rounded-sm">
              <button
                onClick={() => {
                  audioSystem.playClick(640);
                  setRenderMode('pbr');
                }}
                className={`px-3 py-1.5 uppercase font-mono text-[11px] transition-all flex items-center gap-1.5 ${
                  renderMode === 'pbr'
                    ? 'bg-cyan-400 text-stone-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>PBR Fotorealistico</span>
              </button>

              <button
                onClick={() => {
                  audioSystem.playClick(720);
                  setRenderMode('night');
                }}
                className={`px-3 py-1.5 uppercase font-mono text-[11px] transition-all flex items-center gap-1.5 ${
                  renderMode === 'night'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <SunMedium className="w-3 h-3" />
                <span>Golden Hour / Notturno</span>
              </button>

              <button
                onClick={() => {
                  audioSystem.playClick(800);
                  setRenderMode('clay');
                }}
                className={`px-3 py-1.5 uppercase font-mono text-[11px] transition-all flex items-center gap-1.5 ${
                  renderMode === 'clay'
                    ? 'bg-purple-400 text-stone-950 font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Clay / Studio Volumi</span>
              </button>
            </div>
          </div>

          {/* Main Visual Display */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-black group">
            <img
              src={getActiveImage()}
              alt={current.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes('photo-1486406146926-c627a92ad1ab')) {
                  target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85';
                }
              }}
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-102"
            />

            {/* Ambient vignette and scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/30" />

            {/* HUD Overlay inside image */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4 font-mono text-xs">
              <div className="bg-black/75 backdrop-blur-md border border-white/15 p-3 max-w-lg">
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
            {renderPresets.map((preset, idx) => (
              <button
                key={preset.id}
                onClick={() => {
                  audioSystem.playClick(600 + idx * 80);
                  setSelectedPreset(idx);
                }}
                className={`p-4 text-left transition-all flex flex-col justify-between ${
                  selectedPreset === idx
                    ? 'bg-white/10 border-l-2 md:border-l-0 md:border-t-2 border-cyan-400'
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
