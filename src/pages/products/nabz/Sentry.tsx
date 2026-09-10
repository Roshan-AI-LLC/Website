import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BellOff,
  FileText,
  HelpCircle,
  ShieldCheck,
  SignalHigh,
  Stethoscope,
} from 'lucide-react';
import type { ElementType } from 'react';
import { SectionLabel } from '../../../components/SectionLabel';

/**
 * NabzSentry is under anonymous double-blind review. Nothing on this page may
 * identify the submission: no benchmark name, no result figures, no method
 * vocabulary from the paper, no title. Product-level description only.
 *
 * Set PAPER_URL once the preprint is on arXiv, and the button below becomes a
 * real link. Until then it renders as a non-clickable status chip.
 */
const PAPER_URL = '';

const decisions: { icon: ElementType; code: string; name: string; desc: string }[] = [
  {
    icon: SignalHigh,
    code: '01',
    name: 'Keep',
    desc: 'The evidence supports the alarm. It reaches the clinician exactly as it does today, with nothing added to the path.',
  },
  {
    icon: BellOff,
    code: '02',
    name: 'Suppress',
    desc: 'The evidence indicates a false alarm and the model is confident enough to act. This is the only decision that can cause harm, so it is the one placed under an explicit limit.',
  },
  {
    icon: HelpCircle,
    code: '03',
    name: 'Defer',
    desc: 'The evidence is too incomplete or too degraded to act on. A two-way classifier has to guess here. Sentry says so and hands the decision back.',
  },
];

export default function NabzSentryProduct() {
  return (
    <div className="theme-nabz">
      <Head>
        <title>NabzSentry: alarm triage for intensive care | Roshan AI</title>
        <meta
          name="description"
          content="NabzSentry reduces false arrhythmia alarms in intensive care while holding the rate of suppressed genuine alarms under an explicit limit. Part of the Nabz model family from Roshan AI."
        />
        <meta property="og:title" content="NabzSentry: fewer alarms, without silencing the one that matters." />
        <meta
          property="og:description"
          content="Three-way alarm triage for the ICU: keep, suppress, or defer to a clinician, with an explicit limit on suppressing genuine alarms."
        />
        <link rel="canonical" href="https://roshan-ai.com/products/nabz/sentry" />
      </Head>

      <section className="relative isolate overflow-hidden pt-[5.5rem] pb-10 sm:pt-40 sm:pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
          <div className="aurora h-[420px] w-[1100px] max-w-full opacity-60" />
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="enter-fade-up flex flex-wrap items-center gap-2">
            <Link
              to="/products/nabz"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-secondary transition hover:text-primary"
            >
              NabzSentry · Nabz family
            </Link>
            <span
              className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
              style={{ color: 'var(--color-violet-500)' }}
            >
              In review
            </span>
          </div>

          <h1 className="enter-fade-up enter-d-1 mt-4 max-w-4xl text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-6 sm:text-[3rem] lg:text-[3.5rem]">
            Fewer alarms, without silencing{' '}
            <span className="gradient-text">the one that matters.</span>
          </h1>

          <p className="enter-fade-up enter-d-2 mt-4 max-w-2xl text-pretty text-[0.94rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
            Bedside monitors in intensive care produce arrhythmia alarms faster
            than clinical attention can absorb them, and most are false. The
            usual fix is a better classifier, which trades one error for the
            other. NabzSentry changes the shape of the decision instead, and
            puts the harmful error under a limit you set.
          </p>

          <div className="enter-fade-up enter-d-3 mt-6 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3">
            <Link
              to="/contact"
              className="btn-primary group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold"
            >
              <Stethoscope size={14} />
              Talk to us
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            {PAPER_URL ? (
              <a
                href={PAPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-2.5 text-[0.88rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
              >
                <FileText size={14} />
                Read the paper
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-2.5 text-[0.88rem] font-medium text-muted backdrop-blur">
                <FileText size={14} />
                Paper in review · link on publication
              </span>
            )}
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <SectionLabel>The decision</SectionLabel>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 max-w-2xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
              >
                Three outcomes, because two{' '}
                <span className="gradient-text">forces a guess.</span>
              </motion.h2>
            </div>
            <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">
              A binary alarm filter must commit on every event, including the
              ones where the signal has degraded past the point of being
              readable.
            </p>
          </div>

          <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
            <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-3 md:divide-x md:divide-y-0">
              {decisions.map((decision, index) => {
                const Icon = decision.icon;
                return (
                  <motion.div
                    key={decision.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-3 p-5 sm:p-6 md:block"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0 md:mt-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-muted">
                          {decision.code}
                        </span>
                        <h3 className="text-[0.98rem] font-semibold tracking-[-0.01em]">
                          {decision.name}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-secondary sm:text-[0.84rem]">
                        {decision.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <SectionLabel>The guarantee</SectionLabel>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 max-w-3xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
          >
            You set the budget. The evidence has to earn it.
          </motion.h2>

          <div className="glass mt-7 rounded-2xl p-6 sm:mt-9 sm:rounded-3xl sm:p-8">
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <ShieldCheck size={17} strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.9rem] leading-relaxed text-secondary sm:text-[0.96rem]">
                  Suppressing an alarm is the only Sentry decision that can hurt
                  a patient, so it carries an explicit limit. You choose the
                  fraction of genuine alarms the system is permitted to silence.
                  Sentry then holds to that limit with statistical confidence,
                  established on a labelled sample and not on an assumption
                  about how the model will generalise.
                </p>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-secondary sm:text-[0.96rem]">
                  A limit like this costs something, and how much depends on how
                  much labelled data you have. When the budget cannot be met,
                  Sentry reports that plainly and says what would be needed to
                  meet it.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-[0.78rem] leading-relaxed text-muted sm:text-[0.82rem]">
            NabzSentry is a research artifact. It is not connected to any
            clinical system, is not a medical device, and is not cleared for
            patient care. Evaluation to date is retrospective, on public
            de-identified data.
          </p>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative overflow-hidden rounded-2xl p-6 sm:rounded-3xl sm:p-9"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-[1]"
              style={{
                background:
                  'radial-gradient(ellipse at 80% 50%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 66%)',
              }}
            />
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              NabzSentry · in review
            </div>
            <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">
              Alarm data to test this on?
            </h2>
            <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
              We are looking for retrospective alarm cohorts and research
              collaborators. The full method and results publish with the paper.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-primary group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold"
              >
                Start a conversation
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/products/nabz"
                className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-2.5 text-[0.88rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
              >
                All Nabz models
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      className="mx-auto h-px max-w-6xl"
      style={{
        background:
          'linear-gradient(90deg, transparent, var(--border-subtle) 20%, var(--border-strong) 50%, var(--border-subtle) 80%, transparent)',
      }}
    />
  );
}
