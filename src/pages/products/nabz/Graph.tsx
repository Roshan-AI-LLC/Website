import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ProductHero } from '../../../components/nabzgraph/ProductHero';
import { GraphDemoBlock } from '../../../components/nabzgraph/GraphDemoBlock';
import { EdgeTypes } from '../../../components/nabzgraph/EdgeTypes';
import { FeatureColumns } from '../../../components/nabzgraph/FeatureColumns';
import { Metrics } from '../../../components/nabzgraph/Metrics';
import { BreadthGrid } from '../../../components/nabzgraph/BreadthGrid';
import { FAQ } from '../../../components/nabzgraph/FAQ';
import { ClosingCTA } from '../../../components/nabzgraph/ClosingCTA';
import { SectionLabel } from '../../../components/SectionLabel';
import { fmt, NABZGRAPH } from '../../../data/nabzPapers';

const { falseRelations } = NABZGRAPH;

export default function NabzGraphProduct() {
  return (
    <div className="theme-nabz">
      <Head>
        <title>NabzGraph: feedback-robust patient knowledge graphs | Roshan AI</title>
        <meta
          name="description"
          content="NabzGraph builds patient knowledge graphs from bedside monitoring and clinician actions, with typed relations (response, policy, association, mechanistic) and every edge tied to the events behind it."
        />
        <meta
          property="og:title"
          content="NabzGraph: patient graphs that know who acted."
        />
        <meta
          property="og:description"
          content={`Concept, action and beat-level nodes joined by typed relations, each tied to its evidence. ${fmt(falseRelations.ours.transplant, 2)} false concept-level relations per graph, versus ${fmt(falseRelations.correlational.transplant)} for correlational graphs.`}
        />
        <link rel="canonical" href="https://roshan-ai.com/products/nabz/graph" />
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
      <FAQ />
      <ClosingCTA />
    </div>
  );
}

function DemoSection() {
  return (
    <section className="relative py-8 sm:py-14">
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
                See NabzGraph build a patient graph.
              </h2>
            </div>
            {/* Stays on phones: it is the demo's only instruction there, since
                the idle evidence placeholder is hidden below sm. */}
            <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">
              Pick a patient, build the graph, then select a node to see its
              evidence. Prerendered example.
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
