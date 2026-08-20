import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

type Product = {
  status: 'live' | 'next';
  name: string;
  descriptor: string;
  longDesc: string;
  href?: string;
};

const products: Product[] = [
  {
    status: 'live',
    name: 'ShifaMind',
    descriptor: 'Concept-grounded ICD-10 coding',
    longDesc:
      'Reads a clinical note and returns ranked ICD-10 codes with the clinical concepts and source evidence behind each one. Built for clinicians and coders.',
    href: '/products/shifamind',
  },
  {
    status: 'live',
    name: 'NabzGraph',
    descriptor: 'Interpretable ICU knowledge graphs',
    longDesc:
      'Turns continuous ICU sensor streams into patient-specific, traceable concept graphs.',
    href: '/products/nabzgraph',
  },
  {
    status: 'next',
    name: 'More on the platform',
    descriptor: 'Clinical reasoning products in R&D',
    longDesc:
      'The same evidence-first infrastructure extends to the next generation of products.',
  },
];

export function ProductStrip() {
  return (
    <section className="relative py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Products
            </div>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[2.6rem]">
              Built on the platform.{' '}
              <span className="gradient-text">Proven in the workflow.</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden shrink-0 items-center gap-1.5 text-[0.86rem] font-semibold text-secondary transition hover:text-primary sm:inline-flex"
          >
            All products
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              product={product}
              featured={index === 0}
              delay={index * 0.08}
            />
          ))}
        </div>

        <Link
          to="/products"
          className="mt-5 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-secondary transition hover:text-primary sm:hidden"
        >
          View all products
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  featured,
  delay,
}: {
  product: Product;
  featured: boolean;
  delay: number;
}) {
  const isLive = product.status === 'live';
  const cardClassName = `glass group relative block h-full overflow-hidden rounded-3xl transition will-change-transform ${
    featured ? 'p-6 sm:p-8' : 'p-5 sm:p-6'
  } ${product.href ? 'hover:-translate-y-1 hover:border-strong' : ''}`;

  const cardContent = (
    <>
      {featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-70 blur-3xl sm:-right-10 sm:-top-14"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--accent) 28%, transparent), transparent 68%)',
          }}
        />
      )}

      <div className={`relative ${featured ? 'sm:grid sm:grid-cols-[1fr_auto] sm:gap-10' : ''}`}>
        <div>
          <div className="flex items-center justify-between gap-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] ${
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
              {isLive ? 'Live now' : 'In development'}
            </span>
            {featured && (
              <span className="hidden rounded-full border border-subtle px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-secondary sm:inline-flex">
                Flagship product
              </span>
            )}
          </div>

          <h3
            className={`font-display font-semibold tracking-[-0.025em] ${
              featured ? 'mt-7 text-[2rem] sm:text-[2.5rem]' : 'mt-6 text-[1.35rem] sm:text-[1.5rem]'
            }`}
          >
            {product.name}
          </h3>
          <div className="mt-1 text-[0.86rem] font-semibold text-accent">
            {product.descriptor}
          </div>
          <p
            className={`text-secondary ${
              featured
                ? 'mt-4 max-w-xl text-[0.98rem] leading-relaxed sm:text-[1.03rem]'
                : 'mt-3 text-[0.88rem] leading-relaxed'
            }`}
          >
            {product.longDesc}
          </p>

          {product.href && (
            <div className="mt-5 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-accent">
              {featured ? 'Explore ShifaMind' : 'Learn more'}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          )}
        </div>

        {featured && (
          <div className="relative mt-6 hidden w-52 self-end rounded-2xl border border-subtle bg-glass-strong p-4 sm:block">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Evidence-first
            </div>
            <div className="mt-4 space-y-2.5">
              {['Clinical concepts', 'Source evidence', 'Ranked codes'].map((label) => (
                <div key={label} className="flex items-center gap-2 text-[0.75rem] font-medium text-secondary">
                  <CheckCircle2 size={14} className="text-accent" strokeWidth={2} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={featured ? 'sm:col-span-2' : ''}
    >
      {product.href ? (
        <Link to={product.href} data-cursor="hover" className={cardClassName}>
          {cardContent}
        </Link>
      ) : (
        <div className={cardClassName}>{cardContent}</div>
      )}
    </motion.div>
  );
}
