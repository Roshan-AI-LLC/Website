import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShifaMindLogo } from '../ShifaMindLogo';

type Product = {
  status: 'live' | 'next';
  name: string;
  descriptor: string;
  longDesc: string;
  href?: string;
  visual: 'shifamind' | 'placeholder';
};

const products: Product[] = [
  {
    status: 'live',
    name: 'ShifaMind',
    descriptor: 'Concept-grounded ICD-10 coding',
    longDesc:
      'Reads a clinical note and returns ranked ICD-10 codes with the concept evidence behind each one. Built for clinicians and coders.',
    href: '/products/shifamind',
    visual: 'shifamind',
  },
  {
    status: 'next',
    name: 'In development',
    descriptor: 'More clinical reasoning products on the same platform',
    longDesc:
      'Same infrastructure stack, same evidence-first design. Specialised products built on the shared Roshan AI platform are in active R&D.',
    visual: 'placeholder',
  },
];

export function ProductStrip() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Products
            </div>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]">
              Built on the platform.{' '}
              <span className="gradient-text">Shipped to clinicians.</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden shrink-0 items-center gap-1.5 text-[0.86rem] font-medium text-secondary transition hover:text-primary sm:inline-flex"
          >
            All products
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {products.map((p, i) => (
            <ProductCard key={p.name} product={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, delay }: { product: Product; delay: number }) {
  const isLive = product.status === 'live';
  const Wrap: React.ElementType = product.href ? Link : 'div';
  const wrapProps = product.href ? { to: product.href } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Wrap
        {...wrapProps}
        data-cursor={product.href ? 'hover' : undefined}
        className={`glass group relative block h-full overflow-hidden rounded-3xl p-7 transition will-change-transform ${
          product.href ? 'hover:-translate-y-1 hover:border-strong' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-4">
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
          {product.visual === 'shifamind' ? (
            <ShifaMindLogo size={40} />
          ) : (
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: 'rgba(120, 145, 170, 0.1)',
                color: 'var(--color-violet-500)',
              }}
            >
              soon
            </div>
          )}
        </div>

        <h3 className="mt-7 font-display text-[1.5rem] font-semibold tracking-[-0.02em] sm:text-[1.75rem]">
          {product.name}
        </h3>
        <div className="mt-1 text-[0.86rem] font-medium text-accent">
          {product.descriptor}
        </div>
        <p className="mt-3 text-[0.94rem] font-light leading-relaxed text-secondary">
          {product.longDesc}
        </p>

        {product.href && (
          <div className="mt-5 flex items-center gap-1.5 text-[0.86rem] font-medium text-accent">
            Learn more
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle, var(--accent-soft), transparent 70%)',
          }}
        />
      </Wrap>
    </motion.div>
  );
}
