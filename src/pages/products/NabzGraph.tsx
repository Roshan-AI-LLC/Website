import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ProductHero } from '../../components/nabzgraph/ProductHero';
import { GraphDemoBlock } from '../../components/nabzgraph/GraphDemoBlock';
import { EdgeTypes } from '../../components/nabzgraph/EdgeTypes';
import { FeatureColumns } from '../../components/nabzgraph/FeatureColumns';
import { Metrics } from '../../components/nabzgraph/Metrics';
import { BreadthGrid } from '../../components/nabzgraph/BreadthGrid';
import { DeveloperBlock } from '../../components/nabzgraph/DeveloperBlock';
import { ComplianceStrip } from '../../components/shifamind/ComplianceStrip';
import { FAQ } from '../../components/nabzgraph/FAQ';
import { ClosingCTA } from '../../components/nabzgraph/ClosingCTA';

export default function NabzGraphProduct() {
  return (
    <div className="theme-nabzgraph">
      <Head>
        <title>NabzGraph: interpretable knowledge graphs from ICU signals | Roshan AI</title>
        <meta
          name="description"
          content="NabzGraph turns continuous ICU sensor streams into a patient-specific knowledge graph of SNOMED concepts and measured relationships, traceable to the raw signal. Built for intensivists and clinical AI researchers."
        />
        <meta
          property="og:title"
          content="NabzGraph: from ICU sensor streams to an interpretable clinical graph."
        />
        <meta
          property="og:description"
          content="Patient-specific knowledge graphs with concept nodes and measured temporal, co-occurrence, and Granger edges — every node traceable to the raw signal window."
        />
        <link rel="canonical" href="https://roshan-ai.com/products/nabzgraph" />
      </Head>

      <ProductHero />

      <DemoSection />

      <EdgeTypes />
      <Divider />
      <FeatureColumns />
      <Divider />
      <Metrics />
      <Divider />
      <BreadthGrid />
      <Divider />
      <DeveloperBlock />
      <Divider />
      <ComplianceStrip />
      <Divider />
      <FAQ />
      <ClosingCTA />
    </div>
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
                See NabzGraph build a patient graph.
              </h2>
            </div>
            <p className="max-w-sm text-[0.92rem] text-secondary">
              Pick a patient, build the graph, then click any concept node to
              trace it to the raw signal. Prerendered for the demo; the platform
              runs against real waveform data.
            </p>
          </div>

          <GraphDemoBlock />
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
