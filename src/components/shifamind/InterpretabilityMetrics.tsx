import { motion } from 'framer-motion';
import { SectionLabel } from '../SectionLabel';

/**
 * Structural properties of the multiplicative concept bottleneck. Every entry
 * here holds by construction and needs no experiment to support it, which is
 * why this section can ship ahead of the full-code paper.
 */
const properties = [
  {
    code: 'COVERAGE',
    value: '100%',
    name: 'Of every logit, attributable',
    desc: 'Each predicted logit is a bias plus a sum of contributions from named clinical concepts. No parallel pathway to the output exists in the computation graph.',
  },
  {
    code: 'EXACT',
    value: '0',
    name: 'Unexplained remainder',
    desc: 'Per-concept contributions reconcile to the predicted logit exactly. The reconciliation is asserted at every call and holds to machine zero.',
  },
  {
    code: 'TIED',
    value: '1:1',
    name: 'Displayed to applied',
    desc: 'The number shown for a concept is the multiplier applied to that concept in the forward pass. There is no second head, no calibration layer, and no post-hoc estimator.',
  },
  {
    code: 'VOCAB',
    value: '16,227',
    name: 'Clinical concepts',
    desc: 'Each concept carries a canonical name, its surface forms, and the codes it associates with. The 384 most mentioned in a note are routed into slots for that note.',
  },
];

export function InterpretabilityMetrics() {
  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8">
          <div>
            <SectionLabel>Interpretability</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:mt-3 sm:text-[2.25rem]"
            >
              Guarantees that hold{' '}
              <span className="gradient-text">by construction.</span>
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">
            These are properties of the architecture. They are true at every
            call, on every note, with no measurement required.
          </p>
        </div>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="hidden grid-cols-[96px_96px_1fr] gap-4 border-b border-subtle px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-muted sm:grid">
            <span>Property</span>
            <span>Value</span>
            <span>What it means</span>
          </div>
          {properties.map((property, index) => (
            <motion.div
              key={property.code}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-2 border-b border-subtle px-4 py-4 last:border-b-0 sm:grid-cols-[96px_96px_1fr] sm:items-start sm:gap-4 sm:px-5"
            >
              <div className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-accent">
                {property.code}
              </div>
              <div className="font-mono text-[1.2rem] font-semibold tracking-tight text-primary sm:text-[1.35rem]">
                {property.value}
              </div>
              <div className="sm:pt-0.5">
                <div className="text-[0.88rem] font-semibold text-primary">{property.name}</div>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-secondary sm:text-[0.84rem]">
                  {property.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-5 max-w-3xl text-[0.78rem] leading-relaxed text-muted sm:text-[0.82rem]">
          Contributions are signed, so a concept arguing against a code is
          visible alongside the concepts supporting it. Every active concept
          carries the literal span of the note that triggered it together with
          its assertion status: affirmed, negated, historical, hypothetical, or
          attributed to a family member.
        </p>
      </div>
    </section>
  );
}
