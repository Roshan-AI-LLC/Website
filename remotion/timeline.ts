/**
 * Timeline budget for the cinematic cut. 30fps, 1920x1080. Durations are in
 * frames. Segments are sequenced with short cross-transitions (see Full.tsx),
 * which overlap, so the finished piece is a little shorter than the raw sum.
 *
 * Timing is laid out on a steady ~2s (60-frame) pulse so subtle sound design
 * (no music bed required, no VO) can drop onto the marked beats later.
 */
export const FPS = 30;

export const DURATIONS = {
  hook: 4.5 * FPS, // cold open: company + thesis
  stakes: 8 * FPS, // the problem / regulatory pressure
  gap: 6.5 * FPS, // the false choice
  reveal: 5 * FPS, // ShifaMind resolves
  architecture: 9 * FPS, // how it works: the MCB
  demo: 13 * FPS, // real note -> concepts -> code
  benchmark: 8 * FPS, // the proof
  deployment: 6 * FPS, // moat: small, on-prem, traceable
  platform: 5 * FPS, // the company vision
  closing: 5 * FPS, // sign-off + CTA
} as const;

/** Cross-transition length between consecutive segments. */
export const TRANSITION = 14;

const rawTotal = Object.values(DURATIONS).reduce((a, b) => a + b, 0);
const transitionCount = Object.keys(DURATIONS).length - 1;

/** Total frames of the assembled Full composition (transitions overlap). */
export const TOTAL_FRAMES = rawTotal - transitionCount * TRANSITION;

export const WIDTH = 1920;
export const HEIGHT = 1080;
