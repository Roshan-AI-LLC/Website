import { motion } from 'framer-motion';
import { ArrowUpRight, Terminal } from 'lucide-react';

const curlExample = `curl -X POST https://api.roshan-ai.com/v1/shifamind/predict \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"note": "72M with HFrEF presents with dyspnea, edema, BNP 1850..."}'`;

const responseExample = `{
  "codes": [
    {
      "code": "I50.23",
      "description": "Acute on chronic systolic heart failure",
      "confidence": 0.94,
      "concepts": [
        { "label": "orthopnea",            "activation": 0.93 },
        { "label": "lower_extremity_edema", "activation": 0.91 },
        { "label": "bnp_elevation",         "activation": 0.90 }
      ],
      "evidence": ["BNP 1850", "bilateral lower-extremity edema"]
    }
  ]
}`;

export function DeveloperBlock() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <Terminal size={11} strokeWidth={2.4} />
              For developers
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]"
            >
              Integrate ShifaMind via API.
            </motion.h2>

            <p className="mt-4 max-w-md text-[0.96rem] font-light leading-relaxed text-secondary">
              One endpoint. Concept-grounded predictions in the response, with
              evidence and alternatives. No bespoke fine-tuning required.
            </p>

            <a
              href="/developers"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-glass px-4 py-2 text-[0.86rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
            >
              Developer overview
              <ArrowUpRight size={14} />
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass overflow-hidden rounded-3xl"
          >
            <CodeBlock label="Request" code={curlExample} language="bash" />
            <div className="border-t border-subtle" />
            <CodeBlock label="Response" code={responseExample} language="json" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CodeBlock({
  label,
  code,
  language,
}: {
  label: string;
  code: string;
  language: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-subtle px-5 py-3 text-[0.72rem] uppercase tracking-[0.14em] text-muted">
        <span>{label}</span>
        <span className="font-mono">{language}</span>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.78rem] leading-relaxed text-secondary">
        <code>{code}</code>
      </pre>
    </div>
  );
}
