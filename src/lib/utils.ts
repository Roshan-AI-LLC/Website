import type { MouseEvent } from 'react';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Click handler for an in-page link. index.html sets `<base href="/">`, so a
 * bare `#id` href resolves to the home page; such links carry their page path
 * in `href` (for new tabs and copied links) and this scrolls to the target in
 * place, updating only the hash and keeping the router's history entry.
 */
export function jumpToSection(
  event: MouseEvent<HTMLAnchorElement>,
  id: string,
  /** Layout changes to make before measuring, e.g. folding the menu the link sits in. */
  beforeScroll?: () => void,
) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  beforeScroll?.();
  target.scrollIntoView({ block: 'start' });
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, '', `${pathname}${search}#${id}`);
}
