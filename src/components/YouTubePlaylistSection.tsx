import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Youtube, ExternalLink, ChevronLeft, ChevronRight, 
  Layers, Sparkles, CheckCircle2, Film, MonitorPlay, ArrowUpRight,
  RefreshCw, ChevronDown, ChevronUp, Radio, Volume2, ListVideo
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';
import { YouTubeStreamBackground } from './backgrounds/YouTubeStreamBackground';

export interface YouTubeVideoItem {
  id: string;
  title: string;
  category?: string;
  description: string;
  tags?: string[];
  published?: string;
}

export const PLAYLIST_URL = "https://youtube.com/playlist?list=PLkHo5YliNpBhQ6hpYCMb-WmB4UczHgB8Y&si=PA1fdjHvb7G3l0fJ";
export const PLAYLIST_ID = "PLkHo5YliNpBhQ6hpYCMb-WmB4UczHgB8Y";

// Default pre-seeded list for instant rendering and offline fallback
export const INITIAL_PLAYLIST_VIDEOS: YouTubeVideoItem[] = [
  {
    id: "nbkA4LiKfJQ",
    title: "Revit Precast Manager, Strutture - Travi di banchina",
    category: "Strutture Portanti",
    description: "Generazione e posizionamento automatico parametrico delle travi di banchina prefabbricate con aggancio ai pilastri e verifiche geometriche.",
    tags: ["Travi Banchina", "Strutture C.A.", "Automazione BIM"],
    published: "2026-06-17"
  },
  {
    id: "OxbZzOyYG7Y",
    title: "Revit Precast Manager, Strutture - Travi di copertura",
    category: "Coperture Industriali",
    description: "Modellazione rapida di travi di copertura a doppia pendenza, boomerang e ad Y con calcolo automatico dei vincoli d'appoggio.",
    tags: ["Travi Boomerang", "Coperture", "Precast C.A.P."],
    published: "2026-06-17"
  },
  {
    id: "f0ja3Kqyp-o",
    title: "Revit Precast Manager, Strutture - Pendenze automatiche",
    category: "Idraulica & Pendenze",
    description: "Algoritmo per il calcolo e l'inclinazione automatica dei sistemi di copertura prefabbricata, linee di compluvio e pluviali.",
    tags: ["Pendenze", "Quote Esecutive", "Geometria"],
    published: "2026-06-17"
  },
  {
    id: "fM3wGufzRe8",
    title: "Revit Precast Manager, Strutture griglie e pilastri",
    category: "Maglia Strutturale",
    description: "Impostazione istantanea della maglia strutturale, inserimento coordinato dei pilastri con pozzetti e mensole carroponte.",
    tags: ["Pilastri C.A.V.", "Griglie Assi", "Carroponte"],
    published: "2026-06-17"
  },
  {
    id: "V_i9UAMFuCI",
    title: "Revit Precast Manager, Livelli e Setup",
    category: "Configurazione Ambiente",
    description: "Impostazione iniziale dei livelli di quota, piani d'estradosso fondazione e parametri globali del progetto prefabbricato.",
    tags: ["Livelli BIM", "Setup Commessa", "Template"],
    published: "2026-06-17"
  },
  {
    id: "_ox37qWtfvI",
    title: "Revit Precast Manager, automazione edificio civile abitazione",
    category: "Edilizia Civile",
    description: "Adattamento degli strumenti parametrici di Revit Precast Manager per la prefabbricazione applicata all'edilizia residenziale e civile.",
    tags: ["Edilizia Civile", "Pannelli Multipiano", "Solaio Plastico"],
    published: "2026-06-17"
  },
  {
    id: "xYiChWBT2WE",
    title: "Revit Precast Manager, creazione automatica logo in una famiglia",
    category: "Branding & Famiglie",
    description: "Script pyRevit / Revit API per l'estrusione vettoriale automatica di loghi e marchi aziendali personalizzati all'interno delle famiglie RFA.",
    tags: ["Famiglie RFA", "Vettoriale 3D", "Revit API"],
    published: "2026-06-17"
  },
  {
    id: "ptaiRrj85pY",
    title: "Revit Precast Manager, creazione automatica di edifici prefabbricati in c.a.p. da preset predefiniti",
    category: "Preset Complessivi",
    description: "Generazione completa e istantanea di un intero capannone industriale in c.a.p. a partire da preset parametrici e vincoli di maglia.",
    tags: ["Capannoni Completi", "Generatore 1-Click", "Preset"],
    published: "2026-06-17"
  },
  {
    id: "1BgJSIjncc8",
    title: "Revit Precast Manager, modellare in automatico strutture prefabbricate",
    category: "Workflow Operativo",
    description: "Dimostrazione dell'intero flusso di lavoro: dal layout di progetto iniziale fino alla posa virtuale di tutti gli elementi strutturali con computo.",
    tags: ["Workflow Integrato", "BIM 4D/5D", "Revit Automation"],
    published: "2026-06-17"
  }
];

// Default max visible videos to prevent excessive page length
const DEFAULT_VISIBLE_LIMIT = 6;

export const YouTubePlaylistSection: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideoItem[]>(INITIAL_PLAYLIST_VIDEOS);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isExpandedAll, setIsExpandedAll] = useState<boolean>(false);

  // Fetch latest videos automatically from live YouTube RSS feed via our backend proxy
  const fetchPlaylistUpdates = async (force = false) => {
    try {
      setIsLiveSyncing(true);
      const res = await fetch(`/api/youtube-playlist${force ? '?force=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.videos && Array.isArray(data.videos) && data.videos.length > 0) {
          // Merge with enriched categories and tags if already available
          const merged: YouTubeVideoItem[] = data.videos.map((liveV: any, idx: number) => {
            const existing = INITIAL_PLAYLIST_VIDEOS.find(initV => initV.id === liveV.id);
            return {
              id: liveV.id,
              title: liveV.title || existing?.title || `Video #${idx + 1}`,
              category: existing?.category || "Automazione BIM",
              description: existing?.description || liveV.description || "Video tutorial dedicato alla suite Revit Precast Manager.",
              tags: existing?.tags || ["Revit Precast Manager", "BIM Automation", "Prefabbricati"],
              published: liveV.published || existing?.published
            };
          });

          setVideos(merged);
          setLastSyncTime(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (e) {
      console.warn('[YouTubePlaylist] Error auto-syncing from API, using preloaded videos:', e);
    } finally {
      setIsLiveSyncing(false);
    }
  };

  useEffect(() => {
    fetchPlaylistUpdates();
  }, []);

  const activeVideo = videos[activeIndex] || videos[0] || INITIAL_PLAYLIST_VIDEOS[0];

  const handleSelectVideo = (index: number) => {
    audioSystem.playClick(650);
    setActiveIndex(index);
    const playerEl = document.getElementById('youtube-theater-player');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleNext = () => {
    audioSystem.playClick(720);
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    audioSystem.playClick(580);
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleManualRefresh = () => {
    audioSystem.playClick(800);
    fetchPlaylistUpdates(true);
  };

  // Visible items on screen: either limited to DEFAULT_VISIBLE_LIMIT (6) or expanded
  const visibleVideos = useMemo(() => {
    if (isExpandedAll) return videos;
    return videos.slice(0, DEFAULT_VISIBLE_LIMIT);
  }, [videos, isExpandedAll]);

  const hasMoreThanLimit = videos.length > DEFAULT_VISIBLE_LIMIT;
  const remainingCount = Math.max(0, videos.length - DEFAULT_VISIBLE_LIMIT);

  return (
    <section 
      id="youtube-playlist" 
      className="relative py-24 md:py-32 px-6 md:px-12 border-t border-white/10 bg-[#07080b] overflow-hidden"
    >
      {/* Animated Video Stream & Equalizer Canvas Background */}
      <YouTubeStreamBackground />

      {/* Background Ambience Glows */}
      <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Pattern Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs text-red-400 uppercase tracking-widest mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
              <span>CANALE YOUTUBE // TUTORIAL & WORKFLOW AUTOMATION</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans">
              Revit Precast <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">Manager</span>
            </h2>
            <p className="text-stone-400 max-w-2xl mt-4 text-sm md:text-base leading-relaxed">
              La playlist video ufficiale dedicata a <strong>Revit Precast Manager</strong>. 
              Ogni nuovo video caricato sul canale viene sincronizzato automaticamente in questa sezione.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-3">
            {/* Live Sync Status Pill */}
            <button
              onClick={handleManualRefresh}
              title="Verifica nuovi video caricati sulla playlist YouTube"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-stone-300 hover:text-white transition shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-red-400 ${isLiveSyncing ? 'animate-spin' : ''}`} />
              <span>{isLiveSyncing ? 'Sincronizzazione in corso...' : 'Sincronizzato Auto'}</span>
              {lastSyncTime && <span className="text-stone-500 text-[10px]">({lastSyncTime})</span>}
            </button>

            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => audioSystem.playTechHover()}
              className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs md:text-sm font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg shadow-red-900/40 hover:shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Youtube className="w-4 h-4 text-white" />
              <span>Playlist YouTube</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Featured Interactive Theater Video Player */}
        <div 
          id="youtube-theater-player"
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl mb-12 relative overflow-hidden backdrop-blur-md"
        >
          {/* Ambient Video Backlight */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Embedded YouTube Player */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5">
            <iframe
              key={activeVideo.id}
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=0&rel=0&modestbranding=1`}
              title={activeVideo.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Player Info & Navigation Controls Bar */}
          <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase bg-red-950 text-red-300 border border-red-800 px-2.5 py-0.5 rounded-full font-bold">
                  {activeVideo.category || "Strutture Prefabbricate"}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Video {activeIndex + 1} di {videos.length}
                </span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-white tracking-tight leading-snug">
                {activeVideo.title}
              </h3>
              <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-3xl leading-relaxed">
                {activeVideo.description}
              </p>
              {activeVideo.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {activeVideo.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Prev / Next Video Nav Buttons */}
            <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
              <button
                onClick={handlePrev}
                title="Video precedente"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-stone-200 rounded-xl text-xs font-mono font-semibold transition border border-slate-700 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 text-stone-300" />
                <span className="hidden sm:inline">Precedente</span>
              </button>

              <button
                onClick={handleNext}
                title="Prossimo video"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-mono font-semibold transition shadow-md shadow-red-950/60 active:scale-95"
              >
                <span className="hidden sm:inline">Prossimo</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Selector - Compact List Layout with Small Thumbnails */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ListVideo className="w-4 h-4 text-red-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
                Selettore Video ({isExpandedAll ? videos.length : `${visibleVideos.length} di ${videos.length}`})
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <span className="hidden sm:inline">Visualizzazione compatta elenco</span>
              {hasMoreThanLimit && (
                <button
                  onClick={() => {
                    audioSystem.playClick(600);
                    setIsExpandedAll(!isExpandedAll);
                  }}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg transition hover:bg-slate-800 active:scale-95"
                >
                  {isExpandedAll ? (
                    <>
                      <span>Riduci a {DEFAULT_VISIBLE_LIMIT}</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Mostra tutti (+{remainingCount})</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Compact List: 2-column on tablet/desktop, 1-column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {visibleVideos.map((item, index) => {
              const isCurrent = item.id === activeVideo.id;
              const thumbnailUrl = `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`;
              const formattedIndex = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectVideo(index)}
                  onMouseEnter={() => audioSystem.playTechHover()}
                  className={`group cursor-pointer rounded-xl p-2.5 border transition-all duration-200 flex items-center gap-3 ${
                    isCurrent
                      ? 'bg-slate-800/95 border-red-500/90 shadow-[0_0_20px_rgba(239,68,68,0.22)] ring-1 ring-red-500/60'
                      : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {/* Left Number Index */}
                  <span className={`w-5 shrink-0 text-center font-mono text-xs font-bold ${
                    isCurrent ? 'text-red-400' : 'text-stone-500 group-hover:text-stone-300'
                  }`}>
                    {formattedIndex}
                  </span>

                  {/* Small Thumbnail */}
                  <div className="relative w-24 sm:w-28 h-14 sm:h-16 shrink-0 aspect-video rounded-lg overflow-hidden bg-slate-950 border border-white/10">
                    <img
                      src={thumbnailUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Small Play Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                      isCurrent 
                        ? 'bg-red-950/40' 
                        : 'bg-black/30 group-hover:bg-black/10'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isCurrent
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/50'
                          : 'bg-black/75 text-white/90 group-hover:bg-red-600 group-hover:text-white'
                      }`}>
                        <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Right: Title & Meta Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                        isCurrent 
                          ? 'bg-red-950 text-red-300 border border-red-800/80' 
                          : 'bg-slate-800 text-stone-400'
                      }`}>
                        {item.category || "Revit BIM"}
                      </span>

                      {isCurrent && (
                        <span className="text-[9px] font-mono text-red-400 flex items-center gap-1 font-bold animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          IN ONDA
                        </span>
                      )}
                    </div>

                    <h5 className={`text-xs sm:text-[13px] font-semibold line-clamp-2 leading-snug transition-colors ${
                      isCurrent 
                        ? 'text-white' 
                        : 'text-stone-300 group-hover:text-white'
                    }`}>
                      {item.title}
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Expand / Collapse Bar if more than 6 videos */}
          {hasMoreThanLimit && (
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  audioSystem.playClick(650);
                  setIsExpandedAll(!isExpandedAll);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition shadow-sm active:scale-95"
              >
                {isExpandedAll ? (
                  <>
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                    <span>Riduci a {DEFAULT_VISIBLE_LIMIT} video</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                    <span>Mostra tutti i {videos.length} video dell'elenco (+{remainingCount})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
