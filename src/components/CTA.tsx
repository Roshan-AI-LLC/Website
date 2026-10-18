import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CLOSING } from '../data/homeCopy';
import { REQUEST_ACCESS_URL } from '../lib/config';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Home closing call to action: one short glass panel that follows the theme.
 * Headline and line on the left, the one action (request access) on the right from lg;
 * stacked and compact below that.
 */
export function CTA() {
  return (
    <section
      id="get-started"
      aria-labelledby="closing-title"
      className="mobile-native-section relative scroll-mt-24 pt-12 pb-16 sm:pt-6 sm:pb-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div
            className="glass relative isolate overflow-hidden rounded-2xl px-4 py-4 sm:rounded-[1.75rem] sm:px-10 sm:py-9"
          >
            {/* A faint accent glow behind the actions and a hairline along the top. */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 45% 120% at 100% 50%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)',
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 45%, transparent), transparent)',
                }}
              />
            </div>

            <div className="grid gap-3 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
              <div className="min-w-0">
                <h2
                  id="closing-title"
                  className="text-balance font-display text-[1.2rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[2rem] lg:text-[2.25rem]"
                >
                  {CLOSING.h2.lead} <span className="gradient-text">{CLOSING.h2.accent}</span>
                </h2>
                {/* Phones: the heading and button carry the banner; the line returns at sm. */}
                <p className="mt-2 hidden max-w-xl text-pretty text-[0.88rem] leading-relaxed text-secondary sm:block sm:text-[0.98rem]">
                  {CLOSING.line}
                </p>
              </div>

              <div className="flex">
                <a
                  href={REQUEST_ACCESS_URL}
                  className="btn-primary group inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[0.84rem] font-semibold transition hover:-translate-y-0.5 active:scale-[0.98] sm:min-h-12 sm:gap-2 sm:px-6 sm:text-[0.95rem]"
                >
                  {CLOSING.cta}
                  <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
