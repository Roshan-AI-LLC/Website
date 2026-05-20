import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Brain, Database, Layers, Plug, Sparkles } from 'lucide-react';
import type { ElementType } from 'react';
import { Link } from 'react-router-dom';
import { ShifaMindLogo } from '../components/ShifaMindLogo';

type Layer = {
  index: string;
  icon: ElementType;
  title: string;
  oneLiner: string;
  body: string;
  capabilities: string[];
};

const layers: Layer[] = [
  {
    index: '01',
    icon: Database,
    title: 'Ingestion',
    oneLiner: 'Clinical data, normalized into something models can read.',
    body: 'Discharge summaries, progress notes, ED notes, structured EHR fields, imaging reports. Notes arrive over API or batch; the ingestion layer normalizes formatting, strips or preserves PHI per customer policy, and produces the canonical text representation downstream models consume.',
    capabilities: [
      'Free-text notes and discharge summaries',
      'Structured EHR exports (FHIR-flavored)',
      'PHI tagging and de-identification (configurable)',
      'Per-tenant data isolation',
    ],
  },
  {
    index: '02',
    icon: Brain,
    title: 'Models',
    oneLiner: 'Clinical encoders trained on real clinical text.',
    body: 'BioClinical ModernBERT-base today, with larger backbones under evaluation. The encoder is paired with a learnable concept-query bank trained against an explicit set of clinical concepts: the same concepts a coder or clinician would name out loud. The encoder is the substrate; the concept-grounded representation is the contract.',
    capabilities: [
      'BioClinical ModernBERT-base, 8,192-token context',
      '160 grounded clinical concepts',
      'Multiplicative Concept Bottleneck (MCB)',
      'Larger backbones under evaluation',
    ],
  },
  {
    index: '03',
    icon: Layers,
    title: 'Reasoning',
    oneLiner: 'A concept bottleneck every prediction must flow through.',
    body: 'The reasoning layer takes an encoded note, activates the concepts present, and routes prediction signal exclusively through those concepts. No prediction is produced without the concept evidence that supports it. The bottleneck is the feature: it forces explainability by construction.',
    capabilities: [
      'Concept activation per note',
      'Code prediction grounded in concepts',
      'Confidence and alternatives',
      'Concept-Supported True Positive Rate (CSTPR) telemetry',
    ],
  },
  {
    index: '04',
    icon: Plug,
    title: 'APIs',
    oneLiner: 'One integration shape, many products downstream.',
    body: 'Every product on the platform exposes the same response shape: predictions, evidence, concepts, alternatives. Integrators write to a single integration surface; products plug in mechanically. The API is the boundary between Roshan AI infrastructure and the workflows clinicians actually use.',
    capabilities: [
      'REST endpoints, JSON responses',
      'Token-based auth',
      'Per-prediction audit logs',
      'Webhooks for async pipelines (roadmap)',
    ],
  },
  {
    index: '05',
    icon: Sparkles,
    title: 'App surface',
    oneLiner: 'The first product on the stack, today.',
    body: 'ShifaMind is the first consumer of the platform: a coder and reasoning workspace clinicians use directly. The same platform layers power the products that come next. Adding a new product is a content and policy exercise, not a re-architecture.',
    capabilities: [
      'ShifaMind · live',
      'More clinical-reasoning products in development',
      'Customer-facing UI surfaces share the design system',
    ],
  },
];

export default function Platform() {
  return (
    <>
      <Head>
        <title>Platform | Roshan AI</title>
        <meta
          name="description"
          content="The Roshan AI platform: shared clinical AI infrastructure powering ShifaMind and every product downstream."
        />
        <link rel="canonical" href="https://roshan-ai.com/platform" />
      </Head>

      <Hero />
      <LayerList />
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
        <div className="enter-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            Platform
          </div>

          <h1 className="mt-5 max-w-3xl text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">
            The platform under{' '}
            <span className="gradient-text">every Roshan AI product.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[1.05rem] font-light leading-relaxed text-secondary">
            Roshan AI is a platform company. Every product we ship (ShifaMind
            today, more in development) reads from the same ingestion layer,
            runs on the same clinical encoders, and explains itself through the
            same concept reasoning layer. This page is the stack.
          </p>
        </div>
      </div>
    </section>
  );
}

function LayerList() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="space-y-12 sm:space-y-16">
          {layers.map((layer, i) => (
            <LayerBlock key={layer.index} layer={layer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LayerBlock({ layer, index }: { layer: Layer; index: number }) {
  const reversed = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`grid items-start gap-8 lg:gap-14 ${
        reversed ? 'lg:grid-cols-[1.05fr_1fr]' : 'lg:grid-cols-[1fr_1.05fr]'
      }`}
    >
      <div className={reversed ? 'lg:order-2' : ''}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-muted">
            Layer {layer.index}
          </span>
          <div
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
            }}
          >
            <layer.icon size={16} strokeWidth={1.8} />
          </div>
        </div>

        <h2 className="mt-4 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]">
          {layer.title}
        </h2>
        <p className="mt-3 text-[1rem] font-medium text-accent">
          {layer.oneLiner}
        </p>
        <p className="mt-4 text-[0.96rem] font-light leading-relaxed text-secondary">
          {layer.body}
        </p>
      </div>

      <div className={reversed ? 'lg:order-1' : ''}>
        <div className="glass rounded-3xl p-6 sm:p-7">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
            In this layer today
          </div>
          <ul className="mt-4 space-y-2">
            {layer.capabilities.map((c) => (
              <li
                key={c}
                className="flex items-center gap-2.5 rounded-lg border border-subtle bg-glass px-3 py-2.5 text-[0.92rem] text-secondary"
              >
                <span
                  className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
                {c}
              </li>
            ))}
          </ul>
          {layer.title === 'App surface' && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-subtle bg-glass px-3 py-2.5">
              <ShifaMindLogo size={26} />
              <div className="flex-1">
                <div className="text-[0.86rem] font-semibold text-primary">
                  ShifaMind
                </div>
                <div className="text-[0.74rem] text-muted">
                  Live · the first product on the stack
                </div>
              </div>
              <Link
                to="/products/shifamind"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-subtle bg-glass text-secondary transition hover:border-strong hover:text-primary"
                aria-label="Open ShifaMind"
              >
                <ArrowUpRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Closing() {
  return (
    <section className="relative py-20 sm:py-24">
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
                Build on the platform
              </div>
              <h2 className="mt-3 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]">
                Integrate ShifaMind today. Build on what's next.
              </h2>
              <p className="mt-3 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
                The same platform that powers ShifaMind will power the products
                that come after it. If you're building a clinical workflow
                that needs grounded reasoning, talk to us early. Partner
                deployments shape the roadmap.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link
                to="/developers"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                Developer overview
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
              >
                Talk to us
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
