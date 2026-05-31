import { motion } from 'framer-motion';

const metrics = [
  {
    code: 'CF',
    value: '0.92',
    name: 'Concept fidelity',
    ref: 'Koh et al. 2020',
    desc: 'Mean held-out AUROC of the concept bottleneck against rule-defined ground truth, across the seven concepts. High fidelity means the node labels are earned by the evidence, not guessed.',
  },
  {
    code: 'ERASER',
    value: '0.64',
    name: 'Faithfulness',
    ref: 'DeYoung et al. 2020',
    desc: 'Comprehensiveness of the cited signal windows: removing the evidence behind a node drops its activation by 0.64 on average, with near-zero sufficiency loss. The explanation is the cause, not a post-hoc rationalisation.',
  },
  {
    code: 'GR',
    value: '0.70',
    name: 'Granger replication',
    ref: 'Seth 2010',
    desc: 'Held-out replication of the derived causal edges. Granger edges fit on the first half of each stay recur in the second half 70% of the time (151 of 217), evidence the structure is stable, not an artefact of a single window.',
  },
];

export function Metrics() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Evaluation · preprint AAAI 2027
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
            >
              Interpretability you can measure.
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.94rem] font-light leading-relaxed text-secondary lg:text-right">
            NabzGraph is evaluated against published protocols for concept
            fidelity, explanation faithfulness, and causal replication, not
            just downstream accuracy.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
                  {m.code}
                </span>
                <span className="font-mono text-[1.7rem] font-semibold tracking-tight text-accent sm:text-[1.9rem]">
                  {m.value}
                </span>
              </div>
              <h3 className="mt-4 text-[1rem] font-semibold tracking-[-0.01em]">
                {m.name}
              </h3>
              <div className="mt-0.5 text-[0.74rem] font-mono text-muted">{m.ref}</div>
              <p className="mt-2 text-[0.88rem] font-light leading-relaxed text-secondary">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-[0.78rem] text-muted">
          Figures are from the single-seed held-out test split, pending the
          camera-ready preprint. Cohort: 200 MIMIC-IV-WDB patients (167 with
          built graphs); V2 targets full MIMIC-IV with external validation.
        </p>
      </div>
    </section>
  );
}
