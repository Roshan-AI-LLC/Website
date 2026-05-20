import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLATFORM_URL } from '../../lib/config';

export function ClosingCTA() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-10 sm:p-16"
        >
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_auto] lg:items-center">
            <div>
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
                ShifaMind · ready to evaluate
              </div>
              <h2 className="mt-3 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]">
                Bring your notes.{' '}
                <span className="gradient-text">See the concepts behind every code.</span>
              </h2>
              <p className="mt-3 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
                The platform accepts pasted notes today. API access for
                production integration is gated — talk to us about your
                workflow and we'll fit the path.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
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
                className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
              >
                Book a demo
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              background:
                'radial-gradient(ellipse at 80% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%), radial-gradient(ellipse at 20% 100%, color-mix(in oklab, var(--color-violet-500) 18%, transparent), transparent 60%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--accent) 50%, transparent)',
              opacity: 0.5,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
