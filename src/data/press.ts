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
   * Lead visual on the detail page. Only program marks we are permitted to
   * display, each rendered by its own compliant component: NVIDIA's licensed
   * badge artwork, or the text-only Claude Startups mark (Anthropic ships no
   * member logo).
   */
  badge?: 'nvidia-inception' | 'claude-startups';
  /** Optional outbound links shown at the foot of the release. */
  links?: { label: string; href: string }[];
};

export const PRESS_RELEASES: PressRelease[] = [
  {
    slug: 'claude-startups',
    date: '2026-10-13',
    kind: 'Announcement',
    title: 'Roshan AI joins Claude Startups',
    summary:
      'Roshan AI is now a member of Claude Startups, Anthropic’s program for early-stage founders. Membership supports the grounded discussion layer and the engineering workflow around ShifaMind’s trained clinical coder.',
    dek: 'Membership supports the product built around ShifaMind’s coder: the grounded discussion layer where a coder can question a prediction with the evidence in view, and the engineering workflow behind the platform.',
    body: [
      'Roshan AI LLC today announced that it has joined Claude Startups, Anthropic’s program for early-stage founders. Members receive Anthropic API credits, priority rate limits and access to resources, offers and credits from companies building with Claude through the Claude Startup Stack, live group sessions with Anthropic’s Applied AI team, and the program’s events, hackathons and community meetups.',
      'Roshan AI does not wrap a general-purpose language model in longer prompts. The coder at the core of ShifaMind is a clinical model the company trains itself, a BioClinical ModernBERT encoder with a concept bottleneck, so every ICD-10 code it predicts passes through an explicit layer of clinical concepts and arrives with the evidence behind it. Roshan AI publishes comparisons of that coder against general-purpose models, Claude among them, rather than building it on one. A frontier model belongs around that coder, not inside it.',
      'Where Claude fits is in the layer around the coder. ShifaMind’s grounded discussion primitive lets a coder ask follow-up questions about a prediction inside the note, with the concepts and quoted spans that produced it in view, so a question is answered against evidence the model has already committed to. Claude supports that layer, and it supports the engineering workflow behind the platform as Roshan AI builds it. The prediction itself still comes from the trained coder.',
      'Claude Startups sits alongside the NVIDIA Inception program, which Roshan AI joined in July 2026 and which supports the compute side: the training runs, sweeps and evaluation passes a concept-bottlenecked model demands. Between them the two programs support the two halves of the work, training the clinical models and building the product around them.',
      'Roshan AI LLC is based in Arizona, USA.',
    ],
    quote: {
      text: 'Clinical AI fails when nobody can check the work, and a conversation about a prediction is only worth having if it is held to the same evidence as the prediction itself. Claude Startups helps us build that part of ShifaMind while the coder underneath stays a model we trained and can audit.',
      attribution: 'Mohammed Sameer Syed, Founder, Roshan AI',
    },
    badge: 'claude-startups',
    links: [
      {
        label: 'About Claude Startups',
        href: 'https://claude.com/programs/startups',
      },
    ],
  },
  {
    slug: 'lambda-gpu-credits',
    date: '2026-09-09',
    kind: 'Announcement',
    title: 'Thank you to Lambda for backing ShifaMind with GPU credits',
    summary:
      'Lambda has awarded Roshan AI a grant of GPU credits through the NVIDIA Inception program. The credits go directly into scaling ShifaMind and strengthening the interpretability work at its core.',
    dek: 'The award funds larger training runs for ShifaMind and deeper validation of the concept layer that makes every prediction checkable.',
    body: [
      'Roshan AI LLC today announced that it has received a grant of GPU credits from Lambda, awarded through the company\u2019s membership in the NVIDIA Inception program. We are grateful to both. Compute is the constraint that decides how quickly a small research company can move from an idea to a model a clinician can actually use, and this award moves that constraint.',
      'Our thanks go to the Lambda team for backing early-stage clinical AI that does not look like the rest of the field. Roshan AI does not wrap a general-purpose language model in longer prompts. It trains clinical encoders on clinical data and routes every prediction through an explicit concept layer, so the model cannot produce an output without also producing the evidence behind it. That design is harder to train and more expensive to validate than the alternative, and support of this kind is what makes it practical to pursue.',
      'The credits go first to scaling ShifaMind, the concept-grounded ICD-10 coding model at the core of the platform. Concept-bottlenecked models are trained, not prompted, which means every improvement is a training run: longer schedules, wider code coverage, and the sweeps a structural bottleneck demands before it settles.',
      'The second use is the interpretability work itself. A concept layer is only worth having if its claims hold up under testing: concept fidelity measurement, faithfulness ablations, and counterfactual checks. Every one of those checks is an evaluation run of its own, and the credits pay for them.',
      'Roshan AI LLC is based in Arizona, USA.',
    ],
    quote: {
      text: 'ShifaMind will cover more of the ICD-10 code space, with the same evidence attached to every prediction, and it will be ready for deployment in a real coding workflow soon.',
      attribution: 'Mohammed Sameer Syed, Founder, Roshan AI',
    },
    links: [
      {
        label: 'Lambda',
        href: 'https://lambda.ai/',
      },
      {
        label: 'About the NVIDIA Inception program',
        href: 'https://www.nvidia.com/en-us/startups/',
      },
    ],
  },
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
 * one paragraph and keep it current. The trademark lines for both programs it
 * names live in the site footer.
 */
export const COMPANY_BOILERPLATE =
  'Roshan AI LLC builds clinical-grade AI infrastructure. The company trains clinical models structured around an explicit concept layer, so every prediction arrives with the evidence behind it rather than an unverifiable explanation after the fact. ShifaMind, its first product, delivers concept-grounded ICD-10 coding for clinicians and coders. NabzGraph builds interpretable knowledge graphs from ICU signals. Roshan AI is a member of the NVIDIA Inception program and of Claude Startups. Roshan AI is based in Arizona, USA.';
