import { Link } from 'react-router-dom';
import { PLATFORM_URL } from '../lib/config';
import { SocialLinks } from './SocialLinks';
import { NvidiaLegalLine } from './InceptionBadge';
import { AnthropicLegalLine } from './ClaudeStartupsMark';

const columns: {
  title: string;
  links: { label: string; to?: string; href?: string }[];
}[] = [
  {
    title: 'Products',
    links: [
      { label: 'ShifaMind', to: '/products/shifamind' },
      { label: 'Nabz', to: '/products/nabz' },
      { label: 'All products', to: '/products' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Platform overview', to: '/platform' },
      { label: 'Developers', to: '/developers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/company/about' },
      { label: 'Team', to: '/company/team' },
      { label: 'Press', to: '/company/press' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', href: PLATFORM_URL },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/legal/privacy' },
      { label: 'Terms', to: '/legal/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-subtle pt-8 pb-6 sm:pt-14 sm:pb-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Phones: one column. The wordmark shares a row with the social icons and
            each link group becomes a single row (label left, links inline), so
            the footer stays short while every link is a 40px tap target. The
            2-col and 6-col grids return at sm and lg. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2 sm:gap-10 lg:grid-cols-6">
          <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 sm:col-span-2 sm:mb-0 sm:block lg:col-span-1">
            <Link
              to="/"
              className="inline-flex min-h-10 items-center gap-2 justify-self-start font-display text-[0.95rem] font-semibold tracking-[-0.015em] sm:min-h-0"
            >
              <span>
                Roshan<span className="text-secondary">·AI</span>
              </span>
            </Link>
            <p className="col-span-2 text-[0.76rem] leading-relaxed text-muted sm:mt-3 sm:text-[0.78rem]">
              The next architecture of clinical AI.
            </p>
            <SocialLinks className="col-start-2 row-start-1 sm:mt-5" />
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex items-center gap-3 sm:block">
              <div className="w-[5.25rem] shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary sm:w-auto">
                {col.title}
              </div>
              <ul className="flex min-w-0 flex-wrap gap-x-4 text-[0.8rem] sm:mt-3 sm:block sm:space-y-2 sm:text-[0.84rem]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="inline-flex min-h-10 items-center text-muted transition-colors hover:text-primary sm:inline"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center text-muted transition-colors hover:text-primary sm:inline"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col items-start justify-between gap-1 border-t border-subtle pt-4 text-[0.72rem] text-muted sm:mt-12 sm:flex-row sm:items-center sm:gap-3 sm:pt-6 sm:text-[0.74rem]">
          <div>
            <span className="font-medium text-secondary">Roshan AI LLC</span>{' '}
            · Arizona, USA
          </div>
          <div>© {new Date().getFullYear()} Roshan AI. All rights reserved.</div>
        </div>

        {/* Program trademark lines, once for the whole site: the home page and press pages name both programs.
            Phones get the 0.72rem reading floor; desktop keeps the original fine print. */}
        <div className="mt-3 space-y-0.5 text-[0.72rem] leading-relaxed text-muted opacity-70 sm:mt-4 sm:text-[0.62rem]">
          <NvidiaLegalLine />
          <AnthropicLegalLine />
        </div>
      </div>
    </footer>
  );
}
