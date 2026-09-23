import React, { useState, useRef, useEffect } from 'react';
import { ActiveTheoryScene } from './components/ActiveTheoryScene';
import { ActiveTheoryNav } from './components/ActiveTheoryNav';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { BackgroundEffectsHUD } from './components/BackgroundEffectsHUD';
import { ActiveTheoryHero } from './components/ActiveTheoryHero';
import { AmbientBlurredProjects } from './components/AmbientBlurredProjects';
import { RenderingSection } from './components/RenderingSection';
import { PyRevitPythonSection } from './components/PyRevitPythonSection';
import { ProfessionalProfileSection } from './components/ProfessionalProfileSection';
import { TechnicalSkillsSection } from './components/TechnicalSkillsSection';
import { IndustrialQuantityCostingSection } from './components/IndustrialQuantityCostingSection';
import { CertificationsSection } from './components/CertificationsSection';
import { VirtualStagingGallerySection } from './components/VirtualStagingGallerySection';
import { ActiveTheoryContact } from './components/ActiveTheoryContact';
import { AutoGalleryShowcaseSection } from './components/AutoGalleryShowcaseSection';
import { ActiveTheoryRevitModal } from './components/ActiveTheoryRevitModal';
import { ActiveTheoryAuditModal } from './components/ActiveTheoryAuditModal';
import { ActiveTheoryCursor } from './components/ActiveTheoryCursor';
import { ActiveTheorySplashScreen } from './components/ActiveTheorySplashScreen';
import { SceneManager, GraphicTheme, GRAPHIC_THEMES } from './webgl/SceneManager';
import { SmoothScroll } from './webgl/SmoothScroll';
import { Sparkles, ArrowDown, ArrowUp, Activity } from 'lucide-react';

export function App() {
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);
  const scrollerRef = useRef<SmoothScroll | null>(null);

  // Fullscreen 3D Intro Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Graphic Theme State & Shift Notification
  const [activeTheme, setActiveTheme] = useState<GraphicTheme>(GRAPHIC_THEMES[0]);
  const [shiftToast, setShiftToast] = useState<{
    message: string;
    theme: GraphicTheme;
    trigger: 'bottom' | 'top' | 'middle' | 'manual';
  } | null>(null);

  // pyRevit & Audit Modals
  const [isRevitModalOpen, setIsRevitModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [auditProjectTitle, setAuditProjectTitle] = useState<string>('');

  const handleSceneReady = (scene: SceneManager, scroller: SmoothScroll) => {
    setSceneManager(scene);
    scrollerRef.current = scroller;

    // Listen to automatic edge/middle morphing & manual theme changes
    scene.onThemeChange = (theme: GraphicTheme, trigger: 'bottom' | 'top' | 'middle' | 'manual') => {
      setActiveTheme(theme);

      // Do not display toast messages on top, middle, or bottom edge arrivals
      if (trigger === 'bottom' || trigger === 'top' || trigger === 'middle') {
        return;
      }

      // Display toast only for explicit manual selection
      const msg = 'EFFETTO SFONDO 3D ATTIVO // NUOVO REGIME PARAMETRICO';
      setShiftToast({ message: msg, theme, trigger });
    };
  };

  // Automatically dismiss HUD toast after 3.8s
  useEffect(() => {
    if (!shiftToast) return;
    const timer = setTimeout(() => {
      setShiftToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [shiftToast]);

  // Triple-guard IntersectionObserver & Scroll Percentage for Top, Middle (50%), and Bottom
  useEffect(() => {
    if (!sceneManager) return;

    const topEl = document.getElementById('edge-sentinel-top');
    const midEl = document.getElementById('edge-sentinel-middle');
    const bottomEl = document.getElementById('edge-sentinel-bottom');

    if (!topEl || !bottomEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'edge-sentinel-bottom') {
              sceneManager.triggerEdge('bottom');
            } else if (entry.target.id === 'edge-sentinel-middle') {
              sceneManager.triggerEdge('middle');
            } else if (entry.target.id === 'edge-sentinel-top') {
              sceneManager.triggerEdge('top');
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.05,
      }
    );

    observer.observe(topEl);
    if (midEl) observer.observe(midEl);
    observer.observe(bottomEl);

    // Fallback scroll percentage check at ~50% (RAF-throttled to avoid layout thrashing on mobile)
    let scrollRafId: number | null = null;
    const handleScrollPercentage = () => {
      if (scrollRafId !== null) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) return;
        const progress = window.scrollY / scrollHeight;

        if (progress >= 0.47 && progress <= 0.53) {
          if (sceneManager.lastEdge !== 'middle') {
            sceneManager.triggerEdge('middle');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScrollPercentage, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollPercentage);
      if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
    };
  }, [sceneManager]);

  const handleManualCycleTheme = () => {
    if (sceneManager) {
      sceneManager.cycleGraphicTheme('manual');
    }
  };

  const handleRandomTheme = () => {
    if (sceneManager) {
      sceneManager.randomGraphicTheme('manual');
    }
  };

  const handleSelectTheme = (index: number) => {
    if (sceneManager) {
      sceneManager.selectThemeByIndex(index);
    }
  };

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el && scrollerRef.current) {
      const top = el.offsetTop;
      scrollerRef.current.scrollTo(top);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050508] text-stone-100 overflow-x-hidden selection:bg-cyan-400 selection:text-stone-950">
      {/* 0. Fullscreen Monumental 3D Splash Screen Intro */}
      {showSplash && (
        <ActiveTheorySplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* 1. Interactive 3D WebGL Three.js Canvas */}
      <ActiveTheoryScene onSceneReady={handleSceneReady} />

      {/* 1.5 Ambient Blurred Project Visuals with Fluid Transition Animations */}
      <AmbientBlurredProjects />

      {/* 2. Precision Kinetic Trailing Cursor */}
      <ActiveTheoryCursor />

      {/* 2.5 Subtle Reading Progress Bar Fixed at Screen Top Edge */}
      <ReadingProgressBar
        scroller={scrollerRef.current}
        onScrollToSection={handleScrollTo}
      />

      {/* 3. Fixed HUD Technical Navigation */}
      <ActiveTheoryNav
        onScrollToSection={handleScrollTo}
        onRandomTheme={handleRandomTheme}
        onReplayIntro={() => setShowSplash(true)}
        activeTheme={activeTheme}
        onCycleTheme={handleManualCycleTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* 3.2 Floating 3D Background Effects Controller & Visualizer */}
      <BackgroundEffectsHUD
        currentTheme={activeTheme}
        onRandomTheme={handleRandomTheme}
        onCycleTheme={handleManualCycleTheme}
        onSelectTheme={handleSelectTheme}
        onReplayIntro={() => setShowSplash(true)}
      />

      {/* 3.5 Real-time Graphic Shift Toast Alert */}
      {shiftToast && (
        <div className="fixed bottom-8 right-6 md:right-10 z-50 pointer-events-none transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 bg-stone-950/90 backdrop-blur-md border border-cyan-400/80 shadow-[0_0_30px_rgba(0,240,255,0.25)] flex items-center gap-3.5 font-mono">
            <div className="w-9 h-9 border border-cyan-400 flex items-center justify-center bg-cyan-950/30 text-cyan-400 shrink-0">
              {shiftToast.trigger === 'bottom' ? (
                <ArrowDown className="w-5 h-5 animate-bounce" />
              ) : shiftToast.trigger === 'top' ? (
                <ArrowUp className="w-5 h-5 animate-bounce" />
              ) : shiftToast.trigger === 'middle' ? (
                <Activity className="w-5 h-5 animate-pulse text-cyan-400" />
              ) : (
                <Sparkles className="w-5 h-5 animate-spin" />
              )}
            </div>
            <div>
              <div className="text-[10px] text-cyan-400/90 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{shiftToast.message}</span>
              </div>
              <div className="text-sm font-bold tracking-wider text-white mt-0.5">
                {shiftToast.theme.code} // {shiftToast.theme.name}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Smooth Content Wrapper */}
      <main id="smooth-content" className="relative z-10 w-full">
        {/* Top Edge Sentinel for IntersectionObserver */}
        <div id="edge-sentinel-top" className="absolute top-0 left-0 w-full h-32 pointer-events-none opacity-0" />

        {/* Monumental Hero Section */}
        <ActiveTheoryHero
          onExploreProjects={() => handleScrollTo('profilo')}
          onOpenRevitModal={() => handleScrollTo('competenze')}
          onOpenAuditModal={() => handleScrollTo('contact')}
          onScrollToRendering={() => handleScrollTo('rendering')}
          onScrollToPyRevit={() => handleScrollTo('pyrevit-python')}
          onScrollToVirtualStaging={() => handleScrollTo('virtual-staging')}
        />

        {/* 1. Profilo Professionale (6 Separate Modules) */}
        <ProfessionalProfileSection
          onContactClick={() => handleScrollTo('contact')}
        />

        {/* 2. Competenze Tecniche (6 Moduli con Computi, Costi & Opere) */}
        <TechnicalSkillsSection />

        {/* 2.5 Focus Approfondito: Computi Metrici Industriali, Analisi Costi e Opere Complementari */}
        <IndustrialQuantityCostingSection />

        {/* 3. Formazione e Certificazioni (5 Specific Certificates) */}
        <CertificationsSection />

        {/* Mid-Page Sentinel for automatic 3D background transformation at 50% scroll */}
        <div id="edge-sentinel-middle" className="w-full h-24 pointer-events-none opacity-0" />

        {/* 4. Realizzazione Rendering & Visualizzazione Architettonica */}
        <RenderingSection />

        {/* 5. Sviluppo Applicazioni per pyRevit con Python */}
        <PyRevitPythonSection
          onOpenTerminalModal={() => setIsRevitModalOpen(true)}
        />

        {/* 6. Virtual Staging (16 Progetti Prima & Dopo) */}
        <VirtualStagingGallerySection />

        {/* 7. Galleria Rendering & Fotografia (Scorrimento Automatico - 2 Card) */}
        <AutoGalleryShowcaseSection />

        {/* 8. Personal Contacts & Direct Contact Form */}
        <ActiveTheoryContact
          onOpenAuditModal={() => {
            setAuditProjectTitle('');
            setIsAuditModalOpen(true);
          }}
        />

        {/* Bottom Edge Sentinel for IntersectionObserver (positioned absolutely without adding layout height) */}
        <div id="edge-sentinel-bottom" className="absolute bottom-0 left-0 w-full h-24 pointer-events-none opacity-0" />
      </main>

      {/* 5. pyRevit Script Execution Modal */}
      <ActiveTheoryRevitModal
        isOpen={isRevitModalOpen}
        onClose={() => setIsRevitModalOpen(false)}
      />

      {/* 6. Direct Contact Modal */}
      <ActiveTheoryAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        defaultProjectTitle={auditProjectTitle}
      />
    </div>
  );
}

export default App;
