import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, BellOff, Network, Waves } from 'lucide-react';
import type { ElementType } from 'react';
import { SectionLabel } from '../../../components/SectionLabel';

type Member = {
  icon: ElementType;
  name: string;
  descriptor: string;
  longDesc: string;
  status: string;
  statusTone: 'live' | 'review';
  href?: string;
};

const members: Member[] = [
  {
    icon: Network,
    name: 'NabzGraph',
    descriptor: 'Patient-specific knowledge graphs from ICU signals',
    longDesc:
      'Turns a continuous multi-modal stream into a knowledge graph of SNOMED concepts and their measured relationships. Node types and edge types are derived from measurable properties of the signal evidence, and every node and edge points back to the exact windows that produced it.',
    status: 'ACML 2026',
    statusTone: 'live',
    href: '/products/nabz/graph',
  },
  {
    icon: BellOff,
    name: 'NabzSentry',
    descriptor: 'Alarm triage that knows when to stay quiet',
    longDesc:
      'Most arrhythmia alarms in intensive care are false, and silencing a real one delays treatment. Sentry treats triage as three decisions instead of two, keeping a bound on how often a genuine alarm can be suppressed.',
    status: 'In review',
    statusTone: 'review',
    href: '/products/nabz/sentry',
  },
];

const principles = [
  {
    icon: Waves,
    title: 'The signal is the source',
    desc: 'Every Nabz model reads continuous physiological waveforms directly. Nothing in the family depends on a summary statistic somebody else computed first.',
  },
  {
    icon: Activity,
    title: 'Structure is earned, not declared',
    desc: 'What a model asserts about a patient has to be supported by a measurable property of that patient’s signal. An ontology author does not get to decide it in advance.',
  },
  {
    icon: Network,
    title: 'Traceable to the waveform',
    desc: 'Any claim a Nabz model makes can be opened down to the millisecond-level windows behind it. The audit path is part of the architecture.',
  },
];

export default function NabzFamily() {
  return (
    <>
      <Head>
        <title>Nabz: clinical reasoning on physiological signals | Roshan AI</title>
        <meta
          name="description"
          content="Nabz is Roshan AI's family of models for continuous physiological signals. NabzGraph builds patient-specific knowledge graphs from ICU waveforms. NabzSentry handles alarm triage. Every claim traces back to the raw signal."
        />
        <meta property="og:title" content="Nabz: a model family for physiological signals." />
        <meta
          property="og:description"
          content="Patient-specific knowledge graphs and alarm triage, built on continuous ICU waveforms with evidence traceable to the signal."
        />
        <link rel="canonical" href="https://roshan-ai.com/products/nabz" />
      </Head>

      <section className="relative isolate overflow-hidden pt-[5.5rem] pb-10 sm:pt-40 sm:pb-16">
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

          <p className="enter-fade-up enter-d-2 mt-4 max-w-2xl text-pretty text-[0.94rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
            An intensive care unit produces some of the densest data in
            medicine, and almost all of it is consumed as a number on a monitor
            or a black-box alarm. Nabz is our family of models for that stream.
            Each one reads the waveform directly and returns something a
            clinician can interrogate down to the window that caused it.
          </p>

          <div className="enter-fade-up enter-d-3 mt-8 grid max-w-3xl grid-cols-3 overflow-hidden rounded-2xl border border-subtle bg-glass sm:mt-12">
            <Stat value="4" label="Signal modalities" sub="ECG · PPG · ABP · RESP" />
            <Stat value="2" label="Models" sub="More in research" />
            <Stat value="100%" label="Traceable to signal" sub="By construction" />
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionLabel>The models</SectionLabel>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 max-w-3xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
          >
            Two models today, one{' '}
            <span className="gradient-text">shared commitment.</span>
          </motion.h2>

          <div className="mt-7 grid gap-4 sm:mt-9 lg:grid-cols-2">
            {members.map((member, index) => (
              <MemberCard key={member.name} member={member} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionLabel>What makes it a family</SectionLabel>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 max-w-3xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
          >
            Three rules every Nabz model follows.
          </motion.h2>

          <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
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
                    className="flex gap-3 p-5 sm:p-6 md:block"
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

          <p className="mt-5 max-w-3xl text-[0.78rem] leading-relaxed text-muted sm:text-[0.82rem]">
            Nabz sits alongside existing monitoring and the EMR. These models
            detect physiological concepts and their relationships, not disease
            labels, and the deployments described here are retrospective and
            research-oriented.
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
              Nabz · open to collaboration
            </div>
            <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">
              Bring your signals.
            </h2>
            <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
              We are extending the concept vocabulary, adding modalities, and
              looking for retrospective cohorts to validate against. Research
              collaboration is welcome on every model in the family.
            </p>
            <Link
              to="/contact"
              className="group mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                boxShadow: 'var(--shadow-glow)',
                color: 'var(--on-accent)',
              }}
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
    </>
  );
}

function MemberCard({ member, delay }: { member: Member; delay: number }) {
  const Icon = member.icon;
  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon size={19} strokeWidth={1.8} />
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em]"
          style={
            member.statusTone === 'live'
              ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
              : { background: 'rgba(120, 145, 170, 0.1)', color: 'var(--color-violet-500)' }
          }
        >
          {member.status}
        </span>
      </div>

      <h3 className="mt-4 font-display text-[1.35rem] font-semibold tracking-[-0.025em] sm:text-[1.6rem]">
        {member.name}
      </h3>
      <div className="mt-1 text-[0.84rem] font-medium text-accent sm:text-[0.88rem]">
        {member.descriptor}
      </div>
      <p className="mt-3 text-[0.84rem] leading-relaxed text-secondary sm:text-[0.88rem]">
        {member.longDesc}
      </p>

      {member.href && (
        <span className="mt-5 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-primary">
          Explore {member.name}
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {member.href ? (
        <Link
          to={member.href}
          data-cursor="hover"
          className="glass group block h-full rounded-2xl p-6 transition hover:-translate-y-0.5 hover:border-strong sm:rounded-3xl sm:p-8"
        >
          {inner}
        </Link>
      ) : (
        <div className="glass block h-full rounded-2xl p-6 sm:rounded-3xl sm:p-8">{inner}</div>
      )}
    </motion.div>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="min-w-0 px-2.5 py-3 sm:px-5 sm:py-4 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-subtle">
      <div className="font-mono text-[1.05rem] font-semibold tracking-tight text-accent sm:text-[1.55rem]">
        {value}
      </div>
      <div className="mt-1 truncate text-[0.58rem] font-medium uppercase tracking-[0.07em] text-secondary sm:text-[0.74rem]">
        {label}
      </div>
      <div className="mt-0.5 truncate text-[0.58rem] text-muted sm:text-[0.7rem]">{sub}</div>
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
