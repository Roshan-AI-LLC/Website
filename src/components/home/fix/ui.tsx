import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

/** Shared building blocks for the "fix" walkthrough visuals. */

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Every step visual takes the same two flags. */
export type VisualProps = {
  /** Visible and the active step: run the loop. */
  play: boolean;
  /** prefers-reduced-motion: hold the final frame, no tweening. */
  reduced: boolean;
};

/** A colour token at `pct`% strength over transparent. */
export const mix = (token: string, pct: number) =>
  `color-mix(in oklab, var(${token}) ${pct}%, transparent)`;

/** Ink (the text colour) at `pct`%: hairlines, tracks, faint fills. */
export const ink = (pct: number) => mix('--text-primary', pct);

/**
 * Coral for negation. The band (.band-alt) sets --warm per theme; the
 * fallback keeps the visuals usable anywhere else.
 */
export const WARM = 'var(--warm, var(--accent-warm))';
export const warm = (pct: number) =>
  `color-mix(in oklab, var(--warm, var(--accent-warm)) ${pct}%, transparent)`;

/**
 * Steps through phases on timers while `play` is on, looping back to
 * `loopFrom`. Off (offscreen, inactive, reduced motion, or during SSR) it
 * holds `rest`, the meaningful final frame, so the prerendered markup and a
 * reduced-motion visitor both see the finished picture.
 *
 * `instant` is true whenever a visual should jump rather than tween: while
 * held, and on the frame a run (re)starts at phase 0, so scrolling back to
 * the window never shows the rest frame visibly rewinding.
 */
export function useTimeline(
  durations: readonly number[],
  { play, reduced, rest, loopFrom = 0 }: { play: boolean; reduced: boolean; rest: number; loopFrom?: number },
) {
  const running = play && !reduced;
  const [state, setState] = useState(() => ({ phase: running ? 0 : rest, jump: true }));

  useEffect(() => {
    if (!running) {
      setState({ phase: rest, jump: true });
      return;
    }
    let p = 0;
    let timer = 0;
    setState({ phase: 0, jump: true });
    const next = () => {
      timer = window.setTimeout(() => {
        p = p + 1 < durations.length ? p + 1 : loopFrom;
        setState({ phase: p, jump: false });
        next();
      }, durations[p]);
    };
    next();
    return () => window.clearTimeout(timer);
  }, [running, rest, loopFrom, durations]);

  return { phase: state.phase, instant: !running || state.jump };
}

/** A motion value that eases to `value` whenever it changes (jumps when `instant`). */
export function useTween(value: number, instant: boolean, duration = 0.9) {
  const mv = useMotionValue(value);
  useEffect(() => {
    if (instant) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [value, instant, duration, mv]);
  return mv;
}

/** Renders a motion value as fixed-decimal text without re-rendering React. */
export function Num({
  mv,
  decimals = 2,
  className = '',
  style,
}: {
  mv: MotionValue<number>;
  decimals?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const text = useTransform(mv, (v) => v.toFixed(decimals));
  return (
    <motion.span className={`tabular-nums ${className}`} style={style}>
      {text}
    </motion.span>
  );
}

/** Tiny mono caption: column heads, panel labels. */
export function Micro({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[10px] uppercase tracking-[0.14em] text-muted ${className}`}>
      {children}
    </span>
  );
}

/** An ICD-10 code as a mono chip. */
export function CodeChip({ code, dim = false }: { code: string; dim?: boolean }) {
  return (
    <span
      className="inline-flex h-6 shrink-0 items-center rounded-md border px-1.5 font-mono text-[11px] font-semibold tracking-[0.02em] transition-colors duration-500 @md:h-7 @md:px-2 @md:text-[12px]"
      style={{
        borderColor: dim ? 'var(--border-subtle)' : mix('--accent', 40),
        background: dim ? 'transparent' : 'var(--accent-soft)',
        color: dim ? 'var(--text-muted)' : 'var(--text-primary)',
      }}
    >
      {code}
    </span>
  );
}

type Tone = 'accent' | 'warm' | 'muted';

/** Assertion and status tags (AFFIRMED, NEGATED, coded). */
export function Tag({ tone, children, className = '' }: { tone: Tone; children: ReactNode; className?: string }) {
  const color = tone === 'accent' ? 'var(--accent)' : tone === 'warm' ? WARM : 'var(--text-muted)';
  const background = tone === 'accent' ? 'var(--accent-soft)' : tone === 'warm' ? warm(14) : ink(7);
  return (
    <span
      className={`inline-flex h-5 shrink-0 items-center rounded-[5px] px-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500 ${className}`}
      style={{ color, background }}
    >
      {children}
    </span>
  );
}
