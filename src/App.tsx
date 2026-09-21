import React, { useState, useRef, useEffect } from 'react';
import { ActiveTheoryScene } from './components/ActiveTheoryScene';
import { ActiveTheoryNav } from './components/ActiveTheoryNav';
import { ActiveTheoryHero } from './components/ActiveTheoryHero';
import { AmbientBlurredProjects } from './components/AmbientBlurredProjects';
import { RenderingSection } from './components/RenderingSection';
import { PyRevitPythonSection } from './components/PyRevitPythonSection';
import { ProfessionalProfileSection } from './components/ProfessionalProfileSection';
import { TechnicalSkillsSection } from './components/TechnicalSkillsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ActiveTheoryContact } from './components/ActiveTheoryContact';
import { ActiveTheoryRevitModal } from './components/ActiveTheoryRevitModal';
import { ActiveTheoryAuditModal } from './components/ActiveTheoryAuditModal';
import { ActiveTheoryCursor } from './components/ActiveTheoryCursor';
import { SceneManager, GraphicTheme, GRAPHIC_THEMES } from './webgl/SceneManager';
import { SmoothScroll } from './webgl/SmoothScroll';
import { Sparkles, ArrowDown, ArrowUp } from 'lucide-react';

export function App() {
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);
  const scrollerRef = useRef<SmoothScroll | null>(null);

  // Graphic Theme State & Shift Notification
  const [activeTheme, setActiveTheme] = useState<GraphicTheme>(GRAPHIC_THEMES[0]);
  const [shiftToast, setShiftToast] = useState<{
    message: string;
    theme: GraphicTheme;
    trigger: 'bottom' | 'top' | 'manual';
  } | null>(null);

  // pyRevit & Audit Modals
  const [isRevitModalOpen, setIsRevitModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [auditProjectTitle, setAuditProjectTitle] = useState<string>('');

  const handleSceneReady = (scene: SceneManager, scroller: SmoothScroll) => {
    setSceneManager(scene);
    scrollerRef.current = scroller;

    // Listen to automatic edge morphing & manual theme changes
    scene.onThemeChange = (theme: GraphicTheme, trigger: 'bottom' | 'top' | 'manual') => {
      setActiveTheme(theme);

      let msg = '';
      if (trigger === 'bottom') {
        msg = 'ARRIVO IN FONDO AL SITO // TRASFORMAZIONE GRAFICA ATTIVATA';
      } else if (trigger === 'top') {
        msg = 'RITORNO IN CIMA AL SITO // NUOVO STILE GRAFICO APPLICATO';
      } else {
        msg = 'COMMUTAZIONE MANUALE ARCHITETTURA 3D';
      }

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

  // Dual-guard IntersectionObserver on top and bottom sentinels for 100% reliable edge detection
  useEffect(() => {
    if (!sceneManager) return;

    const topEl = document.getElementById('edge-sentinel-top');
    const bottomEl = document.getElementById('edge-sentinel-bottom');

    if (!topEl || !bottomEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'edge-sentinel-bottom') {
              sceneManager.triggerEdge('bottom');
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
    observer.observe(bottomEl);

    return () => {
      observer.disconnect();
    };
  }, [sceneManager]);

  const handleManualCycleTheme = () => {
    if (sceneManager) {
      sceneManager.cycleGraphicTheme('manual');
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
      {/* 1. Interactive 3D WebGL Three.js Canvas */}
      <ActiveTheoryScene onSceneReady={handleSceneReady} />

      {/* 1.5 Ambient Blurred Project Visuals with Fluid Transition Animations */}
      <AmbientBlurredProjects />

      {/* 2. Precision Kinetic Trailing Cursor */}
      <ActiveTheoryCursor />

      {/* 3. Fixed HUD Technical Navigation */}
      <ActiveTheoryNav onScrollToSection={handleScrollTo} />

      {/* 3.5 Real-time Graphic Shift Toast Alert */}
      {shiftToast && (
        <div className="fixed bottom-8 right-6 md:right-10 z-50 pointer-events-none transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 bg-stone-950/90 backdrop-blur-md border border-cyan-400/80 shadow-[0_0_30px_rgba(0,240,255,0.25)] flex items-center gap-3.5 font-mono">
            <div className="w-9 h-9 border border-cyan-400 flex items-center justify-center bg-cyan-950/30 text-cyan-400 shrink-0">
              {shiftToast.trigger === 'bottom' ? (
                <ArrowDown className="w-5 h-5 animate-bounce" />
              ) : shiftToast.trigger === 'top' ? (
                <ArrowUp className="w-5 h-5 animate-bounce" />
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
        />

        {/* 1. Profilo Professionale (6 Separate Modules) */}
        <ProfessionalProfileSection
          onContactClick={() => handleScrollTo('contact')}
        />

        {/* 2. Competenze Tecniche (5 Separate Modules) */}
        <TechnicalSkillsSection />

        {/* 3. Formazione e Certificazioni (5 Specific Certificates) */}
        <CertificationsSection />

        {/* 4. Realizzazione Rendering & Visualizzazione Architettonica */}
        <RenderingSection />

        {/* 5. Sviluppo Applicazioni per pyRevit con Python */}
        <PyRevitPythonSection
          onOpenTerminalModal={() => setIsRevitModalOpen(true)}
        />

        {/* 6. Personal Contacts & Direct Contact Form */}
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
