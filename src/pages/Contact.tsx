import { useState, type FormEvent } from 'react';
import { Head } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '../lib/config';

const ROLES = [
  { value: 'clinician', label: 'Clinician' },
  { value: 'developer', label: 'Developer / integrator' },
  { value: 'partner', label: 'Partner / health system' },
  { value: 'press', label: 'Press' },
  { value: 'other', label: 'Other' },
] as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set('form-name', 'contact');

    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (typeof value === 'string') params.append(key, value);
    }

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <>
      <Head>
        <title>Contact — Roshan AI</title>
        <meta
          name="description"
          content="Talk to Roshan AI about pilots, partnerships, integration, and demos."
        />
        <link rel="canonical" href="https://roshan-ai.com/contact" />
      </Head>

      <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
          <div className="aurora h-[420px] w-[1100px] max-w-full opacity-50" />
        </div>

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
                Contact
              </div>

              <h1 className="mt-5 text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[2.8rem]">
                Talk to{' '}
                <span className="gradient-text">Roshan AI.</span>
              </h1>

              <p className="mt-5 max-w-md text-[1rem] font-light leading-relaxed text-secondary">
                Pilots, integrations, partnerships, demos. Tell us where you sit
                and what you're trying to do — we'll route it to the right
                person.
              </p>

              <div className="mt-10 space-y-4">
                <ContactLink
                  icon={Mail}
                  label="Direct email"
                  value={CONTACT_EMAIL}
                  href={`mailto:${CONTACT_EMAIL}`}
                />
              </div>

              <p className="mt-10 text-[0.78rem] text-muted">
                We respond to legitimate inquiries within 2 business days.
                Recruiters and unsolicited vendor pitches will not get a reply.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
                {status === 'success' ? (
                  <SuccessState onReset={() => setStatus('idle')} />
                ) : (
                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Netlify required hidden inputs */}
                    <input type="hidden" name="form-name" value="contact" />
                    <p className="hidden">
                      <label>
                        Don't fill this out: <input name="bot-field" />
                      </label>
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Name" required>
                        <input
                          name="name"
                          required
                          autoComplete="name"
                          className="form-input"
                        />
                      </Field>
                      <Field label="Email" required>
                        <input
                          type="email"
                          name="email"
                          required
                          autoComplete="email"
                          className="form-input"
                        />
                      </Field>
                    </div>

                    <Field label="Organization">
                      <input
                        name="organization"
                        autoComplete="organization"
                        className="form-input"
                      />
                    </Field>

                    <Field label="I'm a…" required>
                      <select name="role" required className="form-input" defaultValue="">
                        <option value="" disabled>
                          Select one
                        </option>
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Message" required>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        className="form-input resize-y"
                        placeholder="What are you trying to do? What stage are you at?"
                      />
                    </Field>

                    {status === 'error' && (
                      <div
                        className="rounded-xl border border-subtle px-4 py-3 text-[0.86rem]"
                        style={{ color: 'var(--accent-warm)' }}
                      >
                        Couldn't send: {errorMsg}. Email us directly at{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                          {CONTACT_EMAIL}
                        </a>
                        .
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
                        boxShadow: 'var(--shadow-glow)',
                        color: 'var(--on-accent)',
                      }}
                    >
                      {status === 'submitting' ? 'Sending…' : 'Send message'}
                      {status !== 'submitting' && (
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      )}
                    </button>

                    <p className="text-center text-[0.74rem] text-muted">
                      We don't add you to a marketing list. Your message goes to
                      the team inbox only.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <style>{`
          .form-input {
            width: 100%;
            background: var(--bg-glass);
            border: 1px solid var(--border-subtle);
            color: var(--text-primary);
            border-radius: 12px;
            padding: 0.7rem 0.9rem;
            font-family: inherit;
            font-size: 0.92rem;
            transition: border-color 180ms var(--ease-spring),
              background 180ms var(--ease-spring);
          }
          .form-input::placeholder { color: var(--text-muted); }
          .form-input:focus {
            outline: none;
            border-color: var(--accent);
            background: var(--bg-elev);
          }
          .form-input:hover:not(:focus) {
            border-color: var(--border-strong);
          }
          select.form-input {
            appearance: none;
            background-image: linear-gradient(45deg, transparent 50%, var(--text-secondary) 50%),
              linear-gradient(135deg, var(--text-secondary) 50%, transparent 50%);
            background-position: calc(100% - 18px) 50%, calc(100% - 13px) 50%;
            background-size: 5px 5px;
            background-repeat: no-repeat;
            padding-right: 2rem;
          }
        `}</style>
      </section>
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block pb-1.5 text-[0.78rem] font-medium text-secondary">
        {label}
        {required && (
          <span className="ml-1 text-accent" aria-hidden>
            *
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function ContactLink({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-subtle bg-glass p-3.5 transition hover:border-strong"
    >
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
      >
        <Icon size={16} strokeWidth={1.8} />
      </span>
      <span>
        <span className="block text-[0.74rem] font-medium uppercase tracking-[0.12em] text-secondary">
          {label}
        </span>
        <span className="block text-[0.92rem] font-medium text-primary group-hover:text-accent">
          {value}
        </span>
      </span>
    </a>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div
        className="inline-flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
      >
        <CheckCircle2 size={28} strokeWidth={1.6} />
      </div>
      <h2 className="mt-4 font-display text-[1.4rem] font-semibold tracking-[-0.02em]">
        Message sent.
      </h2>
      <p className="mt-2 max-w-sm text-[0.92rem] text-secondary">
        We'll get back to you within 2 business days, usually faster.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-glass px-4 py-2 text-[0.86rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
      >
        Send another message
      </button>
    </div>
  );
}
