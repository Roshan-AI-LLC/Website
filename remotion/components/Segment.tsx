/**
 * Wraps a content-only segment and fades its content in at the head and out
 * at the tail (over the persistent backdrop). Because segments play
 * back-to-back in a Series, only one is visible at a time: the previous one
 * has faded to the backdrop before the next fades in. No cross-segment
 * overlap, but the canvas stays continuous.
 */
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { FADE } from '../timeline';

export const Segment: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
