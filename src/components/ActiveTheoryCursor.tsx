import React, { useEffect, useRef, useState } from 'react';

export const ActiveTheoryCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check for interactive targets and context tags
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, [role="button"], input, select, textarea, .cursor-pointer');
        setIsHovering(!!interactive);

        const projectCard = target.closest('[data-cursor-text]');
        if (projectCard) {
          setCursorText(projectCard.getAttribute('data-cursor-text') || 'VIEW');
        } else if (interactive) {
          setCursorText('');
        } else {
          setCursorText('');
        }
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    let animId: number;
    const lerpRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animId = requestAnimationFrame(lerpRing);
    };

    animId = requestAnimationFrame(lerpRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-cyan-400 rounded-full pointer-events-none z-50 transition-opacity mix-blend-difference hidden md:block"
      />

      {/* Kinetic Trailing Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-50 -ml-5 -mt-5 flex items-center justify-center transition-transform duration-100 ease-out hidden md:flex ${
          isHovering ? 'scale-150' : 'scale-100'
        } ${isClicking ? 'scale-90' : ''}`}
      >
        <div
          className={`w-10 h-10 border rounded-full transition-colors flex items-center justify-center ${
            isHovering
              ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'border-white/30'
          }`}
        >
          {cursorText && (
            <span className="font-mono text-[8px] text-cyan-300 font-bold uppercase tracking-widest">
              {cursorText}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
