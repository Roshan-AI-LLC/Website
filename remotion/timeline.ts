/**
 * Timeline budget for the TRACE cut (the evolution of the original film).
 * 30fps, 1920x1080. Durations are in frames. Segments play back-to-back in a
 * Series over one persistent backdrop + a persistent HUD; each fades its own
 * content in/out (see components/Segment.tsx), and the through-line is composed
 * so the shared element sits at the same place across each seam.
 *
 * Timing sits on a 100bpm pulse (see motion.ts) so the film reads as
 * choreographed and any later audio pass lines up on the beats.
 */
export const FPS = 30;

export const DURATIONS = {
  coldopen: 8.5 * FPS, // stakes, a note is born, condense to a point (pre-context)
  reveal: 5 * FPS, // the point blooms into the logo; "explains itself"
  glassbox: 6.5 * FPS, // intake scan, black box turns to glass
  architecture: 7 * FPS, // the MCB; the shortcut path is blocked
  demo: 10 * FPS, // cursor clicks Predict; note, concepts, code
  benchmark: 6.5 * FPS, // the bars (LAAT added), highest Macro-F1
  proof: 6.5 * FPS, // interpretability metrics: ShifaMind vs Vanilla CBM
  deployment: 5 * FPS, // compact, on-prem, HIPAA, traceable
  closing: 5 * FPS, // sign-off + CTA
} as const;

/** Content fade length at each segment's head and tail. */
export const FADE = 6;

/** Total frames of the assembled Full composition (segments are back-to-back). */
export const TOTAL_FRAMES = Object.values(DURATIONS).reduce((a, b) => a + b, 0);

export const WIDTH = 1920;
export const HEIGHT = 1080;
