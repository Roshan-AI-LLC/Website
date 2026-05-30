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
    desc: 'A directed edge when one concept reliably precedes another. The lag and correlation are read straight off the activation timelines — the trajectory, not just the snapshot.',
  },
  {
    icon: Layers,
    code: 'CO_OCCURS',
    name: 'Co-occurs',
    derived: 'Jaccard overlap of the two concepts’ source-window sets',
    desc: 'An undirected edge when two concepts fire in the same windows. The Jaccard score quantifies how tightly their evidence overlaps in time.',
  },
  {
    icon: GitBranch,
    code: 'GRANGER',
    name: 'Granger',
    derived: 'Granger causality on the underlying signal features',
    desc: 'A directed edge suggesting one signal drives another. It gives a causal direction a threshold alarm cannot — the kind of structure that survives peer review.',
  },
];

export function EdgeTypes() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          The research contribution
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          Edge types{' '}
          <span className="gradient-text">measured, not imposed.</span>
        </motion.h2>

        <p className="mt-4 max-w-2xl text-[0.98rem] font-light leading-relaxed text-secondary">
          The critique that kills most clinical knowledge-graph papers is “why
          these types?” NabzGraph answers it by deriving every edge from a
          measurable property of the signal evidence — nothing is hand-designed
          by an ontology author.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {edges.map((e, i) => (
            <motion.div
              key={e.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass relative overflow-hidden rounded-3xl p-6 sm:p-7"
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                <e.icon size={20} strokeWidth={1.7} />
              </div>
              <div className="mt-5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
                {e.code}
              </div>
              <h3 className="mt-1 text-[1.2rem] font-semibold tracking-[-0.015em]">
                {e.name}
              </h3>
              <div className="mt-2 text-[0.82rem] font-medium text-secondary">
                {e.derived}
              </div>
              <p className="mt-3 text-[0.92rem] font-light leading-relaxed text-secondary">
                {e.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
