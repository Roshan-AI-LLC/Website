/**
 * Hero illustration: note tokens pass through hidden layers into named
 * keywords, and only those keywords connect to ICD-10 codes. Keywords wire
 * straight to codes with no layer in between, because each code score is an
 * exact sum of keyword contributions.
 *
 * Two layouts of the same diagram: the wide one from lg up, a compact one
 * with a single hidden layer below that, so the labels stay legible when the
 * card is narrow. Values are illustrative.
 */

const CONCEPTS = [
  { name: 'orthopnea', score: '0.93' },
  { name: 'pleural effusion', score: '0.92' },
  { name: 'leg edema', score: '0.91' },
  { name: 'BNP elevation', score: '0.90' },
  { name: 'dyspnea', score: '0.87' },
];

const CODES = [
  { code: 'I50.23', score: '0.94', active: true },
  { code: 'J91.8', score: '0.81', active: true },
  { code: 'I50.22', score: '0.31', active: false },
];

type Layout = {
  width: number;
  notesX: number;
  hiddenX: number[];
  pillX: number;
  pillW: number;
  codeX: number;
};

const WIDE: Layout = { width: 446, notesX: 28, hiddenX: [76, 124], pillX: 162, pillW: 146, codeX: 358 };
const COMPACT: Layout = { width: 366, notesX: 26, hiddenX: [64], pillX: 100, pillW: 144, codeX: 280 };

const HEIGHT = 238;
const LABEL_Y = 230;
const R = 8.5;
const PILL_H = 26;
const ROWS = [30, 70, 110, 150, 190];
const NOTE_ROWS = [50, 90, 130, 170];
const CODE_ROWS = [62, 110, 158];

const EDGE = { stroke: 'var(--text-primary)', strokeOpacity: 0.13, strokeWidth: 0.6 };

export function ConceptNetwork() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-full opacity-40 blur-3xl sm:-inset-10 sm:opacity-50"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 20%, transparent), transparent 68%)',
        }}
      />

      <div className="glass relative overflow-hidden rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-accent">
            ShifaMind
          </span>
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-muted">
            Illustrative
          </span>
        </div>

        <div className="mt-4 sm:mt-5">
          <div className="lg:hidden">
            <Diagram layout={COMPACT} />
          </div>
          <div className="hidden lg:block">
            <Diagram layout={WIDE} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Diagram({ layout }: { layout: Layout }) {
  const { width, notesX, hiddenX, pillX, pillW, codeX } = layout;
  const pillEnd = pillX + pillW;
  const lastHidden = hiddenX[hiddenX.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      className="block h-auto w-full"
      role="img"
      aria-label="Note tokens pass through hidden layers into named keywords such as orthopnea and pleural effusion. Only those keywords connect to the ICD-10 codes I50.23, J91.8 and I50.22."
    >
      {/* Dense edges: notes into hidden layers, hidden layers into keywords. */}
      <g style={EDGE}>
        {NOTE_ROWS.flatMap((y1) =>
          ROWS.map((y2) => (
            <line key={`n${y1}-${y2}`} x1={notesX} y1={y1} x2={hiddenX[0]} y2={y2} />
          )),
        )}
        {hiddenX.slice(1).flatMap((x, i) =>
          ROWS.flatMap((y1) =>
            ROWS.map((y2) => (
              <line key={`h${i}-${y1}-${y2}`} x1={hiddenX[i]} y1={y1} x2={x} y2={y2} />
            )),
          ),
        )}
        {ROWS.flatMap((y1) =>
          ROWS.map((y2) => (
            <line key={`p${y1}-${y2}`} x1={lastHidden} y1={y1} x2={pillX} y2={y2} />
          )),
        )}
      </g>

      {/* Keywords to codes: the only path to an output. */}
      <g>
        {ROWS.flatMap((y1) =>
          CODES.map((c, i) => (
            <line
              key={`c${y1}-${c.code}`}
              x1={pillEnd}
              y1={y1}
              x2={codeX}
              y2={CODE_ROWS[i]}
              className={c.active ? 'nn-flow' : undefined}
              style={{
                stroke: c.active ? 'var(--accent)' : 'var(--text-primary)',
                strokeOpacity: c.active ? 0.5 : 0.12,
                strokeWidth: 0.7,
              }}
            />
          )),
        )}
      </g>

      {/* Input arrows. */}
      {NOTE_ROWS.map((y) => {
        const tip = notesX - R - 3;
        return (
          <g key={`a${y}`} style={{ fill: 'var(--text-muted)', stroke: 'var(--text-muted)' }}>
            <line x1={tip - 14} y1={y} x2={tip - 4} y2={y} strokeWidth={1} />
            <path d={`M${tip} ${y} l-5 -3 v6 z`} stroke="none" />
          </g>
        );
      })}

      {NOTE_ROWS.map((y) => (
        <circle
          key={`nn${y}`}
          cx={notesX}
          cy={y}
          r={R}
          style={{ fill: 'color-mix(in oklab, var(--text-primary) 55%, transparent)' }}
        />
      ))}

      {hiddenX.flatMap((x) =>
        ROWS.map((y) => (
          <circle key={`hn${x}-${y}`} cx={x} cy={y} r={R} style={{ fill: 'var(--color-violet-600)' }} />
        )),
      )}

      {CONCEPTS.map((c, i) => {
        const y = ROWS[i];
        return (
          <g key={c.name}>
            <rect
              x={pillX}
              y={y - PILL_H / 2}
              width={pillW}
              height={PILL_H}
              rx={PILL_H / 2}
              style={{
                fill: 'color-mix(in oklab, var(--accent) 16%, var(--bg-elev))',
                stroke: 'var(--accent)',
                strokeOpacity: 0.75,
                strokeWidth: 1,
              }}
            />
            <text
              x={pillX + 11}
              y={y}
              dominantBaseline="central"
              fontSize={11}
              fontWeight={500}
              style={{ fill: 'var(--text-primary)' }}
            >
              {c.name}
            </text>
            <text
              x={pillEnd - 11}
              y={y}
              dominantBaseline="central"
              textAnchor="end"
              fontSize={10.5}
              className="font-mono"
              style={{ fill: 'var(--accent)' }}
            >
              {c.score}
            </text>
          </g>
        );
      })}

      {CODES.map((c, i) => {
        const y = CODE_ROWS[i];
        return (
          <g key={c.code}>
            <circle
              cx={codeX}
              cy={y}
              r={R + 1}
              style={{ fill: c.active ? 'var(--accent)' : 'var(--color-violet-400)' }}
            />
            <text
              x={codeX + R + 7}
              y={y}
              dominantBaseline="central"
              fontSize={10.5}
              fontWeight={c.active ? 600 : 400}
              className="font-mono"
              style={{ fill: c.active ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {c.code}
              <tspan dx={5}>{c.score}</tspan>
            </text>
          </g>
        );
      })}

      <g fontSize={8.5} fontWeight={600} letterSpacing={1.4} textAnchor="middle">
        <text x={notesX} y={LABEL_Y} style={{ fill: 'var(--text-muted)' }}>
          NOTES
        </text>
        {/* The compact layout has no room for this label beside NOTES. */}
        {hiddenX.length > 1 && (
          <text
            x={(hiddenX[0] + lastHidden) / 2}
            y={LABEL_Y}
            fontWeight={400}
            letterSpacing={1}
            style={{ fill: 'var(--text-muted)', opacity: 0.8 }}
          >
            hidden layers
          </text>
        )}
        <text x={pillX + pillW / 2} y={LABEL_Y} style={{ fill: 'var(--accent)' }}>
          KEYWORDS
        </text>
        <text x={(codeX + width) / 2 - 2} y={LABEL_Y} style={{ fill: 'var(--accent)' }}>
          ICD CODES
        </text>
      </g>
    </svg>
  );
}
