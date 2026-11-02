import { useEffect } from 'react';
import { Head } from 'vite-react-ssg';
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { REQUEST_ACCESS_URL } from '../../lib/config';
import { getPost, readingMinutes, type BlogPost } from '../../data/blog';
import { formatPressDate } from '../../data/press';
import { BODY_TEXT, Blocks, Callout, CollapsibleSection, H2_CLASS } from '../../components/blog/Blocks';
import { BlogProvider, Inline, SmartLink, unfoldAround } from '../../components/blog/Inline';
import { plainText } from '../../components/blog/markup';
import { TocFold, TocRail, type TocEntry } from '../../components/blog/Toc';
import { FOCUS_RING, TEXT_COL } from '../../components/blog/ui';
import NotFound from '../NotFound';

const SITE = 'https://roshan-ai.com';
const LOGO_URL = `${SITE}/logo-dark.png`;

/** Grid shared by the hero and the body, so the title lines up with the text column beside the desktop rail. */
const GRID = 'lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10';

const abs = (href: string) => (href.startsWith('/') ? `${SITE}${href}` : href);

/** JSON for a <script type="application/ld+json">, with "<" escaped so no text can close the tag. */
const ld = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

function structuredData(post: BlogPost, url: string): string[] {
  const author = {
    '@type': 'Person',
    name: post.author.name,
    jobTitle: post.author.role,
    ...(post.author.href ? { url: abs(post.author.href) } : {}),
  };
  const article = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author,
    publisher: {
      '@type': 'Organization',
      name: 'Roshan AI',
      url: SITE,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(post.image ? { image: abs(post.image) } : {}),
    url,
    inLanguage: 'en',
    articleSection: post.kind,
    keywords: post.tags.join(', '),
    citation: post.references.map((r) => ({
      '@type': 'CreativeWork',
      name: plainText(r.text),
      ...(r.url ? { url: abs(r.url) } : {}),
    })),
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      // There is no /company index; About is the section's landing page.
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Company',
        item: `${SITE}/company/about`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Blog',
        item: `${SITE}/company/blog`,
      },
      { '@type': 'ListItem', position: 4, name: post.title, item: url },
    ],
  };
  const out = [ld(article)];
  if (post.faq && post.faq.length > 0) {
    out.push(
      ld({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: plainText(q),
          acceptedAnswer: { '@type': 'Answer', text: plainText(a) },
        })),
      }),
    );
  }
  out.push(ld(breadcrumbs));
  return out;
}

/**
 * Deep links (/company/blog/<slug>#leaderboard, #ref-…, #faq) on first load
 * and on in-app navigation. Layout scrolls to the top whenever the path
 * changes, and its effect runs after this page's, so the jump waits a frame;
 * any folded <details> around the target opens first.
 */
function useHashScroll(hash: string) {
  useEffect(() => {
    let id = '';
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    if (!id) return;
    // Layout scrolls to the top on load, which cuts a smooth scroll short, so
    // jump instantly, and once more after the first paint has settled.
    const jump = () => {
      const el = document.getElementById(id);
      if (!el) return;
      unfoldAround(id);
      el.scrollIntoView({
        block: 'start',
        behavior: 'instant' as ScrollBehavior,
      });
    };
    const frame = window.requestAnimationFrame(jump);
    const timer = window.setTimeout(jump, 250);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [hash]);
}

/** An id for a page-level section that no block already uses. */
function freeId(post: BlogPost, want: string): string {
  const taken = new Set(post.blocks.flatMap((b) => ('id' in b && b.id ? [b.id] : [])));
  return taken.has(want) ? `post-${want}` : want;
}

export default function CompanyBlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;
  if (!post) return <NotFound />;
  return <Article post={post} />;
}

function Article({ post }: { post: BlogPost }) {
  useHashScroll(useLocation().hash);
  const path = `/company/blog/${post.slug}`;
  const url = `${SITE}${path}`;
  const refNumbers = Object.fromEntries(post.references.map((r, i) => [r.id, i + 1]));
  const faqId = freeId(post, 'faq');
  const refsId = freeId(post, 'references');
  const hasFaq = !!post.faq && post.faq.length > 0;

  const toc: TocEntry[] = [
    ...post.blocks.flatMap((b) => (b.type === 'h2' ? [{ id: b.id, text: plainText(b.text) }] : [])),
    ...(hasFaq ? [{ id: faqId, text: 'FAQ' }] : []),
    ...(post.references.length > 0 ? [{ id: refsId, text: 'References' }] : []),
  ];

  const title = `${post.seoTitle ?? post.title} | Roshan AI`;
  const modified = post.updated ?? post.date;
  const image = post.image ? abs(post.image) : null;

  return (
    <BlogProvider value={{ path, refNumbers }}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.seoTitle ?? post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        {image && <meta property="og:image" content={image} />}
        {image && <meta property="og:image:width" content="1200" />}
        {image && <meta property="og:image:height" content="630" />}
        {image && <meta name="twitter:card" content="summary_large_image" />}
        {image && <meta name="twitter:image" content={image} />}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:modified_time" content={modified} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.kind} />
        {post.tags.map((t) => (
          <meta key={t} property="article:tag" content={t} />
        ))}
      </Head>

      <article>
        <Hero post={post} />

        <section className="relative pb-10 sm:pb-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className={GRID}>
              <div className="hidden lg:block">
                <TocRail entries={toc} />
              </div>

              <div className="min-w-0">
                <div className={TEXT_COL}>
                  <Callout as="section" tone="key" title="Key takeaways" items={post.takeaways} />
                  {toc.length > 1 && <TocFold entries={toc} className="mt-3 lg:hidden" />}
                </div>

                <div className="mt-8 sm:mt-12">
                  <Blocks blocks={post.blocks} />
                </div>

                {/* The FAQ stays open (each question folds on its own); references fold. */}
                {hasFaq && <Faq id={faqId} items={post.faq!} />}
                {post.references.length > 0 && <References id={refsId} post={post} />}

                <ClosingCta />

                {post.disclosure && (
                  <div className={`${TEXT_COL} mt-5 sm:mt-8`}>
                    <div className="rounded-2xl border border-subtle px-4 py-3 sm:px-5 sm:py-4">
                      <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
                        Methods and disclosure
                      </div>
                      <p className="mt-1.5 text-pretty text-[0.82rem] leading-relaxed text-secondary sm:text-[0.86rem]">
                        <Inline text={post.disclosure} />
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Structured data sits in the body, not <Head>: hoisted there, ~16 KB
            of JSON-LD pushed <meta charset> far past the first 1,024 bytes.
            ld() escapes "<", so the raw HTML cannot close the tag. */}
        {structuredData(post, url).map((json, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
        ))}
      </article>
    </BlogProvider>
  );
}

function Hero({ post }: { post: BlogPost }) {
  const minutes = readingMinutes(post);
  const updated = post.updated && post.updated !== post.date ? post.updated : null;
  return (
    // Inside <article>, so the phone rule for `main > section` never reaches
    // it; the base top padding matches the press release hero.
    <section className="relative isolate overflow-hidden pt-[5.25rem] pb-5 sm:pt-40 sm:pb-12">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-50" />
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className={GRID}>
          <div aria-hidden className="hidden lg:block" />
          <div className={`${TEXT_COL} enter-fade-up`}>
            <Link
              to="/company/blog"
              className="group -my-2.5 inline-flex items-center gap-1.5 rounded-md py-2.5 text-[0.82rem] font-medium text-muted transition-colors hover:text-[color:var(--text-primary)] sm:my-0 sm:py-0"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              All posts
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.74rem] text-muted sm:mt-6 sm:text-[0.76rem]">
              <time dateTime={post.date}>{formatPressDate(post.date)}</time>
              {updated && (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    Updated <time dateTime={updated}>{formatPressDate(updated)}</time>
                  </span>
                </>
              )}
              <span aria-hidden>·</span>
              <span className="font-semibold uppercase tracking-[0.12em] text-accent">{post.kind}</span>
              <span aria-hidden>·</span>
              <span>{minutes} min read</span>
            </div>

            <h1 className="mt-2 text-balance font-display text-[1.7rem] font-bold leading-[1.08] tracking-[-0.025em] sm:mt-4 sm:text-[2.5rem] sm:leading-[1.06]">
              <Inline text={post.title} />
            </h1>

            <p className="mt-2 text-pretty text-[0.95rem] font-light leading-[1.55] text-secondary sm:mt-5 sm:text-[1.08rem] sm:leading-relaxed">
              <Inline text={post.dek} />
            </p>

            <p className="mt-3 text-[0.8rem] text-muted sm:mt-6 sm:text-[0.84rem]">
              By{' '}
              {post.author.href ? (
                <SmartLink
                  url={post.author.href}
                  className="rounded-sm font-semibold text-primary underline decoration-[color:var(--border-strong)] underline-offset-[3px] transition-colors hover:decoration-[color:var(--accent)]"
                >
                  {post.author.name}
                </SmartLink>
              ) : (
                <span className="font-semibold text-primary">{post.author.name}</span>
              )}
              <span aria-hidden> · </span>
              <span className="sr-only">, </span>
              {post.author.role}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq({ id, items }: { id: string; items: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby={id} className={`${TEXT_COL} mt-9 sm:mt-14`}>
      <h2 id={id} className={H2_CLASS}>
        FAQ
      </h2>
      <div className="mt-3 divide-y divide-[color:var(--border-subtle)] border-y border-subtle sm:mt-5">
        {items.map((it, i) => (
          <details key={i} className="group">
            <summary
              className={`flex min-h-12 cursor-pointer list-none items-start justify-between gap-4 rounded-md py-3 text-left sm:gap-8 sm:py-4 [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
            >
              <span className="min-w-0 text-pretty text-[0.94rem] font-medium leading-snug tracking-[-0.01em] text-primary sm:text-[1.02rem]">
                <Inline text={it.q} />
              </span>
              <span
                aria-hidden
                className="-mt-px inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-subtle text-secondary transition duration-300 ease-spring group-open:rotate-45 group-open:border-transparent group-open:bg-[color:var(--accent-soft)] group-open:text-[color:var(--accent)] sm:mt-0 sm:h-7 sm:w-7"
              >
                <Plus size={14} strokeWidth={2} />
              </span>
            </summary>
            <p className={`pb-4 pr-2 sm:pb-5 sm:pr-14 ${BODY_TEXT}`}>
              <Inline text={it.a} />
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <div className={`${TEXT_COL} mt-8 sm:mt-12`}>
      <div className="glass relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:px-6 sm:py-5">
        <div className="relative z-10 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">ShifaMind</div>
            <p className="mt-1.5 text-balance font-display text-[1.2rem] font-semibold leading-[1.15] tracking-[-0.025em] text-primary sm:text-[1.4rem]">
              See the concepts behind <span className="gradient-text">every code.</span>
            </p>
          </div>
          {/* Each label stays on one line: under 420px wide the pills are too
              narrow for label plus arrow, so the arrows go and the text and
              padding shrink a step. */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:items-stretch">
            <a
              href={REQUEST_ACCESS_URL}
              className="btn-primary group inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.84rem] font-semibold transition will-change-transform hover:-translate-y-0.5 max-[420px]:px-2.5 max-[420px]:text-[0.8rem] sm:px-5"
            >
              Request access
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 max-[420px]:hidden" />
            </a>
            <Link
              to="/products/shifamind"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-subtle bg-glass px-3 py-2.5 text-[0.84rem] font-medium text-secondary transition hover:border-strong hover:text-[color:var(--text-primary)] max-[420px]:px-2.5 max-[420px]:text-[0.8rem] sm:px-5"
            >
              Explore ShifaMind
              <ArrowUpRight size={15} className="max-[420px]:hidden" />
            </Link>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at 80% 50%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 66%)',
          }}
        />
      </div>
    </div>
  );
}

function References({ id, post }: { id: string; post: BlogPost }) {
  const n = post.references.length;
  return (
    // A citation link unfolds this section before it scrolls (unfoldAround).
    <CollapsibleSection
      id={id}
      title="References"
      meta={`${n} source${n === 1 ? '' : 's'}`}
      className="mt-8 sm:mt-12"
      last
    >
      <ol
        className={`${TEXT_COL} space-y-2 pt-1 text-[0.8rem] leading-relaxed text-secondary sm:space-y-2.5 sm:text-[0.84rem]`}
      >
        {post.references.map((r, i) => (
          <li
            key={r.id}
            id={`ref-${r.id}`}
            className="grid scroll-mt-3 grid-cols-[2rem_minmax(0,1fr)] gap-1 sm:scroll-mt-28"
          >
            <span className="font-mono text-[0.74rem] leading-[1.75] text-muted">[{i + 1}]</span>
            <span className="min-w-0 text-pretty">
              <Inline text={r.text} />
              {r.url && (
                <>
                  {' '}
                  <SmartLink
                    url={r.url}
                    className="rounded-sm text-accent underline decoration-[color:color-mix(in_oklab,var(--accent)_35%,transparent)] underline-offset-2 [overflow-wrap:anywhere] hover:decoration-[color:var(--accent)]"
                  >
                    {displayUrl(r.url)}
                  </SmartLink>
                </>
              )}
            </span>
          </li>
        ))}
      </ol>
    </CollapsibleSection>
  );
}

function displayUrl(url: string): string {
  if (url.startsWith('/')) return `roshan-ai.com${url}`;
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}
