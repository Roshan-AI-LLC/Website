import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShifaMindLogo } from '../ShifaMindLogo';
import { NabzGraphLogo } from '../NabzGraphLogo';
import type { ElementType } from 'react';

type ItemStatus = 'live' | 'progress' | 'next' | 'future';

type Item = {
  label: string;
  sub?: string;
  status: ItemStatus;
  logo?: ElementType;
  href?: string;
};

type Phase = {
  marker: string;
  title: string;
  body: string;
  accent?: boolean;
  items: Item[];
};

const phases: Phase[] = [
  {
    marker: 'Now',
    title: 'Shipping today',
    body: 'Live products running on the shared platform.',
    accent: true,
    items: [
      {
        label: 'ShifaMind',
        sub: 'Concept-grounded ICD-10 coding',
        status: 'live',
        logo: ShifaMindLogo,
        href: '/products/shifamind',
      },
      {
        label: 'NabzGraph',
        sub: 'Interpretable ICU knowledge graphs',
        status: 'progress',
        logo: NabzGraphLogo,
        href: '/products/nabzgraph',
      },
    ],
  },
  {
    marker: 'Next',
    title: "What's next on ShifaMind",
    body: 'Capabilities in active development.',
    items: [
      { label: 'Multi-agent reasoning', status: 'next' },
      { label: 'HCC coding', status: 'next' },
      { label: 'Risk Adjustment Chart Chase', status: 'next' },
    ],
  },
  {
    marker: 'Later',
    title: 'Further out',
    body: 'More products on the same stack.',
    items: [
      {
        label: 'New clinical-reasoning products',
        sub: 'Same ingestion, encoders, and reasoning layer',
        status: 'future',
      },
    ],
  },
];

export function PlatformDiagram() {
  return (
    <section id="platform" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          Roadmap
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          One platform.{' '}
          <span className="gradient-text">A growing line of products.</span>
        </motion.h2>

        <p className="mt-4 max-w-2xl text-[1rem] font-light leading-relaxed text-secondary">
          Every Roshan AI product runs on the same ingestion layer, the same
          clinical encoders, and the same concept reasoning layer. New products
          and capabilities slot into the stack without bespoke plumbing. Here is
          what is live today and what is coming next.
        </p>

        <div className="mt-12 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <PhaseColumn phase={phases[0]} />
          <Arrow />
          <PhaseColumn phase={phases[1]} />
          <Arrow />
          <PhaseColumn phase={phases[2]} />
        </div>
      </div>
    </section>
  );
}

function PhaseColumn({ phase }: { phase: Phase }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative flex flex-col overflow-hidden rounded-3xl p-5 sm:p-6"
      style={
        phase.accent
          ? {
              borderColor: 'color-mix(in oklab, var(--accent) 35%, transparent)',
              background:
                'linear-gradient(180deg, color-mix(in oklab, var(--accent) 12%, transparent), var(--bg-glass))',
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[0.86rem] font-semibold text-primary">
          {phase.title}
        </div>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
          {phase.marker}
        </span>
      </div>
      <div className="mt-1.5 text-[0.84rem] font-light leading-relaxed text-muted">
        {phase.body}
      </div>

      <ul className="mt-4 space-y-2">
        {phase.items.map((item) => (
          <ItemRow key={item.label} item={item} />
        ))}
      </ul>
    </motion.div>
  );
}

function ItemRow({ item }: { item: Item }) {
  const Logo = item.logo;
  const inner = (
    <>
      {Logo ? (
        <Logo size={26} />
      ) : (
        <span
          className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{
            background:
              item.status === 'future'
                ? 'var(--text-muted)'
                : 'var(--accent)',
          }}
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[0.88rem] font-medium text-primary">
            {item.label}
          </span>
          <StatusChip status={item.status} />
        </div>
        {item.sub && (
          <div className="mt-0.5 text-[0.76rem] leading-snug text-muted">
            {item.sub}
          </div>
        )}
      </div>

      {item.href && (
        <ArrowUpRight
          size={13}
          className="mt-0.5 flex-shrink-0 text-secondary transition group-hover:text-primary"
        />
      )}
    </>
  );

  const className =
    'group flex items-start gap-2.5 rounded-xl border border-subtle bg-glass px-3 py-2.5';

  if (item.href) {
    return (
      <li>
        <Link
          to={item.href}
          className={`${className} transition hover:border-strong`}
          aria-label={`Open ${item.label}`}
        >
          {inner}
        </Link>
      </li>
    );
  }

  return <li className={className}>{inner}</li>;
}

function StatusChip({ status }: { status: ItemStatus }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-accent">
        <span className="pulse-dot inline-block h-1 w-1 rounded-full bg-current" />
        Live
      </span>
    );
  }
  if (status === 'progress') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-accent">
        <span className="pulse-dot inline-block h-1 w-1 rounded-full bg-current" />
        Scaling in progress
      </span>
    );
  }
  if (status === 'next') {
    return (
      <span
        className="rounded-full px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]"
        style={{
          background: 'rgba(120, 145, 170, 0.14)',
          color: 'var(--color-violet-500)',
        }}
      >
        In dev
      </span>
    );
  }
  return (
    <span className="rounded-full border border-subtle px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">
      Planned
    </span>
  );
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <ArrowRight size={18} className="text-muted" />
    </div>
  );
}
