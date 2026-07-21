import { Head } from 'vite-react-ssg';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { InceptionBadge, NvidiaLegalLine } from '../../components/InceptionBadge';
import { CONTACT_EMAIL } from '../../lib/config';
import {
  COMPANY_BOILERPLATE,
  formatPressDate,
  getRelease,
} from '../../data/press';
import NotFound from '../NotFound';

export default function CompanyPressRelease() {
  const { slug } = useParams<{ slug: string }>();
  const release = slug ? getRelease(slug) : undefined;

  if (!release) return <NotFound />;

  const url = `https://roshan-ai.com/company/press/${release.slug}`;

  return (
    <>
      <Head>
        <title>{`${release.title} | Roshan AI`}</title>
        <meta name="description" content={release.summary} />
        <meta property="og:title" content={release.title} />
        <meta property="og:description" content={release.summary} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={release.date} />
        <link rel="canonical" href={url} />
      </Head>

      <article>
        <section className="relative isolate overflow-hidden pt-32 pb-10 sm:pt-40 sm:pb-12">
          <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
            <div className="aurora h-[420px] w-[1100px] max-w-full opacity-50" />
          </div>

          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="enter-fade-up">
              <Link
                to="/company/press"
                className="group inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-muted transition-colors hover:text-primary"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                All announcements
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76rem] text-muted">
                <time dateTime={release.date}>
                  {formatPressDate(release.date)}
                </time>
                <span aria-hidden>·</span>
                <span className="uppercase tracking-[0.12em]">
                  {release.kind}
                </span>
              </div>

              <h1 className="mt-4 text-balance font-display text-[1.9rem] font-bold leading-[1.08] tracking-[-0.025em] sm:text-[2.6rem]">
                {release.title}
              </h1>

              {release.dek && (
                <p className="mt-5 text-pretty text-[1.05rem] font-light leading-relaxed text-secondary">
                  {release.dek}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="relative pb-16 sm:pb-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            {release.badge === 'nvidia-inception' && (
              <figure className="mb-10">
                <InceptionBadge width={220} link={false} />
                <figcaption className="mt-3 text-[0.74rem] leading-relaxed text-muted">
                  Roshan AI is a member of the NVIDIA Inception program.
                </figcaption>
              </figure>
            )}

            <div className="space-y-5 text-[1rem] font-light leading-relaxed text-secondary">
              {release.body.map((para, i) => (
                <p key={i} className="text-pretty">
                  {para}
                </p>
              ))}
            </div>

            {release.quote && (
              <figure className="glass mt-10 rounded-2xl p-6 sm:p-8">
                <blockquote className="text-pretty font-display text-[1.1rem] font-medium leading-[1.5] tracking-[-0.015em] sm:text-[1.25rem]">
                  “{release.quote.text}”
                </blockquote>
                <figcaption className="mt-4 text-[0.82rem] text-muted">
                  {release.quote.attribution}
                </figcaption>
              </figure>
            )}

            {release.links && release.links.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {release.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-subtle bg-glass px-4 py-2 text-[0.86rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
                  >
                    {l.label}
                    <ArrowUpRight size={14} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-12 border-t border-subtle pt-8">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                About Roshan AI
              </div>
              <p className="mt-3 text-pretty text-[0.9rem] font-light leading-relaxed text-secondary">
                {COMPANY_BOILERPLATE}
              </p>

              <div className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                Media contact
              </div>
              <p className="mt-2 text-[0.9rem] font-light text-secondary">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Press%20enquiry`}
                  className="text-accent hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>

              {release.requiresNvidiaLegalLine && (
                <NvidiaLegalLine className="mt-8 text-[0.68rem] leading-relaxed text-muted opacity-70" />
              )}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
