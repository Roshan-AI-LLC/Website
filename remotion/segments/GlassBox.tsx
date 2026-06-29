/**
 * Segment · GLASS BOX. The metaphor beat: a solid black cube turns to glass,
 * revealing the teal concept nodes inside. The note's evidence (carried from
 * the cold open) streams in and converges into the box as it opens. Sets up the
 * mechanism the Architecture segment then explains. [All audiences: the turn]
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';
import { Cube3D } from '../components/Cube3D';
import { EASE } from '../motion';

// Intake: the note's evidence streams in from the left and converges into the
// forming box — the handoff into the mechanism.
const INTAKE = ['orthopnea', 'BNP 1850', 'edema'];

const EvidenceChip: React.FC<{ label: string; index: number }> = ({ label, index }) => {
  const frame = useCurrentFrame();
  const local = frame - 8 - index * 6;
  const p = interpolate(local, [0, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const x = interpolate(p, [0, 1], [-560, 0]);
  const y = -40 + index * 40;
  const opacity = interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${x}px, ${y * (1 - p)}px) scale(${1 - 0.4 * p})`,
        opacity,
        fontFamily: FONTS.mono,
        fontSize: 22,
        color: COLORS.accent,
        background: COLORS.accentSoft,
        border: `1px solid ${COLORS.borderTeal}`,
        borderRadius: 10,
        padding: '8px 16px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
};

export const GlassBox: React.FC = () => {
  return (
    <AbsoluteFill>
      <TealGlow x="50%" y="52%" size={1100} opacity={0.16} />

      {INTAKE.map((label, i) => (
        <EvidenceChip key={label} label={label} index={i} />
      ))}

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 96 }}>
        <RevealText
          appearAt={6}
          style={{
            fontFamily: FONTS.display,
            fontSize: 52,
            fontWeight: 600,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          Most clinical AI is a black box.
        </RevealText>
      </AbsoluteFill>

      <Cube3D appearAt={0} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 128 }}>
        <RevealText
          appearAt={72}
          style={{
            fontFamily: FONTS.display,
            fontSize: 48,
            fontWeight: 600,
            color: COLORS.accent,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          ShifaMind opens it, so you can see the reasoning.
        </RevealText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
