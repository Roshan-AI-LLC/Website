/**
 * Blog posts (/company/blog). Each post lives in its own module under
 * ./posts and is registered below; the pages render posts from this data, so
 * no copy is typed in a component.
 *
 * Inline text in any `text`, list item, table cell, FAQ answer or reference
 * supports a small markup:
 *   **bold**   *italic*   `code`   [label](url)   [^ref-id] (citation to `references`)
 * Internal links start with "/" and stay in the app; anything else opens in
 * a new tab.
 */
import { BEST_MEDICAL_CODING_MODELS_2026 } from './posts/best-medical-coding-models-2026';

export type BlogFigure =
  /** Micro-F1 (x) against macro-F1 (y) for every ranked model. */
  | 'micro-macro-scatter'
  /** Micro-F1 bars, best first, ShifaMind highlighted. */
  | 'micro-f1-bars'
  /** Parameter count (log scale) against micro-F1 for models that report it. */
  | 'params-vs-micro-f1'
  /** One code's score broken into its concept contributions (the paper's worked example). */
  | 'concept-receipt';

export type BlogBlock =
  /** Section heading. `id` is the anchor and must be unique within the post. */
  /**
   * `collapsible`: the section (this heading and every block up to the next
   * h2) folds behind its heading, closed until the reader opens it.
   */
  | { type: 'h2'; id: string; text: string; collapsible?: boolean }
  | { type: 'h3'; id: string; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  /** A data table. `highlight` names row indexes to emphasise (0-based). */
  | {
      type: 'table';
      id?: string;
      caption: string;
      columns: string[];
      rows: string[][];
      /** Columns (0-based) that hold numbers, right-aligned. */
      numeric?: number[];
      highlight?: number[];
      note?: string;
    }
  /** The ranked benchmark table, rendered from codingLeaderboard.ts. */
  | { type: 'leaderboard'; caption: string; note?: string }
  /** The ensembles panel, rendered from codingLeaderboard.ts. */
  | { type: 'ensembles'; caption: string; note?: string }
  | { type: 'figure'; figure: BlogFigure; caption: string }
  /** A boxed aside. `tone: 'key'` is the takeaways style. */
  | { type: 'callout'; tone?: 'info' | 'key' | 'warn'; title?: string; text?: string; items?: string[] }
  | { type: 'quote'; text: string; cite?: string }
  /** Display equation or formula, shown in monospace. */
  | { type: 'formula'; text: string; caption?: string }
  /**
   * A figure reproduced from a paper (a site path under /blog/<slug>/), shown
   * on a white card since paper figures have white backgrounds. Only figures
   * whose licence allows reuse with credit (CC BY, or our own work); `credit`
   * names the source and licence. `maxWidth` caps the displayed width in CSS
   * pixels, for portrait or single-column figures that would blur if stretched.
   */
  | {
      type: 'image';
      src: string;
      width: number;
      height: number;
      alt: string;
      caption: string;
      credit: string;
      maxWidth?: number;
    };

export type BlogReference = {
  /** Id used in [^id] citations. */
  id: string;
  /** Formatted reference, ACL style, inline markup allowed. */
  text: string;
  url?: string;
};

export type BlogPost = {
  /** URL segment under /company/blog/ */
  slug: string;
  /** H1. */
  title: string;
  /** <title> tag, under ~60 characters. Falls back to `title`. */
  seoTitle?: string;
  /** Meta description and index-card summary, under ~160 characters. */
  description: string;
  /** Standfirst under the H1. */
  dek: string;
  /** ISO dates. */
  date: string;
  updated?: string;
  author: { name: string; role: string; href?: string };
  /** Short label on cards, e.g. "Research". */
  kind: string;
  /** Share image for og:image, twitter:image and the article's JSON-LD: a site path, 1200x630. */
  image?: string;
  tags: string[];
  /** Answer-first summary box at the top of the post. */
  takeaways: string[];
  blocks: BlogBlock[];
  faq?: { q: string; a: string }[];
  references: BlogReference[];
  /** Methods and disclosure box at the end of the post. */
  disclosure?: string;
};

export const BLOG_POSTS: BlogPost[] = [BEST_MEDICAL_CODING_MODELS_2026];

export function sortedPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Rough reading time from every text field, at 230 words a minute. */
export function readingMinutes(post: BlogPost): number {
  const parts: string[] = [post.dek, ...post.takeaways];
  for (const b of post.blocks) {
    if ('text' in b && b.text) parts.push(b.text);
    if ('items' in b && b.items) parts.push(...b.items);
    if (b.type === 'table') parts.push(...b.rows.flat());
  }
  for (const f of post.faq ?? []) parts.push(f.q, f.a);
  const words = parts.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
