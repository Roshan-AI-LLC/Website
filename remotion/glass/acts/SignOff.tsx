/**
 * ACT 8 — SIGN-OFF [Roshan AI].
 * Everything condenses to the LogoMark igniting. The two-color story resolves:
 * a warm human point and a teal system point converge from opposite sides and
 * MERGE into the mark. Hero lines in sequence:
 *   "Clinical AI that explains itself." → "ShifaMind — by Roshan AI" → "roshan-ai.com"
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../../theme';
import { LogoMark } from '../../components/LogoMark';
import { TealGlow } from '../../components/TealGlow';
import { ramp } from '../shared';
import { Hero } from '../Hero';

const CX = 960;
const CY = 430;

export const SignOff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Two points converge over 0..40, then the mark ignites.
  const converge = ramp(frame, 6, 46);
  const warmX = interpolate(converge, [0, 1], [CX - 420, CX]);
  const tealX = interpolate(converge, [0, 1], [CX + 420, CX]);
  const pointO = interpolate(converge, [0, 0.7, 1], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Flash at merge.
  const flash = interpolate(frame, [40, 48, 64], [0, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const markIn = spring({ frame: frame - 44, fps, config: { damping: 18, stiffness: 110, mass: 0.8 } });

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <TealGlow size={1100} y="40%" opacity={0.4 * markIn} />

      {/* Converging points */}
      <div
        style={{
          position: 'absolute',
          left: warmX,
          top: CY,
          width: 22,
          height: 22,
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          background: COLORS.humanStrong,
          boxShadow: `0 0 50px 12px ${COLORS.human}`,
          opacity: pointO,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: tealX,
          top: CY,
          width: 22,
          height: 22,
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          background: COLORS.accentStrong,
          boxShadow: `0 0 50px 12px ${COLORS.accent}`,
          opacity: pointO,
        }}
      />

      {/* Merge flash */}
      <div
        style={{
          position: 'absolute',
          left: CX,
          top: CY,
          width: 400,
          height: 400,
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(closest-side, rgba(255,255,255,${flash}), transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      {/* The mark */}
      <div
        style={{
          position: 'absolute',
          left: CX,
          top: CY,
          transform: `translate(-50%,-50%) scale(${interpolate(markIn, [0, 1], [0.6, 1])})`,
          opacity: markIn,
        }}
      >
        <LogoMark size={260} appearAt={44} />
      </div>

      {/* Sequenced sign-off lines */}
      <Hero text="Clinical AI that explains itself." appearAt={70} top={720} size={46} fadeOutAt={140} />
      <SignLine text="ShifaMind" accent="by Roshan AI" appearAt={150} />
      <Hero text="roshan-ai.com" appearAt={196} top={830} size={28} mono />
    </AbsoluteFill>
  );
};

const SignLine: React.FC<{ text: string; accent: string; appearAt: number }> = ({ text, accent, appearAt }) => {
  const frame = useCurrentFrame();
  const o = ramp(frame, appearAt, appearAt + 16);
  return (
    <div
      style={{
        position: 'absolute',
        top: 720,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: o,
        fontFamily: FONTS.display,
        fontSize: 52,
        fontWeight: 700,
        color: COLORS.textPrimary,
        letterSpacing: '-0.02em',
      }}
    >
      {text} <span style={{ color: COLORS.accent }}>{accent}</span>
    </div>
  );
};
