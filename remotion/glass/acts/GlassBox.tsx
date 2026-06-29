/**
 * ACT 2 — THE GLASS BOX / BOTTLENECK [How it works].
 * We fly INTO a cathedral of ~160 faint concept nodes. The evidence particles
 * from Act 1 arrive and IGNITE ~6 relevant concepts. Every path forward is
 * forced through lit concepts: a competitor "ghost path" (dotted) tries to
 * shortcut straight to the answer and DISSOLVES at the gate. Label
 * "MCB · 160 concepts". Hero: "Enforced — not bolted on."
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../../theme';
import { CONCEPTS } from '../../data/scenario';
import { rng, ramp } from '../shared';
import { Hero } from '../Hero';

const CX = 960;
const CY = 540;

type Lat = { x: number; y: number; depth: number; size: number; lit: boolean; label?: string };

// ~160 lattice nodes in a soft elliptical cloud; 6 marked as the lit concepts.
const LATTICE: Lat[] = (() => {
  const r = rng(42);
  const out: Lat[] = [];
  for (let i = 0; i < 160; i++) {
    const ang = r() * Math.PI * 2;
    const rad = Math.pow(r(), 0.6);
    const depth = r();
    out.push({
      x: CX + Math.cos(ang) * rad * 760 * (1.25),
      y: CY + Math.sin(ang) * rad * 440,
      depth,
      size: 1.5 + depth * 3.2,
      lit: false,
    });
  }
  // Hand-place the 6 lit concepts on a clean arc toward the gate (right side).
  const litPos: [number, number][] = [
    [640, 360],
    [720, 560],
    [690, 760],
    [1010, 330],
    [1060, 600],
    [1020, 800],
  ];
  const labels: string[] = [...CONCEPTS.map((c) => c.label), 'congestion', 'jvd'];
  litPos.forEach((p, i) => {
    out.push({ x: p[0], y: p[1], depth: 0.85, size: 7, lit: true, label: labels[i] });
  });
  return out;
})();

const LIT = LATTICE.filter((n) => n.lit);
// The gate node (where all lit paths converge) — shared screen point for the
// match into Act 3 (the verdict resolves here).
const GATE = { x: 1320, y: 560 };

export const GlassBox: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera flies in: a slow forward push.
  const fly = ramp(frame, 0, 120);
  const camScale = interpolate(fly, [0, 1], [0.7, 1.06]);

  // Concepts ignite as the particles strike (staggered).
  const igniteBase = 26;
  // Ghost path attempts the shortcut, then dissolves at the gate.
  const ghost = ramp(frame, 150, 220);
  const ghostDissolve = interpolate(frame, [232, 270], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Enforced path lights through the concepts.
  const enforced = ramp(frame, 250, 360);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${camScale})`,
          transformOrigin: `${CX}px ${CY}px`,
        }}
      >
        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
          {/* faint lattice scaffolding lines between near nodes */}
          {LATTICE.slice(0, 160).map((n, i) => {
            if (i % 3 !== 0) return null;
            const m = LATTICE[(i + 7) % 160];
            const o = (0.02 + n.depth * 0.05) * fly;
            return (
              <line
                key={`s${i}`}
                x1={n.x}
                y1={n.y}
                x2={m.x}
                y2={m.y}
                stroke="rgba(255,255,255,1)"
                strokeOpacity={o}
                strokeWidth={0.5}
              />
            );
          })}

          {/* Competitor ghost path: dotted shortcut straight to the gate */}
          <g opacity={ghostDissolve}>
            <line
              x1={520}
              y1={540}
              x2={GATE.x * (0.5 + 0.5 * ghost) + 520 * (0.5 - 0.5 * ghost)}
              y2={GATE.y * (0.5 + 0.5 * ghost) + 540 * (0.5 - 0.5 * ghost)}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={2}
              strokeDasharray="6 8"
            />
            {ghost > 0.9 && (
              <text
                x={760}
                y={510}
                fill="rgba(255,255,255,0.4)"
                fontSize={18}
                fontFamily={FONTS.mono}
              >
                shortcut
              </text>
            )}
          </g>

          {/* Enforced path: from each lit concept to the gate */}
          {LIT.map((n, i) => {
            const seg = interpolate(enforced, [i / LIT.length * 0.6, i / LIT.length * 0.6 + 0.5], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const ex = n.x + (GATE.x - n.x) * seg;
            const ey = n.y + (GATE.y - n.y) * seg;
            return (
              <line
                key={`e${i}`}
                x1={n.x}
                y1={n.y}
                x2={ex}
                y2={ey}
                stroke={COLORS.accent}
                strokeOpacity={0.5 * seg}
                strokeWidth={1.6}
                style={{ filter: `drop-shadow(0 0 6px ${COLORS.accent})` }}
              />
            );
          })}
        </svg>

        {/* faint lattice dots */}
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {LATTICE.filter((n) => !n.lit).map((n, i) => {
            const tw = 0.5 + 0.5 * Math.sin(frame * 0.04 + i);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: n.x,
                  top: n.y,
                  width: n.size,
                  height: n.size,
                  borderRadius: '50%',
                  transform: 'translate(-50%,-50%)',
                  background: 'rgba(255,255,255,1)',
                  opacity: (0.05 + n.depth * 0.16) * tw * fly,
                }}
              />
            );
          })}

          {/* Lit concept nodes igniting */}
          {LIT.map((n, i) => {
            const ig = interpolate(frame, [igniteBase + i * 8, igniteBase + i * 8 + 18], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const pulse = 0.7 + 0.3 * Math.sin(frame * 0.12 + i);
            return (
              <div
                key={`l${i}`}
                style={{
                  position: 'absolute',
                  left: n.x,
                  top: n.y,
                  transform: `translate(-50%,-50%) scale(${ig})`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  opacity: ig,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: COLORS.accentStrong,
                    boxShadow: `0 0 ${22 * pulse}px ${6 * pulse}px ${COLORS.accentSoft}`,
                  }}
                />
                {n.label && (
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 16,
                      color: COLORS.textSecondary,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {n.label}
                  </div>
                )}
              </div>
            );
          })}

          {/* The gate (convergence point) */}
          <div
            style={{
              position: 'absolute',
              left: GATE.x,
              top: GATE.y,
              transform: `translate(-50%,-50%) scale(${interpolate(enforced, [0.5, 1], [0.6, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })})`,
              width: 30,
              height: 30,
              borderRadius: '50%',
              border: `2px solid ${COLORS.borderTeal}`,
              background: COLORS.accentSoft,
              boxShadow: `0 0 50px -6px ${COLORS.accent}`,
              opacity: enforced,
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: ramp(frame, 30, 60),
          fontFamily: FONTS.mono,
          fontSize: 22,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: COLORS.accent,
        }}
      >
        MCB · concepts
      </div>

      <Hero text="Enforced, not bolted on." appearAt={262} bottom={180} />
    </AbsoluteFill>
  );
};
