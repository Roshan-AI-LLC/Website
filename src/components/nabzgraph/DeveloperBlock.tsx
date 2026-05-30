import { motion } from 'framer-motion';
import { ArrowUpRight, Terminal } from 'lucide-react';

const endpoints = `POST /patients/{id}/kg              Build / refresh the KG from latest signals
GET  /patients/{id}/kg              Retrieve the current KG as JSON
GET  /patients/{id}/kg/nodes        Concept nodes with tiers + scores
GET  /patients/{id}/kg/edges        Edges with evidence metrics
GET  /patients/{id}/evidence/{node} Signal windows behind a node
GET  /patients/{id}/timeline        Concept activation density over time`;

const responseExample = `{
  "nodes": [
    {
      "id": "hypotension::PERSISTENT",
      "concept": "hypotension",
      "snomed": "45007003",
      "modality": "ABP",
      "tier": "PERSISTENT",
      "activation": 0.88,
      "windows": ["08:00", "09:30"]
    }
  ],
  "edges": [
    {
      "type": "TEMPORAL",
      "source": "tachycardia::EPISODIC",
      "target": "hypotension::PERSISTENT",
      "lag_min": 18,
      "cross_corr": 0.71
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
              The graph as a JSON API.
            </motion.h2>

            <p className="mt-4 max-w-md text-[0.96rem] font-light leading-relaxed text-secondary">
              A FastAPI service exposes every node, edge, and piece of evidence.
              Evidence endpoints return signal-window metadata plus base64
              waveform arrays for direct rendering.
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
            <CodeBlock label="Endpoints" code={endpoints} language="http" />
            <div className="border-t border-subtle" />
            <CodeBlock label="GET /kg" code={responseExample} language="json" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CodeBlock({ label, code, language }: { label: string; code: string; language: string }) {
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
