import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, Linkedin, Mail } from 'lucide-react';
import type { ElementType } from 'react';
import { CONTACT_EMAIL } from '../../lib/config';

type SocialLink = { icon: ElementType; label: string; href: string };

type Founder = {
  name: string;
  role: string;
  oneLiner: string;
  bio: string;
  links: SocialLink[];
};

const founder: Founder = {
  name: 'Mohammed Sameer Syed',
  role: 'Founder & CEO',
  oneLiner: 'Builder · Researcher · AI Engineer',
  bio: 'I build AI that earns trust in the rooms where decisions matter. Roshan AI exists to make interpretable, production-grade clinical intelligence affordable for the people who need it most. ShifaMind is where that starts.',
  links: [
    { icon: Globe, label: 'Portfolio', href: 'https://mohammedsameersyed.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohammedsameersyed/' },
    { icon: Mail, label: 'Email', href: `mailto:${CONTACT_EMAIL}` },
  ],
};

const opportunities = [
  { area: 'Engineering', focus: 'Clinical ML, infrastructure, and platform' },
  { area: 'Clinical', focus: 'Coders, physicians, and advisors' },
  { area: 'Go-to-market', focus: 'Partner-first commercial operators' },
];

export default function CompanyTeam() {
  return (
    <>
      <Head>
        <title>Team | Roshan AI</title>
        <meta name="description" content="The people building Roshan AI: founder, engineers, clinical advisors, and what we're hiring for." />
        <link rel="canonical" href="https://roshan-ai.com/company/team" />
      </Head>
      <Hero />
      <FounderBlock />
      <BuildingTeam />
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
            Team
          </div>
          <h1 className="mt-4 text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-5 sm:text-[3rem]">
            The people building{' '}
            <span className="gradient-text">Roshan AI.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-[0.94rem] leading-relaxed text-secondary sm:mt-5 sm:text-[1.05rem]">
            We are early by design. The team works directly on the model, platform, and customer problems—without buffer layers.
          </p>
        </div>
      </div>
    </section>
  );
}

function FounderBlock() {
  return (
    <section className="relative py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-2xl px-5 py-5 sm:rounded-3xl sm:px-7 sm:py-6"
        >
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1.35fr_auto] lg:items-center lg:gap-8">
            <div>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">{founder.role}</div>
              <h2 className="mt-2 font-display text-[1.45rem] font-semibold tracking-[-0.03em] sm:text-[1.85rem]">{founder.name}</h2>
              <div className="mt-1 text-[0.8rem] text-secondary sm:text-[0.9rem]">{founder.oneLiner}</div>
              <p className="mt-3 max-w-2xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">{founder.bio}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:w-40 lg:flex-col">
              {founder.links.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-subtle bg-glass px-4 text-[0.8rem] font-medium text-secondary transition hover:border-strong hover:text-primary"
                  >
                    <Icon size={14} strokeWidth={1.7} />
                    {link.label}
                    <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                );
              })}
            </div>
          </div>
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 20%, transparent), transparent 70%)', filter: 'blur(40px)' }} />
        </motion.div>
      </div>
    </section>
  );
}

function BuildingTeam() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Building the team</div>
            <h2 className="mt-2 max-w-2xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]">We hire when the role is the bottleneck.</h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">No filler hires. Bring a clear point of view on what you would ship and where you would take the platform.</p>
        </div>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.area}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-muted">{opportunity.area}</div>
                <div className="mt-2 text-[0.88rem] font-semibold text-primary">{opportunity.focus}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-accent">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  Open to conversations
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Joining%20Roshan%20AI`}
          className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-subtle bg-glass px-5 text-[0.84rem] font-medium text-secondary transition hover:border-strong hover:text-primary"
        >
          Reach out: {CONTACT_EMAIL}
          <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
