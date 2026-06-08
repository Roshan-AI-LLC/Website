/**
 * Segment 1 · HOOK (cold open). Establishes the company and the thesis in
 * one breath: powerful AI that can't explain itself has no place in
 * medicine. Scroll-stopping by design. [All audiences]
 *
 * Sound slot: low sub-drop on the kicker, a soft riser into the teal line.
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { RevealText } from '../components/RevealText';
import { softGlow } from '../components/TealGlow';

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = spring({ frame, fps, config: { damping: 200, stiffness: 40, mass: 1 } });
  const glow = interpolate(pulse, [0, 1], [0, 0.5]);
  const ring = interpolate(pulse, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Igniting point of light */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1100,
          height: 820,
          transform: 'translate(-50%, -50%)',
          background: softGlow(COLORS.accent),
          opacity: glow * 0.6,
          filter: 'blur(90px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 8 + ring * 540,
          height: 8 + ring * 540,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `1px solid rgba(78,205,196,${0.25 * (1 - ring)})`,
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center', padding: '0 160px' }}>
        <RevealText
          appearAt={6}
          style={{
            fontFamily: FONTS.mono,
            fontSize: 24,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: COLORS.accent,
            marginBottom: 40,
            paddingLeft: '0.42em',
          }}
        >
          Roshan AI
        </RevealText>

        <RevealText
          appearAt={22}
          style={{
            fontFamily: FONTS.display,
            fontSize: 80,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
          }}
        >
          Medicine doesn't just need predictions.
        </RevealText>
        <RevealText
          appearAt={48}
          style={{
            fontFamily: FONTS.display,
            fontSize: 92,
            fontWeight: 700,
            color: COLORS.accent,
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            marginTop: 12,
            textShadow: `0 0 70px ${COLORS.accentSoft}`,
          }}
        >
          It needs reasons.
        </RevealText>
      </div>
    </AbsoluteFill>
  );
};
