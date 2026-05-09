import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Custom cursor: a small dot that snaps to the pointer and a soft outline
 * that trails behind. Hides itself on touch devices and when reduced motion
 * is requested. Expands when hovering interactive elements.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse || reducedMotion) {
      document.body.classList.remove('has-cursor');
      setEnabled(false);
      return;
    }
    setEnabled(true);
    document.body.classList.add('has-cursor');
    return () => {
      document.body.classList.remove('has-cursor');
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]',
      );
      setHovering(!!interactive);
    };

    const tick = () => {
      const s = stateRef.current;
      // Easing follow for the ring
      s.rx += (s.x - s.rx) * 0.18;
      s.ry += (s.y - s.ry) * 0.18;
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full mix-blend-difference"
        style={{
          backgroundColor: '#fff',
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[199] rounded-full mix-blend-difference"
        style={{
          width: hovering ? '52px' : '32px',
          height: hovering ? '52px' : '32px',
          marginLeft: hovering ? '-26px' : '-16px',
          marginTop: hovering ? '-26px' : '-16px',
          border: '1px solid rgba(255,255,255,0.7)',
          background: hovering ? 'rgba(255,255,255,0.06)' : 'transparent',
          transition:
            'width 0.25s var(--ease-spring), height 0.25s var(--ease-spring), margin 0.25s var(--ease-spring), background 0.25s ease',
          willChange: 'transform, width, height',
        }}
      />
    </>
  );
}
