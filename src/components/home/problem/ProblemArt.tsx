import { motion, type Transition } from 'framer-motion';
import { useId, type ComponentType } from 'react';

/**
 * The problem illustrations, each in two sizes: `card` (260x130, the
 * md+ cards) and `mini` (64x64, the compact rows below md). Tokens only, so both themes
 * work. While `play` is off (offscreen, reduced motion, SSR) each holds its
 * rest frame, which already tells the story on its own.
 */
export type ArtProps = { variant: 'card' | 'mini'; play: boolean };

const STILL: Transition = { duration: 0 };
const loop = (duration: number, times: number[]): Transition => ({
  duration,
  times,
  repeat: Infinity,
  ease: 'easeInOut',
});

const ink = (pct: number) => `color-mix(in oklab, var(--text-primary) ${pct}%, transparent)`;
const tone = (token: string, pct: number) => `color-mix(in oklab, var(${token}) ${pct}%, transparent)`;

const svgProps = { 'aria-hidden': true, focusable: false } as const;
const CARD_CLASS = 'h-full w-full max-w-[260px]';
const MINI_CLASS = 'h-14 w-14';

/* ── Highlights aren't explanations ───────────────────────────────────────
   A heat blob (where the model "looked") drifts over the words; the word
   that actually mattered, outlined, is never touched by it. */

type Word = [x: number, y: number, w: number];

const CARD_WORDS: Word[] = [
  [20, 18, 38], [64, 18, 26], [96, 18, 48], [150, 18, 30], [186, 18, 54],
  [20, 38, 30], [56, 38, 54], [116, 38, 22], [144, 38, 40], [190, 38, 50],
  [20, 58, 44], [70, 58, 28], [104, 58, 36], [146, 58, 50], [202, 58, 38],
  [20, 78, 48], [74, 78, 24], [162, 78, 30], [198, 78, 42],
];
const CARD_KEY: Word = [104, 78, 52];
/** Blob centres; every point keeps the blob clear of CARD_KEY. */
const CARD_PATH = { x: [64, 140, 206, 224, 150, 78, 64], y: [30, 24, 44, 66, 40, 48, 30] };

const MINI_WORDS: Word[] = [
  [8, 12, 18], [30, 12, 26],
  [8, 22, 28], [40, 22, 16],
  [8, 32, 14], [44, 32, 12],
  [8, 42, 22], [34, 42, 22],
  [8, 52, 30], [42, 52, 14],
];
const MINI_KEY: Word = [25, 32, 16];
/** Circles the key word via the left and right edges, never across it. */
const MINI_PATH = { x: [18, 46, 58, 48, 18, 8, 18], y: [15, 15, 30, 50, 50, 30, 15] };

function HighlightsArt({ variant, play }: ArtProps) {
  const id = `heat${useId().replace(/:/g, '')}`;
  const mini = variant === 'mini';
  const words = mini ? MINI_WORDS : CARD_WORDS;
  const [kx, ky, kw] = mini ? MINI_KEY : CARD_KEY;
  const path = mini ? MINI_PATH : CARD_PATH;
  const h = mini ? 4 : 7;

  const gradient = (
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" style={{ stopColor: 'var(--accent-warm)', stopOpacity: 0.5 }} />
        <stop offset="60%" style={{ stopColor: 'var(--accent-warm)', stopOpacity: 0.18 }} />
        <stop offset="100%" style={{ stopColor: 'var(--accent-warm)', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );

  // The blob sits at its first point and moves by offsets from there, so the
  // prerendered markup (no transforms until framer measures) already shows
  // the rest frame.
  const [x0, y0] = [path.x[0], path.y[0]];
  const blob = (
    <motion.g
      initial={false}
      animate={play ? { x: path.x.map((v) => v - x0), y: path.y.map((v) => v - y0) } : { x: 0, y: 0 }}
      transition={play ? { duration: mini ? 7 : 9, repeat: Infinity, ease: 'easeInOut' } : STILL}
    >
      <ellipse cx={x0} cy={y0} rx={mini ? 11 : 40} ry={mini ? 6 : 20} fill={`url(#${id})`} />
    </motion.g>
  );

  const pad = mini ? 3 : 5;
  const keyWord = (
    <>
      <rect x={kx} y={ky} width={kw} height={h} rx={h / 2} style={{ fill: ink(24) }} />
      <rect
        x={kx - pad}
        y={ky - pad}
        width={kw + pad * 2}
        height={h + pad * 2}
        rx={mini ? 3 : 5}
        fill="none"
        strokeWidth={mini ? 1 : 1.2}
        strokeDasharray={mini ? '2 1.6' : '3 2.5'}
        style={{ stroke: 'var(--accent)' }}
      />
    </>
  );

  return (
    <svg viewBox={mini ? '0 0 64 64' : '0 0 260 130'} className={mini ? MINI_CLASS : CARD_CLASS} {...svgProps}>
      {gradient}
      {words.map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={h / 2} style={{ fill: ink(14) }} />
      ))}
      {keyWord}
      {blob}
      {!mini && (
        <g className="font-mono" fontSize={9.5} letterSpacing={0.3}>
          <circle cx={24} cy={110} r={5} fill={`url(#${id})`} />
          <circle cx={24} cy={110} r={2} style={{ fill: 'var(--accent-warm)' }} />
          <text x={33} y={113} style={{ fill: 'var(--text-muted)' }}>
            attention
          </text>
          <rect x={186} y={105} width={10} height={10} rx={2} fill="none" strokeWidth={1.1} strokeDasharray="2.4 1.8" style={{ stroke: 'var(--accent)' }} />
          <text x={202} y={113} style={{ fill: 'var(--accent)' }}>
            used
          </text>
        </g>
      )}
    </svg>
  );
}

/* ── Audits need a paper trail ────────────────────────────────────────────
   A claim with a code and an empty reason line (a caret waiting) gets
   stamped DENIED. */

function AuditsArt({ variant, play }: ArtProps) {
  const T = 5.8;
  const card = {
    animate: play
      ? { y: [6, 0, 0, 1.5, 0, 0, 0], opacity: [0, 1, 1, 1, 1, 1, 0] }
      : { y: 0, opacity: 1 },
    transition: play ? loop(T, [0, 0.1, 0.36, 0.385, 0.42, 0.92, 1]) : STILL,
  };
  const stamp = {
    animate: play
      ? { scale: [1.9, 1.9, 1, 1, 1], opacity: [0, 0, 1, 1, 0] }
      : { scale: 1, opacity: 1 },
    transition: play ? loop(T, [0, 0.32, 0.37, 0.92, 1]) : STILL,
  };
  const caret = {
    animate: play ? { opacity: [0, 0, 1, 0, 1, 0, 1, 0, 0] } : { opacity: 0 },
    transition: play ? loop(T, [0, 0.1, 0.14, 0.2, 0.26, 0.32, 0.36, 0.38, 1]) : STILL,
  };

  if (variant === 'mini') {
    return (
      <svg viewBox="0 0 64 64" className={MINI_CLASS} {...svgProps}>
        <motion.g initial={false} {...card}>
          <rect x={11} y={6} width={42} height={52} rx={5} style={{ fill: 'var(--bg-elev)', stroke: 'var(--border-strong)' }} />
          <rect x={17} y={13} width={16} height={3.5} rx={1.75} style={{ fill: ink(26) }} />
          <rect x={17} y={22} width={30} height={3.5} rx={1.75} style={{ fill: ink(14) }} />
          <line x1={17} y1={32} x2={47} y2={32} strokeWidth={1} strokeDasharray="2 2" style={{ stroke: ink(32) }} />
        </motion.g>
        <g transform="translate(32 45) rotate(-12)">
          <motion.g initial={false} {...stamp}>
            <rect x={-24} y={-8} width={48} height={16} rx={3} strokeWidth={1.4} style={{ fill: tone('--accent-warm', 10), stroke: 'var(--accent-warm)' }} />
            <text x={0} y={3.1} textAnchor="middle" fontSize={8.5} fontWeight={700} letterSpacing={0.9} className="font-mono" style={{ fill: 'var(--accent-warm)' }}>
              DENIED
            </text>
          </motion.g>
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 260 130" className={CARD_CLASS} {...svgProps}>
      <motion.g initial={false} {...card}>
        <rect x={56} y={12} width={148} height={106} rx={10} style={{ fill: 'var(--bg-elev)', stroke: 'var(--border-strong)' }} />
        <text x={70} y={31} fontSize={9} letterSpacing={1.6} className="font-mono" style={{ fill: 'var(--text-muted)' }}>
          CLAIM
        </text>
        <line x1={56} y1={40} x2={204} y2={40} style={{ stroke: 'var(--border-subtle)' }} />
        <text x={70} y={60} fontSize={10.5} style={{ fill: 'var(--text-muted)' }}>
          Code
        </text>
        <text x={190} y={60} textAnchor="end" fontSize={11.5} fontWeight={600} className="font-mono" style={{ fill: 'var(--text-primary)' }}>
          I50.23
        </text>
        <text x={70} y={84} fontSize={10.5} style={{ fill: 'var(--text-muted)' }}>
          Reason
        </text>
        <line x1={112} y1={85} x2={190} y2={85} strokeWidth={1} strokeDasharray="2 3" style={{ stroke: ink(32) }} />
        <motion.rect x={113} y={75} width={1.5} height={10} style={{ fill: 'var(--accent)' }} initial={false} {...caret} />
      </motion.g>
      <g transform="translate(158 104) rotate(-9)">
        <motion.g initial={false} {...stamp}>
          <rect x={-42} y={-14} width={84} height={28} rx={5} strokeWidth={2} style={{ fill: tone('--accent-warm', 10), stroke: 'var(--accent-warm)' }} />
          <text x={0} y={4.6} textAnchor="middle" fontSize={13} fontWeight={700} letterSpacing={2.4} className="font-mono" style={{ fill: 'var(--accent-warm)' }}>
            DENIED
          </text>
        </motion.g>
      </g>
    </svg>
  );
}

/* ── Patient data leaves the building ─────────────────────────────────────
   A copy of the patient note slips out of the note, crosses the hospital's
   dashed wall (which flashes coral as it is breached) and disappears into
   someone else's cloud. The rest frame holds the copy just outside the wall. */

/** One cloud outline, drawn at card scale; the mini reuses it scaled down. */
const CLOUD = 'M176 80 a12 12 0 0 1 0-24 a18 18 0 0 1 34-6 a14 14 0 0 1 18 14 a8 8 0 0 1 0 16 z';

function CloudArt({ variant, play }: ArtProps) {
  const T = 5.6;
  const mini = variant === 'mini';
  // Positions along the path: inside the note, at the wall, inside the cloud.
  // The copy is drawn at its rest point and moves by offsets from there, so the
  // prerendered markup already shows the rest frame.
  const g = mini
    ? { rest: 40, start: 17, wall: 30, cloud: 49, y: 31, w: 7, h: 9 }
    : { rest: 128, start: 62, wall: 110, cloud: 198, y: 65, w: 18, h: 22 };
  const sheet = {
    animate: play
      ? {
          x: [g.start, g.start, g.wall, g.cloud, g.cloud, g.start].map((v) => v - g.rest),
          opacity: [0, 1, 1, 1, 0, 0],
          scale: [1, 1, 1, 0.7, 0.55, 1],
        }
      : { x: 0, opacity: 1, scale: 1 },
    transition: play ? loop(T, [0, 0.12, 0.42, 0.76, 0.84, 1]) : STILL,
  };
  const breach = {
    animate: play ? { opacity: [0, 0, 1, 0, 0] } : { opacity: 0.9 },
    transition: play ? loop(T, [0, 0.36, 0.43, 0.62, 1]) : STILL,
  };
  const landed = {
    animate: play ? { opacity: [0, 0, 1, 0, 0] } : { opacity: 0.6 },
    transition: play ? loop(T, [0, 0.72, 0.8, 0.95, 1]) : STILL,
  };

  if (mini) {
    return (
      <svg viewBox="0 0 64 64" className={MINI_CLASS} {...svgProps}>
        <rect x={4} y={12} width={26} height={40} rx={5} fill="none" strokeWidth={1} strokeDasharray="2.5 2.5" style={{ stroke: ink(34) }} />
        <rect x={9} y={20} width={16} height={22} rx={3} style={{ fill: 'var(--bg-elev)', stroke: 'var(--border-strong)' }} />
        {[25, 29, 33, 37].map((y, i) => (
          <rect key={y} x={12} y={y} width={i === 0 ? 7 : 10} height={2} rx={1} style={{ fill: ink(i === 0 ? 26 : 14) }} />
        ))}
        <motion.line x1={30} y1={25} x2={30} y2={37} strokeWidth={1.6} style={{ stroke: 'var(--accent-warm)' }} initial={false} {...breach} />
        <g transform="translate(35 22) scale(0.38) translate(-164 -38)">
          <path d={CLOUD} strokeWidth={2.6} style={{ fill: 'var(--bg-elev)', stroke: 'var(--border-strong)' }} />
          <motion.path d={CLOUD} style={{ fill: tone('--accent-warm', 22) }} initial={false} {...landed} />
        </g>
        <motion.g initial={false} {...sheet}>
          <rect x={g.rest - g.w / 2} y={g.y - g.h / 2} width={g.w} height={g.h} rx={1.5} style={{ fill: 'var(--bg-elev)', stroke: 'var(--accent-warm)' }} />
        </motion.g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 260 130" className={CARD_CLASS} {...svgProps}>
      <rect x={16} y={12} width={94} height={106} rx={10} fill="none" strokeWidth={1.1} strokeDasharray="3 3" style={{ stroke: ink(30) }} />
      <text x={26} y={28} fontSize={8} letterSpacing={1.4} className="font-mono" style={{ fill: 'var(--text-muted)' }}>
        YOUR WALLS
      </text>
      <rect x={34} y={36} width={56} height={66} rx={6} style={{ fill: 'var(--bg-elev)', stroke: 'var(--border-strong)' }} />
      {[48, 58, 68, 78, 88].map((y, i) => (
        <rect key={y} x={42} y={y} width={i === 0 ? 22 : [38, 30, 36, 24][i - 1]} height={4} rx={2} style={{ fill: ink(i === 0 ? 26 : 13) }} />
      ))}
      <line x1={92} y1={65} x2={166} y2={65} strokeWidth={1.1} strokeDasharray="2 3" style={{ stroke: ink(26) }} />
      <motion.line x1={110} y1={52} x2={110} y2={78} strokeWidth={2} strokeLinecap="round" style={{ stroke: 'var(--accent-warm)' }} initial={false} {...breach} />
      <path d={CLOUD} strokeWidth={1.2} style={{ fill: 'var(--bg-elev)', stroke: 'var(--border-strong)' }} />
      <motion.path d={CLOUD} style={{ fill: tone('--accent-warm', 16) }} initial={false} {...landed} />
      <text x={200} y={98} textAnchor="middle" fontSize={8} letterSpacing={1.4} className="font-mono" style={{ fill: 'var(--text-muted)' }}>
        THEIR CLOUD
      </text>
      <motion.g initial={false} {...sheet}>
        <rect x={g.rest - g.w / 2} y={g.y - g.h / 2} width={g.w} height={g.h} rx={3} style={{ fill: 'var(--bg-elev)', stroke: 'var(--accent-warm)' }} />
        <rect x={g.rest - 5} y={g.y - 5} width={10} height={2.4} rx={1.2} style={{ fill: tone('--accent-warm', 60) }} />
        <rect x={g.rest - 5} y={g.y + 0.5} width={7} height={2.4} rx={1.2} style={{ fill: tone('--accent-warm', 40) }} />
      </motion.g>
    </svg>
  );
}

export const PROBLEM_ART: Record<'cloud' | 'highlights' | 'audits', ComponentType<ArtProps>> = {
  cloud: CloudArt,
  highlights: HighlightsArt,
  audits: AuditsArt,
};
