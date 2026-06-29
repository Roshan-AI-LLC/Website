/**
 * ACT 0 — THE FIELD [The problem].
 * A vast, slow-drifting galaxy of faint document-glyph dots receding into
 * depth: hundreds of claims. A few flicker RED and wink out (denials); gaps in
 * the lattice are missing coders. Two data ticks. Then the camera SELECTS one
 * dot and falls toward it — it warms to COLORS.human: a person. A warm heartbeat
 * pulse, messy prose assembling, one warm hero line.
 *
 * The selected dot lives at screen-centre at the END so Act 1's docked note can
 * morph from the same point (match-cut).
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../../theme';
import { rng, ramp, fade } from '../shared';
import { Hero } from '../Hero';

const CX = 960;
const CY = 540;

type Star = {
  x: number;
  y: number;
  depth: number; // 0 far .. 1 near
  size: number;
  twinkle: number;
  denial: boolean;
  denialAt: number;
  gap: boolean;
};

const STARS: Star[] = (() => {
  const r = rng(7);
  const out: Star[] = [];
  for (let i = 0; i < 320; i++) {
    const depth = r();
    out.push({
      x: r() * 1920,
      y: r() * 1080,
      depth,
      size: 1.2 + depth * 3.4,
      twinkle: r() * Math.PI * 2,
      denial: r() < 0.06,
      denialAt: 70 + r() * 160,
      gap: r() < 0.05,
    });
  }
  return out;
})();

const Tick: React.FC<{ label: string; appearAt: number; align: 'left' | 'right'; row: number }> = ({
  label,
  appearAt,
  align,
  row,
}) => {
  const frame = useCurrentFrame();
  const o = fade(frame, appearAt, appearAt + 14, appearAt + 150, appearAt + 172);
  return (
    <div
      style={{
        position: 'absolute',
        top: 300 + row * 54,
        [align]: 150,
        opacity: o,
        fontFamily: FONTS.mono,
        fontSize: 26,
        letterSpacing: '0.1em',
        color: COLORS.textMuted,
        textAlign: align,
      }}
    >
      {label}
    </div>
  );
};

export const Field: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1 (0..200): galaxy drifts, denials wink out, ticks.
  // Phase 2 (200..360): fall toward the selected star; it warms to a person.
  const fall = ramp(frame, 196, 320);
  // Camera pushes toward the chosen star (which sits slightly off-centre).
  const targetX = 1180;
  const targetY = 470;
  const camScale = interpolate(fall, [0, 1], [1, 6.4]);
  const camDX = interpolate(fall, [0, 1], [0, CX - targetX]);
  const camDY = interpolate(fall, [0, 1], [0, CY - targetY]);

  // Field drift (very slow).
  const driftX = Math.sin(frame * 0.004) * 18;
  const driftY = Math.cos(frame * 0.003) * 12;

  // Heartbeat once we've arrived.
  const beatT = ramp(frame, 296, 312);
  const hb = 1 + beatT * (0.18 * Math.max(0, Math.sin((frame - 296) * 0.5)) +
    0.10 * Math.max(0, Math.sin((frame - 296) * 0.5 - 0.9)));

  // Galaxy fades as we plunge into the chosen star.
  const galaxyO = interpolate(fall, [0.35, 0.95], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* The galaxy, transformed by the camera so we appear to fall into it */}
      <AbsoluteFill
        style={{
          transform: `translate(${camDX + driftX}px, ${camDY + driftY}px) scale(${camScale})`,
          transformOrigin: `${targetX}px ${targetY}px`,
          opacity: galaxyO,
        }}
      >
        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
          {STARS.map((s, i) => {
            if (s.gap) return null;
            const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * 0.05 + s.twinkle));
            const base = (0.1 + s.depth * 0.5) * tw;
            // Denials: brief red flare then wink out.
            let fill = `rgba(255,255,255,${base})`;
            let op = base;
            if (s.denial) {
              const d = frame - s.denialAt;
              if (d > 0) {
                const flare = interpolate(d, [0, 8, 22], [base, 0.9, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                fill = `rgba(224,102,122,1)`;
                op = flare;
              }
            }
            return (
              <g key={i} opacity={op}>
                {/* a tiny document glyph: dot + tick line */}
                <circle cx={s.x} cy={s.y} r={s.size} fill={fill} />
                <line
                  x1={s.x - s.size * 1.4}
                  y1={s.y + s.size * 1.8}
                  x2={s.x + s.size * 1.4}
                  y2={s.y + s.size * 1.8}
                  stroke={fill}
                  strokeWidth={0.6}
                  opacity={0.6}
                />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Data ticks (Phase 1) */}
      <Tick label="$262B denied · 2024" appearAt={96} align="left" row={0} />
      <Tick label="1 in 3 coding seats empty" appearAt={120} align="right" row={1} />

      {/* The selected person: warm core that emerges as we arrive */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            left: CX,
            top: CY,
            transform: `translate(-50%, -50%) scale(${hb})`,
            opacity: interpolate(fall, [0.5, 0.8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {/* warm halo */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 520,
              height: 520,
              transform: 'translate(-50%,-50%)',
              borderRadius: '50%',
              background: `radial-gradient(closest-side, ${COLORS.humanSoft}, transparent 70%)`,
              filter: 'blur(40px)',
              opacity: 0.9 * beatT + 0.3,
            }}
          />
          {/* warm point */}
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: COLORS.humanStrong,
              boxShadow: `0 0 60px 14px ${COLORS.human}, 0 0 18px 4px ${COLORS.humanStrong}`,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Messy clinical prose assembling around the person */}
      <ProseScatter appearAt={262} />

      {/* Warm hero line */}
      <Hero
        text={'2:47 AM · "can’t breathe lying down."'}
        appearAt={300}
        warm
        bottom={236}
        size={50}
      />
    </AbsoluteFill>
  );
};

/** Fragments of raw note text drifting in and assembling near the person. */
const ProseScatter: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const fragments = [
    { t: 'dyspnea', x: 620, y: 360, d: 0 },
    { t: 'orthopnea', x: 1280, y: 380, d: 4 },
    { t: '10-lb weight gain', x: 700, y: 700, d: 8 },
    { t: 'edema', x: 1320, y: 690, d: 12 },
    { t: 'BNP 1850', x: 560, y: 540, d: 6 },
    { t: 'recliner', x: 1380, y: 540, d: 10 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {fragments.map((f, i) => {
        const local = frame - appearAt - f.d;
        const o = fade(frame, appearAt + f.d, appearAt + f.d + 16, appearAt + 70, appearAt + 92);
        const drift = Math.sin(local * 0.04 + i) * 6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: f.x,
              top: f.y + drift,
              transform: 'translate(-50%, -50%)',
              opacity: o * 0.7,
              fontFamily: FONTS.mono,
              fontSize: 22,
              color: COLORS.human,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {f.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
