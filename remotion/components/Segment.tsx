/**
 * Wraps a content-only segment and gives it a designed entrance/exit over the
 * persistent backdrop. Not a flat opacity fade: content rises and sharpens
 * into place on entry, then lifts, softens (blur) and recedes on exit, all on
 * eased curves. Because segments play back-to-back in a Series, the previous
 * one has settled to the backdrop before the next rises in - so it reads as a
 * premium "lift and settle," never a ghosted cross-fade.
 */
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FADE } from '../timeline';

const IN = FADE + 4;
const OUT = FADE + 4;

export const Segment: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const cubic = Easing.bezier(0.22, 1, 0.36, 1);

  const inP = interpolate(frame, [0, IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: cubic,
  });
  const outP = interpolate(frame, [durationInFrames - OUT, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: cubic,
  });

  // Gentle perpetual drift so scenes never sit dead-still; parallaxes against
  // the independently-drifting backdrop glow. Very small on purpose.
  const floatY = Math.sin(frame * 0.024) * 3;
  const floatX = Math.cos(frame * 0.017) * 2;

  const opacity = inP * (1 - outP);
  const translateY = (1 - inP) * 20 + outP * -16 + floatY;
  const scale = 0.985 + inP * 0.015 - outP * 0.02;
  const blur = (1 - inP) * 6 + outP * 6;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate(${floatX}px, ${translateY}px) scale(${scale})`,
        filter: blur > 0.15 ? `blur(${blur}px)` : undefined,
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
