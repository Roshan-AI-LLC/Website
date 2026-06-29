/**
 * The film's ONE motion signature. Every segment in both cuts imports its
 * springs, stagger, and easing from here so the whole piece moves like it was
 * authored by one hand (the single biggest fix for the old "stitched together"
 * feel, where five different spring configs and four staggers were in play).
 *
 * Also defines the tempo grid. Motion lands on a 100bpm beat so the film reads
 * as choreographed; when audio is added later, the hits already line up.
 */
import { Easing, interpolate } from 'remotion';

/** Primary entrance spring — crisp rise + settle. Use for text + chips. */
export const SPRING = { damping: 20, stiffness: 160, mass: 0.7 } as const;
/** Heavier spring for large objects (panels, cards, the cube). */
export const SPRING_SOFT = { damping: 26, stiffness: 90, mass: 1 } as const;

/** Frames between staggered siblings. One unit everywhere. */
export const STAGGER = 3;

/** The brand easing curve (matches the site's --ease-spring). */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_OUT = Easing.out(Easing.cubic);
export const EASE_IN = Easing.in(Easing.cubic);

export const BPM = 100;
/** Frames per beat at a given fps (~18 frames at 30fps). */
export const beat = (fps: number) => (60 / BPM) * fps;
/** Snap a beat count to a whole frame offset. */
export const onBeat = (n: number, fps: number) => Math.round(n * beat(fps));

/**
 * Standard "rise + fade in" used by nearly every element. Returns
 * { opacity, y } given a local frame. Eased, clamped, one definition.
 */
export const riseIn = (local: number, dist = 20, dur = 12) => {
  const opacity = interpolate(local, [0, dur * 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(local, [0, dur], [dist, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return { opacity, y };
};
