import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ANNOUNCEMENTS } from '../../data/homeCopy';
import { ClaudeStartupsMark } from '../ClaudeStartupsMark';
import { InceptionBadge } from '../InceptionBadge';

/** Width shared by both marks so their plates match. NVIDIA's minimum is 110. */
const MARK_WIDTH = 120;

/**
 * The band pinned to the bottom of the hero's first screen (rendered as the
 * hero's children): programs on the left, a slow marquee of the company's
 * announcements (the press releases, newest first) on the right. Below lg the marks sit centred with the marquee beneath.
 * Both trademark lines live in the footer. The marks are never animated.
 *
 * `#programs` and `.hero-band-inner` are tightened on short screens in
 * index.css.
 */
export function HeroBand() {
  return (
    <div id="programs" className="enter-fade-up enter-d-5 relative mt-6 scroll-mt-24 sm:mt-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="hero-band-inner flex flex-col items-center gap-2.5 border-t border-subtle pt-3.5 sm:gap-4 sm:pt-6 lg:flex-row lg:gap-8">
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:flex-nowrap sm:gap-4">
            <span className="sr-only text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted sm:not-sr-only">
              Member of
            </span>
            <div className="flex items-center gap-3">
              <InceptionBadge width={MARK_WIDTH} />
              <ClaudeStartupsMark width={MARK_WIDTH} />
            </div>
          </div>

          <span
            aria-hidden
            className="hidden h-9 w-px shrink-0 lg:block"
            style={{ background: 'var(--border-strong)' }}
          />

          <Marquee />
        </div>
      </div>
    </div>
  );
}

/**
 * Two identical lists side by side, the track sliding left by exactly one of
 * them, so the loop is seamless. The copy is aria-hidden. Pauses on hover,
 * offscreen and from its own pause button (moving text needs a way to stop
 * it); static, with no button, under reduced motion (index.css).
 */
function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => setInView(entries[entries.length - 1].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="flex w-full min-w-0 items-center gap-2 lg:flex-1">
      <div
        ref={ref}
        data-paused={inView && !stopped ? undefined : ''}
        className="hero-marquee min-w-0 flex-1 overflow-hidden"
      >
        <div className="hero-marquee-track flex w-max">
          <MarqueeList />
          <MarqueeList copy />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setStopped((s) => !s)}
        aria-label={stopped ? 'Play scrolling announcements' : 'Pause scrolling announcements'}
        className="relative grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full border border-subtle text-muted transition before:absolute before:-inset-1.5 hover:border-strong hover:text-primary motion-reduce:hidden"
      >
        {stopped ? <Play size={11} aria-hidden /> : <Pause size={11} aria-hidden />}
      </button>
    </div>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-10-13" to "Oct 2026", without Date, so server and client agree. */
function monthYear(iso: string) {
  const [y, m] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/**
 * One pass of the announcements. The copy is hidden from screen readers and
 * its links leave the tab order, so each announcement is read and reached once.
 */
function MarqueeList({ copy = false }: { copy?: boolean }) {
  return (
    <ul aria-hidden={copy || undefined} className="flex shrink-0 items-center py-1">
      {ANNOUNCEMENTS.map((a, i) => (
        <li key={a.href} className="flex shrink-0 items-center whitespace-nowrap">
          <Link
            to={a.href}
            tabIndex={copy ? -1 : undefined}
            className="group inline-flex items-center gap-2.5 rounded-full py-1 text-[0.82rem] font-medium text-secondary transition-colors hover:text-primary sm:text-[0.86rem]"
          >
            {i === 0 ? (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">
                New
              </span>
            ) : (
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.06em] text-muted">
                {monthYear(a.date)}
              </span>
            )}
            <span className="text-primary">{a.text}</span>
            <ArrowUpRight
              size={13}
              aria-hidden
              className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
          <span
            aria-hidden
            className="mx-6 size-[5px] shrink-0 rotate-45 rounded-[1px] sm:mx-8"
            style={{ background: 'var(--accent)', opacity: 0.55 }}
          />
        </li>
      ))}
    </ul>
  );
}
