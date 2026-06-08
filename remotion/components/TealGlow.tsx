/**
 * Soft teal atmospheric glow. The recurring accent that ties the piece
 * together. The falloff is a gradual multi-stop feather (alpha eases to zero
 * long before the edge) plus a size-scaled blur and a gentle horizontal
 * stretch, so it reads as haze - never a hard-edged circle.
 */
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../theme';

/** Smoothly-feathered radial fill for a given colour (no visible edge). */
export const softGlow = (c: string) =>
  `radial-gradient(closest-side, ` +
  `color-mix(in srgb, ${c} 100%, transparent) 0%, ` +
  `color-mix(in srgb, ${c} 58%, transparent) 18%, ` +
  `color-mix(in srgb, ${c} 30%, transparent) 34%, ` +
  `color-mix(in srgb, ${c} 13%, transparent) 50%, ` +
  `color-mix(in srgb, ${c} 4%, transparent) 68%, ` +
  `transparent 86%)`;

export const TealGlow: React.FC<{
  /** Diameter in px (before the horizontal stretch). */
  size?: number;
  x?: string;
  y?: string;
  /** 0-1 peak opacity. */
  opacity?: number;
  color?: string;
  /** Horizontal stretch so it isn't a perfect circle. */
  stretch?: number;
}> = ({ size = 900, x = '50%', y = '50%', opacity = 0.5, color = COLORS.accent, stretch = 1.18 }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          transform: `translate(-50%, -50%) scale(${stretch}, ${1 / stretch})`,
          background: softGlow(color),
          opacity,
          filter: `blur(${Math.max(60, Math.round(size * 0.08))}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
