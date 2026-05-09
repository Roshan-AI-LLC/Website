import { motion } from 'framer-motion';
import { Beaker, ShieldCheck, Sparkles, Telescope } from 'lucide-react';

const principles = [
  {
    icon: Beaker,
    title: 'Research-grade engineering',
    body: 'Every system we ship traces back to peer-reviewed methods. Reproducible by design.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for the regulated world',
    body: 'Privacy, auditability, and interpretability are first-class, not an afterthought.',
  },
  {
    icon: Sparkles,
    title: 'Accessible by default',
    body: 'We engineer for low cost-per-inference so the people who need this most can actually use it.',
  },
  {
    icon: Telescope,
    title: 'Long-horizon work',
    body: 'We pick problems where deep technical effort compounds, not ones a wrapper can solve.',
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="About Roshan AI"
          title={
            <>
              We build AI systems
              <br className="hidden sm:block" /> that earn{' '}
              <span className="gradient-text-warm">clinical trust</span>.
            </>
          }
          desc="Roshan AI is an applied research company. We pick problems where the cost of being wrong is real, and where interpretability, latency, and accuracy must coexist. Healthcare is our first frontier."
        />

        <div className="mt-14 grid gap-3 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="glass group relative overflow-hidden rounded-2xl p-6"
              data-cursor="hover"
            >
              <div
                className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                <p.icon size={18} strokeWidth={1.6} />
              </div>
              <h3 className="text-[1rem] font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-[0.86rem] font-light leading-relaxed text-secondary">
                {p.body}
              </p>
              <div
                className="pointer-events-none absolute -bottom-20 -right-20 h-44 w-44 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(circle, var(--accent-soft), transparent 70%)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  align = 'left',
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <div className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-balance text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[2.4rem]">
        {title}
      </h2>
      {desc && (
        <p className="mt-4 text-[0.96rem] font-light leading-relaxed text-secondary">
          {desc}
        </p>
      )}
    </motion.div>
  );
}
