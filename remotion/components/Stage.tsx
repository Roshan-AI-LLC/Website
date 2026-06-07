/**
 * Per-segment backdrop + entrance/exit fade. Pure black, dot grid, and a
 * gentle edge vignette in every segment. The fade (driven by the segment's
 * own local frame range) lets segments cut to/from black seamlessly so the
 * whole piece flows as one continuous render.
 */
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { DotGrid } from './DotGrid';

export const Stage: React.FC<{
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ children, fadeIn = 12, fadeOut = 12 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: FONTS.body,
        opacity,
      }}
    >
      <DotGrid />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(80% 80% at 50% 45%, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
