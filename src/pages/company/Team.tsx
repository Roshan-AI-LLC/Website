import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  bio: 'I build AI that earns trust in the rooms where decisions actually matter. Roshan AI exists for one reason: to make interpretable, production-grade clinical intelligence affordable for the people who need it most. ShifaMind is where that starts.',
  links: [
    { icon: Globe, label: 'Portfolio', href: 'https://mohammedsameersyed.me' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohammedsameersyed/' },
    { icon: Mail, label: 'Email', href: `mailto:${CONTACT_EMAIL}` },
  ],
};

export default function CompanyTeam() {
  return (
    <>
      <Head>
        <title>Team | Roshan AI</title>
        <meta
          name="description"
          content="The people building Roshan AI: founder, engineers, clinical advisors, and what we're hiring for."
        />
        <link rel="canonical" href="https://roshan-ai.com/company/team" />
      </Head>

      <Hero />
      <FounderBlock />
      <BuildingTeam />
      <Closing />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-50" />
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="enter-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            Team
          </div>

          <h1 className="mt-5 text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">
            The people building{' '}
            <span className="gradient-text">Roshan AI.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[1.05rem] font-light leading-relaxed text-secondary">
            We're early. The team today is small and operational. Founders work
            directly on the model, the platform, and the customers. No buffer
            layers. That's the point.
          </p>
        </div>
      </div>
    </section>
  );
}

function FounderBlock() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
                {founder.role}
              </div>
              <h2 className="mt-2 font-display text-[1.7rem] font-semibold tracking-[-0.02em] sm:text-[2rem]">
                {founder.name}
              </h2>
              <div className="mt-1 text-[0.92rem] text-secondary">
                {founder.oneLiner}
              </div>
              <p className="mt-5 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
                {founder.bio}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-col">
              {founder.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-4 py-2 text-[0.86rem] font-medium text-secondary transition hover:border-strong hover:text-primary"
                  data-cursor="hover"
                >
                  <link.icon size={14} strokeWidth={1.7} />
                  {link.label}
                  <ArrowUpRight
                    size={12}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ))}
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

function BuildingTeam() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
            Building the team
          </div>
          <h2 className="mt-3 max-w-2xl text-balance font-display text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2rem]">
            We hire when the role is the bottleneck.
          </h2>
          <p className="mt-4 max-w-2xl text-[0.96rem] font-light leading-relaxed text-secondary">
            No filler hires, no preemptive scaling. When a role is the
            constraint between us and something a customer needs, we open it,
            and we close it fast. If your background fits, tell us what you'd
            ship and where you'd take the platform. We respond to thoughtful
            outreach.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <RoleCard
              area="Engineering"
              focus="Clinical ML, infra, platform"
            />
            <RoleCard area="Clinical" focus="Coders, physicians, advisors" />
            <RoleCard area="Go-to-market" focus="Partner-first, no SDRs" />
          </div>

          <div className="mt-8">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Joining%20Roshan%20AI`}
              className="group inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.88rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
            >
              Reach out: {CONTACT_EMAIL}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RoleCard({ area, focus }: { area: string; focus: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
        {area}
      </div>
      <div className="mt-2 text-[0.92rem] text-primary">{focus}</div>
      <div className="mt-3 inline-flex items-center gap-1.5 text-[0.74rem] font-medium uppercase tracking-[0.12em] text-muted">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: 'var(--color-violet-500)' }}
        />
        Always open to conversations
      </div>
    </div>
  );
}

function Closing() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-10 sm:p-12"
        >
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-center">
            <div>
              <h2 className="text-balance font-display text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[1.9rem]">
                Want to work with us, clinical, technical, or commercial?
              </h2>
              <p className="mt-3 max-w-xl text-[0.96rem] font-light leading-relaxed text-secondary">
                Pilots, partnerships, hiring. Same inbox, same response time.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
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
