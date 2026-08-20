import { Link } from 'react-router-dom';
import { PLATFORM_URL } from '../lib/config';
import { SocialLinks } from './SocialLinks';

const columns: {
  title: string;
  links: { label: string; to?: string; href?: string }[];
}[] = [
  {
    title: 'Products',
    links: [
      { label: 'ShifaMind', to: '/products/shifamind' },
      { label: 'NabzGraph', to: '/products/nabzgraph' },
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
    <footer className="relative border-t border-subtle pt-10 pb-7 sm:pt-14 sm:pb-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-10 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display text-[0.95rem] font-semibold tracking-[-0.015em]"
            >
              <span>
                Roshan<span className="text-secondary">·AI</span>
              </span>
            </Link>
            <p className="mt-2.5 text-[0.76rem] leading-relaxed text-muted sm:mt-3 sm:text-[0.78rem]">
              AI infrastructure for clinical reasoning.
            </p>
            <SocialLinks className="mt-4 sm:mt-5" />
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                {col.title}
              </div>
              <ul className="mt-2.5 space-y-1.5 text-[0.8rem] sm:mt-3 sm:space-y-2 sm:text-[0.84rem]">
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

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-subtle pt-5 text-[0.7rem] text-muted sm:mt-12 sm:flex-row sm:items-center sm:gap-3 sm:pt-6 sm:text-[0.74rem]">
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
