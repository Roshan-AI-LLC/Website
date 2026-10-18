import { motion } from 'framer-motion';
import { CODES } from './story';
import { EASE, WARM, ink, mix, useTimeline, type VisualProps } from './ui';

/**
 * On-prem step: the whole pipeline (patient note, ShifaMind, codes) runs
 * inside the hospital's dashed walls. A signal travels note to model to codes
 * and never crosses the wall; the line out to someone else's cloud is cut.
 * Mirrors the problem section's "Rented AI, exported data" drawing.
 *
 * Phases: note, to model, model, to codes, codes (rest frame).
 */
const TIMES = [500, 650, 550, 650, 2600] as const;
const REST = TIMES.length - 1;

/** The same cloud outline as the problem section, drawn at its own scale. */
const CLOUD = 'M176 80 a12 12 0 0 1 0-24 a18 18 0 0 1 34-6 a14 14 0 0 1 18 14 a8 8 0 0 1 0 16 z';

const MID = 146;
/** Where the signal sits in each phase, and whether it shows. */
const PULSE = [
  { x: 118, o: 0 },
  { x: 160, o: 1 },
  { x: 205, o: 0 },
  { x: 284, o: 1 },
  { x: 284, o: 0 },
];
const NOTE_LINES = [32, 52, 44, 56, 36];
const GRID = [182, 205, 228];

export function OnPremVisual({ play, reduced }: VisualProps) {
  const { phase, instant } = useTimeline(TIMES, { play, reduced, rest: REST });
  const pulse = PULSE[phase];
  const modelOn = phase >= 2;
  const codesOn = phase >= 3;
  const fade = 'transition-[fill,stroke,opacity] duration-500';

  return (
    <svg viewBox="0 0 520 280" className="block h-auto w-full" aria-hidden focusable={false}>
      {/* Your walls. */}
      <rect x={8} y={14} width={352} height={252} rx={18} fill="none" strokeWidth={1.4} strokeDasharray="5 5" style={{ stroke: ink(30) }} />
      <text x={28} y={42} fontSize={10} letterSpacing={1.8} className="font-mono" style={{ fill: 'var(--text-muted)' }}>
        YOUR WALLS
      </text>

      {/* Patient note. */}
      <rect x={30} y={92} width={88} height={108} rx={10} style={{ fill: 'var(--bg-base)', stroke: 'var(--border-strong)' }} />
      {NOTE_LINES.map((w, i) => (
        <rect key={i} x={44} y={108 + i * 17} width={w} height={5} rx={2.5} style={{ fill: ink(i === 0 ? 28 : 14) }} />
      ))}
      <text x={74} y={222} textAnchor="middle" fontSize={9} letterSpacing={1.4} className="font-mono" style={{ fill: 'var(--text-muted)' }}>
        PATIENT NOTE
      </text>

      {/* Note to model, model to each code: all inside the walls. */}
      <g strokeWidth={1.2} style={{ stroke: ink(24) }}>
        <line x1={118} y1={MID} x2={160} y2={MID} />
        <line x1={250} y1={MID} x2={288} y2={126} />
        <line x1={250} y1={MID} x2={288} y2={166} />
      </g>

      {/* ShifaMind. */}
      <rect
        x={160}
        y={104}
        width={90}
        height={84}
        rx={14}
        strokeWidth={1.4}
        className={fade}
        style={{
          fill: modelOn ? mix('--accent', 12) : 'var(--bg-base)',
          stroke: modelOn ? 'var(--accent)' : 'var(--border-strong)',
        }}
      />
      {GRID.flatMap((x) =>
        [126, MID, 166].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={4} className={fade} style={{ fill: modelOn ? 'var(--accent)' : ink(22) }} />
        )),
      )}
      <text x={205} y={210} textAnchor="middle" fontSize={11.5} fontWeight={600} className="font-display" style={{ fill: 'var(--accent)' }}>
        ShifaMind
      </text>

      {/* Codes. */}
      {[
        { code: CODES.i5023.code, y: 112 },
        { code: CODES.j918.code, y: 152 },
      ].map((c) => (
        <g key={c.code}>
          <rect
            x={288}
            y={c.y}
            width={60}
            height={28}
            rx={7}
            className={fade}
            style={{
              fill: codesOn ? 'var(--accent-soft)' : 'transparent',
              stroke: codesOn ? mix('--accent', 50) : 'var(--border-subtle)',
            }}
          />
          <text
            x={318}
            y={c.y + 18}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            className={`font-mono ${fade}`}
            style={{ fill: codesOn ? 'var(--text-primary)' : 'var(--text-muted)' }}
          >
            {c.code}
          </text>
        </g>
      ))}

      {/* The signal. */}
      <motion.circle
        cy={MID}
        r={4.5}
        style={{ fill: 'var(--accent)' }}
        initial={false}
        animate={{ cx: pulse.x, opacity: pulse.o }}
        transition={{ duration: instant ? 0 : 0.55, ease: EASE }}
      />

      {/* Outside: someone else's cloud, and the line to it cut at the wall. */}
      <line x1={360} y1={MID} x2={414} y2={MID} strokeWidth={1.2} strokeDasharray="3 4" style={{ stroke: ink(18) }} />
      <g transform={`translate(386 ${MID})`}>
        <circle r={10} style={{ fill: 'var(--bg-elev)', stroke: WARM }} strokeWidth={1.4} />
        <path d="M-4 -4 L4 4 M4 -4 L-4 4" strokeWidth={1.8} strokeLinecap="round" style={{ stroke: WARM }} />
      </g>
      <g transform="translate(252 90)" opacity={0.55}>
        <path d={CLOUD} strokeWidth={1.2} style={{ fill: 'var(--bg-elev)', stroke: 'var(--border-strong)' }} />
      </g>
      <text x={452} y={196} textAnchor="middle" fontSize={9} letterSpacing={1.4} className="font-mono" style={{ fill: 'var(--text-muted)' }}>
        THEIR CLOUD
      </text>
    </svg>
  );
}
