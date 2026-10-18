import { motion } from 'framer-motion';
import { DEMO } from '../../data/homeCopy';
import { DemoBlock } from '../shifamind/DemoBlock';
import { SectionHead } from './SectionHead';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Home demo: the same interactive ShifaMind coder as the product page (pick a
 * scenario, predict, open a code to see its concepts and evidence).
 * Prerendered scenarios, not live inference.
 */
export function EvidenceDemo() {
  return (
    <section id="demo" className="mobile-native-section relative scroll-mt-24 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead eyebrow={DEMO.eyebrow} lead={DEMO.h2} />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-5 sm:mt-8 lg:mt-10"
        >
          <DemoBlock />
        </motion.div>
      </div>
    </section>
  );
}
