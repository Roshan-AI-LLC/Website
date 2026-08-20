import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Boxes, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ElementType } from 'react';

const predictExample = `curl -X POST https://api.roshan-ai.com/v1/shifamind/predict \\
  -H "Authorization: Bearer $ROSHAN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "note": "72M with HFrEF presents with progressive dyspnea, bilateral edema, BNP 1850..."
  }'`;

const responseExample = `{
  "model": "shifamind-icd10-v2.1",
  "codes": [
    {
      "code": "I50.23",
      "description": "Acute on chronic systolic heart failure",
      "confidence": 0.94,
      "concepts": ["orthopnea", "lower_extremity_edema", "bnp_elevation"],
      "evidence": ["progressive dyspnea", "bilateral edema", "BNP 1850"],
      "alternatives": ["I50.22", "I50.9"]
    }
  ]
}`;

const principles: { icon: ElementType; title: string; body: string }[] = [
  {
    icon: Boxes,
    title: 'One response shape',
    body: 'Predictions, confidence, concepts, evidence, and alternatives across products.',
  },
  {
    icon: ShieldCheck,
    title: 'Auditable inference',
    body: 'Activated concepts and verbatim evidence travel with every response.',
  },
  {
    icon: Zap,
    title: 'Stable contracts',
    body: 'Versioned URLs and explicit deprecation timelines—not surprise changes.',
  },
];

export default function Developers() {
  return (
    <>
      <Head>
        <title>Developers | Roshan AI</title>
        <meta
          name="description"
          content="Roshan AI APIs power clinical reasoning inside your product. Predictions, concepts, evidence, alternatives, through one integration surface."
        />
        <link rel="canonical" href="https://roshan-ai.com/developers" />
      </Head>
      <Hero />
      <CodeShowcase />
      <Principles />
      <Closing />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-[5.5rem] pb-9 sm:pt-40 sm:pb-14">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[360px] w-[1000px] max-w-full opacity-55 sm:h-[420px] sm:w-[1100px]" />
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="enter-fade-up max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
            <Terminal size={11} strokeWidth={2.4} />
            Developers
          </div>
          <h1 className="mt-4 text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-5 sm:text-[3rem]">
            Clinical reasoning,{' '}
            <span className="gradient-text">in your product.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-[0.94rem] leading-relaxed text-secondary sm:mt-5 sm:text-[1.05rem]">
            One API surface returns predictions, the concepts that produced them, and the verbatim phrases they are grounded in.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <a
              href="#request-access"
              className="group col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5 sm:col-auto sm:text-[0.92rem]"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                boxShadow: 'var(--shadow-glow)',
                color: 'var(--on-accent)',
              }}
            >
              Request access
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <Link
              to="/platform"
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.84rem] font-medium text-secondary transition hover:border-strong hover:text-primary sm:col-auto sm:text-[0.92rem]"
            >
              See the platform
            </Link>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-3 py-1 text-[0.68rem] text-muted sm:text-[0.74rem]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-violet-500)]" />
            Closed beta · partner access is gated
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeShowcase() {
  return (
    <section className="relative py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Integration example</div>
            <h2 className="mt-2 font-display text-[1.55rem] font-semibold tracking-[-0.03em] sm:text-[2rem]">From note to traceable result.</h2>
          </div>
          <div className="rounded-full border border-subtle bg-glass px-3 py-1 font-mono text-[0.66rem] text-secondary">
            export ROSHAN_TOKEN="rk_live_..."
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          <div className="grid divide-y divide-[color:var(--border-subtle)] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <CodeBlock label="POST /v1/shifamind/predict" language="bash" code={predictExample} />
            <CodeBlock label="Evidence-rich response" language="json" code={responseExample} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CodeBlock({ label, code, language }: { label: string; code: string; language: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between border-b border-subtle px-4 py-3 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-muted sm:px-5">
        <span className="truncate pr-3">{label}</span>
        <span className="shrink-0 font-mono">{language}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.7rem] leading-relaxed text-secondary sm:px-5 sm:text-[0.76rem]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Principles() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              API contract
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
            >
              Designed for production{' '}
              <span className="gradient-text">integration.</span>
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">
            The same response contract is designed to outlive any single product release.
          </p>
        </div>
        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-3 px-4 py-4 sm:px-5 sm:py-5 md:block"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 md:mt-4">
                    <div className="text-[0.92rem] font-semibold text-primary">{principle.title}</div>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-secondary sm:text-[0.84rem]">{principle.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section id="request-access" className="relative scroll-mt-28 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-2xl px-5 py-5 sm:rounded-3xl sm:px-7 sm:py-6"
        >
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1.35fr_auto] lg:items-center lg:gap-8">
            <div>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Request access</div>
              <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">
                Build the workflow before you request the key.
              </h2>
              <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
                Tell us about your product, data, and clinical workflow. We work directly with partners on scope, timing, and access.
              </p>
            </div>
            <Link
              to="/contact"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5 lg:justify-self-end"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                boxShadow: 'var(--shadow-glow)',
                color: 'var(--on-accent)',
              }}
            >
              Talk to us
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 80% 50%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 66%)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
