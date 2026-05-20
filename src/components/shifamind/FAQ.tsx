import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const items: { q: string; a: string }[] = [
  {
    q: 'How is ShifaMind different from a general-purpose LLM?',
    a: 'General LLMs generate codes from a single forward pass over the note. ShifaMind uses a Multiplicative Concept Bottleneck: cross-attention extracts a concept-grounded representation from the note against a vocabulary of 160 named clinical concepts, and a learned multiplicative gate constrains the diagnosis head to operate only on that concept-grounded representation. There is no direct path from the encoder to the prediction head, so every prediction is concept-mediated by construction.',
  },
  {
    q: 'Does ShifaMind replace coders?',
    a: 'No. ShifaMind is built for clinician- and coder-in-the-loop workflows. The model proposes ranked codes with grounded evidence; the human accepts, edits, or rejects. The fastest path to ROI is reducing the time coders spend on the unambiguous codes so they can focus on the hard ones.',
  },
  {
    q: 'What models power it?',
    a: 'The encoder is BioClinical ModernBERT-base, an 8,192-token long-context clinical encoder. Above the encoder sits a cross-attention concept-grounding module over 160 learnable concept queries, a multiplicative gate, LayerNorm, and a diagnosis head trained with focal loss against the MIMIC-IV top-50 ICD-10 set. A separate concept head produces inspectable scalar concept activations supervised by NegEx-derived pseudo-labels; this head is not used in the diagnosis pathway. Larger backbones are under evaluation.',
  },
  {
    q: 'How do you handle PHI?',
    a: 'BAA-eligible deployments keep PHI inside the customer perimeter. We support customer-managed encryption keys, audit logging on every prediction, and a strict no-training-on-customer-data default. Opt-in research data sharing exists for partners who want it; it is contract-bound and never the default.',
  },
  {
    q: 'Can I try it on my own notes?',
    a: 'Yes. The ShifaMind platform accepts pasted notes today for clinicians and researchers evaluating the system. API access for production integration is gated; reach out via the contact form to start that conversation.',
  },
  {
    q: 'What benchmark do you report on?',
    a: 'Our headline number is Macro-F1 = 0.712 on the MIMIC-IV top-50 ICD-10 held-out set (global threshold τ = 0.5), evaluated against six published baselines including LAAT, CAML, PLM-ICD, KEPT, and GKI-ICD. We also report three interpretability-oriented metrics on the same test set: Concept-Supported True Positive Rate (CSTPR = 0.704), Concept Influence Magnitude (CIM = 1.314), and Concept-Conditioned Recall (CCR = 0.836), against a capacity-matched Vanilla CBM. Methodology, ablations, and statistical tests are in the preprint.',
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
        <span className="text-[1rem] font-medium leading-snug text-primary">
          {q}
        </span>
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
