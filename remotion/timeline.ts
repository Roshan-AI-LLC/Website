/**
 * Timeline budget for the cinematic cut. 30fps, 1920x1080. Durations are in
 * frames. Segments play back-to-back in a Series over one persistent
 * backdrop; each fades its own content in/out (see components/Segment.tsx),
 * so only one segment is ever visible at a time - no cross-segment overlap.
 *
 * Timing sits on a steady pulse so subtle sound design (no music bed, no VO)
 * can drop onto the marked beats in each segment later.
 */
export const FPS = 30;

export const DURATIONS = {
  hook: 4.5 * FPS, // cold open: company + thesis
  stakes: 8 * FPS, // cited problem / regulatory pressure
  gap: 6.5 * FPS, // the false choice
  reveal: 5 * FPS, // ShifaMind resolves
  glassbox: 7 * FPS, // black box -> glass box metaphor
  architecture: 8.5 * FPS, // how it works: the MCB
  demo: 14 * FPS, // cursor clicks Predict, then note -> concepts -> code
  benchmark: 8 * FPS, // the proof
  deployment: 6 * FPS, // moat: compact, on-prem, traceable
  closing: 5 * FPS, // sign-off + CTA
} as const;

/** Content fade length at each segment's head and tail. */
export const FADE = 10;

/** Total frames of the assembled Full composition (segments are back-to-back). */
export const TOTAL_FRAMES = Object.values(DURATIONS).reduce((a, b) => a + b, 0);

export const WIDTH = 1920;
export const HEIGHT = 1080;
