import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/** Reading column (about 44rem): text, tables and figures all share it. */
export const TEXT_COL = 'mx-auto w-full max-w-[44rem]';

/** Phones: wide blocks bleed to the screen edge (the page gutter is 1.25rem). */
export const BLEED = '-mx-5 sm:mx-0';

export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]';

/**
 * Scroll cue for a horizontally scrolling table: a soft shadow at whichever
 * edge has more columns behind it, painted with CSS alone (the covers scroll
 * with the content, the shadows stay put), so it is right in the prerender and
 * vanishes when nothing overflows.
 */
export const SCROLL_CUE: CSSProperties = {
  backgroundColor: 'var(--bg-elev)',
  backgroundImage: [
    'linear-gradient(to right, var(--bg-elev) 35%, transparent)',
    'linear-gradient(to left, var(--bg-elev) 35%, transparent)',
    'radial-gradient(farthest-side at 0 50%, color-mix(in oklab, var(--text-primary) 18%, transparent), transparent)',
    'radial-gradient(farthest-side at 100% 50%, color-mix(in oklab, var(--text-primary) 18%, transparent), transparent)',
  ].join(', '),
  backgroundPosition: 'left center, right center, left center, right center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '2.5rem 100%, 2.5rem 100%, 0.85rem 100%, 0.85rem 100%',
  backgroundAttachment: 'local, local, scroll, scroll',
};

/**
 * Defines --warm-ink, the coral for small text, on the element it is put on.
 * --accent-warm (#d44d4d) is 3.5-4:1 on the light surfaces, under WCAG AA for
 * small labels, so light mode takes a darker coral (5.2:1 or better on the
 * page, the cards and the highlighted row); dark mode keeps the token (7.3:1).
 */
export const WARM_INK = '[--warm-ink:#a93838] dark:[--warm-ink:var(--accent-warm)]';

/** Opaque fills, so a sticky first column hides what scrolls under it. */
export const CELL_BG = 'var(--bg-elev)';
export const HIGHLIGHT_BG = 'color-mix(in oklab, var(--accent) 10%, var(--bg-elev))';

/**
 * A <details> that starts folded (phones) and opens itself from `sm` up once
 * mounted. The prerender and the first client render are the same (folded);
 * the effect only runs after hydration, and the folded parts sit far below
 * the fold on a desktop.
 */
export function FoldOnPhone({
  summary,
  children,
  className = '',
  summaryClassName = '',
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (ref.current && window.matchMedia('(min-width: 640px)').matches) ref.current.open = true;
  }, []);
  return (
    <details ref={ref} className={`group ${className}`}>
      <summary
        className={`flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-md [&::-webkit-details-marker]:hidden ${FOCUS_RING} ${summaryClassName}`}
      >
        {summary}
        <ChevronDown size={16} aria-hidden className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" />
      </summary>
      {children}
    </details>
  );
}

/** "Scroll for more" line shown above wide tables on phones. */
export function SwipeHint() {
  return (
    <div aria-hidden className="mb-1.5 text-right text-[0.68rem] font-medium text-muted sm:hidden">
      Swipe for more columns →
    </div>
  );
}

/** Figure / table caption line: a bold "Table 2." lead, then the caption. */
export function CaptionText({ lead, children }: { lead?: string; children: ReactNode }) {
  return (
    <>
      {lead && <span className="font-semibold text-primary">{lead} </span>}
      {children}
    </>
  );
}
