import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ReactNode, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { jumpToSection } from '../../lib/utils';
import { SectionLabel } from '../SectionLabel';

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
  const { pathname } = useLocation();

  // Phones: fold the Contents list before scrolling, so the jump lands on the
  // heading rather than where it sat while the open list pushed it down.
  const jumpFromContents = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const contents = event.currentTarget.closest('details');
    jumpToSection(event, id, () => {
      if (contents) contents.open = false;
    });
  };

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
            <SectionLabel>{eyebrow}</SectionLabel>

            <h1 className="mt-2 font-display text-[1.75rem] font-bold leading-[1.05] tracking-[-0.025em] sm:mt-5 sm:text-[2.6rem]">
              {title}
            </h1>

            <p className="mt-2 text-[0.8rem] text-muted sm:mt-3 sm:text-[0.86rem]">
              Effective {effectiveDate} · Roshan AI LLC, Arizona, USA
            </p>

            {/* Phones: slightly tighter box and leading; at sm the py-3 and
                the inherited body line-height (1.55) apply as before. */}
            <div
              className="mt-3 rounded-2xl border px-4 py-2.5 text-[0.8rem] leading-[1.45] sm:mt-6 sm:py-3 sm:text-[0.82rem] sm:leading-[1.55]"
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
              <a href="mailto:mohammed@roshan-ai.com" className="underline">
                mohammed@roshan-ai.com
              </a>
              .
            </div>

            <div className="mt-4 text-[0.9rem] font-light leading-[1.55] text-secondary sm:mt-8 sm:text-[1rem] sm:leading-relaxed">
              {intro}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mobile-native-section relative pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {/* Table of contents. Phones: folded behind its "Contents" label so
              the document starts on screen one; always open from sm up. */}
          <nav
            aria-label="Table of contents"
            className="glass mb-4 rounded-2xl sm:hidden"
          >
            <details className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary [&::-webkit-details-marker]:hidden">
                Contents
                <ChevronDown size={16} className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <ol className="border-t border-subtle px-2 py-1.5 text-[0.88rem]">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`${pathname}#${s.id}`}
                      onClick={(event) => jumpFromContents(event, s.id)}
                      className="flex min-h-10 items-center gap-2.5 rounded-lg px-2 text-secondary transition hover:text-accent"
                    >
                      <span className="font-mono text-[0.72rem] text-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{s.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>
          <nav
            aria-label="Table of contents"
            className="glass mb-10 hidden rounded-2xl p-5 sm:block"
          >
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
              Contents
            </div>
            <ol className="mt-3 grid gap-1.5 text-[0.88rem] sm:grid-cols-2">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`${pathname}#${s.id}`}
                    onClick={(event) => jumpToSection(event, s.id)}
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

          {/* Phones: every word of every section stays; tighter gaps, heading
              leading and a slightly smaller body (0.86rem, 1.55) shorten the
              document. Every sm: value is the desktop original. */}
          <div className="space-y-6 sm:space-y-12">
            {sections.map((s, i) => (
              // Phones already reserve the nav height via html scroll-padding-top,
              // so the extra anchor offset only applies from sm up.
              <article
                key={s.id}
                id={s.id}
                className="scroll-mt-3 sm:scroll-mt-32"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.78rem] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.015em] sm:text-[1.4rem] sm:leading-[1.55]">
                    {s.heading}
                  </h2>
                </div>
                <div className="mt-1.5 space-y-2 text-[0.86rem] font-light leading-[1.55] text-secondary sm:mt-3 sm:space-y-3 sm:text-[0.96rem] sm:leading-relaxed">
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
