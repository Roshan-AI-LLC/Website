/**
 * Compact multi-specialty scenarios for the "it works across medicine" flash
 * (cardiology → pulmonology → the ED). Ported from
 * src/data/shifamindScenarios.ts. The full cardiology note lives in
 * data/scenario.ts; these are the one-line-each versions for the rapid montage.
 */
export type MiniScenario = {
  specialty: string;
  code: string;
  desc: string;
  concepts: { label: string; activation: number }[];
};

export const SPECIALTIES: MiniScenario[] = [
  {
    specialty: 'Cardiology',
    code: 'I50.23',
    desc: 'Acute on chronic systolic heart failure',
    concepts: [
      { label: 'orthopnea', activation: 0.93 },
      { label: 'lower_extremity_edema', activation: 0.91 },
      { label: 'bnp_elevation', activation: 0.9 },
    ],
  },
  {
    specialty: 'Pulmonology',
    code: 'J44.1',
    desc: 'COPD with acute exacerbation',
    concepts: [
      { label: 'wheezing', activation: 0.94 },
      { label: 'productive_cough', activation: 0.92 },
      { label: 'hypoxia', activation: 0.83 },
    ],
  },
  {
    specialty: 'Emergency',
    code: 'I21.4',
    desc: 'Non-ST elevation myocardial infarction',
    concepts: [
      { label: 'chest_pain', activation: 0.95 },
      { label: 'troponin_elevation', activation: 0.94 },
      { label: 'st_depression', activation: 0.92 },
    ],
  },
];
