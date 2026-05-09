import { motion } from 'framer-motion';
import { ArrowUpRight, Brain, Cpu } from 'lucide-react';
import { SectionHeader } from './About';

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Roadmap"
          title={
            <>
              One bet at a time.{' '}
              <span className="gradient-text-warm">Built to last.</span>
            </>
          }
          desc="We commit to a problem only when interpretability and accessibility can both be solved together. Healthcare today, robotics next."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <ProjectCard
            tag="Live · v2.1"
            tone="live"
            icon={Brain}
            title="ShifaMind"
            desc="Concept-grounded clinical AI for ICD-10 coding and explainable diagnostic support. Shipping to clinicians and researchers today."
            href="https://shifamind.me"
            cta="Visit shifamind.me"
          />
          <ProjectCard
            tag="In R&D · 2026"
            tone="soon"
            icon={Cpu}
            title="HardwareAI"
            desc="Reasoning models embedded in physical hardware. Interpretable intelligence for robotics, edge devices, and on-prem systems."
            cta="Coming soon"
          />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  tag,
  tone,
  icon: Icon,
  title,
  desc,
  href,
  cta,
}: {
  tag: string;
  tone: 'live' | 'soon';
  icon: React.ElementType;
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
        className="glass group relative block overflow-hidden rounded-3xl p-7 transition will-change-transform hover:-translate-y-1 hover:border-strong"
      >
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${
              isLive ? 'bg-accent-soft text-accent' : 'text-muted'
            }`}
            style={
              isLive
                ? undefined
                : {
                    background: 'color-mix(in oklab, #f59e0b 10%, transparent)',
                    color: '#f59e0b',
                  }
            }
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full bg-current ${
                isLive ? 'pulse-dot' : ''
              }`}
            />
            {tag}
          </span>
          <div
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-soft), color-mix(in oklab, var(--color-violet-500) 12%, transparent))',
              color: 'var(--accent)',
            }}
          >
            <Icon size={20} strokeWidth={1.6} />
          </div>
        </div>

        <h3 className="mt-7 text-[1.45rem] font-semibold tracking-[-0.02em]">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-[0.94rem] font-light leading-relaxed text-secondary">
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
