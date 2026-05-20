import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

      <section className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
          <div className="aurora h-[420px] w-[1100px] max-w-full opacity-50" />
        </div>

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              About Roshan AI
            </div>

            <h1 className="mt-5 text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">
              Building clinical AI{' '}
              <span className="gradient-text">doctors can defend.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-[1.05rem] font-light leading-relaxed text-secondary">
              Roshan AI LLC is a clinical-AI company. We build models trained
              against real clinical data and structured around the concepts a
              doctor uses, so every output is auditable, every prediction is
              explainable, and every deployment is something the clinician can
              stand behind in court if it came to that.
            </p>
          </motion.div>
        </div>
      </section>

      <Section
        eyebrow="The problem"
        title={
          <>
            General-purpose LLMs aren't{' '}
            <span className="gradient-text">clinical-grade.</span>
          </>
        }
      >
        <p>
          Frontier LLMs pass medical board exams. They also fabricate citations,
          recommend contraindicated drugs, and produce reasoning that no
          clinician can verify. In an outpatient demo that's a curiosity. In a
          coding workflow, a diagnostic workflow, or a decision-support
          workflow, it's a liability.
        </p>
        <p>
          The industry's response so far has been to wrap general models in
          longer prompts and call it healthcare AI. The architecture stays
          opaque. The errors stay hidden until they reach a patient.
        </p>
      </Section>

      <Divider />

      <Section
        eyebrow="Our approach"
        title={
          <>
            Build clinical models from the{' '}
            <span className="gradient-text">ground up.</span>
          </>
        }
      >
        <p>
          We train clinical encoders on clinical data, structure them against an
          explicit concept layer, and route every prediction through that
          layer. The bottleneck is the feature, not the bug. It forces the
          model to ground each output in the same concepts a doctor or coder
          would name out loud.
        </p>
        <p>
          The result is an architecture that can't produce a prediction without
          also producing its evidence. Not a post-hoc rationalization. Not a
          chain-of-thought that may or may not reflect the actual computation.
          The concepts <em>are</em> the computation.
        </p>
      </Section>

      <Divider />

      <Section
        eyebrow="ShifaMind"
        title={
          <>
            Our first product, built on the platform.
          </>
        }
      >
        <p>
          ShifaMind is the first thing we shipped. It reads a clinical note and
          returns ranked ICD-10 codes, each one paired with the concept
          evidence behind it. Today it's used by clinicians and researchers
          evaluating coding workflows; tomorrow it's an API any health system
          can integrate.
        </p>
        <p>
          ShifaMind is not the company. It's a consumer of the Roshan AI
          platform. The same infrastructure stack will power the next product,
          and the one after that.{' '}
          <Link to="/products/shifamind" className="text-accent hover:underline">
            See ShifaMind →
          </Link>
        </p>
      </Section>

      <Divider />

      <Section
        eyebrow="What we're building toward"
        title={
          <>
            One platform.{' '}
            <span className="gradient-text">A family of clinical products.</span>
          </>
        }
      >
        <p>
          Coding is one piece. Clinical reasoning runs deeper: risk
          stratification, decision support, longitudinal patient summaries,
          documentation. Every one of those workflows benefits from the same
          architectural commitment: evidence-first, concept-grounded, defensible
          by construction.
        </p>
        <p>
          We're building toward a future where a clinician's AI tools share a
          common reasoning fabric, where the same concept activates a diagnosis
          code, surfaces a relevant guideline, and flags a contraindication, all
          with the same audit trail. That's the platform.
        </p>
      </Section>

      <Closing />
    </>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-balance font-display text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]">
            {title}
          </h2>
          <div className="mt-5 space-y-4 text-[1rem] font-light leading-relaxed text-secondary">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      className="mx-auto h-px max-w-4xl"
      style={{
        background:
          'linear-gradient(90deg, transparent, var(--border-subtle) 20%, var(--border-strong) 50%, var(--border-subtle) 80%, transparent)',
      }}
    />
  );
}

function Closing() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12"
        >
          <div className="relative z-10">
            <h2 className="text-balance font-display text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[1.9rem]">
              Want to work with us, or for us?
            </h2>
            <p className="mt-3 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
              Pilots, integrations, partnerships, hiring. The fastest way to a
              real conversation is the contact form.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
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
                to="/company/team"
                className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
              >
                Meet the team
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
