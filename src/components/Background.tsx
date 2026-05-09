import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Layered, fluid background:
 *  1. SVG grid (CSS) with radial mask
 *  2. Three drifting orbs that respond to pointer + scroll
 *  3. Subtle SVG noise overlay
 *
 * Uses pure CSS transforms for smoothness; no canvas to keep bundle small.
 */
export function Background() {
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const target = { x: 0.5, y: 0.4 };
    const cur = { x: 0.5, y: 0.4 };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      // tie subtle vertical drift to scroll without layout thrash
      const s = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      target.y = 0.35 + s * 0.4;
    };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.04;
      cur.y += (target.y - cur.y) * 0.04;
      const dx = (cur.x - 0.5) * 60;
      const dy = (cur.y - 0.5) * 60;

      if (orb1.current) orb1.current.style.transform = `translate3d(${dx}px, ${dy * 0.7}px, 0)`;
      if (orb2.current) orb2.current.style.transform = `translate3d(${-dx * 0.8}px, ${-dy * 0.5}px, 0)`;
      if (orb3.current) orb3.current.style.transform = `translate3d(${dx * 0.4}px, ${dy * 1.2}px, 0)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)',
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-70" />

      {/* Orbs */}
      <div
        ref={orb1}
        className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full opacity-70 will-change-transform"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 60%, transparent), transparent 60%)',
          filter: 'blur(120px)',
        }}
      />
      <div
        ref={orb2}
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full opacity-60 will-change-transform"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-violet-500) 60%, transparent), transparent 60%)',
          filter: 'blur(140px)',
        }}
      />
      <div
        ref={orb3}
        className="absolute top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 will-change-transform"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-iris-500) 50%, transparent), transparent 60%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Noise overlay */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 'var(--noise-opacity)' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="bg-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bg-noise)" />
      </svg>
    </div>
  );
}
