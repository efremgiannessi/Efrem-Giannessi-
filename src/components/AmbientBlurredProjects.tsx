import React, { useState, useEffect, useRef } from 'react';
import { ARCHITECTURAL_PROJECTS } from '../data/projectsData';
import { isMobileDevice } from '../utils/device';

export const AmbientBlurredProjects: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const isMobileRef = useRef<boolean>(false);
  const currentIndexRef = useRef<number>(0);

  const images = ARCHITECTURAL_PROJECTS.map((p) => p.coverImage);

  useEffect(() => {
    isMobileRef.current = isMobileDevice();
  }, []);

  // 1. Auto-transition cycle through the blurred project images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        currentIndexRef.current = next;
        return next;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [images.length]);

  // 2. Modulate active project image based on page scroll position (RAF throttled)
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const progress = Math.min(1, Math.max(0, scrollY / docHeight));
          const targetIndex = Math.min(
            images.length - 1,
            Math.floor(progress * images.length)
          );
          if (targetIndex !== currentIndexRef.current) {
            currentIndexRef.current = targetIndex;
            setCurrentIndex(targetIndex);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [images.length]);

  // 3. Subtle parallax reaction to mouse movement (zero React re-renders, RAF throttled)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isMobileDevice()) return;

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!parallaxRef.current) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 6;
        const ny = (e.clientY / window.innerHeight - 0.5) * 6;
        parallaxRef.current.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* Container with soft optical blur and cinematic vignette */}
      <div
        ref={parallaxRef}
        className="relative w-full h-full"
        style={{
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {images.map((imgUrl, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={imgUrl}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-50' : 'opacity-0'
              }`}
              style={{
                willChange: 'opacity',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <img
                src={imgUrl}
                alt=""
                className={`w-full h-full object-cover filter blur-[10px] md:blur-[22px] brightness-[0.78] saturate-[1.35] transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-108' : 'scale-100'
                }`}
                loading="eager"
              />
            </div>
          );
        })}

        {/* Scanline Texture Overlay for High-Tech Active Theory Feel */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.65) 50%)',
            backgroundSize: '100% 4px',
          }}
        />

        {/* Subtle Contrast Gradients ensuring text readability while keeping visuals vivid */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/65 via-transparent to-[#050508]/75" />
        <div className="absolute inset-0 bg-stone-950/20" />
      </div>
    </div>
  );
};
