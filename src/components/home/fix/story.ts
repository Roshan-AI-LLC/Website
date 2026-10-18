/**
 * The one clinical story every "fix" visual tells, and its illustrative
 * numbers. Scores are kept in hundredths so every displayed total is an exact
 * sum of its displayed parts (no floating-point drift, no rounding gaps).
 *
 * Everything in this file is illustrative, and the window that shows it is
 * labelled so.
 */

export const CODES = {
  i5023: { code: 'I50.23', name: 'Acute on chronic systolic HF' },
  j918: { code: 'J91.8', name: 'Pleural effusion in other conditions' },
  i5022: { code: 'I50.22', name: 'Chronic systolic HF' },
} as const;

/**
 * The itemize step: I50.23's score, itemized. 41 + 22 + 17 + 14 = 94. The
 * documented systolic HF carries the most, as a coder would expect; the
 * new congestion findings make it acute on chronic.
 */
export const I5023_PARTS = [
  { concept: 'systolic HF', cents: 41 },
  { concept: 'leg edema', cents: 22 },
  { concept: 'BNP elevation', cents: 17 },
  { concept: 'orthopnea', cents: 14 },
] as const;

export const I5023_CENTS = I5023_PARTS.reduce((sum, p) => sum + p.cents, 0);

/** The override step: pleural effusion carries 73 of J91.8's 81, so negating it leaves 8. */
export const J918_CENTS = { affirmed: 81, effusion: 73 } as const;
export const J918_NEGATED_CENTS = J918_CENTS.affirmed - J918_CENTS.effusion;
export const I5022_CENTS = 31;

export const cents = (c: number) => (c / 100).toFixed(2);
