import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

type Product = {
  status: 'live' | 'next';
  name: string;
  descriptor: string;
  body: string;
  highlights: string[];
  href?: string;
  visual: 'shifamind' | 'nabzgraph' | 'placeholder';
};

const products: Product[] = [
  {
    status: 'live',
    name: 'ShifaMind',
    descriptor: 'Concept-grounded ICD-10 coding for clinicians and coders',
    body: 'ShifaMind reads a clinical note and returns ranked ICD-10 codes with the concept evidence behind each one. The interpretability is enforced architecturally: each prediction must flow through an explicit clinical-concept layer before a code can be assigned.',
    highlights: [
      'ICD-10-CM coding from discharge summaries',
      '160 grounded clinical concepts',
      'Evidence phrases from the source note',
      'Ranked alternatives with confidences',
    ],
    href: '/products/shifamind',
    visual: 'shifamind',
  },
  {
    status: 'live',
    name: 'NabzGraph',
    descriptor: 'Interpretable knowledge graphs from ICU signals',
    body: 'NabzGraph turns continuous multi-modal sensor streams (ECG, PPG, arterial pressure, respiration) into a patient-specific knowledge graph of SNOMED concepts and their measured relationships. Every node and edge traces back to the exact signal windows behind it.',
    highlights: [
      'Patient-specific knowledge graph from raw waveforms',
      '7 SNOMED-grounded signal concepts',
      'Temporal, co-occurrence & Granger edges',
      'Every node traceable to the signal window',
    ],
    href: '/products/nabzgraph',
    visual: 'nabzgraph',
  },
  {
    status: 'next',
    name: 'In development',
    descriptor: 'More clinical reasoning products on the platform',
    body: 'Same infrastructure stack, same evidence-first design. Specialised products built on the shared Roshan AI platform are in active R&D. Partner deployments shape the roadmap. Talk to us early.',
    highlights: [
      'On the same ingestion + reasoning layers',
      'Same response shape, no new integration',
      'Partner-shaped roadmap',
    ],
    visual: 'placeholder',
  },
];

export default function ProductsIndex() {
  return (
    <>
      <Head>
        <title>Products | Roshan AI</title>
        <meta
          name="description"
          content="Clinical AI products built on the Roshan AI platform. ShifaMind is our flagship; more in development."
        />
        <link rel="canonical" href="https://roshan-ai.com/products" />
      </Head>

      <Hero />
      <ProductList />
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
            Products
          </div>

          <h1 className="mt-5 max-w-3xl text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">
            One platform.{' '}
            <span className="gradient-text">A growing family of clinical products.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[1.05rem] font-light leading-relaxed text-secondary">
            ShifaMind is the first product Roshan AI ships. The infrastructure
            underneath is shared with every product that follows. Each one
            reads from the same ingestion layer and explains itself through
            the same concept reasoning layer: same contract, same audit trail.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProductList() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="space-y-6">
          {products.map((p, i) => (
            <ProductRow key={p.name} product={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductRow({ product, delay }: { product: Product; delay: number }) {
  const isLive = product.status === 'live';
  const Wrap: React.ElementType = product.href ? Link : 'div';
  const wrapProps = product.href ? { to: product.href } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Wrap
        {...wrapProps}
        data-cursor={product.href ? 'hover' : undefined}
        className={`glass group relative block overflow-hidden rounded-3xl p-7 transition will-change-transform sm:p-9 ${
          product.href ? 'hover:-translate-y-0.5 hover:border-strong' : ''
        }`}
      >
        <div className="grid gap-7 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-10">
          <div>
            <div className="flex items-center justify-between gap-4 lg:justify-start lg:gap-5">
              {product.visual === 'placeholder' && (
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                  style={{
                    background: 'rgba(120, 145, 170, 0.1)',
                    color: 'var(--color-violet-500)',
                  }}
                >
                  soon
                </div>
              )}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${
                  isLive ? 'bg-accent-soft text-accent' : ''
                }`}
                style={
                  !isLive
                    ? {
                        background: 'rgba(120, 145, 170, 0.12)',
                        color: 'var(--color-violet-500)',
                      }
                    : undefined
                }
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full bg-current ${
                    isLive ? 'pulse-dot' : ''
                  }`}
                />
                {isLive ? 'Live' : 'In development'}
              </span>
            </div>

            <h2 className="mt-6 font-display text-[1.9rem] font-semibold tracking-[-0.02em] sm:text-[2.2rem]">
              {product.name}
            </h2>
            <div className="mt-1 text-[0.92rem] font-medium text-accent">
              {product.descriptor}
            </div>
          </div>

          <div>
            <p className="text-[0.98rem] font-light leading-relaxed text-secondary">
              {product.body}
            </p>

            <ul className="mt-5 grid gap-1.5 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[0.88rem] text-secondary">
                  <span
                    className="mt-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    <Check size={10} strokeWidth={2.6} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            {product.href ? (
              <div className="mt-6 inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-accent">
                Open the product page
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
            ) : (
              <div className="mt-6 inline-flex items-center gap-1.5 text-[0.86rem] text-muted">
                More info as it ships.
              </div>
            )}
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)',
          }}
        />
      </Wrap>
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
                Pilots · partnerships · integrations
              </div>
              <h2 className="mt-3 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]">
                Don't see your workflow on the list?
              </h2>
              <p className="mt-3 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
                Roshan AI's product roadmap is shaped by partner workflows.
                Tell us where evidence-grounded reasoning would change your
                clinical or operational outcome. We'll tell you what's
                possible on the platform today.
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
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
              >
                See the platform
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
