/**
 * Published results on the MIMIC-IV ICD-10 full-code benchmark (Edin et al.,
 * 2023: patient-disjoint splits, ~7,940 codes, discharge summaries), as used
 * by the blog's leaderboard and charts. Every number is copied from the
 * source's own results table and was checked against the primary paper on
 * 2026-11-01; nothing here was re-run by Roshan AI. Percent throughout;
 * null = not reported.
 *
 * Only systems evaluated on this exact setting belong here. Results on
 * MIMIC-III, top-50 code sets, the 26K-code re-extraction or private splits
 * are not comparable and stay out (the post explains why).
 *
 * ShifaMind's figures come from its full-code paper (currently under review),
 * the same source as shifamindPaper.ts. The one exception is its parameter
 * count, which is counted from the architecture (see the row).
 */
import { BENCHMARK_ROWS, SHIFAMIND } from './shifamindPaper';

export type ExplanationKind = 'concepts' | 'attention' | 'none';

export type LeaderboardEntry = {
  /** Display name. */
  model: string;
  /** Short author or group credit, e.g. "Edin et al." */
  authors: string;
  /** Venue and year as a reader would cite it, e.g. "SIGIR 2023". */
  venue: string;
  peerReviewed: boolean;
  url: string;
  microAuc: number | null;
  macroAuc: number | null;
  microF1: number;
  macroF1: number | null;
  p8: number | null;
  p15: number | null;
  rPrec: number | null;
  map: number | null;
  /** Rough parameter count, display form. */
  params?: string;
  /** What a coder sees as the reason for a code. */
  explanation: ExplanationKind;
  /** Training data beyond the benchmark's ICD-10 training notes, if any. */
  extraData?: string;
  /** One-line reader note (protocol quirks, macro-F1 definition). */
  note?: string;
  ours?: true;
};

const edin = (model: string) => BENCHMARK_ROWS.find((r) => r.model === model)!;

/**
 * Edin et al. (2023) ten-seed reproductions: P@k / R-prec / MAP from their
 * Table 5; parameter counts and decoders from their Table 2 (CNN and Bi-GRU
 * use a max-pool decoder, so they have no attention to show).
 */
const EDIN_EXTRA: Record<
  string,
  { p8: number; p15: number; rPrec: number; map: number; params: string; explanation: ExplanationKind }
> = {
  'PLM-ICD': { p8: 69.9, p15: 55.0, rPrec: 57.9, map: 61.9, params: '139M', explanation: 'attention' },
  LAAT: { p8: 68.9, p15: 54.3, rPrec: 57.2, map: 60.6, params: '21.9M', explanation: 'attention' },
  MultiResCNN: { p8: 67.8, p15: 53.5, rPrec: 56.1, map: 59.3, params: '11.9M', explanation: 'attention' },
  CAML: { p8: 66.8, p15: 52.2, rPrec: 54.5, map: 57.4, params: '6.1M', explanation: 'attention' },
  'Bi-GRU': { p8: 62.6, p15: 47.7, rPrec: 49.6, map: 51.1, params: '9.9M', explanation: 'none' },
  CNN: { p8: 60.3, p15: 45.7, rPrec: 47.3, map: 48.2, params: '10.3M', explanation: 'none' },
};

const EDIN_URL = 'https://arxiv.org/abs/2304.10909';

function edinRow(model: string): LeaderboardEntry {
  const r = edin(model);
  const x = EDIN_EXTRA[model];
  return {
    model,
    authors: 'Edin et al. (reproduction)',
    venue: 'SIGIR 2023',
    peerReviewed: true,
    url: EDIN_URL,
    microAuc: r.aucMicro,
    macroAuc: r.aucMacro,
    microF1: r.f1Micro,
    macroF1: r.f1Macro,
    p8: x.p8,
    p15: x.p15,
    rPrec: x.rPrec,
    map: x.map,
    params: x.params,
    explanation: x.explanation,
  };
}

/** Ranked models, best micro-F1 first. */
export const LEADERBOARD: LeaderboardEntry[] = [
  {
    model: 'ShifaMind',
    authors: 'Roshan AI',
    venue: 'Under review, 2026',
    peerReviewed: false,
    url: '/papers/shifamind.pdf',
    microAuc: SHIFAMIND.aucMicro,
    macroAuc: SHIFAMIND.aucMacro,
    microF1: SHIFAMIND.f1Micro,
    macroF1: SHIFAMIND.f1Macro,
    p8: 71.8,
    p15: 56.8,
    rPrec: 60.1,
    map: 64.2,
    // Not printed in the paper: counted from the architecture (encoder, concept
    // queries and identity embeddings, label vectors). The blog's figure
    // caption says so.
    params: '~190M',
    explanation: 'concepts',
    extraData: 'MIMIC-IV ICD-9 notes; LLM-written concept vocabulary grounded in UMLS',
    note: `Each code's score is its bias plus an exact sum of contributions from named clinical concepts found in the note. Three-run mean.`,
    ours: true,
  },
  {
    model: 'TraceCoder',
    authors: 'Ren et al.',
    venue: 'IEEE BIBM 2025',
    peerReviewed: true,
    url: 'https://arxiv.org/abs/2510.15267',
    microAuc: 99.2,
    macroAuc: 96.7,
    microF1: 60.0,
    macroF1: 27.7,
    p8: 71.2,
    p15: 56.3,
    rPrec: null,
    map: null,
    explanation: 'attention',
    extraData: 'UMLS, Wikipedia and LLM-generated code knowledge',
    note: 'Macro-F1 formula not printed; the paper says it follows Edin et al.',
  },
  {
    model: 'JAMS + PLM-ICD',
    authors: 'Jeong et al.',
    venue: 'LREC-COLING 2024',
    peerReviewed: true,
    url: 'https://aclanthology.org/2024.lrec-main.227/',
    microAuc: 99.2,
    macroAuc: 96.7,
    microF1: 59.8,
    macroF1: 25.6,
    p8: 71.0,
    p15: 56.1,
    rPrec: 59.3,
    map: 63.6,
    explanation: 'attention',
    extraData: 'MIMIC-IV ICD-9 notes',
  },
  {
    model: 'PLM-CA (full text)',
    authors: 'Douglas et al.',
    venue: 'ACL 2025',
    peerReviewed: true,
    url: 'https://aclanthology.org/2025.acl-long.1489/',
    microAuc: 99.2,
    macroAuc: 96.2,
    microF1: 59.6,
    macroF1: 26.1,
    p8: 70.9,
    p15: 56.1,
    rPrec: null,
    map: 63.4,
    explanation: 'attention',
    note: 'Evidence via gradient-weighted attention mapped onto clinical entities.',
  },
  {
    model: 'PLANT (Mistral-7B)',
    authors: 'Saha Roy et al.',
    venue: 'arXiv preprint, 2025',
    peerReviewed: false,
    url: 'https://arxiv.org/abs/2410.23066',
    microAuc: 99.5,
    macroAuc: 97.4,
    microF1: 59.2,
    macroF1: 23.0,
    p8: 72.1,
    p15: 56.9,
    rPrec: null,
    map: null,
    params: '~7B',
    explanation: 'attention',
    note: 'A 7B language model used as a classifier backbone. Threshold protocol not stated.',
  },
  {
    model: 'PHI (Qwen3-4B)',
    authors: 'Wang et al.',
    venue: 'arXiv preprint, 2026',
    peerReviewed: false,
    url: 'https://arxiv.org/abs/2606.13940',
    microAuc: null,
    macroAuc: null,
    microF1: 58.7,
    macroF1: 21.2,
    p8: null,
    p15: null,
    rPrec: null,
    map: null,
    params: '4B',
    explanation: 'none',
    note: 'Generative LLM post-trained to write codes (SFT, then RL). Ranking metrics do not apply.',
  },
  edinRow('PLM-ICD'),
  {
    model: 'DualLAAT',
    authors: 'Liu & Nguyen',
    venue: 'BioNLP 2026',
    peerReviewed: true,
    url: 'https://aclanthology.org/2026.bionlp-1.29/',
    microAuc: 99.3,
    macroAuc: 97.4,
    microF1: 58.0,
    macroF1: 29.9,
    p8: 69.9,
    p15: 54.9,
    rPrec: 58.0,
    map: 62.3,
    params: '37M',
    explanation: 'attention',
    extraData: 'MIMIC-III and MIMIC-IV ICD-9 notes',
    note: 'Strongest macro-F1 reported on this benchmark: best on rare codes.',
  },
  edinRow('LAAT'),
  edinRow('MultiResCNN'),
  edinRow('CAML'),
  edinRow('Bi-GRU'),
  edinRow('CNN'),
];

export type EnsembleEntry = {
  model: string;
  authors: string;
  venue: string;
  url: string;
  microAuc: number;
  macroAuc: number;
  microF1: number;
  /** As printed; computed with a different macro-F1 formula (see note). */
  macroF1: number;
  p8: number;
  p15: number;
  note: string;
};

/** Reported separately from the ranked table. */
export const ENSEMBLES: EnsembleEntry[] = [
  {
    model: 'GoM-ICD',
    authors: 'Wu et al.',
    venue: 'Big Data Mining and Analytics 8(6), 2025',
    url: 'https://www.sciopen.com/article/10.26599/BDMA.2025.9020019',
    microAuc: 99.4,
    macroAuc: 97.7,
    microF1: 61.3,
    macroF1: 28.5,
    p8: 72.6,
    p15: 57.3,
    note: 'Combines three models in a mixture of experts, with training-time note augmentation. Its macro-F1 is the F1 of averaged precision and recall, a formula that reads higher than the per-code mean used above (ShifaMind scores 28.4 under it). The threshold protocol for the headline table is not stated; the paper’s ablation tunes thresholds on the test split.',
  },
];

export const LEADER = LEADERBOARD[0];
