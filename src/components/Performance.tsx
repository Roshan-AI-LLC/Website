import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { SectionHeader } from './About';

type Row = {
  name: string;
  value: number;
  width: number;
  tone: 'accent' | 'iris' | 'violet' | 'rose' | 'mute';
  highlight?: boolean;
};

const f1Rows: Row[] = [
  { name: 'ShifaMind', value: 0.7122, width: 95, tone: 'accent', highlight: true },
  { name: 'LAAT', value: 0.7114, width: 94.9, tone: 'iris' },
  { name: 'GKI-ICD', value: 0.6485, width: 86.5, tone: 'violet' },
  { name: 'Gemini 2.5 Pro', value: 0.4349, width: 58, tone: 'mute' },
  { name: 'GPT-5.4', value: 0.4169, width: 55.6, tone: 'mute' },
  { name: 'Claude 4.6', value: 0.3426, width: 45.7, tone: 'mute' },
  { name: 'Vanilla CBM', value: 0.164, width: 21.9, tone: 'rose' },
];

const interpretMetrics = [
  { v: '0.704', name: 'CSTPR', desc: 'Correctly identified & explained diagnoses.' },
  { v: '1.314', name: 'CIM', desc: 'Causal strength of concept representations.' },
  { v: '0.836', name: 'CCR', desc: 'Diagnosis recall when concepts are present.' },
];

export function Performance() {
  return (
    <section id="performance" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Evaluation"
          title={
            <>
              Frontier accuracy with
              <br className="hidden sm:block" />{' '}
              <span className="gradient-text">enforced transparency</span>.
            </>
          }
          desc="Evaluated on top-50 ICD-10 codes from MIMIC-IV. ShifaMind matches state-of-the-art black-box models in F1, and is the only one that ships with a verifiable concept trail."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* F1 chart */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6 sm:p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-secondary">
                  Diagnostic F1 (Top-50 ICD-10)
                </div>
                <div className="mt-1 text-[0.74rem] text-muted">
                  Macro-averaged · tuned threshold
                </div>
              </div>
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[0.68rem] font-medium text-accent">
                MIMIC-IV
              </span>
            </div>

            <div className="space-y-2.5">
              {f1Rows.map((r, i) => (
                <BarRow key={r.name} {...r} delay={i * 0.06} />
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-[0.74rem] text-muted">
              <Info size={12} />
              ShifaMind beats every general-purpose LLM tested and matches the
              best clinical specialist baseline.
            </div>
          </motion.div>

          {/* Interpretability */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-6 sm:p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-secondary">
                Interpretability metrics
              </div>
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[0.68rem] font-medium text-accent">
                Enforced
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {interpretMetrics.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
                  className="rounded-xl border border-subtle bg-glass p-4 text-center"
                >
                  <div className="font-mono text-[1.55rem] font-semibold tracking-tight text-accent">
                    {m.v}
                  </div>
                  <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-secondary">
                    {m.name}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 space-y-2.5 rounded-xl border border-subtle bg-accent-soft/30 p-4 text-[0.84rem] leading-relaxed text-secondary">
              {interpretMetrics.map((m) => (
                <div key={m.name} className="flex gap-2">
                  <span className="font-medium text-accent">{m.name}</span>
                  <span>{m.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BarRow({ name, value, width, tone, highlight, delay }: Row & { delay: number }) {
  const grad: Record<Row['tone'], string> = {
    accent:
      'linear-gradient(90deg, color-mix(in oklab, var(--accent) 30%, transparent), var(--accent))',
    iris: 'linear-gradient(90deg, color-mix(in oklab, var(--color-iris-500) 30%, transparent), var(--color-iris-500))',
    violet:
      'linear-gradient(90deg, color-mix(in oklab, var(--color-violet-500) 30%, transparent), var(--color-violet-500))',
    rose: 'linear-gradient(90deg, color-mix(in oklab, #fb7185 30%, transparent), #fb7185)',
    mute: 'linear-gradient(90deg, color-mix(in oklab, var(--text-muted) 25%, transparent), color-mix(in oklab, var(--text-muted) 60%, transparent))',
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-32 truncate text-[0.84rem] ${
          highlight ? 'font-medium text-primary' : 'text-secondary'
        }`}
      >
        {name}
        {highlight && (
          <span className="ml-1 align-middle text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-accent">
            ours
          </span>
        )}
      </div>
      <div className="relative h-7 flex-1 overflow-hidden rounded-md border border-subtle bg-glass">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${width}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-full items-center justify-end rounded-md pr-2 font-mono text-[0.72rem] text-white"
          style={{ background: grad[tone] }}
        >
          {value.toFixed(4)}
        </motion.div>
      </div>
    </div>
  );
}
