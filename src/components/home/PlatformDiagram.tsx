import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  DatabaseZap,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Product = {
  name: string;
  description: string;
  status: 'live' | 'progress' | 'future';
  href?: string;
};

type Layer = {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
  signal: string;
};

const layers: Layer[] = [
  {
    index: '01',
    title: 'Clinical ingestion',
    description: 'Notes, signals, and workflow context enter a shared clinical data layer.',
    icon: DatabaseZap,
    signal: 'Input',
  },
  {
    index: '02',
    title: 'Concept grounding',
    description: 'Clinical encoders map relevant information to interpretable concepts.',
    icon: Network,
    signal: 'Reasoning',
  },
  {
    index: '03',
    title: 'Evidence-backed output',
    description: 'Products return predictions with the concepts and source evidence intact.',
    icon: ShieldCheck,
    signal: 'Delivery',
  },
];

const products: Product[] = [
  {
    name: 'ShifaMind',
    description: 'Concept-grounded ICD-10 coding',
    status: 'live',
    href: '/products/shifamind',
  },
  {
    name: 'NabzGraph',
    description: 'Interpretable ICU knowledge graphs',
    status: 'progress',
    href: '/products/nabzgraph',
  },
  {
    name: 'Next products',
    description: 'More clinical reasoning workflows on the same backbone',
    status: 'future',
  },
];

const nextCapabilities = [
  'Multi-agent reasoning',
  'HCC coding',
  'Risk Adjustment Chart Chase',
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function PlatformDiagram() {
  return (
    <section id="platform" className="relative py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--accent)] text-[color:var(--on-accent)]">
              <BrainCircuit size={9} strokeWidth={2.5} />
            </span>
            Shared clinical infrastructure
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-3 text-balance font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:mt-4 sm:text-[3rem]"
          >
            The product line compounds on{' '}
            <span className="gradient-text">one clinical core.</span>
          </motion.h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-[0.92rem] leading-relaxed text-secondary sm:mt-4 sm:text-[1.05rem]">
            Roshan AI does not build each workflow from scratch. The same
            concept-grounded architecture turns clinical input into evidence-backed
            outputs across a growing set of products.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="glass relative mt-8 overflow-hidden rounded-[1.5rem] p-3 sm:mt-12 sm:rounded-[2rem] sm:p-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--accent) 20%, transparent), transparent 68%)',
            }}
          />

          <div className="relative flex items-center justify-between gap-3 px-1 py-1.5 sm:px-3 sm:py-2">
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.15em] text-secondary">
              Reusable architecture
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-subtle bg-glass-strong px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted sm:inline-flex">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              Designed to compound
            </div>
          </div>

          <div className="relative mt-2.5 grid gap-2 lg:mt-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-4">
            {layers.map((layer, index) => (
              <LayerCard key={layer.index} layer={layer} delay={index * 0.08} />
            ))}
          </div>

          <div className="relative mt-3 rounded-2xl border border-subtle bg-elev p-3 sm:mt-6 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div>
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.15em] text-muted">
                  Products powered by the core
                </div>
                <div className="mt-1 text-[0.78rem] text-secondary sm:text-[0.88rem]">
                  One platform turns shared clinical reasoning into multiple workflows.
                </div>
              </div>
              <div className="hidden h-px flex-1 bg-[color:var(--border-subtle)] sm:block" />
            </div>

            <div className="mt-3 grid gap-2 md:mt-4 md:gap-3 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-4 grid gap-3 lg:mt-5 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-4">
          <div className="rounded-2xl border border-subtle bg-glass px-4 py-3.5 sm:px-6 sm:py-4">
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
              What compounds next
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {nextCapabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-subtle bg-glass-strong px-3 py-1.5 text-[0.72rem] font-semibold text-secondary"
                >
                  {capability}
                  <span className="ml-2 text-[0.6rem] uppercase tracking-[0.1em] text-[color:var(--color-violet-500)]">
                    In dev
                  </span>
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/platform"
            className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.84rem] font-semibold text-secondary transition hover:border-strong hover:text-primary"
          >
            Explore the platform
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LayerCard({ layer, delay }: { layer: Layer; delay: number }) {
  const Icon = layer.icon;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay, ease: EASE }}
          className="relative overflow-hidden rounded-2xl border border-subtle bg-glass-strong p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Icon size={18} strokeWidth={1.9} />
          </span>
          <span className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted">
            {layer.index}
          </span>
        </div>
        <div className="mt-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-accent sm:mt-5">
          {layer.signal}
        </div>
        <h3 className="mt-1.5 font-display text-[1.08rem] font-semibold tracking-[-0.02em] sm:mt-2 sm:text-[1.2rem]">
          {layer.title}
        </h3>
        <p className="mt-1.5 text-[0.78rem] leading-relaxed text-secondary sm:mt-2 sm:text-[0.84rem]">
          {layer.description}
        </p>
      </motion.div>
      {layer.index !== '03' && (
        <div className="flex items-center justify-center py-1 lg:py-0">
          <ArrowRight size={18} className="rotate-90 text-muted lg:rotate-0" />
        </div>
      )}
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.82rem] font-semibold text-primary">{product.name}</span>
        <Status status={product.status} />
      </div>
      <p className="mt-1.5 text-[0.72rem] leading-relaxed text-secondary sm:mt-2 sm:text-[0.76rem]">{product.description}</p>
      {product.href && (
        <span className="mt-3 hidden items-center gap-1 text-[0.72rem] font-semibold text-accent md:inline-flex">
          Open product <ArrowUpRight size={12} />
        </span>
      )}
    </>
  );

  const className = `group block rounded-xl border border-subtle bg-glass-strong p-3 transition sm:p-4 ${
    product.href ? 'hover:-translate-y-0.5 hover:border-strong' : ''
  }`;

  return product.href ? (
    <Link to={product.href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function Status({ status }: { status: Product['status'] }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-accent">
        <span className="pulse-dot h-1 w-1 rounded-full bg-current" />
        Live
      </span>
    );
  }

  if (status === 'progress') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-accent">
        <span className="pulse-dot h-1 w-1 rounded-full bg-current" />
        Scaling
      </span>
    );
  }

  return (
    <span className="rounded-full border border-subtle px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted">
      Planned
    </span>
  );
}
