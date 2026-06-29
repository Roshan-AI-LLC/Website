/**
 * ACT 6 — DOWNSTREAM [Defensible].
 * Post-context payoff. The AuditGate plays (a claim clears the green gate; the
 * denial that doesn't happen). Then we pull WAY back to the Act-0 field — but now
 * it turns TEAL note by note (defensible at scale) and the gaps (missing coders)
 * fill back in. Hero: "Every prediction, defensible."
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../../theme';
import { AuditGate } from '../../components/AuditGate';
import { rng, ramp } from '../shared';
import { Hero } from '../Hero';

type Star = { x: number; y: number; depth: number; size: number; tw: number; turnAt: number; gap: boolean; gapFill: number };

const STARS: Star[] = (() => {
  const r = rng(91);
  const out: Star[] = [];
  for (let i = 0; i < 340; i++) {
    const depth = r();
    out.push({
      x: r() * 1920,
      y: r() * 1080,
      depth,
      size: 1.2 + depth * 3,
      tw: r() * Math.PI * 2,
      turnAt: r(), // 0..1 fraction of the turn window
      gap: r() < 0.06,
      gapFill: r(),
    });
  }
  return out;
})();

export const Downstream: React.FC = () => {
  const frame = useCurrentFrame();

  // AuditGate: 0..150. Field pull-back: 150..end.
  const gateO = interpolate(frame, [4, 22, 150, 172], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fieldO = ramp(frame, 158, 186);
  // Pull back: zoom out from a single point to the whole field.
  const pull = ramp(frame, 158, 280);
  const camScale = interpolate(pull, [0, 1], [5.5, 1]);
  // The teal "turn" sweeps across the field.
  const turn = ramp(frame, 196, 360);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: gateO }}>
        <AuditGate appearAt={8} />
      </AbsoluteFill>

      {/* The field turning teal */}
      <AbsoluteFill style={{ opacity: fieldO }}>
        <AbsoluteFill
          style={{
            transform: `scale(${camScale})`,
            transformOrigin: '960px 540px',
          }}
        >
          <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
            {STARS.map((s, i) => {
              const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame * 0.05 + s.tw));
              // Gaps fill back in as coverage returns.
              const filled = s.gap ? interpolate(turn, [s.gapFill * 0.7, s.gapFill * 0.7 + 0.25], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }) : 1;
              // Turn teal note by note.
              const teal = interpolate(turn, [s.turnAt * 0.85, s.turnAt * 0.85 + 0.12], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const r = Math.round(255 + (0x4e - 255) * teal);
              const g = Math.round(255 + (0xcd - 255) * teal);
              const b = Math.round(255 + (0xc4 - 255) * teal);
              const base = (0.12 + s.depth * 0.5) * tw * filled;
              return (
                <g key={i} opacity={base}>
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill={`rgb(${r},${g},${b})`}
                    style={teal > 0.5 ? { filter: `drop-shadow(0 0 ${3 * teal}px ${COLORS.accent})` } : undefined}
                  />
                </g>
              );
            })}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>

      <Hero text="Every prediction, defensible." appearAt={262} bottom={170} />
    </AbsoluteFill>
  );
};
