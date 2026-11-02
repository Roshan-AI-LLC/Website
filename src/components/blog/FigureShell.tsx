import type { ReactNode } from 'react';
import { BLEED, CaptionText } from './ui';

/**
 * The frame every blog chart sits in. Charts are drawn twice, as a portrait
 * SVG for phones and a landscape one from `md` up, so text stays legible at
 * both sizes; CSS picks one (no JS, identical prerender). Both SVGs are
 * aria-hidden: the text alternative (`alt`, usually a small table) is read
 * instead, and the visible caption is the <figcaption>.
 */
export function FigureShell({
  lead,
  caption,
  alt,
  legend,
  phone,
  wide,
}: {
  lead?: string;
  caption: ReactNode;
  alt: ReactNode;
  legend?: ReactNode;
  phone: ReactNode;
  wide: ReactNode;
}) {
  return (
    <figure>
      <div className={`${BLEED} border-y border-subtle bg-glass px-3 py-3 sm:rounded-2xl sm:border sm:px-5 sm:py-4`}>
        {legend && (
          <div aria-hidden className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.68rem] text-muted sm:text-[0.72rem]">
            {legend}
          </div>
        )}
        <div className="mx-auto w-full max-w-[26rem] md:hidden">{phone}</div>
        <div className="hidden md:block">{wide}</div>
        <div className="sr-only">{alt}</div>
      </div>
      <figcaption className="mt-2 text-pretty text-[0.8rem] leading-snug text-secondary sm:mt-3 sm:text-[0.86rem]">
        <CaptionText lead={lead}>{caption}</CaptionText>
      </figcaption>
    </figure>
  );
}

/** Screen-reader table for a chart's data. */
export function SrTable({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) =>
              j === 0 ? (
                <th key={j} scope="row">
                  {c}
                </th>
              ) : (
                <td key={j}>{c}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A legend swatch: a small rounded square in the given fill. */
export function Swatch({ fill, label }: { fill: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: fill }} />
      {label}
    </span>
  );
}

/** Chart colours, all theme tokens so light and dark both read. */
export const INK = {
  grid: 'var(--border-subtle)',
  axis: 'var(--border-strong)',
  tick: 'var(--text-muted)',
  label: 'var(--text-secondary)',
  strong: 'var(--text-primary)',
  accent: 'var(--accent)',
  warm: 'var(--accent-warm)',
  neutral: 'color-mix(in oklab, var(--text-primary) 38%, transparent)',
  neutralBar: 'color-mix(in oklab, var(--text-primary) 16%, transparent)',
  bias: 'color-mix(in oklab, var(--text-primary) 34%, transparent)',
  other: 'color-mix(in oklab, var(--text-primary) 20%, transparent)',
  ring: 'var(--bg-elev)',
} as const;
