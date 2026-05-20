import { Link } from 'react-router-dom';
import { PLATFORM_URL } from '../lib/config';

const columns: {
  title: string;
  links: { label: string; to?: string; href?: string }[];
}[] = [
  {
    title: 'Products',
    links: [
      { label: 'ShifaMind', to: '/products/shifamind' },
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
    <footer className="relative border-t border-subtle pt-14 pb-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display text-[0.95rem] font-semibold tracking-[-0.015em]"
            >
              <span>
                Roshan<span className="text-secondary">·AI</span>
              </span>
            </Link>
            <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
              AI infrastructure for clinical reasoning.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2 text-[0.84rem]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-muted transition-colors hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors hover:text-primary"
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

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-subtle pt-6 text-[0.74rem] text-muted sm:flex-row sm:items-center">
          <div>
            <span className="font-medium text-secondary">Roshan AI LLC</span>{' '}
            · Arizona, USA
          </div>
          <div>© {new Date().getFullYear()} Roshan AI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
