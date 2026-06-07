/**
 * Segment · GLASS BOX. The metaphor beat: a solid black cube turns to glass,
 * revealing the teal concept nodes inside. Sets up the mechanism that the
 * Architecture segment then explains. [All audiences: the emotional turn]
 *
 * Sound slot: a low "open" swell as the cube turns to glass.
 */
import { AbsoluteFill } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';
import { Cube3D } from '../components/Cube3D';

export const GlassBox: React.FC = () => {
  return (
    <AbsoluteFill>
      <TealGlow x="50%" y="52%" size={1100} opacity={0.16} />

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

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 96 }}>
        <RevealText
          appearAt={96}
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
