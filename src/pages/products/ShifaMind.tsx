import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ProductHero } from '../../components/shifamind/ProductHero';
import { DemoBlock } from '../../components/shifamind/DemoBlock';
import { BenchmarkSection } from '../../components/shifamind/BenchmarkSection';
import { InterpretabilityMetrics } from '../../components/shifamind/InterpretabilityMetrics';
import { FeatureColumns } from '../../components/shifamind/FeatureColumns';
import { BreadthGrid } from '../../components/shifamind/BreadthGrid';
import { DeveloperBlock } from '../../components/shifamind/DeveloperBlock';
import { ComplianceStrip } from '../../components/shifamind/ComplianceStrip';
import { FAQ } from '../../components/shifamind/FAQ';
import { ClosingCTA } from '../../components/shifamind/ClosingCTA';

export default function ShifaMindProduct() {
  return (
    <>
      <Head>
        <title>ShifaMind: Concept-grounded ICD-10 coding | Roshan AI</title>
        <meta
          name="description"
          content="ShifaMind reads a clinical note and returns ranked ICD-10 codes with the concept evidence behind each one. Built for clinicians and coders."
        />
        <meta
          property="og:title"
          content="ShifaMind: concept-grounded ICD-10 coding for clinicians and coders."
        />
        <meta
          property="og:description"
          content="ICD-10 predictions with the clinical concepts and evidence behind every code."
        />
        <link rel="canonical" href="https://roshan-ai.com/products/shifamind" />
      </Head>

      <ProductHero />

      <DemoSection />

      <BenchmarkSection />
      <Divider />
      <InterpretabilityMetrics />
      <Divider />
      <FeatureColumns />
      <Divider />
      <BreadthGrid />
      <Divider />
      <DeveloperBlock />
      <Divider />
      <ComplianceStrip />
      <Divider />
      <FAQ />
      <ClosingCTA />
    </>
  );
}

function DemoSection() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex flex-col items-start gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
                Try it
              </div>
              <h2 className="mt-3 text-balance font-display text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]">
                See ShifaMind code a clinical note.
              </h2>
            </div>
            <p className="max-w-sm text-[0.92rem] text-secondary">
              Pick a scenario, run the coder, and inspect the concepts behind
              every code. Prerendered for the demo; the platform runs against
              your own notes.
            </p>
          </div>

          <DemoBlock />
        </motion.div>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      className="mx-auto h-px max-w-6xl"
      style={{
        background:
          'linear-gradient(90deg, transparent, var(--border-subtle) 20%, var(--border-strong) 50%, var(--border-subtle) 80%, transparent)',
      }}
    />
  );
}
