/**
 * Parser for the small inline markup blog posts use (see src/data/blog.ts):
 *   **bold**   *italic*   `code`   [label](url)   [^ref-id]
 * Pure functions only, so the page, the JSON-LD and the reading of a post all
 * see the same text.
 */

export type Token =
  | { t: 'text'; v: string }
  | { t: 'cite'; id: string }
  | { t: 'link'; url: string; children: Token[] }
  | { t: 'code'; v: string }
  | { t: 'strong'; children: Token[] }
  | { t: 'em'; children: Token[] };

/*
 * One alternation, tried left to right at each position, so a citation wins
 * over a link and bold wins over italic. Italic needs a non-space just inside
 * each star, so a stray "*" (a footnote mark, a multiplication) stays text.
 * No lookbehind: older Safari fails to parse it and would take the bundle down.
 */
const TOKEN_SOURCE = [
  String.raw`\[\^([^\]\s]+)\]`, // 1: citation id
  // The url may hold one level of balanced parentheses ("Foo_(bar)").
  String.raw`\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)`, // 2: link label, 3: url
  '`([^`]+)`', // 4: code
  String.raw`\*\*([\s\S]+?)\*\*`, // 5: bold
  String.raw`\*([^*\s](?:[^*]*?[^*\s])?)\*`, // 6: italic
].join('|');

export function tokenize(text: string): Token[] {
  const re = new RegExp(TOKEN_SOURCE, 'g');
  const out: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ t: 'text', v: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: 'cite', id: m[1] });
    else if (m[2] !== undefined) out.push({ t: 'link', url: m[3], children: tokenize(m[2]) });
    else if (m[4] !== undefined) out.push({ t: 'code', v: m[4] });
    else if (m[5] !== undefined) out.push({ t: 'strong', children: tokenize(m[5]) });
    else if (m[6] !== undefined) out.push({ t: 'em', children: tokenize(m[6]) });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}

function flatten(tokens: Token[]): string {
  return tokens
    .map((tk) => {
      switch (tk.t) {
        case 'text':
        case 'code':
          return tk.v;
        case 'cite':
          return '';
        default:
          return flatten(tk.children);
      }
    })
    .join('');
}

/** The text a reader sees, without markup or citation marks (for meta tags and JSON-LD). */
export function plainText(text: string): string {
  return flatten(tokenize(text))
    .replace(/\s+([.,;:!?)\]])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Citation ids used in a piece of text, in order of appearance. */
export function citationIds(text: string): string[] {
  const ids: string[] = [];
  const walk = (tokens: Token[]) => {
    for (const tk of tokens) {
      if (tk.t === 'cite') ids.push(tk.id);
      else if (tk.t === 'link' || tk.t === 'strong' || tk.t === 'em') walk(tk.children);
    }
  };
  walk(tokenize(text));
  return ids;
}
