/**
 * Faint white dot grid, present in every segment for visual continuity.
 * ~4% opacity dots (the alpha lives in COLORS.grid), softly masked toward
 * the edges so the canvas stays clean and the center reads first.
 */
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../theme';

export const DotGrid: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${COLORS.grid} 1.5px, transparent 1.6px)`,
        backgroundSize: '46px 46px',
        backgroundPosition: 'center',
        maskImage:
          'radial-gradient(120% 120% at 50% 50%, black 45%, transparent 92%)',
        WebkitMaskImage:
          'radial-gradient(120% 120% at 50% 50%, black 45%, transparent 92%)',
      }}
    />
  );
};
