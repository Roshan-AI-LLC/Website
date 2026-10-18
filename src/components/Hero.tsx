import { ArrowDown, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { HERO } from '../data/homeCopy';
import { REQUEST_ACCESS_URL } from '../lib/config';
import { jumpToSection } from '../lib/utils';
import { ConceptNetwork } from './home/ConceptNetwork';

/**
 * The first screen: headline, one sentence, two actions,
 * and the concept-network illustration beside them (stacked below md).
 *
 * The hero fills at least one screen from sm up, with `children` (the
 * programs and announcements band) pinned to its bottom edge, so the next section
 * always starts below the fold instead of peeking in under a short hero.
 * Phones skip the full-screen minimum: the hero is compact there and the next
 * section follows straight on.
 *
 * Entrance is CSS (.enter-fade-up), so it plays without waiting for JS.
 * `.hero-h1`, `.hero-sub` and `.hero-ctas` are tightened on short screens in
 * index.css (a 1366x768 laptop leaves ~657px of viewport).
 */
export function Hero({ children }: { children?: ReactNode }) {
  return (
    <section
      id="top"
      className="relative isolate flex flex-col overflow-hidden pt-[5.5rem] pb-6 sm:min-h-svh sm:pt-28 sm:pb-8"
    >
      {/* Centres the headline block in whatever height the bottom band leaves. */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-5 sm:px-8">
        {/* The glow sits behind the content, wherever centring puts it: at the
            top on phones (stacked content), on its centre from md up. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-[5] flex justify-center md:top-1/2 md:-translate-y-1/2">
          <div className="aurora h-[400px] w-[1000px] max-w-full opacity-70 sm:h-[460px] sm:w-[1200px]" />
        </div>

        <div className="grid w-full items-center gap-6 sm:gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-8 lg:gap-14">
          <div className="min-w-0">
            <h1 className="hero-h1 enter-fade-up max-w-2xl text-balance font-display text-[2.25rem] font-bold leading-[1.02] tracking-[-0.045em] sm:mt-7 sm:text-[3.3rem] md:text-[2.75rem] lg:text-[4.5rem]">
              {HERO.h1.lead} <span className="gradient-text">{HERO.h1.accent}</span>
            </h1>

            <p className="hero-sub enter-fade-up enter-d-2 mt-3 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
              {HERO.sub.before}
              <mark className="hero-mark">{HERO.sub.mark}</mark>
              {HERO.sub.after}
            </p>

            {/* Phones: both actions share one row, down to a 360px screen
                (below 390px the buttons tighten a touch to stay on it). */}
            <div className="hero-ctas enter-fade-up enter-d-3 mt-5 flex flex-wrap items-center gap-2.5 max-[389px]:gap-1.5 sm:mt-8 lg:gap-3">
              <a
                href={REQUEST_ACCESS_URL}
                className="btn-primary group inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-[0.875rem] font-semibold transition will-change-transform hover:-translate-y-0.5 active:scale-[0.98] max-[389px]:gap-1 max-[389px]:px-3 max-[389px]:text-[0.8rem] lg:min-h-12 lg:gap-2 lg:px-6 lg:text-[0.95rem]"
              >
                {HERO.ctaPrimary}
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>

              <a
                href="/#how-it-works"
                onClick={(e) => jumpToSection(e, 'how-it-works')}
                className="group inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-4 text-[0.875rem] font-semibold text-primary backdrop-blur transition hover:border-strong max-[389px]:gap-1 max-[389px]:px-3 max-[389px]:text-[0.8rem] lg:min-h-12 lg:gap-2 lg:px-6 lg:text-[0.95rem]"
              >
                {HERO.ctaSecondary}
                <ArrowDown
                  size={14}
                  aria-hidden
                  className="transition-transform group-hover:translate-y-0.5"
                />
              </a>
            </div>
          </div>

          {/* Shares the text column's left edge when stacked (sm, 640-767px). */}
          <div className="enter-fade-up enter-d-4 relative w-full max-w-xl md:max-w-none">
            <ConceptNetwork />
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
