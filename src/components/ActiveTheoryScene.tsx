import React, { useEffect, useRef } from 'react';
import { SceneManager } from '../webgl/SceneManager';
import { SmoothScroll } from '../webgl/SmoothScroll';

interface ActiveTheorySceneProps {
  onSceneReady?: (scene: SceneManager, scroller: SmoothScroll) => void;
}

export const ActiveTheoryScene: React.FC<ActiveTheorySceneProps> = ({
  onSceneReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneManager | null>(null);
  const scrollerRef = useRef<SmoothScroll | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Smooth Inertial Scroller
    const scroller = new SmoothScroll();
    scrollerRef.current = scroller;

    // Initialize WebGL Three.js Scene
    const scene = new SceneManager(containerRef.current);
    sceneRef.current = scene;

    // Connect Scroller to Scene
    scroller.onUpdate((scroll, velocity, max) => {
      scene.setScroll(scroll, velocity, max);
    });

    if (onSceneReady) {
      onSceneReady(scene, scroller);
    }

    let animationFrameId: number;

    const animate = () => {
      scroller.tick();
      scene.render();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      scene.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="webgl-canvas-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
