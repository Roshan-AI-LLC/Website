/**
 * Every word on the home page, in one place. Figures come from
 * shifamindPaper.ts and nabzPapers.ts so nothing is typed twice.
 *
 * Claim limits (keep when editing):
 *   - Strong accuracy language ("state of the art", "best") is allowed (founder's
 *     call); detailed lines that name a metric stay precise (micro-AUROC ties
 *     PLM-ICD at 99.2).
 *   - GoM-ICD is never named or ranked.
 *   - 7,940 is the MIMIC-IV benchmark code set, not "all of ICD-10".
 *   - NabzSentry is VT alarms only.
 *   - Overruling a concept is a property of the architecture ("can"), shown as
 *     illustrative; the live platform has no override control.
 */
import { CONTACT_EMAIL } from '../lib/config';
import { PRESS_RELEASES } from './press';
import { INTERPRETABILITY, TASK, pct } from './shifamindPaper';

const n = (v: number) => v.toLocaleString('en-US');

export const HERO = {
  /** Rendered with the accent in the gradient. A no-break space keeps "clinical AI." together. */
  h1: { lead: 'The next architecture of', accent: 'clinical\u00A0AI.' },
  /** `mark` is highlighted inside the sentence. */
  sub: {
    before: 'Sovereign models, architected to ',
    mark: 'reason in medical terms',
    // Non-breaking hyphens (U+2011) keep the compounds whole when the line wraps.
    after: '. State\u2011of\u2011the\u2011art accuracy, human\u2011in\u2011the\u2011loop auditability. Built for tomorrow\u2019s medicine.',
  },
  ctaPrimary: 'Request access',
  ctaSecondary: 'See how it works',
} as const;

/**
 * Short titles for the hero band's scrolling announcements, by press slug.
 * A release without one here shows its full title.
 */
const ANNOUNCEMENT_TITLES: Record<string, string> = {
  'lambda-gpu-credits': 'Lambda backs ShifaMind with GPU credits',
  'nvidia-inception': 'Roshan AI joins NVIDIA Inception',
};

/**
 * The scrolling announcements in the hero band: every press release, newest
 * first, so a new release appears here on its own. Announcements only (no
 * stats, products or preprints).
 */
export const ANNOUNCEMENTS: { text: string; href: string; date: string }[] = [...PRESS_RELEASES]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((r) => ({
    text: ANNOUNCEMENT_TITLES[r.slug] ?? r.title,
    href: `/company/press/${r.slug}`,
    date: r.date,
  }));

export const PROBLEM = {
  eyebrow: 'The old bargain',
  h2: { lead: 'Accurate or explainable.', accent: 'Pick one.' },
  line: 'That was the deal in clinical AI. We refused to take it.',
  cards: [
    {
      key: 'cloud',
      title: 'Rented AI, exported data',
      line: 'Generic AI tools never come to your hospital. Your patient data goes to them.',
    },
    {
      key: 'highlights',
      title: 'Explanations, not reasoning',
      line: 'Other AI explains itself after the fact. At best, you get attention weights.',
    },
    {
      key: 'audits',
      title: 'Defense is expensive',
      line: 'Every appeal costs time, and a black box leaves you nothing to revise.',
    },
  ],
  /** Bridge into the fix. Hyphen + word joiner (U+2060): the display font has no
   *  non-breaking hyphen glyph, and this still keeps the compound on one line. */
  bridge: 'So we built both: truly explainable and state-\u2060of-\u2060the-\u2060art accurate.',
} as const;

/**
 * Model size and speed for the fix section's "small and fast" step. Every
 * field must be a measured figure; while this is null the step is left out
 * of the page entirely.
 */
export type SpeedFacts = {
  /** Parameter count, display form, e.g. "150M". */
  params: string;
  /** Hardware the timing was measured on, e.g. "one GPU". */
  hardware: string;
  /** Model time per note, display form, e.g. "0.4 s". */
  model: string;
  /** Human coder time per note, display form, e.g. "~10 min". */
  human: string;
};
/*
 * Sources: model figures from the founder (~190M parameters: BioClinical
 * ModernBERT base plus the concept and label heads; ~2-3 s per note on one GPU).
 * Human time: AHIMA, Watzlaf et al., "ICD-10 Coding Productivity Study
 * Highlights Emerging Standards", J AHIMA 87(8), 2016: 41.9 min per inpatient
 * record over 157,248 discharges (system-logged). Every verified US inpatient
 * average is ~30 min or more (AHIMA 38.1, Ciox/Pitt 37.5, VHA 44, himagine
 * 2017-18 ~29.7), so "~30 min" is the conservative display figure. The human
 * figure covers the whole chart; the model codes the note it is given.
 * Asserted (not annotated) so TypeScript keeps the full type if it is set back to null.
 */
export const SPEED = {
  params: '~190M',
  hardware: 'single GPU',
  model: '~2\u20133 s',
  human: '~30 min',
} as SpeedFacts | null;

const SPEED_STEP = SPEED
  ? ([
      {
        key: 'speed',
        tag: 'Speed',
        title: 'Small model. Fast answers.',
        line: `Compact size of ${SPEED.params} parameters. Suitable to fit on a ${SPEED.hardware}.`,
        statValue: SPEED.model,
        statLabel: `per note, vs ${SPEED.human} by hand`,
      },
    ] as const)
  : [];

export const FIX = {
  eyebrow: 'Our solution',
  // No-break spaces keep "black box" and "exported data" whole when the headline wraps.
  h2: { lead: 'No trade-off. No black\u00A0box.', accent: 'No exported\u00A0data.' },
  line: 'Our own models, reasoning in plain sight, inside your walls.',
  steps: [
    {
      key: 'onprem',
      tag: 'On-prem',
      title: 'In-house',
      line: 'Our own models, deployed inside your walls. Patient data stays inside.',
      statValue: 'HIPAA-ready',
      statLabel: 'BAA-eligible deployments',
    },
    {
      key: 'itemize',
      tag: 'Itemize',
      title: 'A receipt for every code',
      line: 'I50.23 at 0.94? Here are the four concepts that add up to it.',
      statValue: '100%',
      statLabel: 'of every score explained',
    },
    {
      key: 'override',
      tag: 'Override',
      title: 'Human in the loop',
      line: 'A coder can mark any concept affirmed or negated, and every code follows.',
      // Micro-F1 with the model's own gates equals micro-F1 with gates set to the labels.
      statValue:
        INTERPRETABILITY.intervention.ownGates === INTERPRETABILITY.intervention.assertionLabels
          ? 'Zero'
          : pct(INTERPRETABILITY.intervention.ownGates - INTERPRETABILITY.intervention.assertionLabels),
      statLabel: 'accuracy lost under coder control',
    },
    ...SPEED_STEP,
  ],
} as const;

export const DEMO = {
  eyebrow: 'Try it',
  h2: 'See ShifaMind code a clinical note.',
} as const;

export const BENCHMARK = {
  eyebrow: 'The proof',
  h2: 'Benchmark',
  line: `All ${n(TASK.codes)} MIMIC-IV codes. Beats every model we reproduced on micro- and macro-F1.`,
} as const;

export const FAQ_HEAD = {
  h2: 'FAQ',
  contact: 'Talk to us',
} as const;

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'How is this different from other AI?',
    a: 'Most tools add an explanation afterward. ShifaMind can only reach a code through named clinical concepts, and every score is an exact sum of them. The explanation is the model.',
  },
  {
    q: 'What about HIPAA?',
    a: "Deployments are HIPAA-ready and BAA-eligible, with TLS 1.3 and AES-256 encryption and audit logs of each prediction's concepts and evidence. We don't train on your data unless you opt in.",
  },
  {
    q: 'Will this replace our coders?',
    a: "No. It's designed to support coders, not replace them. ShifaMind proposes each code with its evidence, and your coders accept, edit or reject it. They make the final call.",
  },
  {
    // The FAQ renders CONTACT_EMAIL as a mailto link.
    q: 'How do I try it?',
    a: `Email us at ${CONTACT_EMAIL} to request access.`,
  },
  {
    q: 'Is Roshan AI only about medical coding?',
    a: 'No. ShifaMind is our flagship. Nabz is our bedside-monitor research: interpretable patient knowledge graphs, and certified triage of VT alarms.',
  },
];

export const CLOSING = {
  h2: { lead: 'Contact us to', accent: 'learn more.' },
  line: 'Whether you code, treat patients or run a health system, we\u2019d love to talk.',
  /** Access is by request only, so the banner has one action. */
  cta: 'Request access',
} as const;

export const META = {
  title: 'Roshan AI: The next architecture of clinical AI',
  description:
    'Sovereign clinical models that reason in medical terms, with state-of-the-art accuracy. ShifaMind predicts ICD-10 codes, each traced to named concepts.',
} as const;
