import { motion } from 'framer-motion';
import { FileText, Network, Sigma, Stethoscope } from 'lucide-react';
import { SectionHeader } from './About';

const steps = [
  {
    n: '01',
    icon: FileText,
    title: 'Encode',
    body: 'BioClinicalModernBERT turns discharge summaries into rich, clinically-aware embeddings.',
  },
  {
    n: '02',
    icon: Network,
    title: 'Ground',
    body: 'Cross-attention aligns the text against 111 explicit clinical concepts: symptoms, findings, treatments.',
  },
  {
    n: '03',
    icon: Sigma,
    title: 'Gate',
    body: 'A multiplicative bottleneck routes prediction signal exclusively through the active concepts. No shortcuts.',
  },
  {
    n: '04',
    icon: Stethoscope,
    title: 'Predict',
    body: 'ICD-10 codes are produced with concept-level confidence so a clinician can trace every claim.',
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="How it works"
          title={
            <>
              Every prediction flows through a{' '}
              <span className="gradient-text-warm">human-readable bottleneck</span>.
            </>
          }
          desc="ShifaMind is a concept-bottleneck architecture. The model literally cannot make a prediction that isn't traceable to clinical concepts a doctor can read, audit, and override."
        />

        <div className="relative mt-14">
          {/* Connecting line for desktop */}
          <div
            aria-hidden
            className="absolute left-[6%] right-[6%] top-[88px] hidden h-px lg:block"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--border-strong) 15%, var(--border-strong) 85%, transparent)',
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass relative overflow-hidden rounded-2xl p-6"
                data-cursor="hover"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[0.72rem] tracking-[0.18em] text-muted">
                    STEP {s.n}
                  </div>
                  <div
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    <s.icon size={16} strokeWidth={1.7} />
                  </div>
                </div>
                <h3 className="mt-6 text-[1.05rem] font-medium tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.86rem] font-light leading-relaxed text-secondary">
                  {s.body}
                </p>

                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full opacity-50"
                  style={{
                    background:
                      'radial-gradient(circle, var(--accent-soft), transparent 70%)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
