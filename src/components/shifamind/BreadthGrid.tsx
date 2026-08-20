import { motion } from 'framer-motion';

type Cell = {
  label: string;
  status: 'live' | 'planned';
};

const groups: { title: string; cells: Cell[] }[] = [
  {
    title: 'Code systems',
    cells: [
      { label: 'ICD-10-CM', status: 'live' },
      { label: 'ICD-10-PCS', status: 'planned' },
      { label: 'CPT', status: 'planned' },
      { label: 'SNOMED CT', status: 'planned' },
    ],
  },
  {
    title: 'Note types',
    cells: [
      { label: 'Discharge summaries', status: 'live' },
      { label: 'Inpatient progress notes', status: 'live' },
      { label: 'ED notes', status: 'live' },
      { label: 'Outpatient encounters', status: 'planned' },
    ],
  },
  {
    title: 'Specialties',
    cells: [
      { label: 'Cardiology', status: 'live' },
      { label: 'Pulmonology', status: 'live' },
      { label: 'Emergency medicine', status: 'live' },
      { label: 'Endocrinology', status: 'live' },
      { label: 'Oncology', status: 'planned' },
      { label: 'Psychiatry', status: 'planned' },
    ],
  },
];

export function BreadthGrid() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          Breadth
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
        >
          Coverage across code systems, note types, and specialties.
        </motion.h2>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
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
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                  {group.title}
                </div>
                <ul className="mt-3 space-y-2">
                  {group.cells.map((cell) => (
                    <li key={cell.label} className="flex items-center justify-between gap-3 text-[0.8rem] sm:text-[0.84rem]">
                      <span className={cell.status === 'live' ? 'text-primary' : 'text-muted'}>{cell.label}</span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.08em]"
                        style={
                          cell.status === 'live'
                            ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                            : { background: 'rgba(120, 145, 170, 0.1)', color: 'var(--color-violet-500)' }
                        }
                      >
                        {cell.status === 'live' ? 'Live' : 'Roadmap'}
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
