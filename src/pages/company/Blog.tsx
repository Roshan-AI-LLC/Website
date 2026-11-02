import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { readingMinutes, sortedPosts, type BlogPost } from '../../data/blog';
import { formatPressDate } from '../../data/press';
import { SectionLabel } from '../../components/SectionLabel';

const SITE = 'https://roshan-ai.com';
const DESCRIPTION =
  'Research notes from Roshan AI: benchmark reviews, explainable clinical AI and how our models are evaluated.';

const abs = (href: string) => (href.startsWith('/') ? `${SITE}${href}` : href);

export default function CompanyBlog() {
  const posts = sortedPosts();
  // The newest post's share image stands in for the blog's (1200x630, see BlogPost.image).
  const newest = posts[0];
  const image = newest?.image ? abs(newest.image) : null;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Roshan AI Blog',
    url: `${SITE}/company/blog`,
    description: DESCRIPTION,
    publisher: { '@type': 'Organization', name: 'Roshan AI', url: SITE },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      url: `${SITE}/company/blog/${p.slug}`,
      author: { '@type': 'Person', name: p.author.name },
      ...(p.image ? { image: abs(p.image) } : {}),
    })),
  }).replace(/</g, '\\u003c');

  return (
    <>
      <Head>
        <title>Blog | Roshan AI</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={`${SITE}/company/blog`} />
        <meta property="og:title" content="Blog | Roshan AI" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={`${SITE}/company/blog`} />
        {image && <meta property="og:image" content={image} />}
        {image && <meta property="og:image:width" content="1200" />}
        {image && <meta property="og:image:height" content="630" />}
        {image && <meta name="twitter:card" content="summary_large_image" />}
        {image && <meta name="twitter:image" content={image} />}
        <script type="application/ld+json">{jsonLd}</script>
      </Head>
      <Hero />
      <PostList posts={posts} />
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
          <SectionLabel>Blog</SectionLabel>
          <h1 className="mt-2 text-balance font-display text-[1.75rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-5 sm:text-[3rem]">
            Research notes from <span className="gradient-text">Roshan AI.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-pretty text-[0.9rem] leading-[1.55] text-secondary sm:mt-5 sm:text-[1.05rem] sm:leading-relaxed">
            Benchmarks, methods and the evidence behind our models.
          </p>
        </div>
      </div>
    </section>
  );
}

function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="mobile-native-section relative py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-accent">Latest</div>
            {/* Phones: tight heading leading; at sm the inherited body line-height applies, as on /company/press. */}
            <h2 className="mt-2 font-display text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[2rem] sm:leading-[1.55]">
              Posts
            </h2>
          </div>
          <div className="text-[0.72rem] text-muted">
            {posts.length} post{posts.length === 1 ? '' : 's'}
          </div>
        </div>
        <div className="glass mt-3 overflow-hidden rounded-2xl sm:mt-7 sm:rounded-3xl">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-subtle last:border-b-0"
            >
              {/* The whole row is the link. Phones: date line, title and a
                  two-line summary; the "Read" cue joins at sm. */}
              <Link
                to={`/company/blog/${post.slug}`}
                className="group grid gap-0.5 px-4 py-3 transition hover:bg-[color:var(--accent-soft)] sm:grid-cols-[150px_1fr_auto] sm:items-center sm:gap-5 sm:px-5 sm:py-5"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-muted sm:flex-col sm:items-start sm:gap-y-0.5">
                  <time dateTime={post.date}>{formatPressDate(post.date)}</time>
                  <span className="flex items-center gap-x-2">
                    <span aria-hidden className="sm:hidden">·</span>
                    <span className="text-accent">{post.kind}</span>
                    <span aria-hidden>·</span>
                    <span>{readingMinutes(post)} min read</span>
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-pretty text-[0.98rem] font-semibold leading-snug tracking-[-0.012em] text-primary sm:text-[1.1rem]">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[0.8rem] leading-relaxed text-secondary sm:line-clamp-none sm:text-[0.88rem]">
                    {post.description}
                  </p>
                </div>
                <span className="hidden shrink-0 items-center gap-1.5 text-[0.76rem] font-semibold text-accent sm:inline-flex">
                  Read
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
