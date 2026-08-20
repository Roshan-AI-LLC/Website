import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../../lib/config';
import { COMPANY_BOILERPLATE, formatPressDate, sortedReleases } from '../../data/press';

const pressKit: { label: string; desc: string; href: string }[] = [
  { label: 'Logo, dark backgrounds', desc: 'PNG · transparent', href: '/logo-dark.png' },
  { label: 'Logo, light backgrounds', desc: 'PNG · transparent', href: '/logo-light.png' },
  { label: 'Company mark', desc: 'SVG · scalable', href: '/favicon.svg' },
];

export default function CompanyPress() {
  const releases = sortedReleases();
  return (
    <>
      <Head>
        <title>Press | Roshan AI</title>
        <meta name="description" content="Announcements, company boilerplate, brand assets, and media contact for Roshan AI LLC." />
        <link rel="canonical" href="https://roshan-ai.com/company/press" />
      </Head>
      <Hero />
      <Newsroom releases={releases} />
      <PressKit />
      <MediaContact />
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
            Press
          </div>
          <h1 className="mt-4 text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-5 sm:text-[3rem]">News from <span className="gradient-text">Roshan AI.</span></h1>
          <p className="mt-4 max-w-2xl text-pretty text-[0.94rem] leading-relaxed text-secondary sm:mt-5 sm:text-[1.05rem]">Announcements, accurate company context, and the assets journalists need to cover Roshan AI.</p>
        </div>
      </div>
    </section>
  );
}

function Newsroom({ releases }: { releases: ReturnType<typeof sortedReleases> }) {
  return (
    <section className="relative py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Newsroom</div>
            <h2 className="mt-2 font-display text-[1.55rem] font-semibold tracking-[-0.03em] sm:text-[2rem]">Announcements</h2>
          </div>
          <div className="text-[0.72rem] text-muted">{releases.length} release{releases.length === 1 ? '' : 's'}</div>
        </div>
        <div className="glass mt-6 overflow-hidden rounded-2xl sm:mt-7 sm:rounded-3xl">
          {releases.map((release, index) => (
            <motion.article
              key={release.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-subtle last:border-b-0"
            >
              <Link to={`/company/press/${release.slug}`} className="group grid gap-2 px-4 py-4 transition hover:bg-[color:var(--accent-soft)] sm:grid-cols-[150px_1fr_auto] sm:items-center sm:gap-5 sm:px-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-muted">
                  <time dateTime={release.date}>{formatPressDate(release.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{release.kind}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.012em] text-primary sm:text-[1.02rem]">{release.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[0.78rem] leading-relaxed text-secondary sm:text-[0.84rem]">{release.summary}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[0.76rem] font-semibold text-accent">Read <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PressKit() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Press kit</div>
            <h2 className="mt-2 max-w-2xl font-display text-[1.65rem] font-semibold tracking-[-0.03em] sm:text-[2.25rem]">Assets and accurate context.</h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">Use the supplied assets as-is and the boilerplate below when introducing the company.</p>
        </div>
        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {pressKit.map((asset) => (
              <a key={asset.href} href={asset.href} download className="group flex items-center gap-3 px-4 py-4 transition hover:bg-[color:var(--accent-soft)] sm:px-5 sm:py-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"><Download size={14} strokeWidth={1.8} /></span>
                <span className="min-w-0">
                  <span className="block text-[0.84rem] font-semibold text-primary">{asset.label}</span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">{asset.desc}</span>
                </span>
              </a>
            ))}
          </div>
          <div className="border-t border-subtle px-4 py-4 sm:px-5 sm:py-5">
            <div className="text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-muted">About Roshan AI · boilerplate</div>
            <p className="mt-2 max-w-4xl text-[0.8rem] leading-relaxed text-secondary sm:text-[0.88rem]">{COMPANY_BOILERPLATE}</p>
            <p className="mt-3 text-[0.72rem] leading-relaxed text-muted">Use the name “Roshan AI” on first reference and “Roshan AI LLC” for the legal entity. Do not alter logo colours or proportions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaContact() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-2xl px-5 py-5 sm:rounded-3xl sm:px-7 sm:py-6"
        >
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1.35fr_auto] lg:items-center lg:gap-8">
            <div>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Media enquiries</div>
              <h2 className="mt-2 font-display text-[1.45rem] font-semibold tracking-[-0.03em] sm:text-[1.85rem]">Need a briefing or fact check?</h2>
              <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-secondary sm:text-[0.92rem]">For interviews, product context, or an accurate company source, contact the team directly.</p>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Press%20enquiry`} className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5 lg:justify-self-end" style={{ background: 'linear-gradient(135deg, var(--accent), var(--color-iris-500))', boxShadow: 'var(--shadow-glow)', color: 'var(--on-accent)' }}>
              {CONTACT_EMAIL}
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70" style={{ background: 'radial-gradient(ellipse at 80% 50%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 66%)' }} />
        </motion.div>
      </div>
    </section>
  );
}
