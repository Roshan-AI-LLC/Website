/**
 * ACT 5 — THE PROOF [Proof].
 * Pull back: the single prediction becomes one data point in the
 * Accuracy×Interpretability quadrant. ShifaMind rises alone, top-right.
 * Hero: "State of the art. The only one you can audit." Then the quadrant
 * recedes and the Receipts (CSTPR/CIM/CCR) count up, with the line
 * "Numbers a general model can't produce."
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONTS, COLORS } from '../../theme';
import { Quadrant } from '../../components/Quadrant';
import { Receipts } from '../../components/Receipts';
import { ramp } from '../shared';
import { Hero } from '../Hero';

export const Proof: React.FC = () => {
  const frame = useCurrentFrame();

  // Quadrant occupies 0..230; receipts take over ~230..end.
  const quadO = interpolate(frame, [6, 24, 232, 256], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const receiptsIn = ramp(frame, 250, 270);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: quadO }}>
        <Quadrant appearAt={10} />
      </AbsoluteFill>

      <Hero
        text="State of the art. The only one you can audit."
        appearAt={120}
        bottom={120}
        size={44}
        fadeOutAt={228}
      />

      {/* Receipts */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: receiptsIn }}>
        <div style={{ width: 1280 }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: COLORS.accent,
              textAlign: 'center',
              marginBottom: 34,
            }}
          >
            the receipts
          </div>
          <Receipts appearAt={262} />
        </div>
      </AbsoluteFill>

      <Hero
        text="Numbers a general model can't produce."
        appearAt={320}
        bottom={150}
        size={42}
      />
    </AbsoluteFill>
  );
};
