/**
 * Demo scenarios for the /products/shifamind interactive coder.
 * All data is hand-curated for the demo. No live inference. The
 * highlights, concepts, and codes are clinically reasonable but the
 * "predictions" are prerendered, not produced by ShifaMind in real time.
 */

export type Concept = {
  /** Snake-case clinical concept name (matches ShifaMind's concept bank). */
  label: string;
  /** Activation strength, 0–1. */
  activation: number;
};

export type CodePrediction = {
  /** ICD-10 code, e.g. "I50.23". */
  code: string;
  /** Plain-language description for the code. */
  description: string;
  /** Model confidence, 0–1. */
  confidence: number;
  /** Concepts that drove this code. Ordered by activation desc. */
  concepts: Concept[];
  /** Verbatim phrases from the note this code is grounded in. */
  evidence: string[];
  /** Lower-ranked alternative codes the model considered. */
  alternatives: { code: string; description: string }[];
};

export type NoteSection = {
  heading: string;
  /** Body text. Highlights are matched verbatim against substrings. */
  text: string;
};

export type Scenario = {
  id: 'cardiology' | 'pulmonology' | 'ed';
  /** Short tab label. */
  label: string;
  /** Sub-label shown under the tabs when active. */
  subLabel: string;
  /** Structured clinical note. */
  note: NoteSection[];
  /** Predicted codes, ordered most → least confident. */
  codes: CodePrediction[];
};

export const SCENARIOS: Scenario[] = [
  // ───────────────────────────────────────────── Cardiology
  {
    id: 'cardiology',
    label: 'Cardiology',
    subLabel: 'Acute on chronic systolic heart failure',
    note: [
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
    ],
    codes: [
      {
        code: 'I50.23',
        description: 'Acute on chronic systolic (congestive) heart failure',
        confidence: 0.94,
        concepts: [
          { label: 'orthopnea', activation: 0.93 },
          { label: 'lower_extremity_edema', activation: 0.91 },
          { label: 'bnp_elevation', activation: 0.9 },
          { label: 'dyspnea', activation: 0.87 },
          { label: 'pulmonary_congestion', activation: 0.84 },
          { label: 'weight_gain', activation: 0.78 },
        ],
        evidence: [
          'progressive dyspnea on exertion and orthopnea',
          'bilateral lower-extremity edema',
          'BNP 1850',
          'Acute on chronic HFrEF exacerbation',
        ],
        alternatives: [
          {
            code: 'I50.22',
            description: 'Chronic systolic (congestive) heart failure',
          },
          { code: 'I50.9', description: 'Heart failure, unspecified' },
        ],
      },
      {
        code: 'J91.8',
        description: 'Pleural effusion in other conditions classified elsewhere',
        confidence: 0.81,
        concepts: [
          { label: 'pleural_effusion', activation: 0.92 },
          { label: 'pulmonary_congestion', activation: 0.76 },
          { label: 'dyspnea', activation: 0.62 },
        ],
        evidence: ['bilateral pleural effusions'],
        alternatives: [
          { code: 'J90', description: 'Pleural effusion, not elsewhere classified' },
        ],
      },
      {
        code: 'I10',
        description: 'Essential (primary) hypertension',
        confidence: 0.72,
        concepts: [
          { label: 'elevated_blood_pressure', activation: 0.81 },
          { label: 'antihypertensive_use', activation: 0.69 },
        ],
        evidence: ['BP 152/88', 'on lisinopril, carvedilol, and spironolactone'],
        alternatives: [
          { code: 'I11.0', description: 'Hypertensive heart disease with heart failure' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── Pulmonology
  {
    id: 'pulmonology',
    label: 'Pulmonology',
    subLabel: 'COPD exacerbation with bacterial infection',
    note: [
      {
        heading: 'Chief Complaint',
        text: 'Worsening cough and shortness of breath for 4 days.',
      },
      {
        heading: 'History of Present Illness',
        text: '68F with severe COPD (FEV1 35%) and a 40-pack-year smoking history, on tiotropium daily and albuterol PRN, reports increased sputum production with yellow-green color, wheezing, and progressive dyspnea. Denies fever, chest pain, hemoptysis.',
      },
      {
        heading: 'Exam',
        text: 'T 37.8°C, HR 110, RR 26, SpO2 88% on room air. Diffuse expiratory wheezing, prolonged expiratory phase. Accessory muscle use at rest. No crackles.',
      },
      {
        heading: 'Assessment & Plan',
        text: 'Acute exacerbation of COPD with likely bacterial infection. Started azithromycin 500 mg, prednisone 40 mg taper, duoneb every 4 hours, supplemental O2 to maintain SpO2 ≥ 90%.',
      },
    ],
    codes: [
      {
        code: 'J44.1',
        description: 'Chronic obstructive pulmonary disease with (acute) exacerbation',
        confidence: 0.95,
        concepts: [
          { label: 'wheezing', activation: 0.94 },
          { label: 'productive_cough', activation: 0.92 },
          { label: 'dyspnea', activation: 0.89 },
          { label: 'accessory_muscle_use', activation: 0.85 },
          { label: 'hypoxia', activation: 0.83 },
          { label: 'sputum_change', activation: 0.79 },
        ],
        evidence: [
          'increased sputum production with yellow-green color',
          'wheezing',
          'progressive dyspnea',
          'Acute exacerbation of COPD',
        ],
        alternatives: [
          { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
          { code: 'J44.0', description: 'COPD with (acute) lower respiratory infection' },
        ],
      },
      {
        code: 'F17.210',
        description: 'Nicotine dependence, cigarettes, uncomplicated',
        confidence: 0.83,
        concepts: [
          { label: 'smoking_history', activation: 0.94 },
          { label: 'tobacco_use', activation: 0.88 },
        ],
        evidence: ['40-pack-year smoking history'],
        alternatives: [
          { code: 'Z87.891', description: 'Personal history of nicotine dependence' },
        ],
      },
      {
        code: 'J96.91',
        description: 'Respiratory failure, unspecified, with hypoxia',
        confidence: 0.68,
        concepts: [
          { label: 'hypoxia', activation: 0.86 },
          { label: 'accessory_muscle_use', activation: 0.74 },
          { label: 'tachypnea', activation: 0.71 },
        ],
        evidence: ['SpO2 88% on room air', 'Accessory muscle use at rest', 'RR 26'],
        alternatives: [
          { code: 'R09.02', description: 'Hypoxemia' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── ED admission
  {
    id: 'ed',
    label: 'ED admission',
    subLabel: 'NSTEMI with multiple comorbidities',
    note: [
      {
        heading: 'Chief Complaint',
        text: 'Substernal chest pressure for 2 hours.',
      },
      {
        heading: 'History of Present Illness',
        text: '58M presents with 2 hours of substernal chest pressure radiating to the left arm, associated with diaphoresis and nausea. Pain 7/10, partially relieved with rest. PMH significant for HTN, type 2 diabetes, and hyperlipidemia. Family history of CAD in father at age 55.',
      },
      {
        heading: 'Exam',
        text: 'BP 168/95, HR 88, afebrile. Diaphoretic and uncomfortable-appearing. Lungs clear. Heart regular without murmur. EKG shows ST depression in V4–V6.',
      },
      {
        heading: 'Labs',
        text: 'Troponin I 0.08 ng/mL (elevated). Glucose 184. Total cholesterol 248. HbA1c 7.6%.',
      },
      {
        heading: 'Assessment & Plan',
        text: 'Non-ST elevation myocardial infarction. Started aspirin 325 mg, atorvastatin 80 mg, heparin drip. Cardiology consulted, plan for cardiac catheterization.',
      },
    ],
    codes: [
      {
        code: 'I21.4',
        description: 'Non-ST elevation (NSTEMI) myocardial infarction',
        confidence: 0.96,
        concepts: [
          { label: 'chest_pain', activation: 0.95 },
          { label: 'troponin_elevation', activation: 0.94 },
          { label: 'st_depression', activation: 0.92 },
          { label: 'radiation_left_arm', activation: 0.86 },
          { label: 'diaphoresis', activation: 0.82 },
        ],
        evidence: [
          'substernal chest pressure radiating to the left arm',
          'Troponin I 0.08 ng/mL',
          'ST depression in V4–V6',
          'Non-ST elevation myocardial infarction',
        ],
        alternatives: [
          { code: 'I20.0', description: 'Unstable angina' },
          { code: 'I24.9', description: 'Acute ischemic heart disease, unspecified' },
        ],
      },
      {
        code: 'E11.9',
        description: 'Type 2 diabetes mellitus without complications',
        confidence: 0.88,
        concepts: [
          { label: 'diabetes', activation: 0.91 },
          { label: 'hyperglycemia', activation: 0.78 },
          { label: 'elevated_a1c', activation: 0.75 },
        ],
        evidence: ['type 2 diabetes', 'HbA1c 7.6%', 'Glucose 184'],
        alternatives: [
          { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
        ],
      },
      {
        code: 'E78.5',
        description: 'Hyperlipidemia, unspecified',
        confidence: 0.84,
        concepts: [
          { label: 'dyslipidemia', activation: 0.88 },
          { label: 'elevated_cholesterol', activation: 0.82 },
        ],
        evidence: ['hyperlipidemia', 'Total cholesterol 248'],
        alternatives: [
          { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
        ],
      },
      {
        code: 'I10',
        description: 'Essential (primary) hypertension',
        confidence: 0.78,
        concepts: [
          { label: 'elevated_blood_pressure', activation: 0.84 },
          { label: 'hypertension_history', activation: 0.79 },
        ],
        evidence: ['HTN', 'BP 168/95'],
        alternatives: [],
      },
    ],
  },
];
