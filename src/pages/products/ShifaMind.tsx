import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ProductHero } from '../../components/shifamind/ProductHero';
import { DemoBlock } from '../../components/shifamind/DemoBlock';
import { BenchmarkSection } from '../../components/shifamind/BenchmarkSection';
import { InterpretabilityMetrics } from '../../components/shifamind/InterpretabilityMetrics';
import { FeatureColumns } from '../../components/shifamind/FeatureColumns';
import { BreadthGrid } from '../../components/shifamind/BreadthGrid';
import { ComplianceStrip } from '../../components/shifamind/ComplianceStrip';
import { FAQ } from '../../components/shifamind/FAQ';
import { ClosingCTA } from '../../components/shifamind/ClosingCTA';
import { SectionLabel } from '../../components/SectionLabel';
import { pct, SHIFAMIND, TASK } from '../../data/shifamindPaper';

// Shared by the meta description and og:description. Keep under 160 characters.
const DESCRIPTION = `Concept-grounded ICD-10 coding with the evidence behind every code. ${pct(SHIFAMIND.aucMicro)} micro-AUROC across all ${TASK.codes.toLocaleString('en-US')} MIMIC-IV codes.`;

export default function ShifaMindProduct() {
  return (
    <>
      <Head>
        <title>ShifaMind: Concept-grounded ICD-10 coding | Roshan AI</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          property="og:title"
          content="ShifaMind: concept-grounded ICD-10 coding for clinicians and coders."
        />
        <meta property="og:description" content={DESCRIPTION} />
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
      <ComplianceStrip />
      <Divider />
      <FAQ />
      <ClosingCTA />
    </>
  );
}

function DemoSection() {
  return (
    <section className="mobile-native-section relative py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex flex-col items-start gap-2.5 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Try it</SectionLabel>
              <h2 className="mt-3 text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.2rem]">
                See ShifaMind code a clinical note.
              </h2>
            </div>
            {/* Phones: the scenario tabs and Predict button already say this; the line returns at sm. */}
            <p className="hidden max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:block sm:text-[0.92rem]">
              Pick a scenario and see the concepts behind every code.
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
