import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLATFORM_URL } from '../../lib/config';

export function ClosingCTA() {
  return (
    <section className="mobile-native-section relative py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:px-7 sm:py-6"
        >
          {/* Phones: one compact card; the buttons say what the side line
              says, so it returns at sm and the buttons sit side by side. */}
          <div className="relative z-10 grid gap-4 sm:gap-5 lg:grid-cols-[1.35fr_auto] lg:items-center lg:gap-8">
            <div>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">
                ShifaMind · ready to evaluate
              </div>
              <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">
                Bring your notes.{' '}
                <span className="gradient-text">See the concepts behind every code.</span>
              </h2>
              <p className="mt-2 hidden max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:block sm:text-[0.92rem]">
                Try pasted notes today, or talk to us about an evaluation path for your workflow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row lg:justify-end">
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 py-3 text-[0.84rem] font-semibold transition will-change-transform hover:-translate-y-0.5 sm:gap-2 sm:px-5 sm:text-[0.88rem]"
              >
                Try ShifaMind
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-3 py-3 text-[0.84rem] font-medium text-secondary transition hover:border-strong hover:text-primary sm:gap-2 sm:px-5 sm:text-[0.88rem]"
              >
                Book a demo
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 80% 50%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 66%)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
