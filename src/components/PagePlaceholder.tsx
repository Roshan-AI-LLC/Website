import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionLabel } from './SectionLabel';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  status?: string;
};

export function PagePlaceholder({
  eyebrow = 'Roshan AI',
  title,
  description,
  status = 'In progress',
}: Props) {
  return (
    <section className="relative isolate overflow-hidden pt-40 pb-24 sm:pt-48 sm:pb-32">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-40" />
      </div>

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <div className="enter-fade-up">
          <SectionLabel>{status}</SectionLabel>

          <p className="mt-3 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-secondary sm:mt-6">
            {eyebrow}
          </p>

          <h1 className="mt-2 text-balance font-display text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.025em] sm:mt-3 sm:text-[3rem]">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mt-2 max-w-xl text-[0.94rem] font-light leading-[1.55] text-secondary sm:mt-5 sm:text-[1rem] sm:leading-relaxed">
              {description}
            </p>
          )}

          <Link
            to="/"
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-subtle bg-glass px-5 py-2.5 text-[0.88rem] font-medium sm:mt-10 sm:min-h-0 text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
