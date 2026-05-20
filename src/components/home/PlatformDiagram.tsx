import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Database, Brain, Layers, Plug } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShifaMindLogo } from '../ShifaMindLogo';
import type { ElementType } from 'react';

type Stage = {
  title: string;
  body: string;
  items: { label: string; icon?: ElementType }[];
};

const stages: Stage[] = [
  {
    title: 'Data in',
    body: 'Clinical signals the platform was designed to read.',
    items: [
      { label: 'Discharge summaries' },
      { label: 'Inpatient progress notes' },
      { label: 'ED & outpatient encounters' },
      { label: 'Structured EHR records' },
    ],
  },
  {
    title: 'Roshan AI platform',
    body: 'Shared infrastructure across every product.',
    items: [
      { label: 'Ingestion & PHI handling', icon: Database },
      { label: 'Clinical encoders', icon: Brain },
      { label: 'Concept reasoning layer', icon: Layers },
      { label: 'APIs & integrations', icon: Plug },
    ],
  },
  {
    title: 'Products out',
    body: 'What clinicians and developers actually use.',
    items: [
      { label: 'ShifaMind · coding & reasoning' },
      { label: 'More products in development' },
    ],
  },
];

export function PlatformDiagram() {
  return (
    <section id="platform" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          Platform
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          One platform.{' '}
          <span className="gradient-text">Many products downstream.</span>
        </motion.h2>

        <p className="mt-4 max-w-2xl text-[1rem] font-light leading-relaxed text-secondary">
          Every Roshan AI product reads from the same ingestion layer, runs on
          the same clinical encoders, and explains itself through the same
          concept reasoning layer. ShifaMind is one consumer; future products
          slot into the same stack without bespoke plumbing.
        </p>

        <div className="mt-12 grid gap-3 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
          <Column stage={stages[0]} />
          <Arrow />
          <Column stage={stages[1]} accent />
          <Arrow />
          <Column stage={stages[2]}>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-subtle bg-glass px-3 py-2.5">
              <ShifaMindLogo size={28} />
              <div className="flex-1">
                <div className="text-[0.86rem] font-semibold text-primary">
                  ShifaMind
                </div>
                <div className="text-[0.74rem] text-muted">
                  Coding & reasoning · live
                </div>
              </div>
              <Link
                to="/products/shifamind"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-subtle bg-glass text-secondary transition hover:border-strong hover:text-primary"
                aria-label="Open ShifaMind"
              >
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </Column>
        </div>
      </div>
    </section>
  );
}

function Column({
  stage,
  accent,
  children,
}: {
  stage: Stage;
  accent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-5 sm:p-6"
      style={
        accent
          ? {
              borderColor: 'color-mix(in oklab, var(--accent) 35%, transparent)',
              background:
                'linear-gradient(180deg, color-mix(in oklab, var(--accent) 12%, transparent), var(--bg-glass))',
            }
          : undefined
      }
    >
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
        {stage.title}
      </div>
      <div className="mt-1.5 text-[0.86rem] font-light leading-relaxed text-muted">
        {stage.body}
      </div>

      <ul className="mt-4 space-y-1.5">
        {stage.items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 rounded-lg border border-subtle bg-glass px-3 py-2 text-[0.84rem]"
          >
            {item.icon && (
              <item.icon
                size={13}
                strokeWidth={1.8}
                className="flex-shrink-0 text-accent"
              />
            )}
            <span className="text-secondary">{item.label}</span>
          </li>
        ))}
      </ul>

      {children}
    </motion.div>
  );
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <ArrowRight size={18} className="text-muted" />
    </div>
  );
}
