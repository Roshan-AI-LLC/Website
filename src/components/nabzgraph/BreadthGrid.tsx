import { motion } from 'framer-motion';
import { SectionLabel } from '../SectionLabel';

// 'built': in the research model described in the preprint (not a deployed
// product); 'planned': on the roadmap.
type Cell = { label: string; status: 'built' | 'planned' };

const groups: { title: string; cells: Cell[] }[] = [
  {
    title: 'Data',
    cells: [
      { label: 'VitalDB surgical cases', status: 'built' },
      { label: 'MIMIC-IV ICU records', status: 'built' },
      { label: 'Drug & ventilator actions', status: 'built' },
      { label: 'Retrospective analysis', status: 'built' },
      { label: 'Real-time streaming', status: 'planned' },
    ],
  },
  {
    title: 'Concepts',
    cells: [
      { label: 'Tachycardia · bradycardia', status: 'built' },
      { label: 'Hypotension · hypertension', status: 'built' },
      { label: 'Tachypnea · bradypnea', status: 'built' },
      { label: 'Hypercapnia · hypocapnia', status: 'built' },
      { label: 'Beat-level concepts', status: 'built' },
    ],
  },
  {
    title: 'Relations',
    cells: [
      { label: 'Response', status: 'built' },
      { label: 'Policy', status: 'built' },
      { label: 'Association', status: 'built' },
      { label: 'Mechanistic', status: 'built' },
      { label: 'Evidence on every edge', status: 'built' },
    ],
  },
];

export function BreadthGrid() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionLabel>Breadth</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
        >
          Coverage across data, concepts, and relations.
        </motion.h2>

        {/* Phones: this page's one swipe rail (three peer lists). */}
        <div className="mobile-rail-shell glass mt-5 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {groups.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-secondary">{group.title}</div>
                <ul className="mt-3 space-y-2">
                  {group.cells.map((cell) => (
                    <li key={cell.label} className="flex items-center justify-between gap-3 text-[0.78rem] sm:text-[0.84rem]">
                      <span className={cell.status === 'built' ? 'text-primary' : 'text-muted'}>{cell.label}</span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.08em]"
                        style={
                          cell.status === 'built'
                            ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                            : { background: 'rgba(120, 145, 170, 0.1)', color: 'var(--color-violet-500)' }
                        }
                      >
                        {cell.status === 'built' ? 'Built' : 'Roadmap'}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
