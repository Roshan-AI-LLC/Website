import { motion } from 'framer-motion';
import { ArrowUpRight, Network, Workflow } from 'lucide-react';
import { SectionHeader } from './About';

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Roadmap"
          title={
            <>
              The road ahead for{' '}
              <span className="gradient-text-warm">ShifaMind.</span>
            </>
          }
          desc="Shipping today. Compounding tomorrow. Each milestone deepens the system clinicians already trust."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <RoadmapCard
            tag="Live · v2.1"
            tone="live"
            title="ShifaMind Core"
            desc="Concept-grounded ICD-10 coding from discharge summaries with full causal trails. Available to clinicians and researchers today."
            href="https://shifamind.me"
            cta="Visit shifamind.me"
          />
          <RoadmapCard
            tag="In R&D · 2026"
            tone="next"
            icon={Network}
            title="EHR Integration"
            desc="Native plugins for Epic, Cerner, and FHIR-compliant systems. ShifaMind reads structured records alongside notes, with concept activations surfaced inside the clinician's existing workflow."
            cta="On the roadmap"
          />
          <RoadmapCard
            tag="Planned · 2026"
            tone="planned"
            icon={Workflow}
            title="Multi-Agent Specialists"
            desc="Domain-specialised agents (cardiology, pulmonology, oncology, ED) coordinated by an orchestrator. Each agent reasons over the same shared concept layer for consistent, auditable cross-specialty decisions."
            cta="On the roadmap"
          />
        </div>
      </div>
    </section>
  );
}

function RoadmapCard({
  tag,
  tone,
  icon: Icon,
  title,
  desc,
  href,
  cta,
}: {
  tag: string;
  tone: 'live' | 'next' | 'planned';
  icon?: React.ElementType;
  title: string;
  desc: string;
  href?: string;
  cta: string;
}) {
  const isLive = tone === 'live';
  const Wrap: React.ElementType = href ? 'a' : 'div';
  const wrapProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const tagStyles =
    tone === 'live'
      ? 'bg-accent-soft text-accent'
      : tone === 'next'
        ? 'bg-accent-soft text-accent'
        : '';
  const tagInline =
    tone === 'planned'
      ? {
          background: 'rgba(120, 145, 170, 0.12)',
          color: 'var(--color-violet-500)',
        }
      : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Wrap
        {...wrapProps}
        data-cursor="hover"
        className="glass group relative block h-full overflow-hidden rounded-3xl p-7 transition will-change-transform hover:-translate-y-1 hover:border-strong"
      >
        <div className="flex items-start justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${tagStyles}`}
            style={tagInline}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full bg-current ${
                isLive ? 'pulse-dot' : ''
              }`}
            />
            {tag}
          </span>
          {Icon ? (
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
              }}
            >
              <Icon size={20} strokeWidth={1.6} />
            </div>
          ) : null}
        </div>

        <h3 className="mt-7 text-[1.3rem] font-semibold tracking-[-0.02em]">
          {title}
        </h3>
        <p className="mt-2 text-[0.92rem] font-light leading-relaxed text-secondary">
          {desc}
        </p>

        <div className="mt-5 flex items-center gap-1.5 text-[0.86rem] font-medium text-accent">
          {cta}
          {href && (
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          )}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle, var(--accent-soft), transparent 70%)',
          }}
        />
      </Wrap>
    </motion.div>
  );
}

