/**
 * Small, deterministic helpers for the blog's inline SVG charts: scales, tick
 * steps, a text-width estimate and a greedy label placer. Everything here is
 * pure arithmetic, so the prerender and the browser draw the same picture.
 */

export type Box = { x0: number; y0: number; x1: number; y1: number };

/** Rounds to 0.1px: plenty for drawing, and it keeps the prerendered SVG small. */
const px = (v: number) => Math.round(v * 10) / 10;

export function linear(d0: number, d1: number, r0: number, r1: number) {
  const k = (r1 - r0) / (d1 - d0);
  return (v: number) => px(r0 + (v - d0) * k);
}

export function log10Scale(d0: number, d1: number, r0: number, r1: number) {
  const l0 = Math.log10(d0);
  const k = (r1 - r0) / (Math.log10(d1) - l0);
  return (v: number) => px(r0 + (Math.log10(v) - l0) * k);
}

/** Multiples of `step` inside [d0, d1]. */
export function ticks(d0: number, d1: number, step: number): number[] {
  const out: number[] = [];
  for (let v = Math.ceil(d0 / step) * step; v <= d1 + 1e-9; v += step) out.push(Math.round(v * 1000) / 1000);
  return out;
}

/** Rough rendered width of a label in Inter (average glyph ~0.56em, a little more when bold). */
export function textWidth(text: string, size: number, bold = false): number {
  return text.length * size * (bold ? 0.6 : 0.56);
}

/** Display form of a signed number with a true minus sign, e.g. "+3.47", "−0.65". */
export function signed(v: number, digits = 2): string {
  const s = Math.abs(v).toFixed(digits);
  if (Number(s) === 0) return s;
  return v < 0 ? `−${s}` : `+${s}`;
}

/** "~190M", "4B" -> parameter count. */
export function parseParams(p: string): number | null {
  const m = /([\d.]+)\s*([KMB])/i.exec(p);
  if (!m) return null;
  const mult = { K: 1e3, M: 1e6, B: 1e9 }[m[2].toUpperCase() as 'K' | 'M' | 'B'];
  return Number(m[1]) * mult;
}

function overlap(a: Box, b: Box): number {
  const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
  const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
  return w > 0 && h > 0 ? w * h : 0;
}

function outside(a: Box, bounds: Box): number {
  return (
    Math.max(0, bounds.x0 - a.x0) +
    Math.max(0, a.x1 - bounds.x1) +
    Math.max(0, bounds.y0 - a.y0) +
    Math.max(0, a.y1 - bounds.y1)
  );
}

/** Distance from a point to the nearest edge of a box (0 inside). */
function boxDist(b: Box, x: number, y: number): number {
  const dx = Math.max(b.x0 - x, 0, x - b.x1);
  const dy = Math.max(b.y0 - y, 0, y - b.y1);
  return Math.hypot(dx, dy);
}

type Seg = { x1: number; y1: number; x2: number; y2: number };

/** Do two segments cross? */
function segmentsCross(a: Seg, b: Seg): boolean {
  const d = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) =>
    (qx - px) * (ry - py) - (qy - py) * (rx - px);
  const d1 = d(a.x1, a.y1, a.x2, a.y2, b.x1, b.y1);
  const d2 = d(a.x1, a.y1, a.x2, a.y2, b.x2, b.y2);
  const d3 = d(b.x1, b.y1, b.x2, b.y2, a.x1, a.y1);
  const d4 = d(b.x1, b.y1, b.x2, b.y2, a.x2, a.y2);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

function circleBox(x: number, y: number, r: number): Box {
  return { x0: x - r, y0: y - r, x1: x + r, y1: y + r };
}

/** Does segment (x1,y1)-(x2,y2) cross box b? Sampled; plenty for short leader lines. */
function segmentHits(x1: number, y1: number, x2: number, y2: number, b: Box): boolean {
  for (let t = 0.1; t <= 0.9; t += 0.1) {
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) return true;
  }
  return false;
}

export type LabelIn = {
  id: string;
  x: number;
  y: number;
  /** Radius of the point's mark. */
  r: number;
  text: string;
  size: number;
  bold?: boolean;
};

export type LabelOut = {
  id: string;
  /** Text anchor position (SVG x / baseline y). */
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  box: Box;
  /** Leader line from the mark to the label, when the label sits away from it. */
  leader: { x1: number; y1: number; x2: number; y2: number } | null;
};

const ANGLES = [0, 180, -35, 35, -145, 145, -90, 90, -60, 60, -120, 120, -15, 15, -165, 165];
const STEPS = [3, 10, 20, 32, 46, 62, 80, 100, 124];

/** How much nearer its own mark than any other a label must sit to read as its own. */
const AMBIGUOUS_PX = 5;

function candidate(it: LabelIn, angleDeg: number, dist: number): LabelOut {
  const a = (angleDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const ax = it.x + c * dist;
  const py = it.y + s * dist;
  const w = textWidth(it.text, it.size, it.bold);
  const h = it.size * 1.15;
  const anchor: LabelOut['anchor'] = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
  const x0 = anchor === 'start' ? ax : anchor === 'end' ? ax - w : ax - w / 2;
  const y0 = s > 0.45 ? py : s < -0.45 ? py - h : py - h / 2;
  const box = { x0: x0 - 1.5, y0: y0 - 1, x1: x0 + w + 1.5, y1: y0 + h + 1 };
  let leader: LabelOut['leader'] = null;
  if (dist > it.r + 6) {
    // From the mark's edge to the nearest point of the label box.
    const tx = Math.max(box.x0, Math.min(it.x, box.x1));
    const ty = Math.max(box.y0, Math.min(it.y, box.y1));
    const len = Math.hypot(tx - it.x, ty - it.y) || 1;
    leader = {
      x1: px(it.x + ((tx - it.x) / len) * (it.r + 1.5)),
      y1: px(it.y + ((ty - it.y) / len) * (it.r + 1.5)),
      x2: px(tx),
      y2: px(ty),
    };
  }
  return { id: it.id, x: px(anchor === 'start' ? x0 : anchor === 'end' ? x0 + w : ax), y: px(y0 + h * 0.8), anchor, box, leader };
}

/**
 * Greedy label placement: each label tries positions around its mark at
 * growing distances and keeps the cheapest (inside the plot, clear of other
 * labels and marks, close, short leader). Items are placed in the order given,
 * then every label is re-placed twice against all the others. Returns labels
 * in input order, plus the leftover overlap (0 when every label is clear).
 */
export function placeLabels(items: LabelIn[], bounds: Box): { labels: LabelOut[]; overlap: number } {
  const marks = items.map((it) => circleBox(it.x, it.y, it.r + 1.5));
  const placed: (LabelOut | null)[] = items.map(() => null);

  const cost = (i: number, cand: LabelOut): number => {
    const it = items[i];
    const own = boxDist(cand.box, it.x, it.y);
    let c = outside(cand.box, bounds) * 1e4;
    for (let j = 0; j < items.length; j++) {
      const other = placed[j];
      if (j !== i && other) {
        c += overlap(cand.box, other.box) * 1e3;
        if (cand.leader && segmentHits(cand.leader.x1, cand.leader.y1, cand.leader.x2, cand.leader.y2, other.box)) c += 400;
        if (other.leader && segmentHits(other.leader.x1, other.leader.y1, other.leader.x2, other.leader.y2, cand.box)) c += 400;
        if (cand.leader && other.leader && segmentsCross(cand.leader, other.leader)) c += 400;
      }
      // A label must sit clearly nearer its own mark than any other: one about
      // as close to another mark reads as that mark's. A leader line settles
      // the question, so a led label pays less.
      if (j !== i) {
        const gap = boxDist(cand.box, items[j].x, items[j].y) - own;
        if (gap < AMBIGUOUS_PX) c += cand.leader ? 70 : gap < -1 ? 1e3 : 600;
      }
      c += overlap(cand.box, marks[j]) * (j === i ? 2e3 : 1.5e3);
      if (j !== i && cand.leader && segmentHits(cand.leader.x1, cand.leader.y1, cand.leader.x2, cand.leader.y2, marks[j])) c += 300;
    }
    const dist = Math.hypot((cand.box.x0 + cand.box.x1) / 2 - it.x, (cand.box.y0 + cand.box.y1) / 2 - it.y);
    c += dist * 1.6 + (cand.leader ? 10 : 0);
    if (cand.anchor === 'end') c += 3;
    if (cand.anchor === 'middle') c += 5;
    return c;
  };

  const best = (i: number): LabelOut => {
    const it = items[i];
    let top: LabelOut | null = null;
    let topCost = Infinity;
    for (const step of STEPS) {
      for (const ang of ANGLES) {
        const cand = candidate(it, ang, it.r + step);
        const c = cost(i, cand);
        if (c < topCost) {
          topCost = c;
          top = cand;
        }
      }
    }
    return top!;
  };

  for (let i = 0; i < items.length; i++) placed[i] = best(i);
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < items.length; i++) {
      placed[i] = null;
      placed[i] = best(i);
    }
  }

  const labels = placed as LabelOut[];
  let left = 0;
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) left += overlap(labels[i].box, labels[j].box);
    for (let j = 0; j < items.length; j++) left += overlap(labels[i].box, marks[j]);
  }
  return { labels, overlap: left };
}
