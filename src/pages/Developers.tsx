import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Terminal, ShieldCheck, Zap, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ElementType } from 'react';

const authExample = `# Issue a token (one-time, from your account dashboard)
export ROSHAN_TOKEN="rk_live_..."

# Verify the token works
curl https://api.roshan-ai.com/v1/me \\
  -H "Authorization: Bearer $ROSHAN_TOKEN"`;

const predictExample = `curl -X POST https://api.roshan-ai.com/v1/shifamind/predict \\
  -H "Authorization: Bearer $ROSHAN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "note": "72M with HFrEF presents with progressive dyspnea, bilateral edema, BNP 1850. Started IV furosemide..."
  }'`;

const responseExample = `{
  "model": "shifamind-icd10-v2.1",
  "codes": [
    {
      "code": "I50.23",
      "description": "Acute on chronic systolic heart failure",
      "confidence": 0.94,
      "concepts": [
        { "label": "orthopnea",             "activation": 0.93 },
        { "label": "lower_extremity_edema", "activation": 0.91 },
        { "label": "bnp_elevation",         "activation": 0.90 }
      ],
      "evidence": [
        "progressive dyspnea",
        "bilateral edema",
        "BNP 1850"
      ],
      "alternatives": [
        { "code": "I50.22", "description": "Chronic systolic heart failure" },
        { "code": "I50.9",  "description": "Heart failure, unspecified" }
      ]
    }
  ]
}`;

const principles: { icon: ElementType; title: string; body: string }[] = [
  {
    icon: Boxes,
    title: 'One response shape',
    body: 'Every product on the platform returns the same fields: predictions, confidence, concepts, evidence, alternatives. Integrate once; new products plug into the same handlers.',
  },
  {
    icon: ShieldCheck,
    title: 'Auditable inference',
    body: 'Each response carries the activated concepts and verbatim evidence. The audit log is the response, not an addendum.',
  },
  {
    icon: Zap,
    title: 'Stable contracts',
    body: 'Breaking changes ship behind versioned URL prefixes (v1, v2). Deprecations come with timelines, not surprises.',
  },
];

export default function Developers() {
  return (
    <>
      <Head>
        <title>Developers — Roshan AI</title>
        <meta
          name="description"
          content="Roshan AI APIs power clinical reasoning inside your product. Predictions, concepts, evidence, alternatives — through one integration surface."
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
    <section className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-60" />
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
            <Terminal size={11} strokeWidth={2.4} />
            Developers
          </div>

          <h1 className="mt-5 max-w-3xl text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">
            Clinical reasoning,{' '}
            <span className="gradient-text">in your product.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[1.05rem] font-light leading-relaxed text-secondary">
            Roshan AI APIs return predictions, the concepts that produced them,
            and the verbatim phrases they're grounded in. One auth flow, one
            response shape, every product on the platform.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#request-access"
              className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                boxShadow: 'var(--shadow-glow)',
                color: 'var(--on-accent)',
              }}
            >
              Request access
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <Link
              to="/platform"
              className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
            >
              See the platform
            </Link>
          </div>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-3 py-1 text-[0.74rem] text-muted backdrop-blur">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--color-violet-500)' }}
            />
            Closed beta · API access is gated while we onboard partners
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CodeShowcase() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass overflow-hidden rounded-3xl"
        >
          <CodeBlock label="Authenticate" language="bash" code={authExample} />
          <div className="border-t border-subtle" />
          <CodeBlock label="Request — POST /v1/shifamind/predict" language="bash" code={predictExample} />
          <div className="border-t border-subtle" />
          <CodeBlock label="Response" language="json" code={responseExample} />
        </motion.div>
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
      <div className="flex items-center justify-between border-b border-subtle px-5 py-3 text-[0.72rem] uppercase tracking-[0.14em] text-muted sm:px-6">
        <span>{label}</span>
        <span className="font-mono">{language}</span>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.78rem] leading-relaxed text-secondary sm:px-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Principles() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          API principles
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]"
        >
          Designed for production integration.
        </motion.h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass rounded-3xl p-6"
            >
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                <p.icon size={18} strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 text-[1.05rem] font-semibold tracking-[-0.01em]">
                {p.title}
              </h3>
              <p className="mt-2 text-[0.9rem] font-light leading-relaxed text-secondary">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section id="request-access" className="relative scroll-mt-28 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-10 sm:p-14"
        >
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_auto] lg:items-center">
            <div>
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
                Request access
              </div>
              <h2 className="mt-3 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]">
                API access is gated while we onboard partners.
              </h2>
              <p className="mt-3 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
                Tell us about your product, your data, and the workflow you're
                building. We work directly with integrators to size scope,
                price, and timeline before a key gets issued. Full developer
                docs land at{' '}
                <span className="font-mono text-primary">docs.roshan-ai.com</span>{' '}
                when the API moves to public access.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                Talk to us
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 80% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
