import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLATFORM_URL } from '../../lib/config';

export function ClosingCTA() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-2xl px-5 py-5 sm:rounded-3xl sm:px-7 sm:py-6"
        >
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1.35fr_auto] lg:items-center lg:gap-8">
            <div>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">
                ShifaMind · ready to evaluate
              </div>
              <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">
                Bring your notes.{' '}
                <span className="gradient-text">See the concepts behind every code.</span>
              </h2>
              <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
                Try pasted notes today, or talk to us about an evaluation path for your workflow.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                Try ShifaMind
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.88rem] font-medium text-secondary transition hover:border-strong hover:text-primary"
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
