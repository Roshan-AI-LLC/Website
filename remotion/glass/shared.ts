/**
 * GLASS-internal shared helpers + the film's timeline map. Kept inside the
 * glass/ folder so the cut owns its own tempo and atmosphere without touching
 * the orchestrator's shared timeline. Everything here is deterministic (seeded)
 * so renders are stable frame-to-frame.
 */
import { interpolate } from 'remotion';
import { EASE } from '../motion';

/** Deterministic, seed-stable PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Clamped, eased fade-up window. */
export const fade = (
  f: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
): number =>
  interpolate(f, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Eased clamp 0..1 over [a,b]. */
export const ramp = (f: number, a: number, b: number, easing = EASE): number =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Absolute act windows (frames @30fps). Acts overlap at the seams. */
export const ACTS = {
  field: { start: 0, end: 360 },
  intake: { start: 350, end: 660 },
  glass: { start: 648, end: 1140 },
  verdict: { start: 1128, end: 1500 },
  discuss: { start: 1490, end: 1800 },
  proof: { start: 1788, end: 2220 },
  downstream: { start: 2208, end: 2640 },
  platform: { start: 2628, end: 2940 },
  signoff: { start: 2928, end: 3180 },
} as const;

export const GLASS_TOTAL = 3180;

/** Chapter labels for the Hud, one per act, at the act's nominal start. */
export const CHAPTERS: { label: string; start: number }[] = [
  { label: 'The problem', start: 0 },
  { label: 'Predict', start: 360 },
  { label: 'How it works', start: 660 },
  { label: 'Explain', start: 1140 },
  { label: 'Interrogate', start: 1500 },
  { label: 'Proof', start: 1800 },
  { label: 'Defensible', start: 2220 },
  { label: 'Platform', start: 2640 },
  { label: 'Roshan AI', start: 2940 },
];

/** Cross-dissolve opacity for an act given the absolute frame + window. */
export function actOpacity(
  frame: number,
  win: { start: number; end: number },
  fadeFrames = 22,
): number {
  return fade(
    frame,
    win.start,
    win.start + fadeFrames,
    win.end - fadeFrames,
    win.end,
  );
}
