/**
 * The persistent film backdrop: pure black, the faint dot grid, a slowly
 * drifting/breathing ambient teal glow, and an edge vignette. Rendered ONCE
 * behind the whole piece (see Full.tsx) so segments cross-fade over a
 * continuous canvas - the single biggest contributor to the "one film" feel.
 */
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { DotGrid } from './DotGrid';

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();

  // Very slow drift so the canvas is alive but never distracting.
  const gx = 50 + Math.sin(frame * 0.0045) * 14;
  const gy = 46 + Math.cos(frame * 0.0035) * 10;
  const breathe = 0.16 + Math.sin(frame * 0.012) * 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONTS.body }}>
      <DotGrid />
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            left: `${gx}%`,
            top: `${gy}%`,
            width: 1500,
            height: 1500,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.accent} 0%, transparent 62%)`,
            opacity: breathe,
            filter: 'blur(60px)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(85% 85% at 50% 45%, transparent 48%, rgba(0,0,0,0.72) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
