/**
 * Frame-triggered snap-in. A line (or block) appears with a crisp spring
 * rise + fade once the timeline passes `appearAt`. The uniform entrance used
 * for nearly every piece of copy in the video.
 */
import type { CSSProperties } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const RevealText: React.FC<{
  /** Local frame (within the segment) at which this reveals. */
  appearAt?: number;
  children: React.ReactNode;
  style?: CSSProperties;
  /** Rise distance in px. */
  y?: number;
}> = ({ appearAt = 0, children, style, y = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt;

  const s = spring({
    frame: local,
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.6 },
  });
  const opacity = interpolate(local, [0, 7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(s, [0, 1], [y, 0]);

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
};
