import type { ReactNode } from 'react';
import { linear, signed, textWidth } from './chartKit';
import { FigureShell, INK, Swatch } from './FigureShell';

/**
 * The "receipt" for two codes on one test note: each code's logit is its bias
 * plus the sum of its concept contributions, drawn as diverging bars from 0.
 *
 * Source: ShifaMind full-code paper (public/papers/shifamind.pdf), Table 5,
 * the worked example. c = the concept's contribution to the code's logit,
 * alpha = the concept's attention weight. "All other concepts" is not in the
 * table: it is what remains, logit - bias - (sum of the listed c), so each
 * receipt adds up exactly (-0.33 for K75.4, -0.01 for N17.9).
 */
type Concept = { name: string; c: number; alpha: number };
type Receipt = { code: string; name: string; probability: number; logit: number; bias: number; concepts: Concept[] };

const RECEIPTS: Receipt[] = [
  {
    code: 'K75.4',
    name: 'Autoimmune hepatitis',
    probability: 0.97,
    logit: 3.47,
    bias: -6.08,
    concepts: [
      { name: 'autoimmune hepatitis', c: 11.13, alpha: 0.66 },
      { name: 'therapeutic substance', c: -0.65, alpha: 0.061 },
      { name: 'release', c: -0.33, alpha: 0.017 },
      { name: 'subsequent encounter', c: -0.27, alpha: 0.013 },
    ],
  },
  {
    code: 'N17.9',
    name: 'Acute kidney failure',
    probability: 0.96,
    logit: 3.07,
    bias: -1.66,
    concepts: [
      { name: 'elevated creatinine', c: 2.11, alpha: 0.456 },
      { name: 'specified disease', c: 1.43, alpha: 0.244 },
      { name: 'calcium-channel blocker', c: 1.2, alpha: 0.244 },
    ],
  },
];

const round2 = (v: number) => Math.round(v * 100) / 100;
const otherOf = (r: Receipt) => round2(r.logit - r.bias - r.concepts.reduce((s, k) => s + k.c, 0));
const contributionsOf = (r: Receipt) => round2(r.logit - r.bias);

type Row = { label: string; alpha?: number; value: number; fill: string; kind: 'concept' | 'other' | 'bias' | 'logit' };

function rowsOf(r: Receipt): Row[] {
  return [
    ...r.concepts.map((k) => ({
      label: k.name,
      alpha: k.alpha,
      value: k.c,
      fill: k.c >= 0 ? INK.accent : INK.warm,
      kind: 'concept' as const,
    })),
    { label: 'All other concepts', value: otherOf(r), fill: INK.other, kind: 'other' },
    { label: 'Bias', value: r.bias, fill: INK.bias, kind: 'bias' },
  ];
}

/** One shared scale for both codes, so bar lengths compare across them. */
const ALL_VALUES = RECEIPTS.flatMap((r) => [...rowsOf(r).map((x) => x.value), r.logit, 0]);
const D_MIN = Math.min(...ALL_VALUES);
const D_MAX = Math.max(...ALL_VALUES);

type L = { PW: number; rowH: number; headH: number; font: number; barH: number };

/** Panel height for one receipt at a layout. */
const panelH = (r: Receipt, l: L) => l.headH + (rowsOf(r).length + 1) * l.rowH + 8;

function Panel({ r, x, y, l }: { r: Receipt; x: number; y: number; l: L }) {
  const xs = linear(D_MIN, D_MAX, x + 2, x + l.PW - 2);
  const zero = xs(0);
  const rows = rowsOf(r);
  const f = l.font;
  const valueX = x + l.PW;
  const alphaX = valueX - textWidth('+11.13', f, true) - 10;
  const rowsTop = y + l.headH;
  const ruleY = rowsTop + rows.length * l.rowH + 3;

  // A bar from 0 to `value`, with a short zero tick behind it (a full-height
  // zero line would run through the labels).
  const bar = (value: number, top: number, fill: string) => {
    const w = Math.max(1.5, Math.abs(xs(value) - zero));
    return (
      <>
        <line x1={zero} x2={zero} y1={top - 2} y2={top + l.barH + 2} style={{ stroke: INK.axis }} strokeWidth={1} />
        <rect x={value < 0 ? zero - w : zero} y={top} width={w} height={l.barH} rx={2} style={{ fill }} />
      </>
    );
  };

  return (
    <g>
      <text x={x} y={y + f + 3} fontSize={f + 1.5} fontWeight={600} style={{ fill: INK.strong }}>
        <tspan style={{ fontFamily: 'var(--font-mono)' }}>{r.code}</tspan>
        <tspan dx={6}>{r.name}</tspan>
      </text>
      <text x={valueX} y={y + f + 3} textAnchor="end" fontSize={f} fontWeight={600} style={{ fill: INK.accent }}>
        p = {r.probability.toFixed(2)}
      </text>
      {rows.map((row, i) => {
        const top = rowsTop + i * l.rowH;
        return (
          <g key={row.label}>
            <text x={x} y={top + f} fontSize={f} fontWeight={row.kind === 'concept' ? 500 : 400} style={{ fill: row.kind === 'concept' ? INK.label : INK.tick }}>
              {row.label}
            </text>
            {row.alpha !== undefined && (
              <text x={alphaX} y={top + f} textAnchor="end" fontSize={f - 1} style={{ fill: INK.tick }}>
                α {row.alpha.toFixed(3)}
              </text>
            )}
            <text x={valueX} y={top + f} textAnchor="end" fontSize={f} fontWeight={600} style={{ fill: INK.strong }}>
              {signed(row.value)}
            </text>
            {bar(row.value, top + f + 4, row.fill)}
          </g>
        );
      })}
      <line x1={x} x2={valueX} y1={ruleY} y2={ruleY} style={{ stroke: INK.axis }} strokeWidth={1} />
      <text x={x} y={ruleY + 5 + f} fontSize={f} fontWeight={600} style={{ fill: INK.strong }}>
        Logit = bias + contributions
      </text>
      <text x={valueX} y={ruleY + 5 + f} textAnchor="end" fontSize={f} fontWeight={700} style={{ fill: INK.strong }}>
        {signed(r.logit)}
      </text>
      {bar(r.logit, ruleY + 5 + f + 4, INK.strong)}
    </g>
  );
}

const WIDE: L = { PW: 320, rowH: 30, headH: 26, font: 11.5, barH: 7 };
const PHONE: L = { PW: 330, rowH: 27, headH: 26, font: 11, barH: 7 };

function WideSvg() {
  const gap = 40;
  const W = WIDE.PW * 2 + gap;
  const H = Math.max(...RECEIPTS.map((r) => panelH(r, WIDE)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false" className="block h-auto w-full" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {RECEIPTS.map((r, i) => (
        <Panel key={r.code} r={r} x={i * (WIDE.PW + gap)} y={0} l={WIDE} />
      ))}
    </svg>
  );
}

function PhoneSvg() {
  const gap = 18;
  const W = PHONE.PW + 4;
  let y = 0;
  const tops = RECEIPTS.map((r) => {
    const top = y;
    y += panelH(r, PHONE) + gap;
    return top;
  });
  const H = y - gap;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false" className="block h-auto w-full" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {RECEIPTS.map((r, i) => (
        <Panel key={r.code} r={r} x={2} y={tops[i]} l={PHONE} />
      ))}
    </svg>
  );
}

function Alt() {
  return (
    <div>
      <p>Each code&apos;s logit equals its bias plus the sum of its concept contributions.</p>
      {RECEIPTS.map((r) => (
        <div key={r.code}>
          <p>
            {r.code} {r.name}, probability {r.probability.toFixed(2)}, logit {signed(r.logit)}: bias {signed(r.bias)} plus
            contributions {signed(contributionsOf(r))}.
          </p>
          <ul>
            {r.concepts.map((k) => (
              <li key={k.name}>
                {k.name}: {signed(k.c)} (attention {k.alpha.toFixed(3)})
              </li>
            ))}
            <li>all other concepts: {signed(otherOf(r))}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ConceptReceipt({ lead, caption }: { lead?: string; caption: ReactNode }) {
  return (
    <FigureShell
      lead={lead}
      caption={caption}
      legend={
        <>
          <span className="font-mono text-secondary">logit = bias + ∑ c</span>
          <Swatch fill={INK.accent} label="raises the score" />
          <Swatch fill={INK.warm} label="lowers it" />
          <Swatch fill={INK.bias} label="bias, other concepts" />
          <span>α: attention on the concept</span>
        </>
      }
      phone={<PhoneSvg />}
      wide={<WideSvg />}
      alt={<Alt />}
    />
  );
}
