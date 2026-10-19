import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../../components/SectionLabel';
import { TASK } from '../../data/shifamindPaper';
import { NABZGRAPH, NABZSENTRY } from '../../data/nabzPapers';

type Product = {
  status: 'live' | 'preprint' | 'next';
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
      // 7,940 is CM + PCS (5,802 + 2,138; see BreadthGrid), not CM alone.
      `Full ICD-10 code space (CM + PCS), ${TASK.codes.toLocaleString('en-US')} codes`,
      `${TASK.concepts.toLocaleString('en-US')} grounded clinical concepts`,
      'Evidence phrases from the source note',
      'Ranked alternatives with confidences',
    ],
    href: '/products/shifamind',
    visual: 'shifamind',
  },
  {
    // Both Nabz models are research preprints, not deployed products.
    status: 'preprint',
    name: 'Nabz',
    descriptor: 'A model family for bedside monitoring',
    body: 'NabzGraph builds patient graphs whose typed relations hold up when clinicians act on the vitals. NabzSentry sorts ICU VT alarms into keep, suppress or defer, within a certified error budget.',
    highlights: [
      'NabzGraph: feedback-robust patient graphs',
      'NabzSentry: certified three-way alarm triage',
      `${NABZGRAPH.data.surgicalCases.toLocaleString('en-US')} surgical cases · ${NABZSENTRY.data.alarms.toLocaleString('en-US')} VT alarms`,
      'Every graph edge linked to its evidence',
    ],
    href: '/products/nabz',
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
          <SectionLabel>Products</SectionLabel>

          <h1 className="mt-3 max-w-3xl text-balance font-display text-[1.75rem] font-bold leading-[1.05] tracking-[-0.025em] sm:mt-5 sm:text-[3rem]">
            One platform.{' '}
            <span className="gradient-text">A growing family of clinical products.</span>
          </h1>

          {/* Phones: the first two sentences carry the point; the third
              returns at sm. */}
          <p className="mt-3 max-w-2xl text-[0.94rem] font-light leading-relaxed text-secondary sm:mt-6 sm:text-[1.05rem]">
            ShifaMind is the first product Roshan AI ships. The infrastructure
            underneath is shared with every product that follows.
            <span className="hidden sm:inline">
              {' '}Each one reads from the same ingestion layer and explains
              itself through the same concept reasoning layer: same contract,
              same audit trail.
            </span>
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
        <div className="space-y-3 sm:space-y-6">
          {products.map((p, i) => (
            <ProductRow key={p.name} product={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

const STATUS_LABEL: Record<Product['status'], string> = {
  live: 'Live',
  preprint: 'Preprint',
  next: 'In development',
};

function ProductRow({ product, delay }: { product: Product; delay: number }) {
  const isLive = product.status === 'live';
  // Live and preprint share the accent pill; only live gets the pulse.
  const isAccent = product.status !== 'next';
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
        className={`glass group relative block overflow-hidden rounded-2xl px-4 py-3.5 transition will-change-transform sm:rounded-3xl sm:p-9 ${
          product.href ? 'hover:-translate-y-0.5 hover:border-strong' : ''
        }`}
      >
        <div className="grid gap-2.5 sm:gap-7 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-10">
          {/* Phones: the status chip sits on the name's row (name left, chip
              right) instead of its own line; sm restores the stacked block. On
              the in-development card the chip repeats the name word for word,
              so it returns at sm. */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 sm:block">
            <div
              className={`${
                product.status === 'next' ? 'hidden sm:flex' : 'flex'
              } col-start-2 row-start-1 items-center justify-between gap-4 lg:justify-start lg:gap-5`}
            >
              {/* Phones: the "soon" tile repeats the status chip beside it. */}
              {product.visual === 'placeholder' && (
                <div
                  className="hidden h-12 w-12 items-center justify-center rounded-2xl font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:inline-flex"
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
                  isAccent ? 'bg-accent-soft text-accent' : ''
                }`}
                style={
                  !isAccent
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
                {STATUS_LABEL[product.status]}
              </span>
            </div>

            <h2 className="col-start-1 row-start-1 mt-0 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] sm:mt-6 sm:text-[2.2rem] sm:leading-[inherit]">
              {product.name}
            </h2>
            <div className="col-span-2 mt-1 text-[0.86rem] font-medium text-accent sm:text-[0.92rem]">
              {product.descriptor}
            </div>
          </div>

          <div>
            {/* Phones: the body clamps to three lines (the card links to the
                full product page); the highlights below stay in full. */}
            <p className="mobile-compact-copy text-[0.88rem] font-light leading-normal text-secondary sm:text-[0.98rem] sm:leading-relaxed">
              {product.body}
            </p>

            <ul className="mt-2.5 grid gap-1 sm:mt-5 sm:grid-cols-2 sm:gap-1.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[0.82rem] leading-snug text-secondary sm:text-[0.88rem] sm:leading-[inherit]">
                  <span
                    className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full sm:mt-1"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    <Check size={10} strokeWidth={2.6} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            {product.href ? (
              <div className="mt-2.5 inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-accent sm:mt-6">
                Open the product page
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
            ) : (
              <div className="mt-2.5 inline-flex items-center gap-1.5 text-[0.86rem] text-muted sm:mt-6">
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
          className="glass relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-14"
        >
          <div className="relative z-10 grid gap-4 sm:gap-8 lg:grid-cols-[1.3fr_auto] lg:items-center">
            <div>
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
                Pilots · partnerships · integrations
              </div>
              <h2 className="mt-2 text-balance font-display text-[1.35rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:mt-3 sm:text-[2.2rem]">
                Don't see your workflow on the list?
              </h2>
              {/* Phones: heading and buttons carry the CTA; the line returns at sm. */}
              <p className="mt-2 hidden max-w-xl text-[0.86rem] font-light leading-relaxed text-secondary sm:mt-3 sm:block sm:text-[0.96rem]">
                Roshan AI's product roadmap is shaped by partner workflows.
                Tell us where evidence-grounded reasoning would change your
                clinical or operational outcome. We'll tell you what's
                possible on the platform today.
              </p>
            </div>

            {/* Phones: the two buttons sit side by side in a 2-col grid. */}
            <div className="grid grid-cols-2 flex-wrap gap-2 sm:flex lg:justify-end">
              <Link
                to="/contact"
                className="btn-primary group inline-flex items-center justify-center gap-2 rounded-full px-3 py-3 text-[0.84rem] font-semibold transition will-change-transform hover:-translate-y-0.5 sm:px-5 sm:text-[0.92rem]"
              >
                Talk to us
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/platform"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-subtle bg-glass px-3 py-3 text-[0.84rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary sm:px-5 sm:text-[0.92rem]"
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
