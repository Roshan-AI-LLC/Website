import { motion } from 'framer-motion';
import { ChevronDown, HeartPulse, Link2, Stethoscope, Syringe } from 'lucide-react';
import type { ElementType } from 'react';
import { RELATION_TYPES } from '../../data/nabzPapers';
import { SectionLabel } from '../SectionLabel';

type RelationKey = (typeof RELATION_TYPES)[number]['key'];

/** Icon and direction eyebrow per relation type; the copy lives in nabzPapers. */
const META: Record<RelationKey, { icon: ElementType; flow: string }> = {
  response: { icon: Syringe, flow: 'Action → patient' },
  policy: { icon: Stethoscope, flow: 'Patient → action' },
  association: { icon: Link2, flow: 'Concept ↔ concept' },
  mechanistic: { icon: HeartPulse, flow: 'Beat level' },
};

export function EdgeTypes() {
  return (
    <section className="relative py-7 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <SectionLabel>Typed relations</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 max-w-3xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:mt-3 sm:text-[2.25rem]"
            >
              Every relation{' '}
              <span className="gradient-text">knows its type.</span>
            </motion.h2>
          </div>
          {/* Phones: hidden, the rows carry the section. */}
          <p className="hidden max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:block sm:text-right sm:text-[0.9rem]">
            So a clinician&rsquo;s decision and a drug&rsquo;s effect are tested apart.
          </p>
        </div>

        <div className="glass mt-4 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="hidden grid-cols-[180px_1fr_1.2fr] gap-4 border-b border-subtle px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-muted md:grid">
            <span>Relation</span>
            <span>Example</span>
            <span>What it means</span>
          </div>
          {/* Phones: one row per relation type, name and example visible with
              the meaning a tap away (the Platform layer rows' pattern); the
              direction eyebrow is hidden. The stacked rows return at sm, the
              table at md. */}
          <div className="divide-y divide-[color:var(--border-subtle)] sm:hidden">
            {RELATION_TYPES.map((relation) => {
              const Icon = META[relation.key].icon;
              return (
                <details key={relation.key} className="group">
                  <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3 px-4 py-2.5 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Icon size={15} strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.92rem] font-semibold leading-snug text-primary">{relation.name}</span>
                      <span className="mt-0.5 block text-[0.8rem] leading-snug text-secondary">{relation.example}</span>
                    </span>
                    <ChevronDown size={16} className="mt-1.5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="pb-3 pl-[3.75rem] pr-4 text-[0.8rem] leading-relaxed text-secondary">{relation.line}</p>
                </details>
              );
            })}
          </div>
          <div className="hidden sm:block">
            {RELATION_TYPES.map((relation, index) => {
              const { icon: Icon, flow } = META[relation.key];
              return (
                <motion.div
                  key={relation.key}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-2 border-b border-subtle px-4 py-4 last:border-b-0 md:grid-cols-[180px_1fr_1.2fr] md:items-start md:gap-4 md:px-5"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon size={15} strokeWidth={1.8} />
                    </span>
                    <div>
                      <div className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">{flow}</div>
                      <div className="text-[0.88rem] font-semibold text-primary">{relation.name}</div>
                    </div>
                  </div>
                  <div className="text-[0.78rem] font-medium leading-relaxed text-secondary md:pt-1">{relation.example}</div>
                  <div className="text-[0.78rem] leading-relaxed text-secondary md:pt-1">{relation.line}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
