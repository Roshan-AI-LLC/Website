/**
 * Soft teal radial glow. The recurring atmospheric accent that ties the
 * piece together. Positioned and sized per-segment.
 */
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../theme';

export const TealGlow: React.FC<{
  /** Diameter in px. */
  size?: number;
  /** Center position, as CSS percentages. */
  x?: string;
  y?: string;
  /** 0–1 peak opacity. */
  opacity?: number;
  color?: string;
}> = ({ size = 900, x = '50%', y = '50%', opacity = 0.5, color = COLORS.accent }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
          opacity,
          filter: 'blur(40px)',
        }}
      />
    </AbsoluteFill>
  );
};
