import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export type LegalSection = {
  /** Anchor id (kebab-case). */
  id: string;
  heading: string;
  body: ReactNode;
};

type Props = {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  intro: ReactNode;
  sections: LegalSection[];
};

export function LegalLayout({ eyebrow, title, effectiveDate, intro, sections }: Props) {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
          <div className="aurora h-[420px] w-[1100px] max-w-full opacity-40" />
        </div>

        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {eyebrow}
            </div>

            <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[2.6rem]">
              {title}
            </h1>

            <p className="mt-3 text-[0.86rem] text-muted">
              Effective {effectiveDate} · Roshan AI LLC, Arizona, USA
            </p>

            <div
              className="mt-6 rounded-2xl border px-4 py-3 text-[0.82rem]"
              style={{
                borderColor: 'color-mix(in oklab, var(--accent-warm) 35%, transparent)',
                background: 'color-mix(in oklab, var(--accent-warm) 8%, transparent)',
                color: 'var(--text-secondary)',
              }}
            >
              <span className="font-semibold" style={{ color: 'var(--accent-warm)' }}>
                Draft.
              </span>{' '}
              This document is a working draft, written for the public website
              before launch. It will be reviewed by counsel and may change before
              it is final. For questions email{' '}
              <a href="mailto:founder@roshan-ai.com" className="underline">
                founder@roshan-ai.com
              </a>
              .
            </div>

            <div className="mt-8 text-[1rem] font-light leading-relaxed text-secondary">
              {intro}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {/* Table of contents */}
          <nav
            aria-label="Table of contents"
            className="glass mb-10 rounded-2xl p-5"
          >
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
              Contents
            </div>
            <ol className="mt-3 grid gap-1.5 text-[0.88rem] sm:grid-cols-2">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-baseline gap-2 text-secondary transition hover:text-accent"
                  >
                    <span className="font-mono text-[0.72rem] text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{s.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {sections.map((s, i) => (
              <article
                key={s.id}
                id={s.id}
                className="scroll-mt-32"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.78rem] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-[1.25rem] font-semibold tracking-[-0.015em] sm:text-[1.4rem]">
                    {s.heading}
                  </h2>
                </div>
                <div className="mt-3 space-y-3 text-[0.96rem] font-light leading-relaxed text-secondary">
                  {s.body}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
