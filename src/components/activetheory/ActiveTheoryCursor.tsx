import React, { useEffect, useState } from 'react';

export const ActiveTheoryCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'drag' | 'view'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPos({ x: mouseX, y: mouseY });
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('button, a, [role="button"], input, select, textarea');
        const customCursor = target.closest('[data-cursor]');

        if (customCursor) {
          const mode = customCursor.getAttribute('data-cursor') || 'view';
          const label = customCursor.getAttribute('data-cursor-label') || '';
          setCursorState(mode as any);
          setCursorLabel(label);
        } else if (clickable) {
          setCursorState('hover');
          setCursorLabel('');
        } else {
          setCursorState('default');
          setCursorLabel('');
        }
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const loop = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      setTrailingPos({ x: trailX, y: trailY });
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  const isHovered = cursorState !== 'default';

  return (
    <>
      {/* Precision Core Dot */}
      <div
        id="active-theory-cursor-dot"
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        <div className={`rounded-full bg-cyan-400 transition-all duration-200 ${
          isHovered ? 'w-1.5 h-1.5 bg-amber-400' : 'w-1 h-1'
        }`} />
      </div>

      {/* Trailing Active Theory Precision Ring / HUD Reticle */}
      <div
        id="active-theory-cursor-ring"
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-[1px] ${
            isHovered
              ? 'w-14 h-14 border-cyan-400/80 bg-cyan-950/20 scale-100 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'w-7 h-7 border-white/25 bg-transparent scale-90'
          }`}
        >
          {cursorLabel && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-300 font-bold px-1 select-none animate-in fade-in duration-200">
              {cursorLabel}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
