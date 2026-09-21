import React, { useState, useEffect } from 'react';
import {
  Compass,
  Layers,
  Code2,
  Calculator,
  Eye,
  Mail,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
  Split,
  ChevronRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSynthesizer';

interface NavbarProps {
  onOpenAuditModal: () => void;
  onOpen360Tour: () => void;
  onOpenBimViewer: () => void;
  onOpenEstimatorModal: () => void;
  onOpenPromptModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuditModal,
  onOpen360Tour,
  onOpenBimViewer,
  onOpenEstimatorModal,
  onOpenPromptModal,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const nowMuted = audioSystem.toggleMute();
    setIsAudioMuted(nowMuted);
    if (!nowMuted) {
      audioSystem.playClick(800);
    }
  };

  const navLinks = [
    { label: 'WORK', href: '#work' },
    { label: 'LAB / R&D', href: '#revit' },
    { label: 'BIM 5D', href: '#bim' },
    { label: 'CAD vs BIM', href: '#cadvsbim' },
    { label: 'PREVENTIVATORE', href: '#preventivatore' },
    { label: 'STUDIO', href: '#studio' },
    { label: 'CONTATTI', href: '#contatti' },
  ];

  return (
    <header
      id="active-theory-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-black/40 backdrop-blur-md border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Studio Identity (Active Theory Monogram & Telemetry) */}
        <a
          href="#"
          id="navbar-brand-link"
          onClick={() => {
            audioSystem.playClick(400);
          }}
          onMouseEnter={() => audioSystem.playTechHover()}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center border border-cyan-400/50 bg-cyan-950/30 text-cyan-300 font-mono font-bold text-xs tracking-wider group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-stone-950 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            [EG]
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans font-black tracking-tight text-white uppercase text-sm sm:text-base group-hover:text-cyan-300 transition-colors">
                Efrem Giannessi
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] text-white/50 tracking-widest uppercase">
              ACTIVE ARCHITECTURE // BIM 5D & REVIT ENGINE
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 font-mono text-xs tracking-wider uppercase">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => audioSystem.playClick(500)}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="text-white/60 hover:text-cyan-300 transition-colors relative py-1 group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Action Controls & Sound Equalizer */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Active Theory AI Prompt Navigator (v6 signature) */}
          <button
            id="navbar-ai-prompt-btn"
            onClick={() => {
              audioSystem.playClick(650);
              onOpenPromptModal();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-cyan-400/40 bg-black/70 hover:border-cyan-400 text-cyan-300 transition-all font-mono text-xs uppercase tracking-wider group shadow-[0_0_12px_rgba(0,240,255,0.15)]"
            title="Active Theory AI Portfolio Navigator"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>AI NAV</span>
            <span className="text-[10px] text-white/40 border border-white/10 px-1 py-0.5 ml-0.5 hidden lg:inline">⌘K</span>
          </button>

          {/* Active Theory Dynamic Audio Equalizer */}
          <button
            id="navbar-audio-toggle"
            onClick={handleToggleSound}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="flex items-center gap-2 px-2.5 py-1.5 border border-white/15 bg-black/60 hover:border-cyan-400 text-white/70 hover:text-cyan-300 transition-all font-mono text-xs"
            title={isAudioMuted ? 'Attiva Audio' : 'Disattiva Audio'}
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/40" />
                <span className="text-[10px] uppercase tracking-wider text-white/40">MUTE</span>
              </>
            ) : (
              <>
                <div className="flex items-end gap-0.5 h-3 w-3">
                  <span className="w-0.5 bg-cyan-400 animate-[bounce_0.8s_infinite] h-full" />
                  <span className="w-0.5 bg-cyan-400 animate-[bounce_0.6s_infinite_0.2s] h-2/3" />
                  <span className="w-0.5 bg-cyan-400 animate-[bounce_0.9s_infinite_0.4s] h-full" />
                  <span className="w-0.5 bg-cyan-400 animate-[bounce_0.7s_infinite_0.1s] h-1/2" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">
                  AUDIO
                </span>
              </>
            )}
          </button>

          {/* 360° Studio Experience Button */}
          <button
            id="navbar-360-tour-btn"
            onClick={() => {
              audioSystem.playClick(600);
              onOpen360Tour();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-cyan-400/40 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-400 hover:text-stone-950 transition-all font-mono text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tour 360°</span>
          </button>

          {/* Direct BIM Audit Terminal Button */}
          <button
            id="navbar-audit-btn"
            onClick={() => {
              audioSystem.playClick(700);
              onOpenAuditModal();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <span>Audit BIM</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={handleToggleSound}
            className="p-2 border border-white/10 text-white/70 sm:hidden"
            aria-label="Toggle Audio"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            id="navbar-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-white/15 text-white hover:border-cyan-400 hover:text-cyan-300 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="navbar-mobile-drawer"
          className="xl:hidden bg-stone-950/98 border-b border-white/15 px-6 py-8 animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col gap-4 font-mono text-sm tracking-wider uppercase mb-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  audioSystem.playClick(400);
                  setMobileMenuOpen(false);
                }}
                className="text-white/80 hover:text-cyan-300 py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 font-mono text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPromptModal();
              }}
              className="w-full py-3 bg-stone-900 border border-cyan-400/60 text-cyan-300 uppercase tracking-wider flex items-center justify-center gap-2 font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AI Navigator & Command Palette</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpen360Tour();
              }}
              className="w-full py-3 bg-cyan-950/40 border border-cyan-400 text-cyan-300 uppercase tracking-wider flex items-center justify-center gap-2 font-bold"
            >
              <Compass className="w-4 h-4" />
              <span>Accedi al Tour Immersivo 360°</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuditModal();
              }}
              className="w-full py-3 bg-amber-400 text-stone-950 uppercase tracking-wider flex items-center justify-center gap-2 font-bold"
            >
              <span>Richiedi Audit BIM Gratuito</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
