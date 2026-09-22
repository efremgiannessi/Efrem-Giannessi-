import React, { useState, useEffect } from 'react';
import { ARCHITECTURAL_PROJECTS } from '../data/projectsData';

export const AmbientBlurredProjects: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const images = ARCHITECTURAL_PROJECTS.map((p) => p.coverImage);

  // 1. Auto-transition cycle through the blurred project images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [images.length]);

  // 2. Also modulate active project image based on page scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / docHeight));
        const targetIndex = Math.min(
          images.length - 1,
          Math.floor(progress * images.length)
        );
        setCurrentIndex(targetIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [images.length]);

  // 3. Subtle parallax reaction to mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 20;
      const ny = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x: nx, y: ny });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Container with soft optical blur and cinematic vignette */}
      <div
        className="relative w-full h-full"
        style={{
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
          transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {images.map((imgUrl, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={imgUrl}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-55' : 'opacity-0'
              }`}
            >
              <img
                src={imgUrl}
                alt=""
                className={`w-full h-full object-cover filter blur-[16px] sm:blur-[22px] brightness-[0.78] saturate-[1.35] transition-transform duration-[7000ms] ease-out ${
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
