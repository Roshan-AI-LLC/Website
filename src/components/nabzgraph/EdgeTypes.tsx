import { motion } from 'framer-motion';
import { GitBranch, Layers, Workflow } from 'lucide-react';
import type { ElementType } from 'react';

type EdgeKind = {
  icon: ElementType;
  code: string;
  name: string;
  derived: string;
  desc: string;
};

const edges: EdgeKind[] = [
  {
    icon: Workflow,
    code: 'TEMPORAL',
    name: 'Temporal',
    derived: 'Lagged cross-correlation of concept activation series',
    desc: 'A directed relationship when one concept reliably precedes another.',
  },
  {
    icon: Layers,
    code: 'CO_OCCURS',
    name: 'Co-occurs',
    derived: 'Jaccard overlap of two concepts’ source-window sets',
    desc: 'An undirected relationship when evidence activates in the same windows.',
  },
  {
    icon: GitBranch,
    code: 'GRANGER',
    name: 'Granger',
    derived: 'Granger causality on the underlying signal features',
    desc: 'A directed relationship that supplies a measured causal direction.',
  },
];

export function EdgeTypes() {
  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              The research contribution
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-3xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
            >
              Edge types{' '}
              <span className="gradient-text">measured, not imposed.</span>
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">
            Every relationship is derived from signal evidence rather than imposed by an ontology author.
          </p>
        </div>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="hidden grid-cols-[100px_1fr_1.2fr] gap-4 border-b border-subtle px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-muted md:grid">
            <span>Edge</span>
            <span>Derived from</span>
            <span>Why it matters</span>
          </div>
          {edges.map((edge, index) => {
            const Icon = edge.icon;
            return (
              <motion.div
                key={edge.code}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-2 border-b border-subtle px-4 py-4 last:border-b-0 md:grid-cols-[100px_1fr_1.2fr] md:items-start md:gap-4 md:px-5"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={15} strokeWidth={1.8} />
                  </span>
                  <div>
                    <div className="font-mono text-[0.6rem] font-semibold tracking-[0.12em] text-accent">{edge.code}</div>
                    <div className="text-[0.88rem] font-semibold text-primary">{edge.name}</div>
                  </div>
                </div>
                <div className="text-[0.78rem] font-medium leading-relaxed text-secondary md:pt-1">{edge.derived}</div>
                <div className="text-[0.78rem] leading-relaxed text-secondary md:pt-1">{edge.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
