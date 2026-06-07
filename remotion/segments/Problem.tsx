/**
 * Segment 1 · PROBLEM - white lines snap in over the grid, the last one
 * teal: explainability is now the law.
 */
import { AbsoluteFill } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { Stage } from '../components/Stage';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';

const LINES = [
  '12% claim denial rate.',
  '30% certified-coder shortage.',
  'August 2026: the EU AI Act makes healthcare AI high-risk.',
];

export const Problem: React.FC = () => {
  return (
    <Stage>
      <TealGlow x="50%" y="115%" size={1300} opacity={0.18} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          padding: '0 200px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          {LINES.map((line, i) => (
            <RevealText
              key={line}
              appearAt={8 + i * 32}
              style={{
                fontFamily: FONTS.display,
                fontSize: 58,
                fontWeight: 600,
                color: COLORS.textPrimary,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {line}
            </RevealText>
          ))}

          <RevealText
            appearAt={120}
            style={{
              marginTop: 22,
              fontFamily: FONTS.display,
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.accent,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              textShadow: `0 0 60px ${COLORS.accentSoft}`,
            }}
          >
            Explainability is no longer optional. It's the law.
          </RevealText>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
