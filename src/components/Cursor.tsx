import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Epic Games style reticle cursor:
 *  - Four L-shaped corner brackets framing a small center dot
 *  - Snaps tightly to the pointer with light easing
 *  - Brackets fan outward and the frame rotates slightly on hover
 *  - Center dot contracts on press for tactile feedback
 *  - Disabled on touch devices and when prefers-reduced-motion is set
 */
export function Cursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
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
      stateRef.current.tx = e.clientX;
      stateRef.current.ty = e.clientY;

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
      s.x += (s.tx - s.x) * 0.32;
      s.y += (s.ty - s.y) * 0.32;
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
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

  const frame = hovering ? 38 : 22;
  const arm = hovering ? 10 : 6;
  const rotation = hovering ? 45 : 0;
  const dotScale = pressed ? 0.3 : hovering ? 0.55 : 1;
  const stroke = 'rgba(255,255,255,0.95)';
  const armWidth = '1.5px';

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
      style={{ willChange: 'transform', transition: 'opacity 0.2s ease' }}
    >
      <div
        className="relative"
        style={{
          width: frame,
          height: frame,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          transition:
            'width 0.25s var(--ease-spring), height 0.25s var(--ease-spring), transform 0.4s var(--ease-spring)',
        }}
      >
        {/* Center dot */}
        <span
          className="absolute left-1/2 top-1/2"
          style={{
            width: 4,
            height: 4,
            marginLeft: -2,
            marginTop: -2,
            background: '#fff',
            borderRadius: '50%',
            transform: `scale(${dotScale}) rotate(${-rotation}deg)`,
            transition: 'transform 0.2s var(--ease-spring)',
          }}
        />

        {/* Four L-shaped corner brackets */}
        <span
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: arm,
            height: arm,
            borderTop: `${armWidth} solid ${stroke}`,
            borderLeft: `${armWidth} solid ${stroke}`,
            transition: 'width 0.25s var(--ease-spring), height 0.25s var(--ease-spring)',
          }}
        />
        <span
          className="absolute"
          style={{
            top: 0,
            right: 0,
            width: arm,
            height: arm,
            borderTop: `${armWidth} solid ${stroke}`,
            borderRight: `${armWidth} solid ${stroke}`,
            transition: 'width 0.25s var(--ease-spring), height 0.25s var(--ease-spring)',
          }}
        />
        <span
          className="absolute"
          style={{
            bottom: 0,
            right: 0,
            width: arm,
            height: arm,
            borderBottom: `${armWidth} solid ${stroke}`,
            borderRight: `${armWidth} solid ${stroke}`,
            transition: 'width 0.25s var(--ease-spring), height 0.25s var(--ease-spring)',
          }}
        />
        <span
          className="absolute"
          style={{
            bottom: 0,
            left: 0,
            width: arm,
            height: arm,
            borderBottom: `${armWidth} solid ${stroke}`,
            borderLeft: `${armWidth} solid ${stroke}`,
            transition: 'width 0.25s var(--ease-spring), height 0.25s var(--ease-spring)',
          }}
        />
      </div>
    </div>
  );
}
