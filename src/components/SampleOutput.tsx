import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { SectionHeader } from './About';

export function SampleOutput() {
  return (
    <section id="output" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Demo"
          title={
            <>
              A trace you can <span className="gradient-text-warm">actually read</span>.
            </>
          }
          desc="A simulated ShifaMind inference. Every diagnosis is the explicit product of grounded clinical concepts — no hidden activations, no post-hoc rationalisations."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass mt-12 overflow-hidden rounded-2xl"
        >
          <div className="flex items-center gap-2 border-b border-subtle bg-glass-strong px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-[0.76rem] text-muted">
              shifamind_inference.py · patient #48201
            </span>
          </div>

          <div className="space-y-4 p-5 font-mono text-[0.82rem] leading-7 sm:p-7">
            <div>
              <span className="text-muted">›</span>{' '}
              <span className="text-accent">Input:</span>{' '}
              <span className="text-secondary">discharge summary (1,247 tokens)</span>
            </div>
            <div className="rounded-lg border border-subtle bg-glass p-3 font-sans text-[0.86rem] italic leading-relaxed text-secondary">
              “72M admitted with progressive dyspnea, bilateral lower-extremity
              edema, and elevated BNP. CXR showing bilateral pleural effusions.
              Started on IV furosemide with improvement…”
            </div>

            <div className="border-t border-subtle pt-4">
              <span className="text-muted">›</span>{' '}
              <span className="text-accent">Activated concepts</span>
              <div className="mt-2 grid gap-1.5">
                {[
                  ['edema', 0.94],
                  ['diuretics', 0.91],
                  ['cardiac', 0.88],
                  ['dyspnea', 0.86],
                  ['pleural_effusion', 0.79],
                ].map(([label, v], i) => (
                  <div key={String(label)} className="flex items-center gap-3">
                    <div className="w-36 text-secondary">{label as string}</div>
                    <div className="relative h-4 flex-1 overflow-hidden rounded border border-subtle bg-glass">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(v as number) * 100}%` }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 1, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full"
                        style={{
                          background:
                            'linear-gradient(90deg, color-mix(in oklab, var(--accent) 30%, transparent), var(--accent))',
                        }}
                      />
                    </div>
                    <div className="w-10 text-right text-accent">
                      {(v as number).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-subtle pt-4">
              <span className="text-muted">›</span>{' '}
              <span className="text-accent">Predictions</span>
              <ul className="mt-2 space-y-1">
                <li className="flex items-baseline justify-between">
                  <span>
                    <span className="text-muted">[1]</span>{' '}
                    <span className="text-primary">I50.9</span>
                    <span className="ml-2 font-sans text-secondary">
                      — Heart failure, unspecified
                    </span>
                  </span>
                  <span className="text-[#ffd93d]">conf 0.92</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span>
                    <span className="text-muted">[2]</span>{' '}
                    <span className="text-primary">J91.8</span>
                    <span className="ml-2 font-sans text-secondary">— Pleural effusion</span>
                  </span>
                  <span className="text-[#ffd93d]">conf 0.78</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span>
                    <span className="text-muted">[3]</span>{' '}
                    <span className="text-primary">I10</span>
                    <span className="ml-2 font-sans text-secondary">— Essential hypertension</span>
                  </span>
                  <span className="text-[#ffd93d]">conf 0.71</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-subtle pt-4 text-[0.78rem]">
              <span className="text-muted">›</span>{' '}
              <span className="text-accent">Causal trail</span>
              <div className="mt-1 font-sans italic text-secondary">
                I50.9 ← edema(0.94) × cardiac(0.88) × diuretics(0.91) → 0.92
              </div>
              <div className="font-sans italic text-secondary">
                J91.8 ← pleural_effusion(0.79) × dyspnea(0.86) → 0.78
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-3 inline-flex items-center gap-1.5 text-[0.74rem] text-muted">
          <Info size={12} />
          Simulated output · de-identified MIMIC-IV-style example.
        </div>
      </div>
    </section>
  );
}
