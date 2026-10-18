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
  Unplug,
  Waves,
} from 'lucide-react';
import type { ElementType } from 'react';
import { SectionLabel } from '../../../components/SectionLabel';
import { SentryDemoBlock } from '../../../components/nabzsentry/SentryDemoBlock';
import { NABZSENTRY, NABZSENTRY_PAPER_URL, fmt } from '../../../data/nabzPapers';

const decisions: { icon: ElementType; code: string; name: string; desc: string }[] = [
  {
    icon: SignalHigh,
    code: '01',
    name: 'Keep',
    desc: 'Likely real. It reaches the clinician as it does today.',
  },
  {
    icon: BellOff,
    code: '02',
    name: 'Suppress',
    desc: 'Likely false. Silenced, within the budget you set.',
  },
  {
    icon: HelpCircle,
    code: '03',
    name: 'Defer',
    desc: 'Too uncertain to call. A clinician reviews it.',
  },
];

const budget = `${NABZSENTRY.budgetPct}%`;

export default function NabzSentryProduct() {
  return (
    <div className="theme-nabz">
      <Head>
        <title>NabzSentry: VT alarm triage for intensive care | Roshan AI</title>
        <meta
          name="description"
          content={`NabzSentry triages ICU VT alarms into keep, suppress or defer. At a certified ${budget} error budget it suppresses ${fmt(NABZSENTRY.falseAlarmsSuppressedPct)}% of false alarms. Part of the Nabz model family from Roshan AI.`}
        />
        <meta property="og:title" content="NabzSentry: fewer false alarms, with a limit you set on the real ones." />
        <meta
          property="og:description"
          content="Three-way triage of ICU VT alarms: keep, suppress, or defer to a clinician, with a certified limit on how many suppressed alarms are genuine."
        />
        <link rel="canonical" href="https://roshan-ai.com/products/nabz/sentry" />
      </Head>

      <section className="relative isolate overflow-hidden pt-[5.5rem] pb-8 sm:pt-40 sm:pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
          <div className="aurora h-[420px] w-[1100px] max-w-full opacity-60" />
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="enter-fade-up flex flex-wrap items-center gap-2">
            {/* -my-3/py-3: a 40px tap target without moving the row. */}
            <Link
              to="/products/nabz"
              className="-my-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-secondary transition hover:text-primary"
            >
              NabzSentry · Nabz family
            </Link>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
              Preprint
            </span>
          </div>

          <h1 className="enter-fade-up enter-d-1 mt-4 max-w-4xl text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-6 sm:text-[3rem] lg:text-[3.5rem]">
            Fewer false alarms, with a limit{' '}
            <span className="gradient-text">you set on the real ones.</span>
          </h1>

          <p className="enter-fade-up enter-d-2 mt-3 max-w-2xl text-pretty text-[0.9rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
            Most ICU VT alarms are false. Sentry silences them within an
            error budget you set.
          </p>

          {/* Phones: full-width stacked actions; the wrapping row returns at sm. */}
          <div className="enter-fade-up enter-d-3 mt-5 grid flex-wrap items-center gap-2 sm:mt-8 sm:flex sm:gap-3">
            <Link
              to="/contact"
              className="btn-primary group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold"
            >
              <Stethoscope size={14} />
              Talk to us
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href={NABZSENTRY_PAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-subtle bg-glass px-5 py-2.5 text-[0.88rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
            >
              <FileText size={14} />
              Read the paper
            </a>
          </div>

          <div className="enter-fade-up enter-d-3 mt-6 grid max-w-3xl grid-cols-3 overflow-hidden rounded-2xl border border-subtle bg-glass sm:mt-12">
            <Stat
              value={`${fmt(NABZSENTRY.falseAlarmsSuppressedPct)}%`}
              label="False alarms suppressed"
              sub={`At a ${budget} error budget`}
            />
            <Stat
              value={`${fmt(NABZSENTRY.genuineSilencedPct)}%`}
              label="Genuine alarms silenced"
              sub="Expert-labelled VT alarms"
            />
            <Stat value={fmt(NABZSENTRY.auroc, 3)} label="AUROC" sub="On par with best published" />
          </div>
        </div>
      </section>

      <DemoSection />

      <Divider />

      <section className="relative py-10 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <SectionLabel>The decision</SectionLabel>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 max-w-2xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
              >
                Three outcomes, because two{' '}
                <span className="gradient-text">forces a guess.</span>
              </motion.h2>
            </div>
            {/* Phones: side note hidden; the Defer card makes the same point. */}
            <p className="hidden max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:block sm:text-right sm:text-[0.9rem]">
              A two-way filter must commit on every alarm, even unreadable ones.
            </p>
          </div>

          <div className="mobile-rail-shell glass mt-5 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
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
                    className="flex gap-3 p-4 sm:p-6 md:block"
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

          {/* The model, in one row from sm. Phones: a two-column grid, the
              label on the left and both items stacked beside it. */}
          <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 text-[0.8rem] text-secondary sm:mt-5 sm:flex sm:flex-wrap sm:gap-x-5 sm:text-[0.86rem]">
            <span className="row-span-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted sm:row-span-1">
              Model
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Waves size={14} className="shrink-0 text-accent" />
              {NABZSENTRY.channels} waveform channels
              <span className="hidden text-muted sm:inline">· ECG, arterial pressure, pleth</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Unplug size={14} className="shrink-0 text-accent" />
              Works with missing channels
            </span>
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative py-10 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionLabel>The guarantee</SectionLabel>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 max-w-3xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
          >
            You set the budget.{' '}
            <span className="gradient-text">Sentry certifies it.</span>
          </motion.h2>

          <div className="glass mt-5 grid max-w-3xl grid-cols-3 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
            <Stat value={budget} label="Error budget" sub="Max genuine among suppressed" />
            <Stat value={`${NABZSENTRY.confidencePct}%`} label="Confidence" sub="Checked on labelled alarms" />
            <Stat
              value={`${NABZSENTRY.seedsCertified.certified} of ${NABZSENTRY.seedsCertified.of}`}
              label="Runs certified"
              sub={`At the ${budget} budget`}
            />
          </div>

          <p className="mt-4 flex max-w-3xl gap-2 text-[0.84rem] leading-relaxed text-secondary sm:mt-5 sm:text-[0.92rem]">
            <ShieldCheck size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-accent" />
            <span>
              If a budget can’t be certified, Sentry says so and estimates the
              labelled data it would need.
            </span>
          </p>

          <p className="mt-3 max-w-3xl text-[0.78rem] leading-relaxed text-muted sm:text-[0.82rem]">
            Research artifact, evaluated retrospectively. Not a medical device.
          </p>
        </div>
      </section>

      <section className="relative py-8 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative overflow-hidden rounded-2xl p-5 sm:rounded-3xl sm:p-9"
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
              NabzSentry · preprint
            </div>
            <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">
              Alarm data to test this on?
            </h2>
            <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
              We’re looking for alarm cohorts and research partners.
            </p>
            {/* Phones: full-width stacked actions; the wrapping row returns at sm. */}
            <div className="mt-4 grid flex-wrap gap-2 sm:mt-5 sm:flex sm:gap-3">
              <Link
                to="/contact"
                className="btn-primary group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold"
              >
                Start a conversation
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/products/nabz"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-subtle bg-glass px-5 py-2.5 text-[0.88rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
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

function DemoSection() {
  return (
    <section className="relative py-8 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex flex-col items-start gap-2.5 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Try it</SectionLabel>
              <h2 className="mt-3 text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.2rem]">
                See Sentry triage an alarm.
              </h2>
            </div>
            {/* Stays on phones: it carries the demo's one instruction and
                says the signals are synthetic. */}
            <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
              Pick an alarm, run Sentry, then change the budget. Synthetic signals.
            </p>
          </div>

          <SentryDemoBlock />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    // Divider colour: `.border-subtle` is a plain class Tailwind cannot put
    // under a variant, so `[&:not(:first-child)]:border-subtle` never applied
    // and the line fell back to currentColor.
    <div className="min-w-0 px-2 py-3 sm:px-5 sm:py-4 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-[color:var(--border-subtle)]">
      <div className="font-mono text-[1.05rem] font-semibold tracking-tight text-accent sm:text-[1.55rem]">
        {value}
      </div>
      {/* Label and caption wrap rather than truncate: the captions qualify
          the numbers, and at 640-800px they no longer fit on one line. */}
      <div className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.05em] text-secondary sm:text-[0.74rem] sm:tracking-[0.07em]">
        {label}
      </div>
      <div className="mt-0.5 text-[0.72rem] text-muted sm:text-[0.7rem]">{sub}</div>
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
