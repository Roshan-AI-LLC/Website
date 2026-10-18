import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, BellOff, Network, ShieldCheck, Users, Waves } from 'lucide-react';
import type { ElementType } from 'react';
import { SectionLabel } from '../../../components/SectionLabel';
import {
  NABZGRAPH,
  NABZGRAPH_PAPER_URL,
  NABZSENTRY,
  NABZSENTRY_PAPER_URL,
} from '../../../data/nabzPapers';

type Member = {
  icon: ElementType;
  name: string;
  descriptor: string;
  longDesc: string;
  status: string;
  paper: string;
  href?: string;
};

const members: Member[] = [
  {
    icon: Network,
    name: 'NabzGraph',
    descriptor: 'Patient graphs from bedside monitoring',
    longDesc:
      'Typed relations that hold up when clinicians act on the vitals, each linked to the events behind it.',
    status: 'Preprint',
    paper: NABZGRAPH_PAPER_URL,
    href: '/products/nabz/graph',
  },
  {
    icon: BellOff,
    name: 'NabzSentry',
    descriptor: 'Certified three-way alarm triage',
    longDesc:
      'Keep, suppress or defer. You set the share of suppressed alarms allowed to be genuine; Sentry certifies it.',
    status: 'Preprint',
    paper: NABZSENTRY_PAPER_URL,
    href: '/products/nabz/sentry',
  },
];

const preprintCount = members.filter((member) => member.paper).length;

const principles = [
  {
    icon: Waves,
    title: 'The signal is the source',
    desc: 'Every model reads bedside monitor streams directly.',
  },
  {
    icon: Users,
    title: 'Clinicians in the loop',
    desc: 'NabzGraph tests clinician decisions and patient responses separately; NabzSentry defers uncertain alarms.',
  },
  {
    icon: ShieldCheck,
    title: 'Earned, not assumed',
    desc: 'Relations must beat negative controls; alarm budgets must be certified.',
  },
];

export default function NabzFamily() {
  return (
    <div className="theme-nabz">
      <Head>
        <title>Nabz: clinical reasoning on physiological signals | Roshan AI</title>
        <meta
          name="description"
          content="Nabz is Roshan AI's model family for bedside monitoring. NabzGraph builds patient graphs whose typed relations hold up under clinical feedback. NabzSentry triages ICU VT alarms with a certified error budget. Both are preprints on arXiv."
        />
        <meta property="og:title" content="Nabz: a model family for physiological signals." />
        <meta
          property="og:description"
          content="Patient graphs that hold up under clinical feedback, and VT-alarm triage with a certified error budget."
        />
        <link rel="canonical" href="https://roshan-ai.com/products/nabz" />
      </Head>

      <section className="relative isolate overflow-hidden pt-[5.5rem] pb-8 sm:pt-40 sm:pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
          <div className="aurora h-[420px] w-[1100px] max-w-full opacity-60" />
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionLabel tone="muted" className="enter-fade-up">
            Nabz · A Roshan AI model family
          </SectionLabel>

          <h1 className="enter-fade-up enter-d-1 mt-4 max-w-4xl text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-6 sm:text-[3rem] lg:text-[3.5rem]">
            Clinical reasoning on the{' '}
            <span className="gradient-text">signals themselves.</span>
          </h1>

          {/* Phones: the closing sentence returns at sm; the model cards
              below make the same point. */}
          <p className="enter-fade-up enter-d-2 mt-3 max-w-2xl text-pretty text-[0.9rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
            Nabz is our model family for bedside monitoring in surgery and
            intensive care.
            <span className="hidden sm:inline">
              {' '}Each model says what the data support, and when they don’t.
            </span>
          </p>

          <div className="enter-fade-up enter-d-3 mt-6 grid max-w-3xl grid-cols-3 overflow-hidden rounded-2xl border border-subtle bg-glass sm:mt-12">
            <Stat
              value={NABZGRAPH.data.surgicalCases.toLocaleString('en-US')}
              label="Surgical cases"
              sub="NabzGraph"
            />
            <Stat
              value={NABZSENTRY.data.alarms.toLocaleString('en-US')}
              label="VT alarms"
              sub="NabzSentry"
            />
            <Stat value={String(preprintCount)} label="Preprints" sub="On arXiv" />
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative py-10 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionLabel>The models</SectionLabel>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 max-w-3xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
          >
            Two models today, one{' '}
            <span className="gradient-text">shared commitment.</span>
          </motion.h2>

          <div className="mt-5 grid gap-3 sm:mt-9 sm:gap-4 lg:grid-cols-2">
            {members.map((member, index) => (
              <MemberCard key={member.name} member={member} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative py-10 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionLabel>What makes it a family</SectionLabel>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 max-w-3xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
          >
            Three rules every Nabz model follows.
          </motion.h2>

          <div className="mobile-rail-shell glass mt-5 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
            <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-3 md:divide-x md:divide-y-0">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <motion.div
                    key={principle.title}
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
                      <h3 className="text-[0.98rem] font-semibold tracking-[-0.01em]">
                        {principle.title}
                      </h3>
                      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-secondary sm:text-[0.84rem]">
                        {principle.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-[0.78rem] leading-relaxed text-muted sm:mt-5 sm:text-[0.82rem]">
            Both models are research artifacts built on retrospective data, not
            validated for clinical use.
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
              Nabz · open to collaboration
            </div>
            <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">
              Bring your signals.
            </h2>
            {/* Phones: the second sentence repeats the eyebrow above; it
                returns at sm. */}
            <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
              We are looking for retrospective cohorts to validate against.
              <span className="hidden sm:inline">
                {' '}Research collaboration is welcome on every model.
              </span>
            </p>
            <Link
              to="/contact"
              className="btn-primary group mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold sm:mt-5"
            >
              Start a conversation
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function MemberCard({ member, delay }: { member: Member; delay: number }) {
  const Icon = member.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* The card is a <div>, not a <Link>, so the paper link can sit beside
          the page link without nesting anchors. The "Explore" link stretches
          over the whole card (after:inset-0); the paper link sits above it. */}
      <div
        data-cursor={member.href ? 'hover' : undefined}
        className={`glass group relative h-full rounded-2xl p-4 transition sm:rounded-3xl sm:p-8 ${
          member.href ? 'hover:-translate-y-0.5 hover:border-strong' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Icon size={19} strokeWidth={1.8} />
          </span>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-accent">
            {member.status}
          </span>
        </div>

        <h3 className="mt-3 font-display text-[1.35rem] font-semibold tracking-[-0.025em] sm:mt-4 sm:text-[1.6rem]">
          {member.name}
        </h3>
        <div className="mt-1 text-[0.84rem] font-medium text-accent sm:text-[0.88rem]">
          {member.descriptor}
        </div>
        {/* Phones: clamped to three lines; the card opens the model's page,
            which carries the full account. */}
        <p className="mobile-compact-copy mt-2 text-[0.84rem] leading-relaxed text-secondary sm:mt-3 sm:text-[0.88rem]">
          {member.longDesc}
        </p>

        {/* Both links are at least 40px tall for touch. */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 sm:mt-3">
          {member.href && (
            <Link
              to={member.href}
              className="inline-flex min-h-10 items-center gap-1.5 text-[0.86rem] font-semibold text-primary after:absolute after:inset-0 after:rounded-2xl sm:after:rounded-3xl"
            >
              Explore {member.name}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
          <a
            href={member.paper}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex min-h-10 items-center gap-1 text-[0.8rem] font-medium text-accent hover:underline sm:text-[0.84rem]"
          >
            Read the paper
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    // Divider colour: `.border-subtle` is a plain class Tailwind cannot put
    // under a variant, so `[&:not(:first-child)]:border-subtle` never applied
    // and the line fell back to currentColor. Phones get the hairline here;
    // the desktop divider is left as it renders today.
    <div className="min-w-0 px-2 py-3 sm:px-5 sm:py-4 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-[color:var(--border-subtle)]">
      <div className="font-mono text-[1.05rem] font-semibold tracking-tight text-accent sm:text-[1.55rem]">
        {value}
      </div>
      {/* Phones: label and caption wrap instead of truncating (both were cut
          off at 390px, and the captions qualify the numbers); truncation
          returns at sm, where they fit on one line. */}
      <div className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.05em] text-secondary sm:truncate sm:text-[0.74rem] sm:tracking-[0.07em]">
        {label}
      </div>
      <div className="mt-0.5 text-[0.72rem] text-muted sm:truncate sm:text-[0.7rem]">{sub}</div>
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
