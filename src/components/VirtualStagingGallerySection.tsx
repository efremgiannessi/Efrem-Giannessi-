import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  VIRTUAL_STAGING_ITEMS,
  VirtualStagingItem,
} from '../data/virtualStagingShowcase';
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeftRight,
  ZoomIn,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface StagingCardProps {
  item: VirtualStagingItem;
  onOpenModal: (item: VirtualStagingItem) => void;
}

const StagingCard: React.FC<StagingCardProps> = ({ item, onOpenModal }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      id={`card-${item.id}`}
      className="bg-stone-950/80 border border-white/15 backdrop-blur-md overflow-hidden flex flex-col group transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_10px_30px_rgba(0,240,255,0.12)]"
    >
      {/* Card Header */}
      <div className="p-3.5 md:p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-black/40 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
            {item.folderName.toUpperCase()}
          </span>
          <span className="text-white/80 font-bold tracking-wide truncate max-w-[170px] sm:max-w-[220px]">
            {item.title}
          </span>
        </div>

        <button
          onClick={() => {
            audioSystem.playClick(720);
            onOpenModal(item);
          }}
          className="p-1.5 text-white/50 hover:text-cyan-400 hover:bg-white/10 transition-colors"
          title="Ingrandisci a tutto schermo"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Split Viewport */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches[0]) handleMove(e.touches[0].clientX);
        }}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
        className="relative aspect-[16/10] w-full overflow-hidden select-none cursor-ew-resize bg-black"
      >
        {/* DOPO Image (Full Background) */}
        <img
          src={item.afterImage}
          alt={`Dopo Virtual Staging - ${item.title}`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          loading="lazy"
        />

        {/* PRIMA Image (Clipped Left Layer with CSS ClipPath) */}
        <img
          src={item.beforeImage}
          alt={`Prima Virtual Staging - ${item.title}`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          }}
          loading="lazy"
        />

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.8)] pointer-events-none z-20"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Centered Drag Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-950/95 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.7)] text-cyan-300">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Labels Overlay */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className="px-2 py-0.5 bg-stone-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>PRIMA // STATO REALE</span>
          </span>
        </div>

        <div className="absolute top-3 right-3 pointer-events-none z-10">
          <span className="px-2 py-0.5 bg-stone-950/85 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>DOPO // VIRTUAL STAGING</span>
          </span>
        </div>
      </div>

      {/* Quick Snap Controls */}
      <div className="px-3 py-2 border-b border-white/10 bg-black/60 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              audioSystem.playClick(580);
              setSliderPos(100);
            }}
            className={`px-2 py-1 uppercase text-[10px] transition-colors border ${
              sliderPos === 100
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 font-bold'
                : 'text-white/60 hover:text-white border-white/10 hover:border-white/30'
            }`}
          >
            Solo Prima
          </button>
          <button
            onClick={() => {
              audioSystem.playClick(640);
              setSliderPos(50);
            }}
            className={`px-2 py-1 uppercase text-[10px] transition-colors border ${
              sliderPos === 50
                ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/50 font-bold'
                : 'text-white/60 hover:text-white border-white/10 hover:border-white/30'
            }`}
          >
            Split 50%
          </button>
          <button
            onClick={() => {
              audioSystem.playClick(700);
              setSliderPos(0);
            }}
            className={`px-2 py-1 uppercase text-[10px] transition-colors border ${
              sliderPos === 0
                ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50 font-bold'
                : 'text-white/60 hover:text-white border-white/10 hover:border-white/30'
            }`}
          >
            Solo Dopo
          </button>
        </div>

        <span className="text-white/40 text-[10px]">
          Posizione: {Math.round(sliderPos)}%
        </span>
      </div>

      {/* Description & Technical Tags */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-white/80 text-xs leading-relaxed line-clamp-3 mb-4 font-sans">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10 font-mono text-[10px] text-white/50">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/10">
              4K UHD
            </span>
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 uppercase">
              {item.category}
            </span>
          </div>

          <button
            onClick={() => {
              audioSystem.playClick(720);
              onOpenModal(item);
            }}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold group-hover:underline"
          >
            <span>Dettagli HD</span>
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const VirtualStagingGallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('living');
  const [activeModalItem, setActiveModalItem] = useState<VirtualStagingItem | null>(null);
  const [modalSliderPos, setModalSliderPos] = useState<number>(50);
  const [isModalDragging, setIsModalDragging] = useState<boolean>(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'living', label: 'Living & Giorno', count: VIRTUAL_STAGING_ITEMS.filter((i) => i.category === 'living').length },
    { id: 'notte', label: 'Camere & Notte', count: VIRTUAL_STAGING_ITEMS.filter((i) => i.category === 'notte').length },
    { id: 'cucina', label: 'Cucine', count: VIRTUAL_STAGING_ITEMS.filter((i) => i.category === 'cucina').length },
    { id: 'bagno', label: 'Bagni', count: VIRTUAL_STAGING_ITEMS.filter((i) => i.category === 'bagno').length },
    { id: 'terrazzo', label: 'Esterni & Terrazzi', count: VIRTUAL_STAGING_ITEMS.filter((i) => i.category === 'terrazzo').length },
    { id: 'studio', label: 'Studio & Fitness', count: VIRTUAL_STAGING_ITEMS.filter((i) => i.category === 'studio').length },
  ];

  const filteredItems = VIRTUAL_STAGING_ITEMS.filter((i) => i.category === selectedCategory);

  const handleNextModal = useCallback(() => {
    if (!activeModalItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activeModalItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    audioSystem.playClick(680);
    setActiveModalItem(filteredItems[nextIndex]);
    setModalSliderPos(50);
  }, [activeModalItem, filteredItems]);

  const handlePrevModal = useCallback(() => {
    if (!activeModalItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activeModalItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    audioSystem.playClick(620);
    setActiveModalItem(filteredItems[prevIndex]);
    setModalSliderPos(50);
  }, [activeModalItem, filteredItems]);

  const handleModalMove = useCallback((clientX: number) => {
    if (!modalContainerRef.current) return;
    const rect = modalContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setModalSliderPos(pct);
  }, []);

  const handleModalMouseMove = (e: React.MouseEvent) => {
    if (isModalDragging || e.buttons === 1) {
      handleModalMove(e.clientX);
    }
  };

  const handleModalTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleModalMove(e.touches[0].clientX);
    }
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!activeModalItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextModal();
      if (e.key === 'ArrowLeft') handlePrevModal();
      if (e.key === 'Escape') setActiveModalItem(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem, handleNextModal, handlePrevModal]);

  return (
    <section
      id="virtual-staging"
      className="py-24 px-6 md:px-16 select-none relative z-10 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>VALORIZZAZIONE IMMOBILIARE // INTERIOR DESIGN // PRIMA & DOPO</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              VIRTUAL STAGING
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-2 font-mono text-xs">
            <span className="text-white/60 max-w-md md:text-right">
              Allestimento digitale fotorealistico per immobili vuoti o allo stato grezzo.
              Confronto immediato tra stato di fatto e potenziale arredato.
            </span>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 overflow-x-auto scrollbar-none font-mono text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  audioSystem.playClick(620);
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-2 uppercase text-[11px] transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-cyan-400 text-stone-950 border-cyan-400 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'bg-stone-950/60 text-white/70 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-stone-950 text-cyan-300 font-bold' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredItems.map((item) => (
            <StagingCard
              key={item.id}
              item={item}
              onOpenModal={(target) => {
                setActiveModalItem(target);
                setModalSliderPos(50);
              }}
            />
          ))}
        </div>

        {/* Metrics Banner */}
        <div className="p-6 md:p-8 bg-stone-950/70 border border-white/15 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
          <div>
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
              PROGETTI DI STAGING
            </span>
            <div className="text-2xl md:text-3xl font-bold text-white">16/16</div>
            <span className="text-[11px] text-white/40">Ambienti suddivisi per categoria</span>
          </div>

          <div>
            <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">
              ACCELERAZIONE VENDITA
            </span>
            <div className="text-2xl md:text-3xl font-bold text-white">+73%</div>
            <span className="text-[11px] text-white/40">Tempi sul mercato ridotti</span>
          </div>

          <div>
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
              RISOLUZIONE OUTPUT
            </span>
            <div className="text-2xl md:text-3xl font-bold text-white">4K UHD</div>
            <span className="text-[11px] text-white/40">Finiture e materiali PBR</span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-1">
              VALORE PERCEPITO
            </span>
            <div className="text-2xl md:text-3xl font-bold text-white">+18%</div>
            <span className="text-[11px] text-white/40">Incremento medio offerta</span>
          </div>
        </div>
      </div>

      {/* High-Resolution Lightbox Modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-5xl bg-stone-950 border border-cyan-400/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 md:px-6 border-b border-white/10 flex items-center justify-between gap-4 font-mono text-xs bg-stone-950">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-cyan-400 text-stone-950 font-bold uppercase">
                  {activeModalItem.folderName.toUpperCase()}
                </span>
                <span className="text-white text-sm font-bold uppercase tracking-wider">
                  {activeModalItem.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevModal}
                  className="p-2 border border-white/10 hover:border-cyan-400 hover:text-cyan-400 text-white/70 transition-colors"
                  title="Ambiente Precedente (Tasto Freccia Sinistra)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextModal}
                  className="p-2 border border-white/10 hover:border-cyan-400 hover:text-cyan-400 text-white/70 transition-colors"
                  title="Ambiente Successivo (Tasto Freccia Destra)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    audioSystem.playClick(500);
                    setActiveModalItem(null);
                  }}
                  className="p-2 border border-white/10 hover:border-red-400 hover:text-red-400 text-white/70 transition-colors ml-2"
                  title="Chiudi (Tasto Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Interactive Split Viewer */}
            <div
              ref={modalContainerRef}
              onMouseDown={(e) => {
                setIsModalDragging(true);
                handleModalMove(e.clientX);
              }}
              onMouseUp={() => setIsModalDragging(false)}
              onMouseLeave={() => setIsModalDragging(false)}
              onMouseMove={handleModalMouseMove}
              onTouchStart={(e) => {
                setIsModalDragging(true);
                if (e.touches[0]) handleModalMove(e.touches[0].clientX);
              }}
              onTouchEnd={() => setIsModalDragging(false)}
              onTouchMove={handleModalTouchMove}
              onClick={(e) => handleModalMove(e.clientX)}
              className="relative aspect-[16/9] w-full bg-black overflow-hidden select-none cursor-ew-resize"
            >
              {/* DOPO Image (Full Background) */}
              <img
                src={activeModalItem.afterImage}
                alt={`Dopo Virtual Staging - ${activeModalItem.title}`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              />

              {/* PRIMA Image (Clipped Left Layer with CSS ClipPath) */}
              <img
                src={activeModalItem.beforeImage}
                alt={`Prima Virtual Staging - ${activeModalItem.title}`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                style={{
                  clipPath: `inset(0 ${100 - modalSliderPos}% 0 0)`,
                  WebkitClipPath: `inset(0 ${100 - modalSliderPos}% 0 0)`,
                }}
              />

              {/* Dividing Line in Modal */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.9)] pointer-events-none z-20"
                style={{ left: `${modalSliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-stone-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.8)]">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
              </div>

              {/* Floating Status Badges */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="px-3 py-1 bg-black/85 backdrop-blur-md border border-amber-400/50 text-amber-300 font-mono text-xs font-bold shadow-lg">
                  PRIMA // STATO REALE
                </span>
              </div>
              <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <span className="px-3 py-1 bg-black/85 backdrop-blur-md border border-cyan-400/50 text-cyan-300 font-mono text-xs font-bold shadow-lg">
                  DOPO // VIRTUAL STAGING
                </span>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 md:p-6 bg-stone-950 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="max-w-2xl">
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
                  INTERVENTO DI DESIGN // {activeModalItem.category.toUpperCase()}
                </span>
                <p className="text-white/90 text-sm font-sans leading-relaxed">
                  {activeModalItem.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioSystem.playClick(580);
                    setModalSliderPos(100);
                  }}
                  className={`px-3 py-1.5 uppercase font-mono text-xs transition-colors border ${
                    modalSliderPos === 100
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'border-white/15 text-white/70 hover:text-white'
                  }`}
                >
                  Solo Prima
                </button>
                <button
                  onClick={() => {
                    audioSystem.playClick(640);
                    setModalSliderPos(50);
                  }}
                  className={`px-3 py-1.5 uppercase font-mono text-xs transition-colors border ${
                    modalSliderPos === 50
                      ? 'bg-cyan-400 text-stone-950 font-bold border-cyan-400'
                      : 'border-white/15 text-white/70 hover:text-white'
                  }`}
                >
                  Split 50%
                </button>
                <button
                  onClick={() => {
                    audioSystem.playClick(700);
                    setModalSliderPos(0);
                  }}
                  className={`px-3 py-1.5 uppercase font-mono text-xs transition-colors border ${
                    modalSliderPos === 0
                      ? 'bg-emerald-400 text-stone-950 font-bold border-emerald-400'
                      : 'border-white/15 text-white/70 hover:text-white'
                  }`}
                >
                  Solo Dopo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
