import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Brain, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const thesis = [
  {
    icon: Brain,
    label: 'The problem',
    title: 'General-purpose models are not clinical-grade.',
    body: 'Clinical workflows need more than a plausible answer. Opaque reasoning, fabricated evidence, and unverifiable recommendations create risk precisely where a clinician needs a defensible decision.',
  },
  {
    icon: ShieldCheck,
    label: 'Our approach',
    title: 'Make evidence a requirement, not an add-on.',
    body: 'Roshan AI routes every prediction through an explicit clinical concept layer. The concepts and evidence are not a post-hoc explanation—they are the computation contract.',
  },
];

export default function CompanyAbout() {
  return (
    <>
      <Head>
        <title>About | Roshan AI</title>
        <meta
          name="description"
          content="Roshan AI LLC builds clinical-grade AI infrastructure. Our mission, what we believe, and what we're building toward."
        />
        <link rel="canonical" href="https://roshan-ai.com/company/about" />
      </Head>
      <Hero />
      <CompanyThesis />
      <PlatformAmbition />
      <Closing />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-[5.5rem] pb-9 sm:pt-40 sm:pb-14">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[360px] w-[1000px] max-w-full opacity-50 sm:h-[420px] sm:w-[1100px]" />
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="enter-fade-up max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            About Roshan AI
          </div>
          <h1 className="mt-4 text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-5 sm:text-[3rem]">
            Building clinical AI{' '}
            <span className="gradient-text">doctors can defend.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-[0.94rem] leading-relaxed text-secondary sm:mt-5 sm:text-[1.05rem]">
            Roshan AI builds clinical intelligence around the concepts practitioners use, so every output remains auditable, explainable, and deployable in the workflows that matter.
          </p>
        </div>
      </div>
    </section>
  );
}

function CompanyThesis() {
  return (
    <section className="mobile-native-section relative py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Company thesis</div>
            <h2 className="mt-2 max-w-2xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]">
              Clinical AI has to be{' '}
              <span className="gradient-text">accountable by design.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">
            We replace opaque prediction paths with a clinical evidence contract.
          </p>
        </div>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-2 md:divide-x md:divide-y-0">
            {thesis.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="px-4 py-5 sm:px-5 sm:py-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <div className="mt-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-accent">{item.label}</div>
                  <h3 className="mt-2 text-[1.05rem] font-semibold tracking-[-0.015em] text-primary sm:text-[1.15rem]">{item.title}</h3>
                  <p className="mt-2 text-[0.8rem] leading-relaxed text-secondary sm:text-[0.88rem]">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformAmbition() {
  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              What we are building toward
            </div>
            <h2 className="mt-3 text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]">
              One platform.{' '}
              <span className="gradient-text">A family of clinical products.</span>
            </h2>
          </div>
          <div>
            <p className="text-[0.88rem] leading-relaxed text-secondary sm:text-[0.96rem]">
              Coding is the first application. The same evidence-first architecture can support risk stratification, decision support, longitudinal summaries, and documentation—with a common reasoning fabric and audit trail.
            </p>
            <div className="glass mt-5 flex flex-col gap-3 rounded-2xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-muted">Live today</div>
                <div className="mt-1 text-[0.92rem] font-semibold text-primary">ShifaMind</div>
                <div className="mt-0.5 text-[0.78rem] text-secondary">Concept-grounded ICD-10 coding, built on the shared platform.</div>
              </div>
              <Link
                to="/products/shifamind"
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-4 text-[0.8rem] font-semibold text-secondary transition hover:border-strong hover:text-primary"
              >
                Explore ShifaMind
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
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
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Work with Roshan AI</div>
              <h2 className="mt-2 text-balance font-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[1.85rem]">Bring a clinical workflow worth defending.</h2>
              <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">Pilots, integrations, partnerships, and thoughtful hiring conversations all start with a real problem to solve.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              <Link
                to="/contact"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--color-iris-500))', boxShadow: 'var(--shadow-glow)', color: 'var(--on-accent)' }}
              >
                Talk to us
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link to="/company/team" className="inline-flex min-h-11 items-center justify-center rounded-full border border-subtle bg-glass px-5 py-3 text-[0.88rem] font-medium text-secondary transition hover:border-strong hover:text-primary">Meet the team</Link>
            </div>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70" style={{ background: 'radial-gradient(ellipse at 80% 50%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 66%)' }} />
        </motion.div>
      </div>
    </section>
  );
}
