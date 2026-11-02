import { AlertTriangle, ChevronDown, Info, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { BlogBlock } from '../../data/blog';
import { BlogFigureView } from './Figures';
import { Inline } from './Inline';
import { Ensembles, Leaderboard } from './Leaderboard';
import {
  BLEED,
  CELL_BG,
  CaptionText,
  FOCUS_RING,
  HIGHLIGHT_BG,
  SCROLL_CUE,
  SwipeHint,
  TEXT_COL,
  WARM_INK,
} from './ui';
import { plainText } from './markup';

/**
 * Renders a post's blocks. Every block sits in the ~44rem reading column, so
 * tables, figures and their notes line up with the text; on phones tables and
 * figures bleed to the screen edge, and anything wider than the column
 * scrolls inside its own container. Figures and tables are numbered in order
 * ("Figure 2.", "Table 1.").
 */

export const BODY_TEXT =
  'text-pretty text-[0.95rem] font-light leading-[1.62] text-secondary sm:text-[1.02rem] sm:leading-[1.72]';

export const H2_CLASS =
  'scroll-mt-3 text-balance font-display text-[1.3rem] font-semibold leading-[1.15] tracking-[-0.025em] text-primary sm:scroll-mt-28 sm:text-[1.7rem] sm:leading-[1.2]';

/** A folded section's heading: a step smaller, so the closed stack stays compact on phones. */
const FOLDED_H2_CLASS =
  'scroll-mt-3 text-balance font-display text-[1.12rem] font-semibold leading-[1.2] tracking-[-0.02em] text-primary sm:scroll-mt-28 sm:text-[1.5rem]';

const H3_CLASS =
  'scroll-mt-3 text-balance text-[1.02rem] font-semibold leading-snug tracking-[-0.012em] text-primary sm:scroll-mt-28 sm:text-[1.14rem]';

/** Space above each block type; the first block gets none. */
const SPACE: Record<BlogBlock['type'], string> = {
  h2: 'mt-9 sm:mt-14',
  h3: 'mt-6 sm:mt-9',
  p: 'mt-3 sm:mt-4',
  list: 'mt-3 sm:mt-4',
  table: 'mt-5 sm:mt-7',
  leaderboard: 'mt-5 sm:mt-7',
  ensembles: 'mt-5 sm:mt-7',
  figure: 'mt-5 sm:mt-7',
  callout: 'mt-5 sm:mt-6',
  quote: 'mt-5 sm:mt-6',
  formula: 'mt-4 sm:mt-5',
  image: 'mt-5 sm:mt-7',
};

export function Blocks({ blocks }: { blocks: BlogBlock[] }) {
  let figures = 0;
  let tables = 0;
  const leads = blocks.map((b) => {
    if (b.type === 'figure' || b.type === 'image') return `Figure ${++figures}.`;
    if (b.type === 'table' || b.type === 'leaderboard' || b.type === 'ensembles') return `Table ${++tables}.`;
    return undefined;
  });
  // A collapsible h2 takes every block up to the next h2 into its section.
  const parts: ({ kind: 'block'; i: number } | { kind: 'section'; i: number; body: number[] })[] = [];
  blocks.forEach((b, i) => {
    const last = parts[parts.length - 1];
    if (b.type === 'h2' && b.collapsible) parts.push({ kind: 'section', i, body: [] });
    else if (b.type !== 'h2' && last?.kind === 'section') last.body.push(i);
    else parts.push({ kind: 'block', i });
  });
  const cell = (i: number, space: string) => (
    <div key={i} className={`${space} ${TEXT_COL}`}>
      <Block block={blocks[i]} lead={leads[i]} />
    </div>
  );
  return (
    <div>
      {parts.map((p, n) => {
        if (p.kind === 'block') return cell(p.i, n === 0 ? '' : SPACE[blocks[p.i].type]);
        const h = blocks[p.i] as Extract<BlogBlock, { type: 'h2' }>;
        const body = p.body.map((i) => blocks[i]);
        // Folded sections stack flush; the first one after open prose gets the usual h2 gap,
        // and the last one in a run closes the stack with a hairline.
        const stacked = n > 0 && parts[n - 1].kind === 'section';
        const closesStack = parts[n + 1]?.kind !== 'section';
        return (
          <CollapsibleSection
            key={p.i}
            id={h.id}
            title={<Inline text={h.text} />}
            meta={`${sectionMinutes(body)} min read`}
            className={n === 0 || stacked ? '' : SPACE.h2}
            last={closesStack}
          >
            {p.body.map((i, k) => cell(i, k === 0 ? 'mt-1 sm:mt-2' : SPACE[blocks[i].type]))}
          </CollapsibleSection>
        );
      })}
    </div>
  );
}

/** Reading time of a run of blocks, counted as readingMinutes counts a post. */
function sectionMinutes(body: BlogBlock[]): number {
  const parts: string[] = [];
  for (const b of body) {
    if ('text' in b && b.text) parts.push(b.text);
    if ('items' in b && b.items) parts.push(...b.items);
    if (b.type === 'table') parts.push(...b.rows.flat());
  }
  const words = parts.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

/**
 * A section folded behind its heading: closed in the prerender and on first
 * paint, opened by the reader, or by any link into it (unfoldAround). The
 * content stays in the HTML, so search engines and in-page search still see
 * it. Folded sections stack with a hairline between them, like an accordion.
 */
export function CollapsibleSection({
  id,
  title,
  meta,
  children,
  className = '',
  last = false,
}: {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Closes the stack with a hairline below the heading. */
  last?: boolean;
}) {
  return (
    <details className={`group/section ${className}`}>
      <summary
        className={`${TEXT_COL} flex cursor-pointer list-none items-center justify-between gap-4 border-t border-subtle py-4 sm:gap-6 sm:py-5 [&::-webkit-details-marker]:hidden ${
          last ? 'border-b group-open/section:border-b-0' : ''
        } ${FOCUS_RING}`}
      >
        <span className="min-w-0">
          <h2 id={id} className={`${FOLDED_H2_CLASS} transition-colors group-hover/section:text-[color:var(--accent)]`}>
            {title}
          </h2>
          {meta && <span className="mt-1 block text-[0.74rem] text-muted sm:mt-1.5 sm:text-[0.78rem]">{meta}</span>}
        </span>
        <span
          aria-hidden
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-subtle text-secondary transition duration-300 ease-spring group-open/section:rotate-180 group-open/section:border-transparent group-open/section:bg-[color:var(--accent-soft)] group-open/section:text-[color:var(--accent)] sm:h-9 sm:w-9"
        >
          <ChevronDown size={17} strokeWidth={2} />
        </span>
      </summary>
      <div className={`pb-6 sm:pb-10 ${last ? 'group-open/section:border-b group-open/section:border-subtle' : ''}`}>
        {children}
      </div>
    </details>
  );
}

function Block({ block: b, lead }: { block: BlogBlock; lead?: string }) {
  switch (b.type) {
    case 'h2':
      return (
        <h2 id={b.id} className={H2_CLASS}>
          <Inline text={b.text} />
        </h2>
      );
    case 'h3':
      return (
        <h3 id={b.id} className={H3_CLASS}>
          <Inline text={b.text} />
        </h3>
      );
    case 'p':
      return (
        <p className={BODY_TEXT}>
          <Inline text={b.text} />
        </p>
      );
    case 'list':
      return <List ordered={b.ordered} items={b.items} />;
    case 'table':
      return <DataTable block={b} lead={lead} />;
    case 'leaderboard':
      return <Leaderboard caption={b.caption} note={b.note} lead={lead} />;
    case 'ensembles':
      return <Ensembles caption={b.caption} note={b.note} lead={lead} />;
    case 'figure':
      return <BlogFigureView figure={b.figure} lead={lead} caption={<Inline text={b.caption} />} />;
    case 'callout':
      return <Callout tone={b.tone} title={b.title} text={b.text} items={b.items} />;
    case 'quote':
      return (
        <figure className="border-l-2 pl-4 sm:pl-5" style={{ borderColor: 'var(--accent)' }}>
          <blockquote className="text-pretty font-display text-[1rem] font-medium leading-[1.45] tracking-[-0.012em] text-primary sm:text-[1.2rem]">
            <Inline text={b.text} />
          </blockquote>
          {b.cite && (
            <figcaption className="mt-1.5 text-[0.8rem] text-muted sm:mt-2 sm:text-[0.84rem]">
              <Inline text={b.cite} />
            </figcaption>
          )}
        </figure>
      );
    case 'formula':
      // Shown verbatim: in a formula "*" is more likely a product than italics.
      return (
        <figure>
          <div className="rounded-xl border border-subtle bg-glass px-4 py-3 text-center sm:px-5 sm:py-4">
            <code className="whitespace-pre-wrap break-words font-mono text-[0.86rem] leading-relaxed text-primary sm:text-[0.95rem]">
              {b.text}
            </code>
          </div>
          {b.caption && (
            <figcaption className="mt-1.5 text-center text-[0.78rem] leading-snug text-muted sm:mt-2 sm:text-[0.82rem]">
              <Inline text={b.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'image':
      return <PaperFigure block={b} lead={lead} />;
  }
}

/**
 * A figure reproduced from a paper. Paper figures are drawn on white, so the
 * card stays white in both themes rather than inverting the artwork.
 */
function PaperFigure({ block: b, lead }: { block: Extract<BlogBlock, { type: 'image' }>; lead?: string }) {
  return (
    <figure>
      <div className={`${BLEED} border-y border-subtle bg-white px-3 py-3 sm:rounded-2xl sm:border sm:px-5 sm:py-5`}>
        {/* Opens the full-size image in a new tab: wide diagrams get small on phones. */}
        <a
          href={b.src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open full-size image: ${b.alt}`}
          className={`block cursor-zoom-in rounded-md ${FOCUS_RING}`}
        >
          <img
            src={b.src}
            width={b.width}
            height={b.height}
            alt={b.alt}
            loading="lazy"
            decoding="async"
            className="mx-auto block h-auto w-full"
            style={b.maxWidth ? { maxWidth: `${b.maxWidth}px` } : undefined}
          />
        </a>
      </div>
      <figcaption className="mt-2 text-pretty text-[0.8rem] leading-snug text-secondary sm:mt-3 sm:text-[0.86rem]">
        <CaptionText lead={lead}>
          <Inline text={b.caption} />
        </CaptionText>{' '}
        <span className="text-muted">
          <Inline text={b.credit} />
        </span>
      </figcaption>
    </figure>
  );
}

export function List({ ordered, items, className = '' }: { ordered?: boolean; items: string[]; className?: string }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      className={`${ordered ? 'list-decimal' : 'list-disc'} space-y-1.5 pl-5 marker:text-[color:var(--accent)] sm:space-y-2 ${BODY_TEXT} ${className}`}
    >
      {items.map((it, i) => (
        <li key={i} className="pl-1">
          <Inline text={it} />
        </li>
      ))}
    </Tag>
  );
}

const TONES = {
  key: {
    Icon: Sparkles,
    border: 'color-mix(in oklab, var(--accent) 32%, transparent)',
    bg: 'color-mix(in oklab, var(--accent) 7%, transparent)',
    ink: 'var(--accent)',
  },
  info: {
    Icon: Info,
    border: 'var(--border-subtle)',
    bg: 'var(--bg-glass)',
    ink: 'var(--accent)',
  },
  warn: {
    Icon: AlertTriangle,
    border: 'color-mix(in oklab, var(--accent-warm) 35%, transparent)',
    bg: 'color-mix(in oklab, var(--accent-warm) 7%, transparent)',
    // --warm-ink (set on the box by WARM_INK): the coral that passes AA as small text.
    ink: 'var(--warm-ink)',
  },
} as const;

/** A boxed aside. `key` is the takeaways style. */
export function Callout({
  tone = 'info',
  title,
  text,
  items,
  as = 'div',
}: {
  tone?: 'info' | 'key' | 'warn';
  title?: string;
  text?: string;
  items?: string[];
  /** 'section' makes it a labelled region (the takeaways box); in-body callouts stay plain. */
  as?: 'div' | 'section';
}) {
  const t = TONES[tone];
  const Tag = as;
  return (
    <Tag
      aria-label={as === 'section' && title ? plainText(title) : undefined}
      className={`rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 ${WARM_INK}`}
      style={{ borderColor: t.border, background: t.bg }}
    >
      {title && (
        <div
          className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
          style={{ color: t.ink }}
        >
          <t.Icon size={14} strokeWidth={2} aria-hidden />
          <Inline text={title} />
        </div>
      )}
      {text && (
        <p
          className={`${title ? 'mt-1.5 sm:mt-2' : ''} text-pretty text-[0.9rem] leading-[1.6] text-secondary sm:text-[0.96rem]`}
        >
          <Inline text={text} />
        </p>
      )}
      {items && items.length > 0 && (
        <ul
          className={`${title || text ? 'mt-1.5 sm:mt-2' : ''} space-y-1.5 text-[0.9rem] leading-[1.55] text-secondary sm:text-[0.96rem]`}
        >
          {items.map((it, i) => (
            <li key={i} className="flex gap-2.5">
              <span
                aria-hidden
                className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: t.ink }}
              />
              <span className="min-w-0 text-pretty">
                <Inline text={it} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </Tag>
  );
}

function DataTable({ block: b, lead }: { block: Extract<BlogBlock, { type: 'table' }>; lead?: string }) {
  const numeric = new Set(b.numeric ?? []);
  const highlight = new Set(b.highlight ?? []);
  // Four or more columns of prose are too cramped at phone width: such tables
  // keep a readable minimum width and scroll sideways, with a sticky first column.
  const scrolls = b.columns.length >= 4;
  const minWidth = scrolls ? `${Math.min(56, b.columns.length * 7)}rem` : undefined;
  const frame = scrolls ? 'border-y sm:rounded-2xl sm:border' : 'rounded-xl border';
  const sticky = (j: number) => (scrolls && j === 0 ? 'sticky left-0 z-[1] max-w-[8.5rem] sm:max-w-none' : '');
  // A row whose first cell is empty continues the row above: that row's header
  // cell spans it, so every row keeps a row header (e.g. one code over several
  // concept rows) and no header cell is left empty.
  const continues = (i: number) => i > 0 && b.rows[i][0].trim() === '';
  const span = (i: number) => {
    let k = i + 1;
    while (k < b.rows.length && continues(k)) k++;
    return k - i;
  };
  return (
    <figure id={b.id} className={b.id ? 'scroll-mt-3 sm:scroll-mt-28' : undefined}>
      <figcaption className="mb-2 text-pretty text-[0.8rem] leading-snug text-secondary sm:mb-3 sm:text-[0.86rem]">
        <CaptionText lead={lead}>
          <Inline text={b.caption} />
        </CaptionText>
      </figcaption>
      {scrolls && <SwipeHint />}
      <div className={scrolls ? BLEED : ''}>
        {/* Only a table that scrolls is a focusable, labelled region (keyboard
            users scroll it); the figcaption above already names the table.
            `relative` keeps absolutely positioned descendants (sr-only text)
            inside the overflow clip. */}
        <div
          role={scrolls ? 'region' : undefined}
          aria-label={scrolls ? `${(lead ?? 'Table').replace(/\.$/, '')} (scrolls sideways)` : undefined}
          tabIndex={scrolls ? 0 : undefined}
          className={`relative overflow-x-auto overscroll-x-contain border-subtle ${frame} ${scrolls ? FOCUS_RING : ''}`}
          style={SCROLL_CUE}
        >
          <table className="w-full border-collapse text-left text-[0.8rem] sm:text-[0.86rem]" style={{ minWidth }}>
            <thead>
              <tr className="border-b border-strong">
                {b.columns.map((c, j) => {
                  const cls = `px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-muted ${
                    numeric.has(j) ? 'text-right' : ''
                  } ${sticky(j)}`;
                  const style = j === 0 ? { background: CELL_BG } : undefined;
                  // An empty corner cell is not a header.
                  return c.trim() === '' ? (
                    <td key={j} className={cls} style={style} />
                  ) : (
                    <th key={j} scope="col" className={cls} style={style}>
                      <Inline text={c} />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, i) => {
                const hi = highlight.has(i);
                return (
                  <tr
                    key={i}
                    className="border-b border-subtle last:border-b-0"
                    style={hi ? { background: HIGHLIGHT_BG } : undefined}
                  >
                    {row.map((cell, j) => {
                      const cls = `px-3 py-2 align-top ${numeric.has(j) ? 'text-right tabular-nums' : ''} ${
                        hi ? 'text-primary' : 'text-secondary'
                      }`;
                      if (j > 0) {
                        return (
                          <td key={j} className={`${cls} ${hi ? 'font-semibold' : ''}`}>
                            <Inline text={cell} />
                          </td>
                        );
                      }
                      if (continues(i)) return null;
                      const rows = span(i);
                      return (
                        <th
                          key={j}
                          scope="row"
                          rowSpan={rows > 1 ? rows : undefined}
                          className={`${cls} ${sticky(j)} ${hi ? 'font-semibold' : 'font-medium'}`}
                          style={{
                            background: hi ? HIGHLIGHT_BG : CELL_BG,
                            boxShadow: hi ? 'inset 3px 0 0 var(--accent)' : undefined,
                          }}
                        >
                          <Inline text={cell} />
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {b.note && (
        <p className="mt-2 text-[0.74rem] leading-relaxed text-muted sm:text-[0.78rem]">
          <Inline text={b.note} />
        </p>
      )}
    </figure>
  );
}
