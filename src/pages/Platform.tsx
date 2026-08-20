import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Brain, ChevronDown, Database, Layers, Plug } from 'lucide-react';
import type { ElementType } from 'react';
import { Link } from 'react-router-dom';

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
    body: 'Notes arrive through API or batch, are normalized under customer policy, and become the canonical clinical representation downstream models consume.',
    capabilities: [
      'Free-text notes and discharge summaries',
      'FHIR-flavored EHR exports',
      'Configurable PHI tagging',
      'Per-tenant data isolation',
    ],
  },
  {
    index: '02',
    icon: Brain,
    title: 'Models',
    oneLiner: 'Clinical encoders trained on real clinical text.',
    body: 'The encoder is paired with a learnable concept-query bank trained against explicit clinical concepts: the substrate for a grounded representation contract.',
    capabilities: [
      'BioClinical ModernBERT-base · 8,192 tokens',
      '160 grounded clinical concepts',
      'Multiplicative Concept Bottleneck',
      'Larger backbones under evaluation',
    ],
  },
  {
    index: '03',
    icon: Layers,
    title: 'Reasoning',
    oneLiner: 'A concept bottleneck every prediction must flow through.',
    body: 'The reasoning layer activates the concepts present in a note and routes prediction signal exclusively through them, making evidence a requirement rather than an afterthought.',
    capabilities: [
      'Per-note concept activation',
      'Concept-grounded code prediction',
      'Confidence and alternatives',
      'CSTPR telemetry',
    ],
  },
  {
    index: '04',
    icon: Plug,
    title: 'APIs',
    oneLiner: 'One integration shape, many products downstream.',
    body: 'Every product returns predictions, evidence, concepts, and alternatives through the same response shape—one integration surface for evolving clinical workflows.',
    capabilities: [
      'REST endpoints and JSON responses',
      'Token-based authentication',
      'Per-prediction audit logs',
      'Async webhooks on roadmap',
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
      <PlatformStack />
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
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            Platform
          </div>
          <h1 className="mt-4 text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-5 sm:text-[3rem]">
            The platform under{' '}
            <span className="gradient-text">every Roshan AI product.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-[0.94rem] leading-relaxed text-secondary sm:mt-5 sm:text-[1.05rem]">
            One clinical core turns ingestion, model intelligence, grounded reasoning, and APIs into products that can compound without a re-architecture.
          </p>
        </div>
      </div>
    </section>
  );
}

function PlatformStack() {
  return (
    <section className="relative py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-3 lg:grid-cols-[150px_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-5">
          <div className="hidden lg:block" />
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Architecture map</div>
            <h2 className="mt-2 max-w-2xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]">
              Four layers.{' '}
              <span className="gradient-text">One clinical contract.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary lg:pt-7 lg:text-[0.9rem]">
            Each layer remains reusable as products, workflows, and integrations grow.
          </p>
        </div>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          {layers.map((layer, index) => (
            <StackRow key={layer.index} layer={layer} index={index} />
          ))}
          <div className="flex flex-col gap-3 bg-accent-soft/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-muted">Live today</div>
              <div className="mt-1 text-[0.9rem] font-semibold text-primary">ShifaMind</div>
              <div className="mt-0.5 text-[0.78rem] text-secondary">The first product built on the shared stack.</div>
            </div>
            <Link
              to="/products/shifamind"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-4 text-[0.8rem] font-semibold text-secondary transition hover:border-strong hover:text-primary"
            >
              Explore ShifaMind
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackRow({ layer, index }: { layer: Layer; index: number }) {
  const Icon = layer.icon;
  const Detail = () => (
    <>
      <p className="mt-2 max-w-3xl text-[0.78rem] leading-relaxed text-secondary sm:mt-1.5 sm:text-[0.84rem]">{layer.body}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {layer.capabilities.map((capability) => (
          <span key={capability} className="rounded-full border border-subtle bg-glass px-2.5 py-1 text-[0.68rem] text-secondary">
            {capability}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-2 border-b border-subtle px-4 py-3.5 last:border-b-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5 sm:px-5 sm:py-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon size={17} strokeWidth={1.8} />
        </span>
        <div>
          <div className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted">Layer {layer.index}</div>
          <div className="text-[0.92rem] font-semibold text-primary">{layer.title}</div>
        </div>
      </div>

      <details className="group sm:hidden" open={index === 0}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.8rem] font-medium text-accent [&::-webkit-details-marker]:hidden">
          <span>{layer.oneLiner}</span>
          <ChevronDown size={16} className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="pb-1"><Detail /></div>
      </details>

      <div className="hidden min-w-0 sm:block">
        <div className="text-[0.84rem] font-medium text-accent">{layer.oneLiner}</div>
        <Detail />
      </div>
    </motion.div>
  );
}

function Closing() {
  return (
    <section className="relative py-12 sm:py-16">
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
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Build on the platform</div>
              <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">
                Integrate ShifaMind today.{' '}
                <span className="gradient-text">Build on what&apos;s next.</span>
              </h2>
              <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
                If your clinical workflow needs grounded reasoning, partner deployments can shape the next product on the stack.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              <Link
                to="/developers"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                Developer overview
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-subtle bg-glass px-5 py-3 text-[0.88rem] font-medium text-secondary transition hover:border-strong hover:text-primary"
              >
                Talk to us
              </Link>
            </div>
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
