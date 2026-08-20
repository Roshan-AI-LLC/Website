import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { CompanyMark } from './CompanyMark';
import { cn } from '../lib/utils';
import { PLATFORM_URL } from '../lib/config';

type DropdownItem = { label: string; href: string; desc?: string };

const productItems: DropdownItem[] = [
  {
    label: 'ShifaMind',
    href: '/products/shifamind',
    desc: 'Clinical coding & reasoning for physicians',
  },
  {
    label: 'NabzGraph',
    href: '/products/nabzgraph',
    desc: 'Interpretable knowledge graphs from ICU signals',
  },
];

const companyItems: DropdownItem[] = [
  { label: 'About', href: '/company/about' },
  { label: 'Team', href: '/company/team' },
  { label: 'Press', href: '/company/press' },
];

const flatLinks = [
  { href: '/platform', label: 'Platform' },
  { href: '/developers', label: 'Developers' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div
        className={cn(
          'nav-rail mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 backdrop-blur-xl sm:px-5',
          scrolled ? 'nav-rail-scrolled' : 'border-transparent bg-transparent',
        )}
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 font-display text-[1rem] font-semibold tracking-[-0.015em]"
        >
          <CompanyMark size={30} />
          <span>
            Roshan<span className="text-secondary">·AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Dropdown label="Products" items={productItems} />
          {flatLinks.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              className={({ isActive }) =>
                cn(
                  'nav-link rounded-md px-3 py-1.5 text-[0.86rem] font-medium transition-colors hover:text-primary',
                  isActive ? 'is-active text-primary' : 'text-secondary',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Dropdown label="Company" items={companyItems} />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-1.5 rounded-full border border-subtle bg-accent-soft px-4 py-1.5 text-[0.82rem] font-medium text-accent transition hover:border-strong sm:inline-flex"
          >
            Sign in
            <ArrowUpRight
              size={14}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

          <button
            className="inline-flex h-9 items-center gap-2 rounded-full border border-subtle bg-glass px-3 text-secondary transition hover:border-strong hover:text-primary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em]">
              {open ? 'Close' : 'Menu'}
            </span>
            {open ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="mx-0 mt-2 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-3xl border border-subtle bg-glass-strong p-3 shadow-[0_18px_60px_-20px_rgba(11,17,32,0.32)] backdrop-blur-xl">
              <MobileGroup label="Products" items={productItems} onClose={() => setOpen(false)} />
              {flatLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 text-[0.92rem] text-secondary transition hover:bg-accent-soft hover:text-primary"
                >
                  {l.label}
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </Link>
              ))}
              <MobileGroup label="Company" items={companyItems} onClose={() => setOpen(false)} />
              <div className="mt-3 flex items-center justify-between border-t border-subtle pt-3">
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
                    Appearance
                  </span>
                </div>
                <a
                  href={PLATFORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-4 py-1.5 text-[0.82rem] font-medium text-accent"
                >
                  Sign in
                  <ArrowUpRight size={14} strokeWidth={2} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Dropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const location = useLocation();

  const isActive = items.some((item) =>
    location.pathname === item.href ||
    location.pathname.startsWith(`${item.href}/`),
  );

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleEnter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'nav-link inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[0.86rem] font-medium transition-colors hover:text-primary',
          open || isActive ? 'is-active text-primary' : 'text-secondary',
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {label}
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            className="absolute left-0 top-full mt-2 min-w-[260px] rounded-2xl border border-subtle bg-glass-strong p-2 backdrop-blur-xl"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                role="menuitem"
                className="block rounded-lg px-3 py-2 transition hover:bg-accent-soft"
              >
                <div className="text-[0.9rem] font-medium text-primary">
                  {item.label}
                </div>
                {item.desc && (
                  <div className="mt-0.5 text-[0.78rem] text-secondary">
                    {item.desc}
                  </div>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileGroup({
  label,
  items,
  onClose,
}: {
  label: string;
  items: DropdownItem[];
  onClose: () => void;
}) {
  return (
    <div className="mb-1">
      <div className="px-3 pt-2 pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClose}
          className="flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 text-[0.92rem] text-secondary transition hover:bg-accent-soft hover:text-primary"
        >
          <span>
            {item.label}
            {item.desc && (
              <span className="ml-2 hidden text-[0.74rem] text-muted sm:inline">· {item.desc}</span>
            )}
          </span>
          <ArrowUpRight size={14} strokeWidth={1.6} />
        </Link>
      ))}
    </div>
  );
}
