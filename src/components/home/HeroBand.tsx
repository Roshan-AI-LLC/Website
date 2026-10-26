import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ANNOUNCEMENTS } from '../../data/homeCopy';
import { ClaudeStartupsMark } from '../ClaudeStartupsMark';
import { InceptionBadge } from '../InceptionBadge';

/** Width shared by both marks so their plates match. NVIDIA's minimum is 110. */
const MARK_WIDTH = 120;

/** Must match the transform transition on `.hero-ticker-list` in index.css. */
const SLIDE_MS = 700;

/**
 * The band pinned to the bottom of the hero's first screen (rendered as the
 * hero's children): programs on the left, the company's announcements (the
 * press releases, newest first) on the right, one at a time, sliding up. Below
 * lg the marks sit centred with the announcements beneath.
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

          <Ticker />
        </div>
      </div>
    </div>
  );
}

/**
 * One announcement at a time, holding still to be read, then sliding up to the
 * next. A copy of the first sits after the last, so the loop always moves up:
 * after sliding onto the copy the list jumps back to the real first without a
 * transition. The ring on the pause button is the clock: each lap of it
 * advances one announcement, so pausing (hover, keyboard focus, offscreen, the
 * button) freezes the ring and the list together. Keyboard focus on a hidden
 * announcement brings it into view. Under reduced motion it starts paused and
 * swaps without sliding (index.css).
 */
function Ticker() {
  const n = ANNOUNCEMENTS.length;
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);
  const [inView, setInView] = useState(true);
  const [stopped, setStopped] = useState(false);
  // The clock only runs once React is live, so the server render and the first
  // client render agree and no lap can end before its handler is attached.
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      setStopped(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => setInView(entries[entries.length - 1].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Landed on the copy of the first: once the slide ends, jump to the real one.
  useEffect(() => {
    if (index !== n) return;
    const t = window.setTimeout(() => {
      setInstant(true);
      setIndex(0);
    }, SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index, n]);

  // Turn transitions back on once the jump has painted.
  useEffect(() => {
    if (!instant) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setInstant(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [instant]);

  const advance = () => setIndex((i) => (reduced ? (i + 1) % n : Math.min(i + 1, n)));

  if (n === 0) return null;
  const many = n > 1;
  const items = many ? [...ANNOUNCEMENTS, ANNOUNCEMENTS[0]] : ANNOUNCEMENTS;

  return (
    <div
      data-paused={inView && !stopped ? undefined : ''}
      className="hero-ticker-wrap flex w-full min-w-0 items-center gap-2 lg:flex-1"
    >
      <div ref={ref} className="hero-ticker h-9 min-w-0 flex-1 overflow-hidden">
        <ul
          aria-label="Announcements"
          data-instant={instant ? '' : undefined}
          className="hero-ticker-list"
          style={{ transform: `translateY(${-index * 2.25}rem)` }}
        >
          {items.map((a, i) => {
            const copy = i === n;
            return (
              <li
                key={copy ? 'copy' : a.href}
                aria-hidden={copy || undefined}
                className="flex h-9 items-center justify-center lg:justify-start"
              >
                <Link
                  to={a.href}
                  tabIndex={copy ? -1 : undefined}
                  onFocus={() => {
                    setInstant(false);
                    setIndex(i);
                  }}
                  className="group inline-flex min-w-0 max-w-full items-center gap-2.5 rounded-full py-1 text-[0.82rem] font-medium text-secondary transition-colors hover:text-primary focus-visible:outline-offset-2 max-[374px]:text-[0.78rem] sm:text-[0.86rem]"
                >
                  {/* A fixed slot from lg, so every title starts at the same x as it slides in.
                      Phones keep the New chip but drop the month, so the titles fit whole. */}
                  {i % n === 0 ? (
                    <span className="flex shrink-0 lg:w-[4.75rem]">
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">
                        New
                      </span>
                    </span>
                  ) : (
                    <span className="hidden shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-muted sm:flex lg:w-[4.75rem]">
                      {monthYear(a.date)}
                    </span>
                  )}
                  <span className="truncate text-primary">{a.text}</span>
                  <ArrowUpRight
                    size={13}
                    aria-hidden
                    className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {many && (
        <button
          type="button"
          onClick={() => setStopped((s) => !s)}
          aria-label={stopped ? 'Play rotating announcements' : 'Pause rotating announcements'}
          className="hero-ticker-btn relative grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full border border-subtle text-muted transition before:absolute before:-inset-1.5 hover:border-strong hover:text-primary"
        >
          {mounted && !stopped && (
            <svg aria-hidden viewBox="0 0 28 28" className="pointer-events-none absolute -inset-px -rotate-90">
              <circle
                key={index % n}
                cx="14"
                cy="14"
                r="13"
                pathLength={1}
                className="hero-ticker-clock"
                onAnimationEnd={advance}
              />
            </svg>
          )}
          {stopped ? <Play size={11} aria-hidden /> : <Pause size={11} aria-hidden />}
        </button>
      )}
    </div>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-10-13" to "Oct 2026", without Date, so server and client agree. */
function monthYear(iso: string) {
  const [y, m] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
