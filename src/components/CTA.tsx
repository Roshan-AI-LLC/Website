import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl px-5 py-6 sm:px-7 sm:py-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--accent) 24%, transparent), transparent 68%)',
            }}
          />

          <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
            <div>
              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.15em] text-accent">
                Clinicians · developers · partners
              </div>
              <h2 className="mt-2 text-balance font-display text-[1.55rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[1.9rem]">
                Build with <span className="gradient-text">Roshan AI.</span>
              </h2>
              <p className="mt-2 max-w-xl text-[0.86rem] leading-relaxed text-secondary sm:text-[0.92rem]">
                Pilot ShifaMind, integrate the API, or talk to us about your clinical workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.84rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                Book a demo
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/products/shifamind"
                className="inline-flex items-center gap-1.5 rounded-full border border-subtle bg-glass px-4 py-2.5 text-[0.84rem] font-medium text-secondary transition hover:border-strong hover:text-primary"
              >
                See ShifaMind
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
