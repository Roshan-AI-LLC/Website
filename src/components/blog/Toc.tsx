import { useEffect, useState, type MouseEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { jumpToSection } from '../../lib/utils';
import { unfoldAround, useBlog } from './Inline';
import { FOCUS_RING } from './ui';

export type TocEntry = { id: string; text: string };

/**
 * Highlights the section being read. Starts empty, so the prerender and the
 * first client render match; it only updates after mount, on scroll.
 */
function useActiveSection(idKey: string) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const ids = idKey ? idKey.split('|') : [];
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [idKey]);
  return active;
}

/** Desktop (lg+): a sticky rail beside the article. */
export function TocRail({ entries }: { entries: TocEntry[] }) {
  const { path } = useBlog();
  const active = useActiveSection(entries.map((e) => e.id).join('|'));
  return (
    <nav aria-label="On this page" className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4">
      <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">On this page</div>
      <ol className="mt-3 space-y-0.5 border-l border-subtle">
        {entries.map((e) => {
          const on = active === e.id;
          return (
            <li key={e.id}>
              <a
                href={`${path}#${e.id}`}
                onClick={(ev) => jumpToSection(ev, e.id, () => unfoldAround(e.id))}
                aria-current={on ? 'location' : undefined}
                className={`-ml-px block rounded-r-md border-l py-1 pl-3 pr-1 text-[0.8rem] leading-snug transition-colors ${
                  on
                    ? 'border-[color:var(--accent)] font-medium text-accent'
                    : 'border-transparent text-muted hover:text-[color:var(--text-primary)]'
                }`}
              >
                {e.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Phones and tablets: the contents fold behind one row, as on the legal pages. */
export function TocFold({ entries, className = '' }: { entries: TocEntry[]; className?: string }) {
  const { path } = useBlog();
  // Fold the list before scrolling, so the jump lands on the heading rather
  // than where it sat while the open list pushed it down; open the target's
  // section if it is folded.
  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const details = event.currentTarget.closest('details');
    jumpToSection(event, id, () => {
      if (details) details.open = false;
      unfoldAround(id);
    });
  };
  return (
    <nav aria-label="Table of contents" className={`glass rounded-2xl ${className}`}>
      <details className="group">
        <summary
          className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
        >
          <span>
            Contents <span className="ml-1 font-medium normal-case tracking-normal text-muted">· {entries.length} sections</span>
          </span>
          <ChevronDown size={16} aria-hidden className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <ol className="border-t border-subtle px-2 py-1.5 text-[0.88rem]">
          {entries.map((e, i) => (
            <li key={e.id}>
              <a
                href={`${path}#${e.id}`}
                onClick={(ev) => jump(ev, e.id)}
                className="flex min-h-10 items-center gap-2.5 rounded-lg px-2 text-secondary transition-colors hover:text-[color:var(--accent)]"
              >
                <span className="font-mono text-[0.72rem] text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="leading-snug">{e.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
