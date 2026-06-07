/**
 * Segment 4 · EXPLAINABILITY / GLASS BOX - a black cube turns to glass,
 * revealing teal concept nodes inside, while the overlay explains that
 * ShifaMind opens the black box.
 */
import { AbsoluteFill } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { Stage } from '../components/Stage';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';
import { Cube3D } from '../components/Cube3D';

export const GlassBox: React.FC = () => {
  return (
    <Stage>
      <TealGlow x="50%" y="52%" size={1100} opacity={0.16} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 70 }}>
        <RevealText
          appearAt={6}
          style={{
            fontFamily: FONTS.display,
            fontSize: 50,
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

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70 }}>
        <RevealText
          appearAt={95}
          style={{
            fontFamily: FONTS.display,
            fontSize: 46,
            fontWeight: 600,
            color: COLORS.accent,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          ShifaMind opens it, so clinicians see the reasoning.
        </RevealText>
        <RevealText
          appearAt={130}
          style={{
            marginTop: 18,
            fontFamily: FONTS.body,
            fontSize: 30,
            color: COLORS.textSecondary,
            textAlign: 'center',
            maxWidth: 1100,
          }}
        >
          Every prediction runs through the clinical concepts a doctor already thinks in.
        </RevealText>
      </AbsoluteFill>
    </Stage>
  );
};
