import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Hero illustration: note tokens pass through hidden layers into named
 * keywords, and only those keywords connect to ICD-10 codes. Keywords wire
 * straight to codes with no layer in between, because each code score is an
 * exact sum of keyword contributions.
 *
 * Two layouts of the same diagram: the wide one from lg up, a compact one
 * with a single hidden layer below that, so the labels stay legible when the
 * card is narrow. Values are illustrative.
 *
 * Motion: a forward pass runs every LOOP.dur on the SVG's own SMIL clock
 * (no JS timers, SSR-safe). Pulses travel notes -> hidden -> keywords, each
 * node flashes as the wave reaches it, then pulses run keyword -> code and the
 * two predicted codes ring. I50.22 never fires: the model saying no. The
 * clock pauses offscreen; under reduced motion the animation layer is not
 * rendered at all (and CSS hides it before hydration), leaving the static
 * diagram.
 *
 * Interaction: hovering, tapping or keyboard-focusing a keyword lights its
 * links to codes; doing the same to a code lights the keywords feeding it.
 * The header reads out what is lit. A tap stays lit until the next tap
 * elsewhere.
 */

const CONCEPTS = [
  { name: 'orthopnea', score: '0.93' },
  { name: 'pleural effusion', score: '0.92' },
  { name: 'leg edema', score: '0.91' },
  { name: 'BNP elevation', score: '0.90' },
  { name: 'reduced EF', score: '0.87' },
];

const CODES = [
  { code: 'I50.23', score: '0.94', active: true, desc: 'Acute on chronic systolic HF' },
  { code: 'J91.8', score: '0.81', active: true, desc: 'Pleural effusion in other conditions' },
  { code: 'I50.22', score: '0.31', active: false, desc: 'Chronic systolic HF' },
];

/**
 * Illustrative weight of each keyword in each code: LINKS[code][keyword],
 * 2 strong, 1 weak, 0 none. Drives edge weight, the wave and the highlight.
 */
const LINKS = [
  [2, 0, 2, 2, 2],
  [1, 2, 0, 0, 1],
  [0, 0, 1, 1, 1],
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
/** A predicted code's ring stops about where its label starts (codeX + R + 7). */
const RING_MAX = R + 9;
const ROWS = [30, 70, 110, 150, 190];
const NOTE_ROWS = [50, 90, 130, 170];
const CODE_ROWS = [62, 110, 158];

const EDGE = { stroke: 'var(--text-primary)', strokeOpacity: 0.13, strokeWidth: 0.6 };
const FADE = 'opacity 240ms ease, stroke-opacity 240ms ease, stroke-width 240ms ease';

/* ── The forward pass ──────────────────────────────────────────────────── */

/** One pass per cycle. Every animation shares this clock, so they stay in step. */
const LOOP = { dur: '4s', begin: '0.9s', repeatCount: 'indefinite' } as const;

type Pair = [from: number, to: number];
/** Sampled edges the wave travels, as [from row, to row]. */
const INTO_HIDDEN: Pair[] = [[0, 1], [1, 3], [2, 0], [3, 2]];
const ACROSS_HIDDEN: Pair[] = [[0, 2], [1, 0], [2, 3], [3, 1]];
const INTO_KEYWORDS: Pair[] = [[1, 0], [3, 1], [0, 2], [2, 3], [3, 4]];
/** Travel time per hop, as a fraction of the cycle. */
const TRAVEL = { hidden: 0.08, keyword: 0.09, code: 0.13 };

type Pulse = { id: string; d: string; a: number; b: number; weak: boolean };
type Flash = { id: string; x: number; y: number; at: number };
type Wave = { pulses: Pulse[]; nodes: Flash[]; pills: number[]; rings: (number | null)[] };

/** Times are cycle fractions. Each pulse leaves its node the moment that node lights. */
function planWave(l: Layout): Wave {
  const pulses: Pulse[] = [];
  const nodes: Flash[] = [];
  const send = (id: string, x1: number, y1: number, x2: number, y2: number, a: number, travel: number, weak = false) => {
    pulses.push({ id, d: `M${x1} ${y1}L${x2} ${y2}`, a, b: a + travel, weak });
    return a + travel;
  };
  const arrive = (map: Map<number, number>, row: number, at: number) =>
    map.set(row, Math.min(map.get(row) ?? 1, at));

  let lit = new Map<number, number>();
  INTO_HIDDEN.forEach(([n, h], i) =>
    arrive(lit, h, send(`n${n}`, l.notesX, NOTE_ROWS[n], l.hiddenX[0], ROWS[h], 0.02 + i * 0.015, TRAVEL.hidden)),
  );
  lit.forEach((at, h) => nodes.push({ id: `h0-${h}`, x: l.hiddenX[0], y: ROWS[h], at }));

  for (let k = 1; k < l.hiddenX.length; k++) {
    const next = new Map<number, number>();
    ACROSS_HIDDEN.forEach(([s, d]) => {
      const from = lit.get(s);
      if (from === undefined) return;
      arrive(next, d, send(`h${k}-${s}`, l.hiddenX[k - 1], ROWS[s], l.hiddenX[k], ROWS[d], from + 0.01, TRAVEL.hidden));
    });
    next.forEach((at, h) => nodes.push({ id: `h${k}-${h}`, x: l.hiddenX[k], y: ROWS[h], at }));
    lit = next;
  }

  const last = l.hiddenX[l.hiddenX.length - 1];
  const pills = CONCEPTS.map(() => 1);
  INTO_KEYWORDS.forEach(([s, p]) => {
    const from = lit.get(s);
    if (from === undefined) return;
    pills[p] = Math.min(pills[p], send(`k${s}-${p}`, last, ROWS[s], l.pillX, ROWS[p], from + 0.01, TRAVEL.keyword));
  });

  // Keywords fire into the codes they feed. Only predicted codes receive the
  // wave; a code rings once its last strong keyword lands.
  const rings = CODES.map((c, ci) => {
    if (!c.active) return null;
    let ring = 0;
    LINKS[ci].forEach((w, p) => {
      if (w === 0 || pills[p] >= 1) return;
      const at = send(`c${p}-${ci}`, l.pillX + l.pillW, ROWS[p], l.codeX, CODE_ROWS[ci], pills[p] + 0.04, TRAVEL.code, w === 1);
      if (w === 2) ring = Math.max(ring, at);
    });
    return ring || null;
  });

  return { pulses, nodes, pills, rings };
}

const WAVE_WIDE = planWave(WIDE);
const WAVE_COMPACT = planWave(COMPACT);

/** SMIL keyTimes from cycle fractions. Fixed decimals keep SSR and client identical. */
const kt = (...t: number[]) => t.map((v) => v.toFixed(3)).join(';');

function PulseDot({ p }: { p: Pulse }) {
  const r = p.weak ? 1.5 : 2.1;
  const peak = p.weak ? 0.55 : 1;
  return (
    <g opacity={0}>
      <circle r={r * 2.8} style={{ fill: 'var(--accent)', opacity: 0.2 }} />
      <circle r={r} style={{ fill: 'var(--accent)' }} />
      <animateMotion
        {...LOOP}
        path={p.d}
        calcMode="spline"
        keyPoints="0;0;1;1"
        keyTimes={kt(0, p.a, p.b, 1)}
        keySplines="0 0 1 1;0.45 0 0.3 1;0 0 1 1"
      />
      <animate
        {...LOOP}
        attributeName="opacity"
        values={`0;0;${peak};${peak};0;0`}
        keyTimes={kt(0, p.a, p.a + 0.015, p.b - 0.015, p.b, 1)}
      />
    </g>
  );
}

function NodeFlash({ f }: { f: Flash }) {
  const t = kt(0, f.at, f.at + 0.03, f.at + 0.16, 1);
  return (
    <circle className="cn-anim" cx={f.x} cy={f.y} r={R} opacity={0} style={{ fill: 'var(--accent)' }}>
      <animate {...LOOP} attributeName="opacity" values="0;0;0.9;0;0" keyTimes={t} />
      <animate {...LOOP} attributeName="r" values={`${R};${R};${R + 1.8};${R};${R}`} keyTimes={t} />
    </circle>
  );
}

/* ── Highlight ─────────────────────────────────────────────────────────── */

type Hot = { kind: 'kw' | 'code'; i: number } | null;

/** True for keyboard focus. Browsers without :focus-visible treat all focus as visible. */
function focusVisible(el: Element) {
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
}

const linkedCodes = (k: number) => CODES.filter((_, c) => LINKS[c][k] > 0);
const linkedConcepts = (c: number) => CONCEPTS.filter((_, k) => LINKS[c][k] > 0);

function linkStyle(k: number, c: number, hot: Hot): CSSProperties {
  const w = LINKS[c][k];
  const active = CODES[c].active;
  let opacity = w === 0 ? 0.06 : active ? (w === 2 ? 0.55 : 0.26) : 0.16;
  let width = w === 2 ? 0.85 : 0.65;
  if (hot) {
    const lit = w > 0 && (hot.kind === 'kw' ? hot.i === k : hot.i === c);
    opacity = lit ? (active ? (w === 2 ? 0.95 : 0.6) : 0.45) : 0.04;
    width = lit ? (w === 2 ? 1.5 : 1.1) : 0.6;
  }
  return {
    stroke: active && w > 0 ? 'var(--accent)' : 'var(--text-primary)',
    strokeOpacity: opacity,
    strokeWidth: width,
    transition: FADE,
  };
}

function keywordOpacity(k: number, hot: Hot) {
  if (!hot) return 1;
  if (hot.kind === 'kw') return hot.i === k ? 1 : 0.35;
  const w = LINKS[hot.i][k];
  return w === 2 ? 1 : w === 1 ? 0.7 : 0.3;
}

function codeOpacity(c: number, hot: Hot) {
  if (!hot) return 1;
  if (hot.kind === 'code') return hot.i === c ? 1 : 0.3;
  return LINKS[c][hot.i] > 0 ? 1 : 0.3;
}

function Readout({ hot }: { hot: Hot }) {
  if (!hot) return null;
  if (hot.kind === 'code') {
    const c = CODES[hot.i];
    return (
      <>
        <span className={c.active ? 'text-accent' : 'text-muted'}>{c.code}</span>
        <span className="text-secondary"> · {c.desc}</span>
      </>
    );
  }
  return (
    <>
      <span className="text-primary">{CONCEPTS[hot.i].name}</span>
      <span className="text-muted"> → </span>
      {linkedCodes(hot.i).map((c, n) => (
        <span key={c.code} className={c.active ? 'text-accent' : 'text-muted'}>
          {n > 0 ? ', ' : ''}
          {c.code}
        </span>
      ))}
    </>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function ConceptNetwork() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Hot>(null);
  const [focus, setFocus] = useState<Hot>(null);
  // The last lit item, so the readout keeps its text while it fades out.
  const [shown, setShown] = useState<Hot>(null);
  const hot = hover ?? focus;

  const onHover = (h: Hot) => {
    setHover(h);
    if (h) setShown(h);
  };
  const onFocus = (h: Hot) => {
    setFocus(h);
    if (h) setShown(h);
  };

  // Touch: a tap lights an item until the next tap elsewhere. iOS sends no
  // mouseleave for a tap on blank page, so listen for any pointer down that
  // lands outside the keyword and code targets.
  useEffect(() => {
    if (!hover) return;
    const clear = (e: PointerEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest('[data-cn-target]')) setHover(null);
    };
    document.addEventListener('pointerdown', clear);
    return () => document.removeEventListener('pointerdown', clear);
  }, [hover]);

  // Run the SMIL clock only for the layout on screen, only while in view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const svgs = Array.from(root.querySelectorAll<SVGSVGElement>('svg[data-cn]'));
    let inView = true;
    const sync = () =>
      svgs.forEach((svg) => {
        if (inView && !reduced && svg.getClientRects().length > 0) svg.unpauseAnimations();
        else svg.pauseAnimations();
      });
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver((entries) => {
            inView = entries[entries.length - 1].isIntersecting;
            sync();
          });
    io?.observe(root);
    const mq = window.matchMedia('(min-width: 1024px)');
    mq.addEventListener('change', sync);
    sync();
    return () => {
      io?.disconnect();
      mq.removeEventListener('change', sync);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-full opacity-40 blur-3xl sm:-inset-10 sm:opacity-50"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 20%, transparent), transparent 68%)',
        }}
      />

      <div className="glass relative overflow-hidden rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6">
        <div className="flex h-4 items-center justify-between gap-4">
          <div className="relative min-w-0 flex-1">
            <span
              className={`block text-[0.64rem] font-semibold uppercase leading-4 tracking-[0.16em] text-accent transition-opacity duration-200 ${
                hot ? 'opacity-0' : ''
              }`}
            >
              ShifaMind
            </span>
            <span
              aria-hidden
              className={`absolute inset-0 truncate font-mono text-[0.66rem] leading-4 transition-opacity duration-200 ${
                hot ? '' : 'opacity-0'
              }`}
            >
              <Readout hot={shown} />
            </span>
          </div>
          <span className="shrink-0 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-muted">
            Illustrative
          </span>
        </div>

        <div className="mt-3 sm:mt-5">
          <div className="lg:hidden">
            <Diagram layout={COMPACT} wave={WAVE_COMPACT} animate={!reduced} hot={hot} onHover={onHover} onFocus={onFocus} />
          </div>
          <div className="hidden lg:block">
            <Diagram layout={WIDE} wave={WAVE_WIDE} animate={!reduced} hot={hot} onHover={onHover} onFocus={onFocus} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Diagram({
  layout,
  wave,
  animate,
  hot,
  onHover,
  onFocus,
}: {
  layout: Layout;
  wave: Wave;
  animate: boolean;
  hot: Hot;
  onHover: (h: Hot) => void;
  onFocus: (h: Hot) => void;
}) {
  const { width, notesX, hiddenX, pillX, pillW, codeX } = layout;
  const pillEnd = pillX + pillW;
  const lastHidden = hiddenX[hiddenX.length - 1];
  const dim = hot !== null;
  // Roving focus: the diagram is one tab stop; arrow keys move inside it.
  const [rove, setRove] = useState(0);

  const box = (x: number, y: number, w: number, h: number): CSSProperties => ({
    left: `${((x / width) * 100).toFixed(3)}%`,
    top: `${((y / HEIGHT) * 100).toFixed(3)}%`,
    width: `${((w / width) * 100).toFixed(3)}%`,
    height: `${((h / HEIGHT) * 100).toFixed(3)}%`,
  });

  const targets = [
    ...CONCEPTS.map((c, i) => ({
      hot: { kind: 'kw', i } as const,
      label: `${c.name}, ${c.score}. Feeds ${linkedCodes(i).map((x) => x.code).join(', ')}`,
      style: box(pillX, ROWS[i] - PILL_H / 2, pillW, PILL_H),
      // Grows the hit area to the full 40-unit row band (rows sit ~34px apart on phones).
      hit: 'before:-inset-y-[7px]',
    })),
    ...CODES.map((c, i) => ({
      hot: { kind: 'code', i } as const,
      label: `${c.code}, ${c.desc}, ${c.score}. From ${linkedConcepts(i).map((x) => x.name).join(', ')}`,
      style: box(codeX - R - 4, CODE_ROWS[i] - R - 4, width - (codeX - R - 4) - 2, 2 * R + 8),
      hit: 'before:-inset-y-[10px]',
    })),
  ];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = targets.length;
    const step: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in step) next = (rove + step[e.key] + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    e.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  };

  return (
    <div className="relative">
      <svg
        data-cn=""
        viewBox={`0 0 ${width} ${HEIGHT}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Note tokens pass through hidden layers into named keywords such as orthopnea and pleural effusion. Only those keywords connect to the ICD-10 codes I50.23, J91.8 and I50.22."
      >
        {/* Dense edges: notes into hidden layers, hidden layers into keywords. */}
        <g style={{ ...EDGE, opacity: dim ? 0.5 : 1, transition: FADE }}>
          {NOTE_ROWS.flatMap((y1) =>
            ROWS.map((y2) => <line key={`n${y1}-${y2}`} x1={notesX} y1={y1} x2={hiddenX[0]} y2={y2} />),
          )}
          {hiddenX.slice(1).flatMap((x, i) =>
            ROWS.flatMap((y1) =>
              ROWS.map((y2) => <line key={`h${i}-${y1}-${y2}`} x1={hiddenX[i]} y1={y1} x2={x} y2={y2} />),
            ),
          )}
          {ROWS.flatMap((y1) =>
            ROWS.map((y2) => <line key={`p${y1}-${y2}`} x1={lastHidden} y1={y1} x2={pillX} y2={y2} />),
          )}
        </g>

        {/* Keywords to codes: the only path to an output, weighted by contribution. */}
        <g>
          {ROWS.flatMap((y1, k) =>
            CODES.map((c, ci) => (
              <line
                key={`c${y1}-${c.code}`}
                x1={pillEnd}
                y1={y1}
                x2={codeX}
                y2={CODE_ROWS[ci]}
                style={linkStyle(k, ci, hot)}
              />
            )),
          )}
        </g>

        {/* The wave. */}
        {animate && (
          <g className="cn-anim" style={{ opacity: dim ? 0.12 : 1, transition: FADE }}>
            {wave.pulses.map((p) => (
              <PulseDot key={p.id} p={p} />
            ))}
          </g>
        )}

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

        <g style={{ opacity: dim ? 0.5 : 1, transition: FADE }}>
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

          {animate && wave.nodes.map((f) => <NodeFlash key={f.id} f={f} />)}
        </g>

        {CONCEPTS.map((c, i) => {
          const y = ROWS[i];
          const at = wave.pills[i];
          const lit = hot?.kind === 'kw' && hot.i === i;
          return (
            <g key={c.name} style={{ opacity: keywordOpacity(i, hot), transition: FADE }}>
              <rect
                x={pillX}
                y={y - PILL_H / 2}
                width={pillW}
                height={PILL_H}
                rx={PILL_H / 2}
                style={{
                  fill: 'color-mix(in oklab, var(--accent) 16%, var(--bg-elev))',
                  stroke: 'var(--accent)',
                  strokeOpacity: lit ? 1 : 0.75,
                  strokeWidth: lit ? 1.5 : 1,
                  transition: FADE,
                }}
              />
              {animate && at < 1 && (
                <rect
                  className="cn-anim"
                  x={pillX}
                  y={y - PILL_H / 2}
                  width={pillW}
                  height={PILL_H}
                  rx={PILL_H / 2}
                  opacity={0}
                  style={{
                    fill: 'color-mix(in oklab, var(--accent) 20%, transparent)',
                    stroke: 'var(--accent)',
                    strokeWidth: 1.5,
                  }}
                >
                  <animate
                    {...LOOP}
                    attributeName="opacity"
                    values="0;0;1;0;0"
                    keyTimes={kt(0, at, at + 0.03, at + 0.24, 1)}
                  />
                </rect>
              )}
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
          const at = wave.rings[i];
          return (
            <g key={c.code} style={{ opacity: codeOpacity(i, hot), transition: FADE }}>
              {animate && at !== null && (
                <circle
                  className="cn-anim"
                  cx={codeX}
                  cy={y}
                  r={R + 1}
                  opacity={0}
                  style={{ fill: 'none', stroke: 'var(--accent)', strokeWidth: 1.4 }}
                >
                  <animate
                    {...LOOP}
                    attributeName="r"
                    values={`${R + 1};${R + 1};${RING_MAX};${RING_MAX}`}
                    keyTimes={kt(0, at, at + 0.24, 1)}
                    calcMode="spline"
                    keySplines="0 0 1 1;0.2 0.6 0.3 1;0 0 1 1"
                  />
                  <animate
                    {...LOOP}
                    attributeName="opacity"
                    values="0;0;0.85;0;0"
                    keyTimes={kt(0, at, at + 0.02, at + 0.24, 1)}
                  />
                </circle>
              )}
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

      {/* Real buttons over the keywords and codes, for hover, focus and touch. */}
      <div role="group" aria-label="Keywords and codes" className="absolute inset-0" onKeyDown={onKeyDown}>
        {targets.map((t, n) => (
          <button
            key={`${t.hot.kind}${t.hot.i}`}
            type="button"
            tabIndex={n === rove ? 0 : -1}
            aria-label={t.label}
            style={t.style}
            data-cn-target=""
            className={`absolute cursor-default rounded-full before:absolute before:inset-x-0 ${t.hit}`}
            onMouseEnter={() => onHover(t.hot)}
            onMouseLeave={() => onHover(null)}
            // Taps light the item; keyboard Enter/Space (detail 0) is left to focus.
            onClick={(e) => {
              if (e.detail > 0) onHover(t.hot);
            }}
            onFocus={(e) => {
              setRove(n);
              // Keyboard focus lights the item; a mouse click's focus does
              // not, or the item would stay lit after the pointer leaves.
              if (focusVisible(e.currentTarget)) onFocus(t.hot);
            }}
            onBlur={() => onFocus(null)}
          />
        ))}
      </div>
    </div>
  );
}
