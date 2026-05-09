import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, Linkedin, Mail } from 'lucide-react';

export function Founder() {
  return (
    <section id="founder" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
                Founder &amp; CEO
              </div>
              <h3 className="mt-2 font-display text-[1.7rem] font-semibold tracking-[-0.02em] sm:text-[2rem]">
                Mohammed Sameer Syed
              </h3>
              <div className="mt-1 text-[0.92rem] text-secondary">
                Builder · Researcher · AI Engineer
              </div>
              <p className="mt-5 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
                I build AI that earns trust in the rooms where decisions actually
                matter. Roshan AI exists for one reason: to make interpretable,
                production-grade intelligence affordable for the people who need
                it most. ShifaMind is where that starts.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-col">
              <FounderLink
                href="https://mohammedsameersyed.me"
                icon={Globe}
                label="Portfolio"
              />
              <FounderLink
                href="https://www.linkedin.com/in/mohammedsameersyed/"
                icon={Linkedin}
                label="LinkedIn"
              />
              <FounderLink
                href="mailto:founder@roshan-ai.com"
                icon={Mail}
                label="Get in touch"
              />
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--accent) 25%, transparent), transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function FounderLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-4 py-2 text-[0.86rem] font-medium text-secondary transition hover:border-strong hover:text-primary"
      data-cursor="hover"
    >
      <Icon size={14} strokeWidth={1.7} />
      {label}
      <ArrowUpRight
        size={12}
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
