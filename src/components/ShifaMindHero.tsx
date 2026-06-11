import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { PLATFORM_URL } from '../lib/config';

const traits = [
  'Concept-grounded predictions',
  'Causally-faithful explanations',
  'MIMIC-IV evaluated',
  'ICD-10 coding ready',
];

export function ShifaMindHero() {
  return (
    <section id="shifamind" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-accent">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
                Flagship product
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="font-display text-[1.6rem] font-semibold tracking-[-0.025em] sm:text-[2rem]">
                  ShifaMind
                </span>
              </div>

              <h2 className="mt-3 text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[2.8rem]">
                Clinical AI that{' '}
                <span className="gradient-text">explains itself.</span>
              </h2>
              <p className="mt-5 max-w-xl text-[1rem] font-light leading-relaxed text-secondary">
                A concept-bottleneck model that predicts ICD-10 diagnoses from
                discharge summaries while exposing the clinical concepts driving
                each prediction. Interpretability is{' '}
                <span className="text-primary">enforced architecturally</span>,
                not bolted on after training.
              </p>

              <ul className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {traits.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 text-[0.9rem] text-secondary"
                  >
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                    >
                      <Check size={12} strokeWidth={2.4} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="https://shifamind.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                    boxShadow: 'var(--shadow-glow)',
                    color: 'var(--on-accent)',
                  }}
                >
                  Visit shifamind.me
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <a
                  href={PLATFORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-subtle bg-glass px-5 py-2.5 text-[0.88rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
                >
                  Open the platform
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <ConceptVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function ConceptVisual() {
  // Simulated activated concepts -> mapped diagnoses (visual only)
  const concepts = [
    { label: 'edema', v: 0.94 },
    { label: 'diuretics', v: 0.91 },
    { label: 'cardiac', v: 0.88 },
    { label: 'dyspnea', v: 0.86 },
    { label: 'pleural_effusion', v: 0.79 },
  ];
  const diagnoses = [
    { code: 'I50.9', label: 'Heart failure', conf: 0.92 },
    { code: 'J91.8', label: 'Pleural effusion', conf: 0.78 },
    { code: 'I10', label: 'Hypertension', conf: 0.71 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between text-[0.72rem] uppercase tracking-[0.14em] text-muted">
        <span className="inline-flex items-center gap-2 normal-case tracking-normal">
          <span className="font-mono uppercase tracking-[0.14em]">patient #48201</span>
        </span>
        <span className="inline-flex items-center gap-1 text-accent">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
          live inference
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-subtle bg-glass-strong p-4 text-[0.78rem] leading-relaxed text-secondary">
        <span className="font-mono text-muted">Note ›</span>{' '}
        <em>
          72M admitted with progressive dyspnea, bilateral lower-extremity
          edema, and elevated BNP. CXR showing bilateral pleural effusions.
          Started on IV furosemide with improvement…
        </em>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[0.72rem] font-medium uppercase tracking-[0.12em] text-secondary">
          Activated concepts
          <span className="font-mono text-muted">160 grounded</span>
        </div>
        <div className="space-y-1.5">
          {concepts.map((c, i) => (
            <ConceptBar key={c.label} {...c} delay={i * 0.06} />
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-subtle pt-4">
        <div className="mb-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-secondary">
          Predicted diagnoses
        </div>
        <ul className="space-y-1.5 font-mono text-[0.82rem]">
          {diagnoses.map((d, i) => (
            <motion.li
              key={d.code}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
              className="flex items-center justify-between rounded-md border border-subtle bg-glass px-3 py-2"
            >
              <span>
                <span className="text-primary">{d.code}</span>
                <span className="ml-2 font-sans text-secondary">{d.label}</span>
              </span>
              <span className="text-accent">{d.conf.toFixed(2)}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Decorative gradient ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)',
          filter: 'blur(20px)',
          opacity: 0.5,
        }}
      />
    </motion.div>
  );
}

function ConceptBar({ label, v, delay }: { label: string; v: number; delay: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 truncate text-[0.78rem] text-secondary">{label}</div>
      <div className="relative h-5 flex-1 overflow-hidden rounded-md border border-subtle bg-glass">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${v * 100}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-md"
          style={{
            background:
              'linear-gradient(90deg, color-mix(in oklab, var(--accent) 35%, transparent), var(--accent))',
          }}
        />
      </div>
      <div className="w-10 text-right font-mono text-[0.72rem] text-accent">
        {v.toFixed(2)}
      </div>
    </div>
  );
}
