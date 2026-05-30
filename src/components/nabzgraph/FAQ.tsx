import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const items: { q: string; a: string }[] = [
  {
    q: 'How is NabzGraph different from a monitoring alarm?',
    a: 'An alarm fires on a single threshold for a single channel. NabzGraph builds a patient-specific knowledge graph: each node is a SNOMED concept activated by detectable signal patterns, and each edge is a measured relationship between concepts — temporal precedence, co-occurrence, or Granger-causal influence. You can interrogate why a concept fired, how concepts relate, and when a pattern first emerged, all the way down to the raw signal window.',
  },
  {
    q: 'Why are the edge types trustworthy?',
    a: 'Every edge type is derived from a measurable property of the signal evidence, not hand-designed. Temporal edges come from lagged cross-correlation of concept activation series, co-occurrence edges from Jaccard overlap of source-window sets, and Granger edges from Granger causality on the underlying signal features. This is the core research contribution — a defense against the "why these types?" critique.',
  },
  {
    q: 'Is it a diagnosis system?',
    a: 'No. NabzGraph detects physiological concepts and their relationships, not disease labels. It is a signal-layer reasoning layer that sits alongside the EMR and existing monitoring — it does not replace them.',
  },
  {
    q: 'What model powers it?',
    a: 'Per-modality 1D-conv + Transformer encoders (MAE pre-trained, then fine-tuned end-to-end) produce one embedding per 30s window. A cross-modal fusion layer with learned mask tokens handles missing modalities, a concept bottleneck layer exposes seven SNOMED-grounded binary concept heads, and a persistence-tier classifier labels each concept TRANSIENT, EPISODIC, or PERSISTENT before nodes and edges are derived.',
  },
  {
    q: 'What if a patient is missing a modality?',
    a: 'The cross-modal fusion layer is trained with learned mask tokens, so a patient without ABP or PPG still produces a valid graph from the available channels. Missing-modality robustness is built into the architecture, not patched on afterward.',
  },
  {
    q: 'Is it real-time?',
    a: 'V1 is designed for retrospective ICU-stay analysis; KG construction runs in under 2 seconds per patient on CPU after the encoder forward pass. A streaming pipeline for live monitoring is on the V2 roadmap.',
  },
];

export function FAQ() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          FAQ
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          Questions we get a lot.
        </motion.h2>

        <div className="mt-10 divide-y divide-[color:var(--border-subtle)] border-y border-subtle">
          {items.map((it, i) => (
            <FAQItem key={i} q={it.q} a={it.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:opacity-90"
        aria-expanded={open}
      >
        <span className="text-[1rem] font-medium leading-snug text-primary">{q}</span>
        <span
          className={`mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-subtle text-secondary transition ${
            open ? 'rotate-45 border-strong text-accent' : ''
          }`}
        >
          <Plus size={14} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-[0.94rem] font-light leading-relaxed text-secondary">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
