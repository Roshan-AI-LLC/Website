export type PressRelease = {
  /** URL segment under /company/press/ */
  slug: string;
  /** ISO date, used for sorting and <time datetime>. */
  date: string;
  /** Short label shown on cards, e.g. "Announcement". */
  kind: string;
  title: string;
  /** One or two sentences. Used on the index card and as the meta description. */
  summary: string;
  /** Optional standfirst above the body on the detail page. */
  dek?: string;
  /** Body paragraphs. Plain strings, rendered as <p>. */
  body: string[];
  /** Optional pull-quote. */
  quote?: { text: string; attribution: string };
  /**
   * Lead visual on the detail page. Only partner badges we are licensed to
   * display, rendered by their own compliant component.
   */
  badge?: 'nvidia-inception';
  /** Renders the NVIDIA legal attribution on the detail page. */
  requiresNvidiaLegalLine?: boolean;
  /** Optional outbound links shown at the foot of the release. */
  links?: { label: string; href: string }[];
};

export const PRESS_RELEASES: PressRelease[] = [
  {
    slug: 'nvidia-inception',
    date: '2026-07-21',
    kind: 'Announcement',
    title: 'Roshan AI joins the NVIDIA Inception program',
    summary:
      'Roshan AI is now a member of the NVIDIA Inception program, giving our clinical models access to NVIDIA’s accelerated computing stack, engineering resources, and go-to-market network.',
    dek: 'Membership supports the training and deployment of concept-grounded clinical models behind ShifaMind and NabzGraph.',
    body: [
      'Roshan AI LLC today announced that it has joined the NVIDIA Inception program, a program designed to help startups accelerate innovation and growth. Membership gives Roshan AI access to the latest NVIDIA developer resources and training, preferred pricing on NVIDIA hardware and software, and exposure to NVIDIA’s venture capital network.',
      'Roshan AI builds clinical-grade AI infrastructure. Rather than wrapping a general-purpose language model in longer prompts, the company trains clinical encoders on clinical data and routes every prediction through an explicit concept layer. The result is an architecture that cannot produce an output without also producing the evidence behind it, which is what makes the output defensible in a clinical setting.',
      'That architecture is compute-intensive. Concept-grounded models carry a structural bottleneck by design, and training them well means training them often, across large volumes of clinical text and physiological signal data. Access to NVIDIA’s accelerated computing stack directly shortens the loop between a research idea and a model a clinician can actually use.',
      'The membership supports both products currently on the Roshan AI platform. ShifaMind reads a clinical note and returns ranked ICD-10 codes, each paired with the concept evidence behind it. NabzGraph builds interpretable knowledge graphs from ICU signals. Both consume the same underlying platform, and both benefit from the same infrastructure improvements.',
      'Roshan AI LLC is based in Arizona, USA.',
    ],
    quote: {
      text: 'Clinical AI does not fail because the models are too small. It fails because nobody can check the work. Everything we build is aimed at that problem, and being part of the NVIDIA Inception program means we get to iterate on it faster.',
      attribution: 'Mohammed Sameer Syed, Founder, Roshan AI',
    },
    badge: 'nvidia-inception',
    requiresNvidiaLegalLine: true,
    links: [
      {
        label: 'About the NVIDIA Inception program',
        href: 'https://www.nvidia.com/en-us/startups/',
      },
    ],
  },
];

export function getRelease(slug: string): PressRelease | undefined {
  return PRESS_RELEASES.find((r) => r.slug === slug);
}

/** Newest first. */
export function sortedReleases(): PressRelease[] {
  return [...PRESS_RELEASES].sort((a, b) => b.date.localeCompare(a.date));
}

export function formatPressDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Standard company boilerplate. Journalists lift this verbatim, so keep it to
 * one paragraph and keep it current.
 */
export const COMPANY_BOILERPLATE =
  'Roshan AI LLC builds clinical-grade AI infrastructure. The company trains clinical models structured around an explicit concept layer, so every prediction arrives with the evidence behind it rather than an unverifiable explanation after the fact. ShifaMind, its first product, delivers concept-grounded ICD-10 coding for clinicians and coders. NabzGraph builds interpretable knowledge graphs from ICU signals. Roshan AI is based in Arizona, USA.';
