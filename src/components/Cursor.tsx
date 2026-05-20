import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Asphalt-style HUD cursor:
 *  - Sharp angular arrow pointer (white with teal stroke + soft teal glow)
 *  - On hover over interactive elements, a slow-rotating teal hex frame
 *    materialises around the arrow and the glow intensifies
 *  - Tight follow with 32% easing per frame
 *  - Disabled on touch and prefers-reduced-motion
 */
export function Cursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ x: 0, y: 0, ax: 0, ay: 0 });
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
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
    return () => document.body.classList.remove('has-cursor');
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]',
      );
      setHovering(!!interactive);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      if (containerRef.current) containerRef.current.style.opacity = '0';
    };
    const onEnter = () => {
      if (containerRef.current) containerRef.current.style.opacity = '1';
    };

    const tick = () => {
      const s = stateRef.current;
      s.ax += (s.x - s.ax) * 0.4;
      s.ay += (s.y - s.ay) * 0.4;
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${s.ax}px, ${s.ay}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  const arrowScale = pressed ? 0.85 : hovering ? 1.18 : 1;
  const teal = '#4ecdc4';

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ willChange: 'transform', transition: 'opacity 0.2s ease' }}
    >
      {/* Outer rotating hex frame (hover only) */}
      <div
        style={{
          position: 'absolute',
          left: -22,
          top: -22,
          width: 44,
          height: 44,
          opacity: hovering ? 1 : 0,
          transform: hovering ? 'scale(1)' : 'scale(0.55)',
          transformOrigin: 'center',
          transition:
            'opacity 0.28s var(--ease-spring), transform 0.32s var(--ease-spring)',
        }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 40 40"
          style={{
            display: 'block',
            transformOrigin: '20px 20px',
            animation: 'cursor-spin 6s linear infinite',
            filter: `drop-shadow(0 0 6px ${teal})`,
          }}
        >
          {/* Hex frame */}
          <polygon
            points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5"
            fill="none"
            stroke={teal}
            strokeOpacity="0.85"
            strokeWidth="1.1"
            strokeLinejoin="miter"
          />
          {/* Tick marks at vertices */}
          {[
            [20, 3, 0, -2.5],
            [35, 11.5, 2.2, -1.3],
            [35, 28.5, 2.2, 1.3],
            [20, 37, 0, 2.5],
            [5, 28.5, -2.2, 1.3],
            [5, 11.5, -2.2, -1.3],
          ].map(([x, y, dx, dy], i) => (
            <line
              key={i}
              x1={x as number}
              y1={y as number}
              x2={(x as number) + (dx as number)}
              y2={(y as number) + (dy as number)}
              stroke={teal}
              strokeOpacity="0.95"
              strokeWidth="1.4"
              strokeLinecap="square"
            />
          ))}
        </svg>
      </div>

      {/* Counter-rotating inner accent (hover only) */}
      <div
        style={{
          position: 'absolute',
          left: -10,
          top: -10,
          width: 20,
          height: 20,
          opacity: hovering ? 0.85 : 0,
          transform: hovering ? 'scale(1)' : 'scale(0.6)',
          transformOrigin: 'center',
          transition:
            'opacity 0.28s var(--ease-spring), transform 0.32s var(--ease-spring)',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          style={{
            display: 'block',
            transformOrigin: '10px 10px',
            animation: 'cursor-spin-rev 4s linear infinite',
          }}
        >
          {/* Two short angular arcs */}
          <path
            d="M2 6 L4 4 L8 4"
            fill="none"
            stroke={teal}
            strokeWidth="1"
            strokeOpacity="0.7"
          />
          <path
            d="M18 14 L16 16 L12 16"
            fill="none"
            stroke={teal}
            strokeWidth="1"
            strokeOpacity="0.7"
          />
        </svg>
      </div>

      {/* Main angular arrow, tip anchored at (0,0) of container */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `scale(${arrowScale})`,
          transformOrigin: '0 0',
          transition: 'transform 0.18s var(--ease-spring), filter 0.25s ease',
          filter: hovering
            ? `drop-shadow(0 0 8px ${teal}) drop-shadow(0 0 2px rgba(255,255,255,0.5))`
            : `drop-shadow(0 0 5px rgba(78,205,196,0.5))`,
        }}
      >
        {/* Asphalt-style sharp chevron arrow */}
        <path
          d="M0 0 L15 9 L9 10.2 L7 16 Z"
          fill="#fff"
          stroke={teal}
          strokeWidth="1"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
        {/* Inner highlight slash */}
        <path
          d="M2 1.6 L11 7"
          stroke={teal}
          strokeOpacity="0.9"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}
