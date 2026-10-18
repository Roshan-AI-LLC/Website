import { animate, useInView, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { FIX } from '../../data/homeCopy';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionHead } from './SectionHead';
import { PhoneSteps } from './fix/PhoneSteps';
import { StepList } from './fix/StepList';
import { StepWindow } from './fix/StepWindow';
import { EASE } from './fix/ui';

const N = FIX.steps.length;
const DESKTOP = '(min-width: 1024px)';
/** Longest a click may hold its step while the smooth scroll travels to it. */
const HOLD_MS = 1500;

const clampStep = (v: number) => Math.min(N - 1, Math.max(0, Math.floor(v * N)));

/**
 * The fix, on the alternate band (index.css .band-alt; follows the theme).
 *
 * lg+: a scroll-driven walkthrough. A tall track (one screen plus half a
 * screen per step, sized from the step count) holds a sticky full-height stage: steps on the left, a
 * product window on the right. Scroll position inside the track picks the
 * active step; clicking a step scrolls to it, holding that step while the
 * page travels so the window does not flicker through the steps between.
 *   The stage centres its content, so the track is pulled up and down by
 *   (50svh - 16rem) to keep the gap to the header, and to the next section,
 *   about the same on every screen height. That figure is half the stage
 *   content (about 27.5rem) plus its top/bottom padding offset. The pulled-up
 *   track overlaps the header, so it ignores the pointer except on the grid.
 *
 * md to lg: the same list and window side by side, no pinning; clicking
 * selects. Below md (phones, small tablets): one compact card, one row per step,
 * the same breakpoint the problem section uses.
 */
export function HowItWorks() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const desktop = useRef(false);
  const activeRef = useRef(0);
  /** Step a click is travelling to (desktop), or null. */
  const held = useRef<number | null>(null);
  const holdTimer = useRef(0);
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);

  const play = useInView(windowRef, { margin: '0px 0px 80px 0px' });
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  const show = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
  }, []);

  const release = useCallback(() => {
    held.current = null;
    window.clearTimeout(holdTimer.current);
  }, []);

  const follow = useCallback(
    (v: number) => {
      progress.set(v);
      const i = clampStep(v);
      if (held.current !== null) {
        if (i !== held.current) return;
        release();
      }
      show(i);
    },
    [progress, release, show],
  );

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (desktop.current) follow(v);
  });

  // Desktop is decided in an effect (never during render) so the prerendered
  // markup and the first client render agree.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const sync = () => {
      desktop.current = mq.matches;
      release();
      if (mq.matches) follow(scrollYProgress.get());
      else progress.set(activeRef.current / N);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      release();
    };
  }, [follow, progress, release, scrollYProgress]);

  const select = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (desktop.current && track) {
        const top = track.getBoundingClientRect().top + window.scrollY;
        const range = track.offsetHeight - window.innerHeight;
        if (!reduced) {
          // Light the target now; scroll positions on the way are ignored
          // until the page reaches it (or the hold runs out, e.g. the visitor
          // scrolled elsewhere mid-flight).
          release();
          held.current = i;
          holdTimer.current = window.setTimeout(() => {
            held.current = null;
            if (desktop.current) follow(scrollYProgress.get());
          }, HOLD_MS);
          show(i);
        }
        // Land mid-step so the active step is unambiguous.
        window.scrollTo({ top: top + ((i + 0.5) / N) * range, behavior: reduced ? 'auto' : 'smooth' });
        return;
      }
      show(i);
      if (reduced) progress.set(i / N);
      else animate(progress, i / N, { duration: 0.5, ease: EASE });
    },
    [follow, progress, reduced, release, scrollYProgress, show],
  );

  return (
    <section
      id="how-it-works"
      className="band-alt mobile-native-section relative scroll-mt-24 overflow-x-clip py-16 sm:py-28 lg:pb-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead eyebrow={FIX.eyebrow} lead={FIX.h2.lead} accent={FIX.h2.accent} line={FIX.line} />
      </div>

      <div
        ref={trackRef}
        className="relative mt-14 hidden md:block lg:pointer-events-none lg:mb-[min(0px,calc(16rem_-_50svh))] lg:mt-[min(0px,calc(16rem_-_50svh))] lg:h-[calc(100svh_+_var(--fix-steps)_*_50svh)]"
        style={{ '--fix-steps': N } as CSSProperties}
      >
        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:pb-6 lg:pt-20">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] items-center gap-8 px-8 lg:pointer-events-auto lg:gap-14">
            <StepList active={active} progress={progress} onSelect={select} reduced={reduced} />
            <StepWindow ref={windowRef} active={active} play={play} reduced={reduced} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:hidden">
        <PhoneSteps />
      </div>
    </section>
  );
}
