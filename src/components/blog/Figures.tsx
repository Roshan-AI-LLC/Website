import type { ReactNode } from 'react';
import type { BlogFigure } from '../../data/blog';
import { LEADERBOARD, type LeaderboardEntry } from '../../data/codingLeaderboard';
import { linear, log10Scale, parseParams, placeLabels, ticks, type LabelIn } from './chartKit';
import { ConceptReceipt } from './ConceptReceipt';
import { FigureShell, INK, SrTable, Swatch } from './FigureShell';

/**
 * The blog's data figures, drawn as inline SVG from codingLeaderboard.ts.
 * Theme tokens only (CSS variables), so they follow light and dark mode.
 */

const pct = (v: number) => v.toFixed(1);

type Margins = { l: number; r: number; t: number; b: number };
type Layout = { W: number; H: number; m: Margins; font: number; r: number };

function Svg({ W, H, children }: { W: number; H: number; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      aria-hidden="true"
      focusable="false"
      className="block h-auto w-full"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {children}
    </svg>
  );
}

/** Horizontal gridlines with y tick labels, vertical gridlines with x tick labels. */
function Grid({
  L,
  xTicks,
  yTicks,
  xs,
  ys,
  xFmt = (v) => String(v),
  yFmt = (v) => String(v),
}: {
  L: Layout;
  xTicks: number[];
  yTicks: number[];
  xs: (v: number) => number;
  ys: (v: number) => number;
  xFmt?: (v: number) => string;
  yFmt?: (v: number) => string;
}) {
  const { W, H, m, font } = L;
  return (
    <g>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={m.l} x2={W - m.r} y1={ys(v)} y2={ys(v)} style={{ stroke: INK.grid }} strokeWidth={1} />
          <text x={m.l - 6} y={ys(v) + font * 0.35} textAnchor="end" fontSize={font - 1} style={{ fill: INK.tick }}>
            {yFmt(v)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xs(v)} x2={xs(v)} y1={m.t} y2={H - m.b} style={{ stroke: INK.grid }} strokeWidth={1} />
          <text x={xs(v)} y={H - m.b + font + 3} textAnchor="middle" fontSize={font - 1} style={{ fill: INK.tick }}>
            {xFmt(v)}
          </text>
        </g>
      ))}
      <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} style={{ stroke: INK.axis }} strokeWidth={1} />
    </g>
  );
}

type Point = { id: string; x: number; y: number; label: string; ours: boolean; title: string };

/** Points with placed labels; ShifaMind drawn last and in the accent. */
function LabelledPoints({ L, points }: { L: Layout; points: Point[] }) {
  const { W, H, m, font, r } = L;
  const rOf = (p: Point) => (p.ours ? r + 1.5 : r);
  // ShifaMind first so it gets the best spot, then the most crowded points.
  const crowd = (p: Point) => points.filter((q) => Math.hypot(q.x - p.x, q.y - p.y) < 48).length;
  const order = [...points].sort((a, b) => Number(b.ours) - Number(a.ours) || crowd(b) - crowd(a) || a.x - b.x);
  const items: LabelIn[] = order.map((p) => ({
    id: p.id,
    x: p.x,
    y: p.y,
    r: rOf(p),
    text: p.label,
    size: font,
    bold: p.ours,
  }));
  const { labels } = placeLabels(items, { x0: m.l + 2, y0: m.t - 2, x1: W - 2, y1: H - m.b - 2 });
  const byId = new Map(labels.map((l) => [l.id, l]));
  const drawOrder = [...points].sort((a, b) => Number(a.ours) - Number(b.ours));

  return (
    <g>
      {drawOrder.map((p) => {
        const l = byId.get(p.id)!;
        return l.leader ? (
          <line
            key={`ld-${p.id}`}
            x1={l.leader.x1}
            y1={l.leader.y1}
            x2={l.leader.x2}
            y2={l.leader.y2}
            style={{ stroke: p.ours ? INK.accent : INK.tick }}
            strokeWidth={1}
            opacity={0.85}
          />
        ) : null;
      })}
      {drawOrder.map((p) => (
        <circle
          key={`pt-${p.id}`}
          cx={p.x}
          cy={p.y}
          r={rOf(p)}
          style={{ fill: p.ours ? INK.accent : INK.neutral, stroke: INK.ring }}
          strokeWidth={2}
        >
          <title>{p.title}</title>
        </circle>
      ))}
      {drawOrder.map((p) => {
        const l = byId.get(p.id)!;
        return (
          <text
            key={`lb-${p.id}`}
            x={l.x}
            y={l.y}
            textAnchor={l.anchor}
            fontSize={font}
            fontWeight={p.ours ? 600 : 400}
            style={{ fill: p.ours ? INK.accent : INK.label }}
          >
            {p.label}
          </text>
        );
      })}
    </g>
  );
}

function AxisTitles({ L, x, y }: { L: Layout; x: string; y: string }) {
  const { W, H, m, font } = L;
  return (
    <g fontSize={font - 1} style={{ fill: INK.tick }}>
      <text x={2} y={font} textAnchor="start" fontWeight={500}>
        {y}
      </text>
      <text x={W - m.r} y={H - 3} textAnchor="end" fontWeight={500}>
        {x}
      </text>
    </g>
  );
}

/* ── Micro-F1 vs macro-F1 ───────────────────────────────────────────────── */

const SCATTER_WIDE: Layout = { W: 720, H: 460, m: { l: 36, r: 10, t: 26, b: 36 }, font: 12, r: 5 };
const SCATTER_PHONE: Layout = { W: 340, H: 380, m: { l: 26, r: 4, t: 22, b: 32 }, font: 10, r: 4 };

const scatterRows = () => LEADERBOARD.filter((r): r is LeaderboardEntry & { macroF1: number } => r.macroF1 !== null);

/** Leaderboard rank (best micro-F1 first), the number phones show beside each point. */
const rankOf = (model: string) => [...LEADERBOARD].sort((a, b) => b.microF1 - a.microF1).findIndex((r) => r.model === model) + 1;

/**
 * Phones label each point with its leaderboard rank and list the names in a
 * key below; at phone width ten names in the top-right cluster cannot all sit
 * beside their points.
 */
function ScatterSvg({ L, numbered = false }: { L: Layout; numbered?: boolean }) {
  const rows = scatterRows();
  const xMin = Math.floor(Math.min(...rows.map((r) => r.microF1))) - 1;
  const xMax = Math.ceil(Math.max(...rows.map((r) => r.microF1))) + 2;
  const yMin = Math.floor((Math.min(...rows.map((r) => r.macroF1)) - 2) / 5) * 5;
  const yMax = Math.ceil((Math.max(...rows.map((r) => r.macroF1)) + 2) / 5) * 5;
  const { W, H, m } = L;
  const xs = linear(xMin, xMax, m.l, W - m.r);
  const ys = linear(yMin, yMax, H - m.b, m.t);
  const points: Point[] = rows.map((r) => ({
    id: r.model,
    x: xs(r.microF1),
    y: ys(r.macroF1),
    label: numbered ? String(rankOf(r.model)) : r.model,
    ours: !!r.ours,
    title: `${r.model}: micro-F1 ${pct(r.microF1)}, macro-F1 ${pct(r.macroF1)}`,
  }));
  return (
    <Svg W={W} H={H}>
      <Grid L={L} xTicks={ticks(xMin, xMax, 2)} yTicks={ticks(yMin, yMax, 5)} xs={xs} ys={ys} />
      <AxisTitles L={L} x="Micro-F1 (%) →" y="↑ Macro-F1 (%)" />
      <LabelledPoints L={L} points={points} />
    </Svg>
  );
}

function MicroMacroScatter({ lead, caption }: { lead?: string; caption: ReactNode }) {
  const rows = scatterRows();
  return (
    <FigureShell
      lead={lead}
      caption={caption}
      legend={
        <>
          <Swatch fill={INK.accent} label="ShifaMind" />
          <Swatch fill={INK.neutral} label="Other published models" />
        </>
      }
      phone={
        <>
          <ScatterSvg L={SCATTER_PHONE} numbered />
          <ol aria-hidden className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[0.68rem] leading-snug text-secondary">
            {[...rows]
              .sort((a, b) => rankOf(a.model) - rankOf(b.model))
              .map((r) => (
                <li key={r.model} className={`flex gap-1.5 ${r.ours ? 'font-semibold text-accent' : ''}`}>
                  <span className="w-4 shrink-0 text-right tabular-nums text-muted">{rankOf(r.model)}</span>
                  <span className="min-w-0 truncate">{r.model}</span>
                </li>
              ))}
          </ol>
        </>
      }
      wide={<ScatterSvg L={SCATTER_WIDE} />}
      alt={
        <SrTable
          caption="Micro-F1 and macro-F1 for each model, percent"
          head={['Model', 'Micro-F1', 'Macro-F1']}
          rows={rows.map((r) => [r.model, pct(r.microF1), pct(r.macroF1)])}
        />
      }
    />
  );
}

/* ── Micro-F1 bars ──────────────────────────────────────────────────────── */

type BarLayout = { W: number; rowH: number; barH: number; labelW: number; top: number; bottom: number; valueW: number; font: number };
const BARS_WIDE: BarLayout = { W: 720, rowH: 25, barH: 15, labelW: 156, top: 26, bottom: 28, valueW: 44, font: 12 };
const BARS_PHONE: BarLayout = { W: 340, rowH: 21, barH: 12, labelW: 104, top: 22, bottom: 24, valueW: 32, font: 10 };

const barRows = () => [...LEADERBOARD].sort((a, b) => b.microF1 - a.microF1);

/** Truncated axis start: below the lowest score, on a multiple of 5 (45 for the current data). */
const barAxisStart = () => Math.floor((Math.min(...LEADERBOARD.map((r) => r.microF1)) - 1) / 5) * 5;

function BarsSvg({ L }: { L: BarLayout }) {
  const rows = barRows();
  const d0 = barAxisStart();
  const d1 = Math.ceil(Math.max(...rows.map((r) => r.microF1)) + 1);
  const x0 = L.labelW + 8;
  const xs = linear(d0, d1, x0, L.W - L.valueW);
  const H = L.top + rows.length * L.rowH + L.bottom;
  const base = H - L.bottom;
  const f = L.font;
  return (
    <Svg W={L.W} H={H}>
      <text x={x0} y={f} fontSize={f - 1} fontWeight={500} style={{ fill: INK.tick }}>
        Micro-F1 (%) · axis starts at {d0}, not 0
      </text>
      {ticks(d0, d1, 5).map((v) => (
        <g key={v}>
          <line x1={xs(v)} x2={xs(v)} y1={L.top - 4} y2={base} style={{ stroke: INK.grid }} strokeWidth={1} />
          <text x={xs(v)} y={base + f + 3} textAnchor="middle" fontSize={f - 1} style={{ fill: INK.tick }}>
            {v}
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = L.top + i * L.rowH;
        const cy = y + L.rowH / 2;
        const w = Math.max(1, xs(r.microF1) - x0);
        return (
          <g key={r.model}>
            <text
              x={L.labelW}
              y={cy + f * 0.35}
              textAnchor="end"
              fontSize={f}
              fontWeight={r.ours ? 600 : 400}
              style={{ fill: r.ours ? INK.accent : INK.label }}
            >
              {r.model}
            </text>
            <rect
              x={x0}
              y={cy - L.barH / 2}
              width={w}
              height={L.barH}
              rx={3}
              style={{ fill: r.ours ? INK.accent : INK.neutralBar }}
            >
              <title>{`${r.model}: micro-F1 ${pct(r.microF1)}`}</title>
            </rect>
            <text
              x={x0 + w + 5}
              y={cy + f * 0.35}
              fontSize={f}
              fontWeight={r.ours ? 600 : 500}
              style={{ fill: r.ours ? INK.accent : INK.label }}
            >
              {pct(r.microF1)}
            </text>
          </g>
        );
      })}
      {/* Axis line with a break mark at its start: the bars do not start at 0. */}
      <line x1={x0} x2={L.W - L.valueW} y1={base} y2={base} style={{ stroke: INK.axis }} strokeWidth={1} />
      <g style={{ stroke: INK.tick }} strokeWidth={1.2} strokeLinecap="round">
        <line x1={x0 - 6} y1={base + 4} x2={x0 - 1} y2={base - 4} />
        <line x1={x0 - 2} y1={base + 4} x2={x0 + 3} y2={base - 4} />
      </g>
    </Svg>
  );
}

function MicroF1Bars({ lead, caption }: { lead?: string; caption: ReactNode }) {
  const rows = barRows();
  return (
    <FigureShell
      lead={lead}
      caption={caption}
      phone={<BarsSvg L={BARS_PHONE} />}
      wide={<BarsSvg L={BARS_WIDE} />}
      alt={
        <SrTable
          caption={`Micro-F1 by model, best first, percent. The chart's axis starts at ${barAxisStart()}.`}
          head={['Model', 'Micro-F1']}
          rows={rows.map((r) => [r.model, pct(r.microF1)])}
        />
      }
    />
  );
}

/* ── Parameters vs micro-F1 ─────────────────────────────────────────────── */

const PARAMS_WIDE: Layout = { W: 680, H: 320, m: { l: 36, r: 10, t: 26, b: 36 }, font: 12, r: 5 };
const PARAMS_PHONE: Layout = { W: 340, H: 270, m: { l: 26, r: 4, t: 22, b: 32 }, font: 10, r: 4 };

const paramRows = () =>
  LEADERBOARD.flatMap((r) => {
    const n = r.params ? parseParams(r.params) : null;
    return n ? [{ row: r, n }] : [];
  });

const fmtCount = (n: number) => (n >= 1e9 ? `${n / 1e9}B` : n >= 1e6 ? `${n / 1e6}M` : `${n / 1e3}K`);

function ParamsSvg({ L }: { L: Layout }) {
  const data = paramRows();
  const { W, H, m } = L;
  const lo = 10 ** Math.floor(Math.log10(Math.min(...data.map((d) => d.n))));
  const hi = 10 ** Math.ceil(Math.log10(Math.max(...data.map((d) => d.n))));
  const yMin = Math.floor(Math.min(...data.map((d) => d.row.microF1)) - 0.5);
  const yMax = Math.ceil(Math.max(...data.map((d) => d.row.microF1)) + 0.5);
  const xs = log10Scale(lo, hi, m.l + 6, W - m.r - 6);
  const ys = linear(yMin, yMax, H - m.b, m.t);
  const decades: number[] = [];
  for (let v = lo; v <= hi * 1.0001; v *= 10) decades.push(v);
  const points: Point[] = data.map(({ row, n }) => ({
    id: row.model,
    x: xs(n),
    y: ys(row.microF1),
    label: row.model,
    ours: !!row.ours,
    title: `${row.model}: ${row.params} parameters, micro-F1 ${pct(row.microF1)}`,
  }));
  return (
    <Svg W={W} H={H}>
      <Grid L={L} xTicks={decades} yTicks={ticks(yMin, yMax, 1)} xs={xs} ys={ys} xFmt={fmtCount} />
      <AxisTitles L={L} x="Parameters (log scale) →" y="↑ Micro-F1 (%)" />
      <LabelledPoints L={L} points={points} />
    </Svg>
  );
}

function ParamsVsMicroF1({ lead, caption }: { lead?: string; caption: ReactNode }) {
  const data = paramRows();
  return (
    <FigureShell
      lead={lead}
      caption={caption}
      legend={
        <>
          <Swatch fill={INK.accent} label="ShifaMind" />
          <Swatch fill={INK.neutral} label="Models that report a size" />
        </>
      }
      phone={<ParamsSvg L={PARAMS_PHONE} />}
      wide={<ParamsSvg L={PARAMS_WIDE} />}
      alt={
        <SrTable
          caption="Parameter count and micro-F1 for models that report their size"
          head={['Model', 'Parameters', 'Micro-F1']}
          rows={data.map(({ row }) => [row.model, row.params ?? '', pct(row.microF1)])}
        />
      }
    />
  );
}

/** Renders the figure a `figure` block names. */
export function BlogFigureView({ figure, lead, caption }: { figure: BlogFigure; lead?: string; caption: ReactNode }) {
  switch (figure) {
    case 'micro-macro-scatter':
      return <MicroMacroScatter lead={lead} caption={caption} />;
    case 'micro-f1-bars':
      return <MicroF1Bars lead={lead} caption={caption} />;
    case 'params-vs-micro-f1':
      return <ParamsVsMicroF1 lead={lead} caption={caption} />;
    case 'concept-receipt':
      return <ConceptReceipt lead={lead} caption={caption} />;
  }
}
