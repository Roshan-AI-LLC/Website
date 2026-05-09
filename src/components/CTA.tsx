import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function CTA() {
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
                Partners · clinicians · investors
              </div>
              <h2 className="mt-3 text-balance text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]">
                Want a closer look at{' '}
                <span className="gradient-text-warm">ShifaMind</span>?
              </h2>
              <p className="mt-3 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
                We give clinical partners and serious investors a private walkthrough of the
                model, evals, and roadmap. No deck-spam, just the work.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <a
                href="mailto:founder@roshan-ai.com"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-medium text-white transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                Request a demo
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="https://shifamind.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
              >
                Visit shifamind.me
                <ArrowUpRight size={15} />
              </a>
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
