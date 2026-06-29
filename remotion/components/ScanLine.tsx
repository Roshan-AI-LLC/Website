/**
 * The film's signature transition + "reading" primitive. A teal scan line with
 * a soft leading haze sweeps across a region. Promoted from the demo's note
 * scan to the universal device: it reads prose in the demo, and it wipes
 * between scenes elsewhere, so every transition shares one visual language.
 *
 * `progress` (0..1) positions the line; `axis` chooses sweep direction; pass
 * `glow` to size the trailing haze.
 */
import { COLORS } from '../theme';

export const ScanLine: React.FC<{
  progress: number;
  axis?: 'y' | 'x';
  opacity?: number;
  glow?: number;
  color?: string;
}> = ({ progress, axis = 'y', opacity = 1, glow = 90, color = COLORS.accent }) => {
  const p = `${Math.max(0, Math.min(1, progress)) * 100}%`;
  const vertical = axis === 'y';

  const haze: React.CSSProperties = vertical
    ? {
        left: 0,
        right: 0,
        top: p,
        height: glow,
        transform: `translateY(-${glow}px)`,
        background: `linear-gradient(180deg, transparent, ${color}22)`,
      }
    : {
        top: 0,
        bottom: 0,
        left: p,
        width: glow,
        transform: `translateX(-${glow}px)`,
        background: `linear-gradient(90deg, transparent, ${color}22)`,
      };

  const line: React.CSSProperties = vertical
    ? {
        left: 0,
        right: 0,
        top: p,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }
    : {
        top: 0,
        bottom: 0,
        left: p,
        width: 2,
        background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
      };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', ...haze }} />
      <div style={{ position: 'absolute', boxShadow: `0 0 18px ${color}`, ...line }} />
    </div>
  );
};
