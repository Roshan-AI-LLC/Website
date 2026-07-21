import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../../lib/config';
import {
  COMPANY_BOILERPLATE,
  formatPressDate,
  sortedReleases,
} from '../../data/press';

const pressKit: { label: string; desc: string; href: string }[] = [
  {
    label: 'Logo, dark backgrounds',
    desc: 'PNG, transparent',
    href: '/logo-dark.png',
  },
  {
    label: 'Logo, light backgrounds',
    desc: 'PNG, transparent',
    href: '/logo-light.png',
  },
  {
    label: 'Company mark',
    desc: 'SVG, scalable',
    href: '/favicon.svg',
  },
];

export default function CompanyPress() {
  const releases = sortedReleases();

  return (
    <>
      <Head>
        <title>Press | Roshan AI</title>
        <meta
          name="description"
          content="Announcements, company boilerplate, brand assets, and media contact for Roshan AI LLC."
        />
        <link rel="canonical" href="https://roshan-ai.com/company/press" />
      </Head>

      <section className="relative isolate overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
          <div className="aurora h-[420px] w-[1100px] max-w-full opacity-50" />
        </div>

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="enter-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Press
            </div>

            <h1 className="mt-5 text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">
              News from{' '}
              <span className="gradient-text">Roshan AI.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-[1.05rem] font-light leading-relaxed text-secondary">
              Announcements, brand assets, and everything a journalist needs to
              write about us accurately. For anything not covered here, the
              media contact is at the bottom of the page.
            </p>
          </div>
        </div>
      </section>

      <section className="relative pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
            Announcements
          </div>

          <div className="mt-6 space-y-4">
            {releases.map((r, i) => (
              <motion.article
                key={r.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to={`/company/press/${r.slug}`}
                  className="glass group block rounded-2xl p-6 transition hover:border-strong sm:p-7"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.74rem] text-muted">
                    <time dateTime={r.date}>{formatPressDate(r.date)}</time>
                    <span aria-hidden>·</span>
                    <span className="uppercase tracking-[0.12em]">{r.kind}</span>
                  </div>

                  <h2 className="mt-3 text-balance font-display text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[1.5rem]">
                    {r.title}
                  </h2>

                  <p className="mt-3 max-w-2xl text-pretty text-[0.94rem] font-light leading-relaxed text-secondary">
                    {r.summary}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.86rem] font-medium text-accent">
                    Read the announcement
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
            Press kit
          </div>
          <h2 className="mt-3 text-balance font-display text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.2rem]">
            Brand assets and boilerplate.
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {pressKit.map((asset) => (
              <a
                key={asset.href}
                href={asset.href}
                download
                className="glass group flex items-start gap-3 rounded-2xl p-4 transition hover:border-strong"
              >
                <span
                  className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                  }}
                >
                  <Download size={14} strokeWidth={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.88rem] font-medium">
                    {asset.label}
                  </span>
                  <span className="mt-0.5 block text-[0.76rem] text-muted">
                    {asset.desc}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="glass mt-4 rounded-2xl p-6 sm:p-7">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
              About Roshan AI, boilerplate
            </div>
            <p className="mt-3 text-pretty text-[0.94rem] font-light leading-relaxed text-secondary">
              {COMPANY_BOILERPLATE}
            </p>
          </div>

          <p className="mt-6 text-[0.82rem] font-light leading-relaxed text-muted">
            Please use the Roshan AI name as one word plus the initialism, as
            in Roshan AI, and the legal entity name Roshan AI LLC on first
            reference. Do not alter the logo colors or proportions.
          </p>
        </div>
      </section>

      <Divider />

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative overflow-hidden rounded-3xl p-8 sm:p-10"
          >
            <div className="relative z-10">
              <h2 className="text-balance font-display text-[1.4rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[1.7rem]">
                Media enquiries
              </h2>
              <p className="mt-3 max-w-xl text-[0.94rem] font-light leading-relaxed text-secondary">
                Interviews, product briefings, or fact-checking a story. We aim
                to respond within two business days.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Press%20enquiry`}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--color-iris-500))',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                {CONTACT_EMAIL}
                <ArrowUpRight size={15} />
              </a>
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
    </>
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
