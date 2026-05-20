import { motion } from 'framer-motion';

type Cell = {
  label: string;
  /** "live" = supported today, "planned" = on roadmap. */
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
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          Breadth
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          Coverage across code systems, note types, and specialties.
        </motion.h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="glass rounded-3xl p-6">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                {g.title}
              </div>
              <ul className="mt-4 space-y-2">
                {g.cells.map((c) => (
                  <li
                    key={c.label}
                    className="flex items-center justify-between text-[0.92rem]"
                  >
                    <span
                      className={
                        c.status === 'live' ? 'text-primary' : 'text-muted'
                      }
                    >
                      {c.label}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.66rem] font-medium uppercase tracking-[0.1em]"
                      style={
                        c.status === 'live'
                          ? {
                              background: 'var(--accent-soft)',
                              color: 'var(--accent)',
                            }
                          : {
                              background: 'rgba(120, 145, 170, 0.1)',
                              color: 'var(--color-violet-500)',
                            }
                      }
                    >
                      <span className="inline-block h-1 w-1 rounded-full bg-current" />
                      {c.status === 'live' ? 'Live' : 'Roadmap'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
