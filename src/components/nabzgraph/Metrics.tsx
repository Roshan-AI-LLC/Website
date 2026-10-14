import { motion } from 'framer-motion';
import { fmt, NABZGRAPH } from '../../data/nabzPapers';
import { SectionLabel } from '../SectionLabel';

const { beat, conceptAuroc, falseRelations, graph } = NABZGRAPH;

// One row per result: the figure, a short label and a short note. Every
// number is read from nabzPapers.ts.
const metrics = [
  {
    code: 'ERRORS',
    value: fmt(falseRelations.ours.transplant, 2),
    name: 'False concept relations',
    note: `vs ${fmt(falseRelations.correlational.transplant)} for correlational graphs`,
  },
  {
    code: 'CONCEPT',
    value: fmt(conceptAuroc.ours, 3),
    name: 'Concept AUROC',
    note: 'Held-out ICU patients, vs monitor',
  },
  {
    code: 'BEAT',
    value: `${fmt(beat.patSbpNegativePct)}%`,
    name: 'Pulse timing tracks pressure',
    note: `Of ${beat.cases.toLocaleString('en-US')} surgical cases`,
  },
  {
    code: 'GRAPH',
    value: fmt(graph.relationInstances),
    name: 'Relations per graph',
    note: 'Each tied to its events',
  },
];

export function Metrics() {
  return (
    <section className="relative py-10 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8">
          <div>
            <SectionLabel>Results</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
            >
              Reliability you can{' '}
              <span className="gradient-text">measure.</span>
            </motion.h2>
          </div>
          {/* Phones: hidden, the rows carry the section. */}
          <p className="hidden max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:block sm:text-right sm:text-[0.9rem]">
            False relations counted after swapping in another patient&rsquo;s streams.
          </p>
        </div>

        {/* Phones: a 2x2 grid of score, name and note; the code eyebrow is
            hidden. The three-column table returns at sm. */}
        <div className="glass mt-5 grid grid-cols-2 overflow-hidden rounded-2xl sm:mt-9 sm:block sm:rounded-3xl">
          <div className="hidden grid-cols-[76px_88px_1fr] gap-4 border-b border-subtle px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-muted sm:grid">
            <span>Test</span>
            <span>Score</span>
            <span>Result</span>
          </div>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.code}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className={`grid gap-1 border-b border-subtle px-4 py-3 last:border-b-0 sm:grid-cols-[76px_88px_1fr] sm:items-start sm:gap-4 sm:px-5 sm:py-4 max-sm:content-start ${
                // Phones: the left column draws the vertical divider and only
                // the top row the horizontal one.
                index % 2 === 0 ? 'max-sm:border-r' : ''
              } ${index >= 2 ? 'max-sm:border-b-0' : ''}`}
            >
              <div className="hidden font-mono text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-accent sm:block">{metric.code}</div>
              <div className="font-mono text-[1.2rem] font-semibold tracking-tight text-primary sm:text-[1.35rem]">{metric.value}</div>
              <div className="sm:pt-0.5">
                <div className="text-[0.88rem] font-semibold text-primary">{metric.name}</div>
                <div className="mt-0.5 text-[0.72rem] leading-snug text-muted sm:text-[0.8rem]">{metric.note}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-4 text-[0.72rem] leading-relaxed text-muted sm:mt-5 sm:text-[0.78rem]">
          Research results on retrospective data. Not validated for clinical use.
        </p>
      </div>
    </section>
  );
}
