/**
 * Cardiology scenario, ported verbatim from
 * src/data/shifamindScenarios.ts (the 'cardiology' entry). Only the fields
 * the video needs are kept. Data is hand-curated demo data, not live
 * inference - same caveat as the source file.
 */
export type NoteSection = { heading: string; text: string };

export const NOTE: NoteSection[] = [
  {
    heading: 'Chief Complaint',
    text: 'Progressive dyspnea on exertion and orthopnea over 1 week.',
  },
  {
    heading: 'History of Present Illness',
    text: '72M with known HFrEF (LVEF 30%) on lisinopril, carvedilol, and spironolactone presents with one week of progressive shortness of breath, bilateral lower-extremity edema, and a 10-lb weight gain. Sleeping in a recliner due to orthopnea. No chest pain or syncope.',
  },
  {
    heading: 'Exam',
    text: 'BP 152/88, HR 96, RR 22, SpO2 91% on room air. JVD 12 cm. Bibasilar crackles. 3+ pitting edema in both lower extremities.',
  },
  {
    heading: 'Labs & Imaging',
    text: 'BNP 1850 (markedly elevated). Troponin negative. CXR: bilateral pleural effusions and pulmonary vascular congestion.',
  },
  {
    heading: 'Assessment & Plan',
    text: 'Acute on chronic HFrEF exacerbation. Started IV furosemide 80 mg, continue home GDMT, daily weights, fluid restriction 1.5 L.',
  },
];

/** Evidence phrases highlighted, in reveal order (matches the spec). */
export const EVIDENCE_PHRASES = [
  'Progressive dyspnea on exertion and orthopnea',
  'bilateral lower-extremity edema',
  'BNP 1850',
] as const;

/** Top concepts driving the I50.23 prediction, ordered by activation. */
export const CONCEPTS = [
  { label: 'orthopnea', activation: 0.93 },
  { label: 'lower_extremity_edema', activation: 0.91 },
  { label: 'bnp_elevation', activation: 0.9 },
  { label: 'dyspnea', activation: 0.87 },
] as const;

/** The resolved primary code. */
export const CODE = {
  code: 'I50.23',
  description: 'Acute on chronic systolic heart failure',
  confidence: 0.94,
} as const;
