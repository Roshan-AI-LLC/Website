import { createContext, useContext, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { jumpToSection } from '../../lib/utils';
import { tokenize, type Token } from './markup';

/**
 * What inline text needs to know about the post it sits in: the page path
 * (index.html sets <base href="/">, so a bare "#id" would resolve to the home
 * page) and each reference's number, which is its position in
 * `post.references`.
 */
export type BlogContextValue = { path: string; refNumbers: Record<string, number> };

const BlogContext = createContext<BlogContextValue>({ path: '', refNumbers: {} });

export function BlogProvider({ value, children }: { value: BlogContextValue; children: ReactNode }) {
  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  return useContext(BlogContext);
}

/** Opens every <details> the element with this id sits in (the references and table notes fold on phones). */
export function unfoldAround(id: string) {
  let details = document.getElementById(id)?.closest('details') ?? null;
  while (details) {
    details.open = true;
    details = details.parentElement?.closest('details') ?? null;
  }
}

/** In-page jump that also unfolds any <details> the target sits in, then scrolls to it. */
export function jumpToAnchor(event: MouseEvent<HTMLAnchorElement>, id: string) {
  jumpToSection(event, id, () => unfoldAround(id));
}

export const LINK_CLASS =
  'rounded-sm text-accent underline decoration-[color:color-mix(in_oklab,var(--accent)_40%,transparent)] underline-offset-[3px] transition-colors hover:decoration-[color:var(--accent)]';

function isFile(url: string) {
  return /\.[a-z0-9]{2,5}$/i.test(url.split(/[?#]/)[0]);
}

/**
 * One link, routed by its URL: "#id" jumps in the page, "/route" stays in the
 * app, "/file.pdf" and external URLs open in a new tab, mailto/tel open as is.
 */
export function SmartLink({
  url,
  children,
  className = LINK_CLASS,
  ariaLabel,
}: {
  url: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const { path } = useBlog();
  if (url.startsWith('#')) {
    const id = url.slice(1);
    return (
      <a href={`${path}${url}`} onClick={(e) => jumpToAnchor(e, id)} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  if (/^(mailto|tel):/i.test(url)) {
    return (
      <a href={url} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  const internal = url.startsWith('/') && !url.startsWith('//');
  if (internal && !isFile(url)) {
    return (
      <Link to={url} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel={internal ? 'noopener' : 'noopener noreferrer'}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
      {!ariaLabel && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/** A superscript citation, numbered by the reference's position in the post. */
function Cite({ id }: { id: string }) {
  const { refNumbers } = useBlog();
  const n = refNumbers[id];
  if (!n) {
    // Visible in the page and in the build log, so a broken id gets fixed.
    if (typeof window === 'undefined') console.warn(`[blog] citation to unknown reference "${id}"`);
    return (
      <sup className="relative top-[-0.4em] align-baseline text-[0.72em] text-muted" title={`Missing reference: ${id}`}>
        [?]
      </sup>
    );
  }
  return (
    <sup className="relative top-[-0.4em] align-baseline text-[0.72em] font-medium leading-none">
      <SmartLink
        url={`#ref-${id}`}
        ariaLabel={`Reference ${n}`}
        className="rounded-sm px-[0.1em] text-accent no-underline transition-colors hover:underline"
      >
        [{n}]
      </SmartLink>
    </sup>
  );
}

const NBSP = '\u00a0';
const isCite = (tk: Token | undefined) => tk?.t === 'cite';
const isGap = (tk: Token | undefined) => tk?.t === 'text' && tk.v.trim() === '';

/** Tokens to render: citations come grouped into runs. */
type Piece = Exclude<Token, { t: 'cite' }> | { t: 'cites'; ids: string[] };

/**
 * Groups each run of citations ("[1][2] [3]", spaces between them dropped)
 * into one piece so the run never breaks across lines, and binds the run to
 * the word before it: a trailing space in the preceding text becomes a
 * no-break space.
 */
function groupCitations(tokens: Token[]): Piece[] {
  const out: Piece[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tk = tokens[i];
    if (tk.t !== 'cite') {
      out.push(tk);
      continue;
    }
    const ids: string[] = [];
    let k = i;
    while (k < tokens.length) {
      const cur = tokens[k];
      if (cur.t === 'cite') {
        ids.push(cur.id);
        k++;
      } else if (isGap(cur) && isCite(tokens[k + 1])) {
        k++;
      } else break;
    }
    const prev = out[out.length - 1];
    if (prev && prev.t === 'text' && /\s$/.test(prev.v)) {
      out[out.length - 1] = { t: 'text', v: prev.v.replace(/\s+$/, NBSP) };
    }
    out.push({ t: 'cites', ids });
    i = k - 1;
  }
  return out;
}

function render(tokens: Token[], key: string, inLink: boolean): ReactNode[] {
  return groupCitations(tokens).map((tk, i) => {
    const k = `${key}.${i}`;
    switch (tk.t) {
      case 'text':
        return tk.v;
      case 'cites':
        return (
          <span key={k} className="whitespace-nowrap">
            {tk.ids.map((id, n) => (
              <Cite key={n} id={id} />
            ))}
          </span>
        );
      case 'code':
        return (
          <code
            key={k}
            className="rounded-[0.3em] px-[0.3em] py-[0.08em] font-mono text-[0.86em] text-primary"
            style={{ background: 'color-mix(in oklab, var(--text-primary) 7%, transparent)' }}
          >
            {tk.v}
          </code>
        );
      case 'strong':
        // Inside a link the link's colour wins; bold only adds weight.
        return (
          <strong key={k} className={inLink ? 'font-semibold' : 'font-semibold text-primary'}>
            {render(tk.children, k, inLink)}
          </strong>
        );
      case 'em':
        return <em key={k}>{render(tk.children, k, inLink)}</em>;
      case 'link':
        // A link inside a link label renders as its text: anchors cannot nest.
        if (inLink) return <span key={k}>{render(tk.children, k, true)}</span>;
        return (
          <SmartLink key={k} url={tk.url}>
            {render(tk.children, k, true)}
          </SmartLink>
        );
    }
  });
}

/** Renders a string of blog markup as inline React nodes. */
export function Inline({ text }: { text: string }) {
  return <>{render(tokenize(text), 'i', false)}</>;
}
