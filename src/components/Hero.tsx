import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SHIFAMIND, TASK, pct } from '../data/shifamindPaper';
import { ConceptNetwork } from './home/ConceptNetwork';

/**
 * Hero right-hand visual.
 *   'network' renders the concept-mediated network illustration.
 *   'none'    drops it and the hero becomes a single centred column.
 * Change this one value to switch. Nothing else needs to move.
 */
const HERO_VISUAL: 'network' | 'none' = 'network';

const proofPoints = [
  { value: pct(SHIFAMIND.aucMicro), label: 'Micro-AUROC' },
  { value: pct(SHIFAMIND.aucMacro), label: 'Macro-AUROC' },
  { value: TASK.codes.toLocaleString('en-US'), label: 'ICD-10 codes' },
];

/** Latest announcement, shown as the pill above the headline. */
const ANNOUNCEMENT = {
  text: 'Roshan AI joins Claude Startups',
  to: '/company/press/claude-startups',
};

/**
 * The hero fills at least one screen from sm up, with `children` (the
 * programs row) pinned to its bottom edge, so the next section always starts
 * below the fold instead of peeking in under a short hero. Phones skip the
 * full-screen minimum: the hero is compact there and the next section
 * follows straight on.
 */
export function Hero({ children }: { children?: ReactNode }) {
  const withVisual = HERO_VISUAL === 'network';

  return (
    <section
      id="top"
      className="relative isolate flex flex-col overflow-hidden pt-[5.5rem] pb-7 sm:min-h-svh sm:pt-28 sm:pb-10"
    >
      {/* Centres the headline block in whatever height the bottom row leaves. */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-5 sm:px-8">
        {/* The glow sits behind the content, wherever centring puts it: at the
            top on phones (stacked content), on its centre from md up. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-[5] flex justify-center md:top-1/2 md:-translate-y-1/2">
          <div className="aurora h-[400px] w-[1000px] max-w-full opacity-70 sm:h-[460px] sm:w-[1200px]" />
        </div>

        <div
          className={
            withVisual
              ? 'grid w-full items-center gap-7 sm:gap-9 md:grid-cols-[1.05fr_0.95fr] md:gap-8 lg:gap-14'
              : 'w-full'
          }
        >
          <div className={withVisual ? 'min-w-0' : 'min-w-0 max-w-3xl'}>
            {/* Phones: an invisible ::before stretches the 26px pill to a 42px tap target without moving anything. */}
            <Link
              to={ANNOUNCEMENT.to}
              className="enter-fade-up group relative inline-flex max-w-full items-center gap-2 rounded-full border border-subtle bg-glass py-1 pl-1 pr-3 text-[0.74rem] font-medium text-secondary backdrop-blur transition before:absolute before:inset-x-0 before:-inset-y-2 hover:border-strong hover:text-primary sm:static sm:text-[0.8rem] sm:before:hidden"
            >
              <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">
                New
              </span>
              <span className="truncate">{ANNOUNCEMENT.text}</span>
              <ArrowRight
                size={12}
                className="shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <h1
              className={`enter-fade-up enter-d-1 mt-4 text-balance font-display font-bold leading-[1.03] tracking-[-0.045em] sm:mt-7 ${
                withVisual
                  ? 'max-w-2xl text-[2.15rem] sm:text-[3.3rem] md:text-[2.6rem] lg:text-[4rem]'
                  : 'max-w-3xl text-[2.4rem] sm:text-[3.8rem] lg:text-[4.75rem]'
              }`}
            >
              Clinical AI you can{' '}
              <span className="gradient-text">verify.</span>
            </h1>

            <p className="enter-fade-up enter-d-2 mt-3 max-w-xl text-pretty text-[0.96rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
              Roshan AI builds clinical-grade models that surface the concepts
              and evidence behind every prediction.
            </p>

            {/* Phones: button and link share one row (wrapping only on the narrowest screens). */}
            <div className="enter-fade-up enter-d-3 mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3">
              <Link
                to="/products/shifamind"
                className="btn-primary group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto sm:px-5"
              >
                Explore ShifaMind
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <a
                href="#benchmark"
                className="group inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full border border-transparent bg-transparent px-0 text-[0.8rem] font-semibold text-secondary transition hover:text-primary sm:min-h-11 sm:w-auto sm:text-[0.84rem]"
              >
                View benchmark
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <div
              className="enter-fade-up enter-d-4 mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-subtle bg-glass sm:mt-8 sm:max-w-xl"
              aria-label="Roshan AI proof points"
            >
              {proofPoints.map((proof, index) => (
                <div
                  key={proof.label}
                  className={`min-w-0 px-2 py-2.5 sm:px-4 sm:py-3 ${
                    index > 0 ? 'border-l border-subtle' : ''
                  }`}
                >
                  <div className="truncate font-display text-[0.92rem] font-semibold tracking-[-0.025em] text-primary sm:text-[1.1rem]">
                    {proof.value}
                  </div>
                  <div className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted sm:text-[0.66rem]">
                    {proof.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {withVisual && (
            <div className="enter-fade-up enter-d-3 relative w-full max-w-xl md:max-w-none">
              <ConceptNetwork />
            </div>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
