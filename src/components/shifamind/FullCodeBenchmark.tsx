import { motion } from 'framer-motion';
import { FileText, ShieldCheck } from 'lucide-react';

/**
 * Full-code MIMIC-IV results.
 *
 * GATE: the full-code paper is under review and not public. While
 * FULL_CODE_PUBLIC is false the ShifaMind page keeps rendering the published
 * top-50 chart. Flip it to true the day the preprint posts, and set PAPER_URL.
 *
 * Figures are Table 1 of the full-code draft. Baselines are cited from
 * Edin et al. and Wu et al. and were not re-run. ShifaMind thresholds are
 * fixed on validation and never tuned on test; figures are the mean over
 * three seeds, with micro-F1 and macro-F1 both varying by 0.1 across seeds.
 */
export const FULL_CODE_PUBLIC = false;

const PAPER_URL = '';

type Row = {
  model: string;
  macroF1: number;
  microF1: number;
  p8: number;
  ours?: boolean;
};

const rows: Row[] = [
  { model: 'CAML', macroF1: 16.0, microF1: 55.4, p8: 66.8 },
  { model: 'MultiResCNN', macroF1: 21.1, microF1: 56.9, p8: 67.8 },
  { model: 'LAAT', macroF1: 20.3, microF1: 57.9, p8: 68.9 },
  { model: 'PLM-ICD', macroF1: 21.1, microF1: 58.5, p8: 69.9 },
  { model: 'GoM-ICD', macroF1: 28.5, microF1: 61.3, p8: 72.6 },
  { model: 'ShifaMind', macroF1: 27.2, microF1: 59.7, p8: 71.2, ours: true },
];

const MICRO_MAX = 65;
const EASE = [0.22, 1, 0.36, 1] as const;

export function FullCodeBenchmark() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: EASE }}
      className="glass relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full opacity-55 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent), transparent 68%)',
        }}
      />

      <div className="relative grid lg:grid-cols-[0.84fr_1.16fr]">
        <div className="border-b border-subtle p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft">
              <ShieldCheck size={14} strokeWidth={2.1} />
            </span>
            Full code space
          </div>

          <h2 className="mt-4 max-w-md text-balance font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:mt-5 sm:text-[2.7rem]">
            Accuracy under a hard{' '}
            <span className="gradient-text">attribution constraint.</span>
          </h2>

          <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-secondary sm:mt-4 sm:text-[0.96rem]">
            ShifaMind codes the full MIMIC-IV ICD-10 space, 7,940 codes. Every
            other row is free to route predictive signal through any internal
            pathway it finds useful. ShifaMind is not. 100% of every predicted
            logit is a sum of contributions from named clinical concepts, each
            traceable to a quoted span of the note.
          </p>

          <div className="mt-6 rounded-2xl border border-subtle bg-glass-strong p-4 sm:mt-8 sm:p-6">
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
              MIMIC-IV full code · Micro-F1
            </div>
            <div className="mt-3 flex items-end gap-3">
              <div className="font-display text-[3.2rem] font-semibold leading-none tracking-[-0.06em] text-primary sm:text-[4.25rem]">
                59.7
              </div>
              <div className="pb-1.5 text-[0.8rem] leading-snug text-secondary">
                7,940 codes
                <br />
                three seeds
              </div>
            </div>
            <p className="mt-3 text-[0.76rem] leading-relaxed text-muted">
              Thresholds fixed on validation, never tuned on test. Baselines
              cited from published reproductions and not re-run.
            </p>
          </div>

          {PAPER_URL && (
            <a
              href={PAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-glass px-4 py-2 text-[0.84rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
            >
              <FileText size={14} strokeWidth={1.8} />
              Read the paper
            </a>
          )}
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 border-b border-subtle pb-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-muted sm:gap-x-5">
            <span>Model</span>
            <span className="text-right">Macro-F1</span>
            <span className="w-[3.2rem] text-right sm:w-[3.6rem]">Micro-F1</span>
          </div>

          <div className="mt-1">
            {rows.map((row, index) => (
              <motion.div
                key={row.model}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
                className="border-b border-subtle py-2.5 last:border-b-0"
              >
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 sm:gap-x-5">
                  <span
                    className={
                      row.ours
                        ? 'truncate text-[0.86rem] font-semibold text-primary'
                        : 'truncate text-[0.86rem] text-secondary'
                    }
                  >
                    {row.model}
                    {row.ours && (
                      <span className="ml-1.5 text-[0.68rem] font-medium text-accent">
                        ours
                      </span>
                    )}
                  </span>
                  <span className="text-right font-mono text-[0.8rem] tabular-nums text-secondary">
                    {row.macroF1.toFixed(1)}
                  </span>
                  <span
                    className={
                      row.ours
                        ? 'w-[3.2rem] text-right font-mono text-[0.86rem] font-semibold tabular-nums text-primary sm:w-[3.6rem]'
                        : 'w-[3.2rem] text-right font-mono text-[0.8rem] tabular-nums text-secondary sm:w-[3.6rem]'
                    }
                  >
                    {row.microF1.toFixed(1)}
                  </span>
                </div>

                <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--border-subtle)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(row.microF1 / MICRO_MAX) * 100}%` }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
                    className="h-full rounded-full"
                    style={{
                      background: row.ours
                        ? 'linear-gradient(90deg, var(--accent), var(--color-iris-500))'
                        : 'color-mix(in oklab, var(--text-muted) 40%, transparent)',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-5 text-[0.72rem] leading-relaxed text-muted">
            MIMIC-IV ICD-10 full coding under the subject-level splits of Edin
            et al. Precision at 8: ShifaMind 71.2, GoM-ICD 72.6. We do not claim
            to lead this benchmark. We claim the only row whose every prediction
            decomposes into named clinical concepts with no unexplained
            remainder.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
