import { Head } from 'vite-react-ssg';
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { InceptionBadge } from '../../components/InceptionBadge';
import { ClaudeStartupsMark } from '../../components/ClaudeStartupsMark';
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
        {/* This hero sits inside <article>, so the global phone rule for
            `main > section` never reaches it; the base padding here matches
            the other page heroes on phones. */}
        <section className="relative isolate overflow-hidden pt-[5.5rem] pb-6 sm:pt-40 sm:pb-12">
          <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
            <div className="aurora h-[420px] w-[1100px] max-w-full opacity-50" />
          </div>

          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="enter-fade-up">
              <Link
                to="/company/press"
                className="group -my-2.5 inline-flex items-center gap-1.5 py-2.5 text-[0.82rem] font-medium text-muted transition-colors hover:text-primary sm:my-0 sm:py-0"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                All announcements
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76rem] text-muted sm:mt-6">
                <time dateTime={release.date}>
                  {formatPressDate(release.date)}
                </time>
                <span aria-hidden>·</span>
                <span className="uppercase tracking-[0.12em]">
                  {release.kind}
                </span>
              </div>

              <h1 className="mt-3 text-balance font-display text-[1.75rem] font-bold leading-[1.08] tracking-[-0.025em] sm:mt-4 sm:text-[2.6rem]">
                {release.title}
              </h1>

              {release.dek && (
                <p className="mt-3 text-pretty text-[0.98rem] font-light leading-relaxed text-secondary sm:mt-5 sm:text-[1.05rem]">
                  {release.dek}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="relative pb-12 sm:pb-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            {/* Phones: a smaller mark with its caption beside it; the full-size
                stacked figure returns at sm. Both widths stay above the
                badge's 110px legibility floor. */}
            {release.badge === 'nvidia-inception' && (
              <figure className="mb-6 flex items-center gap-4 sm:mb-10 sm:block">
                <InceptionBadge width={120} link={false} className="flex shrink-0 sm:hidden" />
                <InceptionBadge width={220} link={false} className="hidden sm:inline" />
                <figcaption className="text-[0.74rem] leading-relaxed text-muted sm:mt-3">
                  Roshan AI is a member of the NVIDIA Inception program.
                </figcaption>
              </figure>
            )}

            {release.badge === 'claude-startups' && (
              <figure className="mb-6 flex items-center gap-4 sm:mb-10 sm:block">
                <ClaudeStartupsMark width={120} link={false} className="flex shrink-0 sm:hidden" />
                <ClaudeStartupsMark width={220} link={false} className="hidden sm:inline" />
                <figcaption className="text-[0.74rem] leading-relaxed text-muted sm:mt-3">
                  Roshan AI is a member of Claude Startups.
                </figcaption>
              </figure>
            )}

            <div className="space-y-4 text-[0.94rem] font-light leading-[1.6] text-secondary sm:space-y-5 sm:text-[1rem] sm:leading-relaxed">
              {release.body.map((para, i) => (
                <p key={i} className="text-pretty">
                  {para}
                </p>
              ))}
            </div>

            {release.quote && (
              <figure className="glass mt-7 rounded-2xl p-4 sm:mt-10 sm:p-8">
                <blockquote className="text-pretty font-display text-[1rem] font-medium leading-[1.5] tracking-[-0.015em] sm:text-[1.25rem]">
                  “{release.quote.text}”
                </blockquote>
                <figcaption className="mt-3 text-[0.82rem] text-muted sm:mt-4">
                  {release.quote.attribution}
                </figcaption>
              </figure>
            )}

            {release.links && release.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-10">
                {release.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-subtle bg-glass px-4 py-2 text-[0.86rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary sm:min-h-0"
                  >
                    {l.label}
                    <ArrowUpRight size={14} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-8 border-t border-subtle pt-3 sm:mt-12 sm:pt-8">
              {/* Phones: the boilerplate folds behind its own label, as on
                  /company/press (every word kept, one tap away); it is always
                  open from sm up. */}
              <details className="group sm:hidden">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary [&::-webkit-details-marker]:hidden">
                  About Roshan AI
                  <ChevronDown size={16} className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="pb-1 text-pretty text-[0.86rem] font-light leading-relaxed text-secondary">
                  {COMPANY_BOILERPLATE}
                </p>
              </details>
              <div className="hidden sm:block">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                  About Roshan AI
                </div>
                <p className="mt-2 text-pretty text-[0.86rem] font-light leading-relaxed text-secondary sm:mt-3 sm:text-[0.9rem]">
                  {COMPANY_BOILERPLATE}
                </p>
              </div>

              <div className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary sm:mt-6">
                Media contact
              </div>
              <p className="mt-2 text-[0.9rem] font-light text-secondary">
                {/* Phones: padding grows the tap target to 40px; the negative
                    margin keeps the line where it was. Plain inline from sm. */}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Press%20enquiry`}
                  className="-my-2.5 inline-block py-2.5 text-accent hover:underline sm:my-0 sm:inline sm:py-0"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
