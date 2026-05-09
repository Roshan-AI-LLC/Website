import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';

const links = [
  { href: '#shifamind', label: 'ShifaMind' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#performance', label: 'Performance' },
  { href: '#projects', label: 'Roadmap' },
  { href: '#founder', label: 'Founder' },
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
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background,border,box-shadow,padding] duration-500',
        scrolled
          ? 'border-b border-subtle backdrop-blur-xl py-2'
          : 'border-b border-transparent py-4',
      )}
      style={{
        backgroundColor: scrolled ? 'var(--bg-glass-strong)' : 'transparent',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="group inline-flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight"
        >
          <Logo />
          <span>
            Roshan<span className="text-secondary">·AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link rounded-md px-3 py-1.5 text-[0.86rem] font-medium text-secondary transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <a
            href="https://shifamind.me"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-1.5 rounded-full border border-subtle bg-accent-soft px-4 py-1.5 text-[0.82rem] font-medium text-accent transition hover:border-strong sm:inline-flex"
          >
            Try ShifaMind
            <ArrowUpRight
              size={14}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-subtle bg-glass text-secondary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
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
            <div className="mx-4 mt-2 rounded-2xl border border-subtle bg-glass-strong p-3 backdrop-blur-xl">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[0.92rem] text-secondary hover:bg-accent-soft hover:text-primary"
                >
                  {l.label}
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </a>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-subtle pt-3">
                <ThemeToggle />
                <a
                  href="https://shifamind.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-4 py-1.5 text-[0.82rem] font-medium text-accent"
                >
                  Try ShifaMind
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

function Logo() {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-8 w-7 items-center justify-center"
    >
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="32"
        className="block"
        style={{
          filter:
            'drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 45%, transparent))',
        }}
      >
        {/* Lower facet: white in dark / near-black in light */}
        <path
          d="M13 17 L11 30 L28 13 L19 13 Z"
          fill="var(--logo-fg)"
        />
        {/* Upper facet: teal */}
        <path
          d="M21 2 L4 17 L13 17 L19 13 Z"
          fill="var(--accent)"
        />
        {/* Hairline outline for crisp edges */}
        <path
          d="M21 2 L4 17 L13 17 L11 30 L28 13 L19 13 Z"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.6"
          strokeWidth="0.6"
          strokeLinejoin="miter"
        />
      </svg>
    </span>
  );
}
