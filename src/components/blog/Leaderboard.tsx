import type { ReactNode } from 'react';
import { ENSEMBLES, LEADERBOARD, type ExplanationKind, type LeaderboardEntry } from '../../data/codingLeaderboard';
import { Inline, SmartLink } from './Inline';
import {
  BLEED,
  CELL_BG,
  CaptionText,
  FOCUS_RING,
  FoldOnPhone,
  HIGHLIGHT_BG,
  SCROLL_CUE,
  SwipeHint,
  WARM_INK,
} from './ui';

/**
 * The ranked MIMIC-IV ICD-10 full-code table and the ensembles panel, both
 * rendered from src/data/codingLeaderboard.ts. Phones: the table scrolls
 * inside its own container (shadow cue at the edge, model column sticky) and
 * the per-model notes fold under "Table notes".
 */

type NumKey = 'microF1' | 'macroF1' | 'microAuc' | 'macroAuc' | 'p8' | 'p15' | 'rPrec' | 'map';
type Col = { key: NumKey; label: string; full: string };
type Group = { label: string; full: string; cols: Col[] };

const GROUPS: Group[] = [
  {
    label: 'F1',
    full: 'F1',
    cols: [
      { key: 'microF1', label: 'Micro', full: 'Micro-F1' },
      { key: 'macroF1', label: 'Macro', full: 'Macro-F1' },
    ],
  },
  {
    label: 'AUROC',
    full: 'AUROC',
    cols: [
      { key: 'microAuc', label: 'Micro', full: 'Micro-AUROC' },
      { key: 'macroAuc', label: 'Macro', full: 'Macro-AUROC' },
    ],
  },
  {
    label: 'Ranking',
    full: 'Ranking metrics',
    cols: [
      { key: 'p8', label: 'P@8', full: 'Precision at 8' },
      { key: 'p15', label: 'P@15', full: 'Precision at 15' },
      { key: 'rPrec', label: 'R-prec', full: 'R-precision' },
      { key: 'map', label: 'MAP', full: 'Mean average precision' },
    ],
  },
];

const ALL_COLS = GROUPS.flatMap((g) => g.cols);

const EXPLANATION: Record<ExplanationKind, string> = {
  concepts: 'Concepts',
  attention: 'Attention',
  none: 'None',
};

const fmt = (v: number) => v.toFixed(1);
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

/** "preprint" / "under review" for rows that are not peer reviewed, null otherwise. */
function reviewMarker(row: LeaderboardEntry): string | null {
  if (row.peerReviewed) return null;
  return /under review/i.test(row.venue) ? 'under review' : 'preprint';
}

/** The venue without the words the marker already says ("arXiv preprint, 2025" -> "arXiv 2025"). */
function venueText(row: LeaderboardEntry, marker: string | null): string {
  if (!marker) return row.venue;
  return row.venue
    .replace(new RegExp(`\\s*${marker},?`, 'i'), '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// From sm the cells tighten to 6px so the ranked table fits the 44rem reading column.
const TH_BASE = 'px-2 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-muted sm:px-1.5';
const TD_NUM = 'px-2 py-2 text-right tabular-nums sm:px-1.5';

function NotReported() {
  return (
    <>
      <span aria-hidden className="text-muted">n/r</span>
      <span className="sr-only">not reported</span>
    </>
  );
}

function TableShell({
  label,
  minWidth,
  children,
}: {
  label: string;
  minWidth: string;
  children: ReactNode;
}) {
  return (
    <div className={BLEED}>
      {/* `relative` makes the scroller the containing block of the sr-only
          (position: absolute) spans in the cells; without it they escape the
          overflow clip and widen the page on phones. */}
      <div
        role="region"
        aria-label={`${label} (scrolls sideways)`}
        tabIndex={0}
        className={`relative overflow-x-auto overscroll-x-contain border-y border-subtle sm:rounded-2xl sm:border ${FOCUS_RING}`}
        style={SCROLL_CUE}
      >
        <table className={`w-full border-collapse text-left text-[0.78rem] sm:text-[0.8rem] ${minWidth}`}>{children}</table>
      </div>
    </div>
  );
}

function GroupedHead({ lead, tail }: { lead: ReactNode[]; tail: ReactNode[] }) {
  return (
    <thead>
      <tr className="border-b border-subtle">
        {lead}
        {GROUPS.map((g) => (
          <th key={g.label} scope="colgroup" colSpan={g.cols.length} className={`${TH_BASE} text-center`}>
            <span aria-hidden>{g.label}</span>
            <span className="sr-only">{g.full}</span>
          </th>
        ))}
        {tail}
      </tr>
      <tr className="border-b border-strong">
        {ALL_COLS.map((c) => (
          <th key={c.key} scope="col" className={`${TH_BASE} whitespace-nowrap text-right normal-case tracking-normal`}>
            <span aria-hidden>{c.label}</span>
            <span className="sr-only">{c.full}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function Leaderboard({ caption, note, lead }: { caption: string; note?: string; lead?: string }) {
  const rows = [...LEADERBOARD].sort((a, b) => b.microF1 - a.microF1);

  const best = {} as Record<NumKey, number>;
  for (const c of ALL_COLS) {
    const values = rows.map((r) => r[c.key]).filter((v): v is number => v !== null);
    best[c.key] = Math.max(...values);
  }

  // Footnote numbers (per-model notes) and letters (extra training data), in row order.
  const noteNo = new Map<string, number>();
  const extraLetter = new Map<string, string>();
  for (const r of rows) {
    if (r.note) noteNo.set(r.model, noteNo.size + 1);
    if (r.extraData) extraLetter.set(r.model, LETTERS[extraLetter.size] ?? '*');
  }

  const stickyHead = 'sticky left-0 z-[2]';

  return (
    <figure>
      <figcaption className="mb-2 text-pretty text-[0.8rem] leading-snug text-secondary sm:mb-3 sm:text-[0.86rem]">
        <CaptionText lead={lead}>
          <Inline text={caption} />
        </CaptionText>
      </figcaption>
      <SwipeHint />
      <TableShell label={lead ? `${lead} Leaderboard` : 'Leaderboard'} minWidth="min-w-[42rem]">
        <caption className="sr-only">
          Published results on the MIMIC-IV ICD-10 full-code benchmark, ranked by micro-F1. Percent; n/r means not
          reported.
        </caption>
        <colgroup>
          <col />
          <col />
        </colgroup>
        {GROUPS.map((g) => (
          <colgroup key={g.label} span={g.cols.length} />
        ))}
        <colgroup>
          <col />
          <col />
        </colgroup>
        <GroupedHead
          lead={[
            <th key="rank" scope="col" rowSpan={2} className={`${TH_BASE} w-8 text-right`}>
              <span aria-hidden>#</span>
              <span className="sr-only">Rank</span>
            </th>,
            <th
              key="model"
              scope="col"
              rowSpan={2}
              className={`${TH_BASE} ${stickyHead} border-r border-subtle`}
              style={{ background: CELL_BG }}
            >
              Model
            </th>,
          ]}
          tail={[
            <th key="expl" scope="col" rowSpan={2} className={`${TH_BASE} w-[4.5rem] leading-tight`}>
              Explained by
            </th>,
            <th key="extra" scope="col" rowSpan={2} className={`${TH_BASE} w-[3rem] leading-tight`}>
              Extra data
            </th>,
          ]}
        />
        <tbody>
          {rows.map((row, i) => {
            const marker = reviewMarker(row);
            const venue = venueText(row, marker);
            const n = noteNo.get(row.model);
            const letter = extraLetter.get(row.model);
            const bg = row.ours ? HIGHLIGHT_BG : undefined;
            return (
              <tr key={row.model} className="border-b border-subtle last:border-b-0" style={{ background: bg }}>
                <td
                  className="px-2 py-2 text-right tabular-nums text-muted sm:px-1.5"
                  style={row.ours ? { boxShadow: 'inset 3px 0 0 var(--accent)' } : undefined}
                >
                  {i + 1}
                </td>
                <th
                  scope="row"
                  className={`sticky left-0 z-[1] min-w-[9.5rem] max-w-[12rem] border-r border-subtle px-2 py-2 font-normal sm:max-w-none sm:px-1.5`}
                  style={{ background: bg ?? CELL_BG }}
                >
                  <span className="whitespace-nowrap">
                    <SmartLink
                      url={row.url}
                      className={`rounded-sm font-semibold transition-colors hover:underline ${
                        row.ours ? 'text-accent' : 'text-primary'
                      }`}
                    >
                      {row.model}
                    </SmartLink>
                    {n && (
                      <sup className="relative top-[-0.35em] ml-0.5 align-baseline text-[0.7em]">
                        <SmartLink
                          url={`#lb-note-${n}`}
                          ariaLabel={`Note ${n}`}
                          className="rounded-sm px-[0.1em] text-accent no-underline hover:underline"
                        >
                          {n}
                        </SmartLink>
                      </sup>
                    )}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.68rem] leading-tight text-muted sm:text-[0.7rem]">
                    {venue && <span>{venue}</span>}
                    {marker && (
                      <span
                        className={`rounded-full border px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.06em] ${WARM_INK}`}
                        style={{
                          borderColor: 'color-mix(in oklab, var(--warm-ink) 45%, transparent)',
                          color: 'var(--warm-ink)',
                        }}
                      >
                        {marker}
                      </span>
                    )}
                  </span>
                </th>
                {ALL_COLS.map((c) => {
                  const v = row[c.key];
                  const isBest = v !== null && v === best[c.key];
                  return (
                    <td key={c.key} className={`${TD_NUM} ${isBest ? 'font-bold text-primary' : 'text-secondary'}`}>
                      {v === null ? <NotReported /> : fmt(v)}
                      {isBest && <span className="sr-only"> (best)</span>}
                    </td>
                  );
                })}
                <td className={`whitespace-nowrap px-2 py-2 sm:px-1.5 ${row.ours ? 'font-semibold text-accent' : 'text-secondary'}`}>
                  {EXPLANATION[row.explanation]}
                </td>
                <td className="whitespace-nowrap px-2 py-2 sm:px-1.5">
                  {letter ? (
                    <span title={row.extraData} className="text-secondary">
                      Yes
                      <sup className="relative top-[-0.35em] ml-0.5 align-baseline text-[0.7em]">
                        <SmartLink
                          url={`#lb-extra-${letter}`}
                          ariaLabel={`Extra data note ${letter}`}
                          className="rounded-sm px-[0.1em] text-accent no-underline hover:underline"
                        >
                          {letter}
                        </SmartLink>
                      </sup>
                    </span>
                  ) : (
                    <>
                      <span aria-hidden className="text-muted">–</span>
                      <span className="sr-only">none</span>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableShell>

      <div className="mt-2 text-[0.74rem] leading-relaxed text-muted sm:mt-3 sm:text-[0.78rem]">
        <p>
          Ranked by micro-F1. Percent; <strong className="font-semibold text-secondary">bold</strong> is the best value
          in each column; n/r is not reported.
          {note && (
            <>
              {' '}
              <Inline text={note} />
            </>
          )}
        </p>
        <FoldOnPhone
          className="mt-1 sm:mt-2"
          summaryClassName="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-secondary"
          summary={<span>Table notes</span>}
        >
          <div className="grid gap-x-8 gap-y-2 pb-1 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <ol aria-label="Notes" className="space-y-1">
              {rows
                .filter((r) => r.note)
                .map((r) => {
                  const k = noteNo.get(r.model)!;
                  return (
                    <li key={r.model} id={`lb-note-${k}`} className="flex scroll-mt-3 gap-1.5 sm:scroll-mt-28">
                      <span className="w-3 shrink-0 text-right font-semibold text-accent">{k}</span>
                      <span>
                        <span className="font-medium text-secondary">{r.model}:</span> <Inline text={r.note!} />
                      </span>
                    </li>
                  );
                })}
            </ol>
            <div>
              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-secondary">
                Extra training data
              </div>
              <ul className="mt-1 space-y-1">
                {rows
                  .filter((r) => r.extraData)
                  .map((r) => {
                    const k = extraLetter.get(r.model)!;
                    return (
                      <li key={r.model} id={`lb-extra-${k}`} className="flex scroll-mt-3 gap-1.5 sm:scroll-mt-28">
                        <span className="w-3 shrink-0 text-right font-semibold text-accent">{k}</span>
                        <span>
                          <span className="font-medium text-secondary">{r.model}:</span> {r.extraData}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </FoldOnPhone>
      </div>
    </figure>
  );
}

const ENSEMBLE_COLS: { key: 'microF1' | 'macroF1' | 'microAuc' | 'macroAuc' | 'p8' | 'p15'; label: string; full: string }[] = [
  { key: 'microF1', label: 'Micro-F1', full: 'Micro-F1' },
  { key: 'macroF1', label: 'Macro-F1', full: 'Macro-F1' },
  { key: 'microAuc', label: 'Micro-AUROC', full: 'Micro-AUROC' },
  { key: 'macroAuc', label: 'Macro-AUROC', full: 'Macro-AUROC' },
  { key: 'p8', label: 'P@8', full: 'Precision at 8' },
  { key: 'p15', label: 'P@15', full: 'Precision at 15' },
];

/** Ensembles, reported apart from the ranked table, each with its note. */
export function Ensembles({ caption, note, lead }: { caption: string; note?: string; lead?: string }) {
  return (
    <figure>
      <figcaption className="mb-2 text-pretty text-[0.8rem] leading-snug text-secondary sm:mb-3 sm:text-[0.86rem]">
        <CaptionText lead={lead}>
          <Inline text={caption} />
        </CaptionText>
      </figcaption>
      <SwipeHint />
      <TableShell label={lead ? `${lead} Ensembles` : 'Ensembles'} minWidth="min-w-[36rem]">
        <caption className="sr-only">Ensemble systems on the same benchmark, reported apart from the ranked table. Percent.</caption>
        <thead>
          <tr className="border-b border-strong">
            <th scope="col" className={`${TH_BASE} sticky left-0 z-[2] border-r border-subtle`} style={{ background: CELL_BG }}>
              Ensemble
            </th>
            {ENSEMBLE_COLS.map((c) => (
              <th key={c.key} scope="col" className={`${TH_BASE} whitespace-nowrap text-right normal-case tracking-normal`}>
                <span aria-hidden>{c.label}</span>
                <span className="sr-only">{c.full}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ENSEMBLES.map((e) => (
            <tr key={e.model} className="border-b border-subtle last:border-b-0">
              <th
                scope="row"
                className="sticky left-0 z-[1] min-w-[9.5rem] border-r border-subtle px-2 py-2 font-normal sm:min-w-[11rem] sm:px-2.5"
                style={{ background: CELL_BG }}
              >
                <SmartLink url={e.url} className="rounded-sm font-semibold text-primary transition-colors hover:underline">
                  {e.model}
                </SmartLink>
                <span className="mt-0.5 block text-[0.68rem] leading-tight text-muted sm:text-[0.7rem]">
                  {e.authors} · {e.venue}
                </span>
              </th>
              {ENSEMBLE_COLS.map((c) => (
                <td key={c.key} className={`${TD_NUM} text-secondary`}>
                  {fmt(e[c.key])}
                  {c.key === 'macroF1' && (
                    <>
                      <span aria-hidden className="text-accent">*</span>
                      <span className="sr-only"> (different formula, see note)</span>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </TableShell>
      <div className="mt-2 space-y-1.5 text-[0.74rem] leading-relaxed text-muted sm:mt-3 sm:text-[0.78rem]">
        {ENSEMBLES.map((e) => (
          <p key={e.model}>
            <span className="text-accent">*</span> <span className="font-medium text-secondary">{e.model}:</span>{' '}
            <Inline text={e.note} />
          </p>
        ))}
        {note && (
          <p>
            <Inline text={note} />
          </p>
        )}
      </div>
    </figure>
  );
}

