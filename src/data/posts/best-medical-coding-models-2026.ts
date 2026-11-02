import type { BlogPost } from '../blog';
import { CONTACT_EMAIL, REQUEST_ACCESS_URL } from '../../lib/config';

/**
 * Benchmark review of medical coding models, November 2026.
 *
 * Every number is copied from a primary source listed in `references` (or,
 * for ShifaMind, from its full-code paper under review, hosted at
 * /papers/shifamind.pdf). Nothing was re-run. The ranked table and the
 * ensembles panel render from codingLeaderboard.ts.
 */
export const BEST_MEDICAL_CODING_MODELS_2026: BlogPost = {
  slug: 'best-medical-coding-models-2026',
  title: 'Best Medical Coding AI Models in 2026: A Benchmark Review',
  seoTitle: 'Best Medical Coding AI 2026: ICD-10 Benchmark',
  description: `The best medical coding AI models of 2026 on the MIMIC-IV ICD-10 full-code benchmark: who leads each metric, how LLMs fare, and the best explainable model.`,
  dek: `The medical coding model that shows its math. ShifaMind posts the top micro-F1 among the models ranked here on the MIMIC-IV ICD-10 full-code benchmark, and it is the only published ICD coding model whose every predicted code is an exact sum of contributions from named clinical concepts found in the note. State-of-the-art accuracy, best-in-class explainability. Here is the field, including where others lead.`,
  date: '2026-11-01',
  author: { name: 'Mohammed Sameer Syed', role: 'Founder, Roshan AI', href: '/company/team' },
  kind: 'Research',
  image: '/blog/best-medical-coding-models-2026/og.png',
  tags: ['Medical coding', 'ICD-10', 'Benchmarks', 'MIMIC-IV', 'Explainable AI', 'LLMs'],
  takeaways: [
    `As of November 2026, ShifaMind ranks #1 by micro-F1 among the [models ranked here](#inclusion-criteria) on the MIMIC-IV ICD-10 full-code benchmark: 60.6 (trained with extra MIMIC-IV ICD-9 notes), ahead of TraceCoder (60.0) and JAMS + PLM-ICD (59.8) [^shifamind2026][^ren2025][^jeong2024].`,
    `No model leads every metric: DualLAAT has the best macro-F1 (29.9, the rare-code measure), PLANT and DualLAAT the best AUROC, and PLANT the best precision at 8 [^liu2026][^sahaRoy2025].`,
    `ShifaMind is also the best explainable model on this benchmark: the only published ICD coding model whose every predicted code is an exact sum of contributions from named clinical concepts found in the note.`,
    `Prompted small LLMs score 0.1 to 3.0 micro-F1 on this benchmark; the post-trained 4B PHI reaches 58.7, and the 7B PLANT, used as a classifier, 59.2 [^wang2026phi][^sahaRoy2025].`,
    `No commercial vendor publishes results on this benchmark, so vendor-reported 95% to 98% accuracy figures cannot be ranked against these models or each other.`,
  ],
  blocks: [
    { type: 'h2', id: 'abstract', text: 'Abstract' },
    {
      type: 'p',
      text: `Medical coding AI turns a clinical note into billing codes. Buyers hear accuracy of 95% to 98%; papers report micro-F1 near 60. Both can be true, because they measure different things. This review compiles published results, as of November 1, 2026, on the field's shared test, the MIMIC-IV ICD-10 full-code benchmark [^edin2023]: 13 ranked models, from 2018-era convolutional networks to 7B LLM backbones.`,
    },
    {
      type: 'p',
      text: `ShifaMind, built by Roshan AI, ranks #1 by micro-F1 (60.6) among the models ranked here on MIMIC-IV ICD-10 full-code, and also leads on R-precision and MAP [^shifamind2026]. It is the only published ICD coding model whose every predicted code is an exact sum of contributions from named clinical concepts found in the note, which makes it the best explainable model on this benchmark. Like JAMS and DualLAAT, its headline run adds MIMIC-IV ICD-9 training notes, and its paper is under review.`,
    },

    { type: 'h2', id: 'benchmark', text: 'The benchmark' },
    { type: 'h3', id: 'dataset-and-splits', text: 'Dataset and splits' },
    {
      type: 'p',
      text: `Since 2023 the reference test has been the MIMIC-IV ICD-10 split of Edin et al. [^edin2023]: deidentified MIMIC-IV-Note discharge summaries [^johnson2023note][^johnson2023] of emergency department or ICU patients at Beth Israel Deaconess Medical Center, 2008 to 2019.`,
    },
    {
      type: 'table',
      id: 'benchmark-facts',
      caption: 'The MIMIC-IV ICD-10 full-code benchmark at a glance',
      columns: ['Property', 'Value'],
      rows: [
        ['Documents', '122,279 discharge summaries, 65,659 patients'],
        ['Codes', `7,942 ICD-10-CM and ICD-10-PCS (7,940 in ShifaMind's join)`],
        ['Codes per note', 'Median 14 (interquartile range 9 to 20)'],
        ['Words per note', 'Median 1,492'],
        ['Split', '72.9% train, 10.9% validation, 16.2% test; patient-disjoint'],
        ['Test set', '19,799 notes, 314,100 gold (note, code) pairs'],
        ['Threshold', 'One per model, tuned on validation (not always stated)'],
      ],
      note: 'Sources: Edin et al. (2023), Table 1 and Section 3; test-set note and pair counts from the ShifaMind paper.',
    },
    { type: 'h3', id: 'metrics', text: 'Metrics' },
    {
      type: 'p',
      text: 'We omit exact match ratio, under 1% for every model that reports it.',
    },
    {
      type: 'table',
      id: 'metric-definitions',
      caption: 'The metrics in this review',
      columns: ['Metric', 'What it measures'],
      rows: [
        ['Micro-F1', 'F1 over all (note, code) decisions pooled'],
        ['Macro-F1', 'Mean per-code F1; rare codes count equally'],
        ['Micro- and macro-AUROC', 'Right codes ranked above wrong ones; near ceiling'],
        ['Precision at 8 and 15', `Share of a note's top 8 or 15 codes that are right`],
        ['R-precision', `Precision at k, with k = the note's number of gold codes`],
        ['MAP', `Precision at each gold code's rank, averaged`],
      ],
    },
    {
      type: 'formula',
      text: 'P = ΣTP / (ΣTP + ΣFP)     R = ΣTP / (ΣTP + ΣFN)     micro-F1 = 2·P·R / (P + R)',
      caption: 'Micro-F1 pools every (note, code) decision before computing precision and recall, so frequent codes carry most of the weight.',
    },
    {
      type: 'p',
      text: `Some papers compute macro-F1 from averaged precision and recall, which never reads lower than the per-code mean used here [^edin2023][^shifamind2026].`,
    },
    { type: 'h3', id: 'headline-metric', text: 'Why micro-F1' },
    {
      type: 'p',
      text: `We rank by micro-F1 because Edin et al.'s protocol tunes thresholds to maximize it, most papers lead with it, and it counts each code decision once. About 60 is strong: in Edin et al.'s reproduction, PLM-ICD reached 58.5 and never correctly predicted 51.8% of diagnosis codes [^edin2023]. Scores in the 70s usually come from the easier top-50 code setting.`,
    },
    { type: 'h3', id: 'inclusion-criteria', text: 'What we included' },
    {
      type: 'list',
      items: [
        `Results on the Edin et al. MIMIC-IV ICD-10 full-code splits, copied from each source's results table; we re-ran nothing.`,
        'Macro-F1 compared only where papers use, or appear to use, the per-code mean.',
        'Posted by November 1, 2026, including preprints and, for ShifaMind, a manuscript under review.',
        'One row per system at its headline configuration; ensembles of several trained models appear at the end.',
      ],
    },
    {
      type: 'callout',
      tone: 'warn',
      title: 'Why some higher numbers are not comparable',
      items: [
        `**MIMIC-III, an older ICD-9 dataset (micro-F1):** GKI-ICD (61.2) [^zhang2025gki], ACE-ICD (62.7) [^le2025ace], NoteContrast (60.7) [^kailas2023], LTR-ICD (60.65) [^mansoori2026].`,
        `**The 26K-code MIMIC-IV setting** [^nguyen2023]: CoLa-ICD (60.0) [^cheng2026cola] and CoRelation [^luo2024corelation] use a different split and label set.`,
        `**Qiu et al. (2026), 67.5:** diagnosis codes only, on the authors' own split without patient grouping [^qiu2026].`,
        `**MIMIC-IV ICD-9:** TraceCoder's 63.7 and JAMS's 62.8 are not ICD-10 scores [^ren2025][^jeong2024].`,
      ],
    },

    { type: 'h2', id: 'leaderboard', text: 'Leaderboard' },
    {
      type: 'p',
      text: `The table ranks 13 models by micro-F1.`,
    },
    {
      type: 'p',
      text: `Watch the extra-data column: the top three all use resources beyond the ICD-10 training notes. ShifaMind and JAMS add ICD-9-coded notes; TraceCoder adds UMLS, Wikipedia and LLM-written descriptions, and ShifaMind's concept vocabulary is LLM-written and grounded in UMLS.`,
    },
    {
      type: 'leaderboard',
      caption: `MIMIC-IV ICD-10 full-code benchmark (Edin et al. splits), test set, percent, sorted by micro-F1. Compiled from each paper's own results table as of November 1, 2026; none re-run.`,
      note: 'ShifaMind: three-run mean, manuscript under review. Edin et al. rows: ten-seed reproductions, with seed standard deviations up to 0.9 (2.3 for PLM-ICD macro-F1). Several newer papers report no variance.',
    },
    {
      type: 'figure',
      figure: 'micro-f1-bars',
      caption: 'Micro-F1 on MIMIC-IV ICD-10 full-code, sorted from highest, ShifaMind highlighted. The top four models sit within 1.0 point of each other.',
    },
    {
      type: 'figure',
      figure: 'micro-macro-scatter',
      caption: 'Micro-F1 (dominated by common codes) against macro-F1 (every code weighted equally). ShifaMind leads on micro-F1; DualLAAT leads on macro-F1, with TraceCoder second.',
    },
    { type: 'h3', id: 'reading-the-table', text: 'Reading the table' },
    {
      type: 'p',
      text: `**Where ShifaMind leads.** Among the models ranked here on MIMIC-IV ICD-10 full-code, ShifaMind is #1 by micro-F1 (60.6); among those reporting them, it also has the highest R-precision (60.1) and MAP (64.2) [^shifamind2026].`,
    },
    {
      type: 'p',
      text: `**Where others lead.** DualLAAT has the best macro-F1 (29.9), followed by TraceCoder (27.7) and ShifaMind (26.8) [^liu2026][^ren2025]. PLANT has the best micro-AUROC (99.5), shares the best macro-AUROC (97.4) with DualLAAT, and leads precision at 8 and 15 [^sahaRoy2025].`,
    },
    {
      type: 'p',
      text: `**Margins.** The 0.6-point lead over TraceCoder is the highest reported number, not a significance result. Over PLM-ICD, the most-cited baseline, the margin is 2.1 micro-F1 and 5.7 macro-F1 [^shifamind2026].`,
    },
    {
      type: 'table',
      id: 'metric-leaders',
      caption: 'Who leads each metric on MIMIC-IV ICD-10 full-code (ranked models)',
      columns: ['Metric', 'Leader', 'Leader score', 'ShifaMind'],
      rows: [
        ['Micro-F1', 'ShifaMind', '60.6', '60.6'],
        ['Macro-F1', 'DualLAAT', '29.9', '26.8'],
        ['Micro-AUROC', 'PLANT', '99.5', '99.2'],
        ['Macro-AUROC', 'PLANT, DualLAAT', '97.4', '96.7'],
        ['Precision at 8', 'PLANT', '72.1', '71.8'],
        ['Precision at 15', 'PLANT', '56.9', '56.8'],
        ['R-precision', 'ShifaMind', '60.1', '60.1'],
        ['MAP', 'ShifaMind', '64.2', '64.2'],
      ],
      numeric: [2, 3],
      highlight: [0, 6, 7],
    },

    { type: 'h2', id: 'model-profiles', text: 'Model profiles', collapsible: true },
    { type: 'h3', id: 'profile-shifamind', text: 'ShifaMind (under review)' },
    {
      type: 'p',
      text: `A concept-mediated coder: each code's score is its bias plus an exact sum of signed contributions from named clinical concepts in the note ([details below](#shows-its-math)) [^shifamind2026]. See the [paper](/papers/shifamind.pdf) and [product page](/products/shifamind).`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/shifamind-concept-mediation.webp',
      width: 1290,
      height: 507,
      alt: 'Network sketch in which note tokens pass through encoder layers into five named concepts, such as orthopnea and pleural effusion, each showing a gate value near 1.0. The concepts connect to three ICD codes scored 0.94, 0.81 and 0.31.',
      caption: `Concept mediation at a glance: evidence in the note reaches each ICD-10 code only through named concepts, each shown with its gate. Values are illustrative.`,
      credit: `Figure 3 from the ShifaMind paper [^shifamind2026].`,
    },
    {
      type: 'p',
      text: `**Watch-out:** its headline run adds MIMIC-IV ICD-9 notes; on ICD-10 notes alone it scores 59.7 micro-F1 and 25.7 macro-F1 (three-run means).`,
    },
    { type: 'h3', id: 'profile-tracecoder', text: 'TraceCoder (BIBM 2025)' },
    {
      type: 'p',
      text: `Enriches each code with UMLS, Wikipedia and LLM-written knowledge, with hybrid attention that traces predictions to it; trained on ICD-10 notes only [^ren2025]. **Watch-out:** no seed count or variance reported.`,
    },
    { type: 'h3', id: 'profile-jams', text: 'JAMS + PLM-ICD (2024)' },
    {
      type: 'p',
      text: `Trains one encoder on ICD-9 and ICD-10 notes at once, linking the code systems through the General Equivalence Mappings; the PLM-ICD backbone is its strongest [^jeong2024]. **Watch-out:** three-seed means without variance, and no stated threshold protocol.`,
    },
    { type: 'h3', id: 'profile-plmca', text: 'PLM-CA (ACL 2025)' },
    {
      type: 'p',
      text: `Its entity-only variant codes from clinical entities alone, dropping negated and hypothetical mentions, which leaves about 22% of the text [^douglas2025]; the full-text PLM-CA in the table is stronger.`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/douglas2025-entity-pipeline.webp',
      width: 1131,
      height: 857,
      alt: 'Four-step flow diagram in which a short sample note with highlighted findings and disorders is cut down to a tagged entity list and passed to the PLM-CA model, which outputs ICD-10 code I25.110. The phrases that supported the code are then highlighted in the original note.',
      caption: `The entity-first pipeline: extract and filter clinical entities, code from the shorter entity-only note, then map the attributions back onto full spans in the original text.`,
      credit: `Figure 1 from Douglas et al. (2025) [^douglas2025], ACL 2025. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`,
      maxWidth: 560,
    },
    {
      type: 'p',
      text: `The entity-only variant scores 58.8 micro-F1 and 24.8 macro-F1 and more than halves training time. **Watch-out:** one training run, and the paper does not define its macro-F1.`,
    },
    { type: 'h3', id: 'profile-plant', text: 'PLANT (preprint)' },
    {
      type: 'p',
      text: `Initializes label attention from a pretrained learning-to-rank model and uses LLM backbones as classifiers, not text generators; its headline row is Mistral-7B, 4-bit with LoRA, reading up to 2,048 tokens [^sahaRoy2025].`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/plant-overview.webp',
      width: 1434,
      height: 522,
      alt: 'Diagram of the PLANT method. Label embeddings, keys and values go into a multi-head attention block that scores tokens for each label, and a ranking loss weighted by nDCG change penalizes token pairs ranked in the wrong order among the top tokens chosen by mutual information gain.',
      caption: `PLANT warms up label attention by teaching it to rank the most informative note tokens for each code, before ordinary fine-tuning begins.`,
      credit: `Figure 1 from Saha Roy et al. (2025) [^sahaRoy2025], arXiv:2410.23066v4. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`,
    },
    {
      type: 'p',
      text: `**Watch-out:** no stated threshold protocol, and two rows in its baseline table do not trace to this benchmark.`,
    },
    { type: 'h3', id: 'profile-duallaat', text: 'DualLAAT (BioNLP 2026)' },
    {
      type: 'p',
      text: `A compact label-wise attention model (37M parameters) trained on pooled ICD-9 and ICD-10 MIMIC notes; the ICD-9 data lifts its macro-F1 from 27.9 to 29.9 [^liu2026].`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/duallaat-overview.webp',
      width: 682,
      height: 724,
      alt: 'Three-panel overview showing ICD version drift next to a long-tailed code frequency histogram, then three MIMIC datasets (two ICD-9, one ICD-10) feeding a single DualLAAT model, then small bars of ICD-10 scores with and without added ICD-9 training data.',
      caption: `DualLAAT pools ICD-9 and ICD-10 MIMIC notes into one label-wise attention model; the added ICD-9 data helps most on rare codes.`,
      credit: `Figure 1 from Liu and Nguyen (2026) [^liu2026], BioNLP 2026. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`,
      maxWidth: 440,
    },
    {
      type: 'p',
      text: `**Watch-out:** the paper does not state its threshold protocol, and the authors disclose that one ICD-10 test patient also appears in their ICD-9 training data.`,
    },
    { type: 'h3', id: 'profile-phi', text: 'PHI (preprint)' },
    {
      type: 'p',
      text: `Qwen3-4B post-trained with supervised fine-tuning, reinforcement learning and Progressive Hint Injection; it writes codes as text, so it has no threshold or ranking scores [^wang2026phi]. **Watch-out:** the strongest generative LLM here, yet below the same authors' PLM-ICD retrain (59.6 micro-F1, 23.7 macro-F1).`,
    },
    { type: 'h3', id: 'profile-plm-icd', text: 'PLM-ICD (2022)' },
    {
      type: 'p',
      text: `The reference transformer coder: a biomedical RoBERTa with per-code label attention [^huang2022], quoted from Edin et al.'s ten-seed reproduction [^edin2023]. **Watch-out:** re-runs on the same split can differ by a point or more [^wang2026phi].`,
    },
    { type: 'h3', id: 'profile-laat-lineage', text: 'LAAT and earlier models' },
    {
      type: 'p',
      text: `LAAT [^vu2020] refined CAML's per-code attention [^mullenbach2018], and MultiResCNN extended CAML [^li2020]. Under Edin et al.'s protocol they score 57.9 (LAAT), 56.9 (MultiResCNN) and 55.4 (CAML) micro-F1 [^edin2023]. **Watch-out:** without pretrained transformers these are a floor, yet LAAT sits under three points from the top.`,
    },

    { type: 'h2', id: 'llms', text: 'LLMs as medical coders', collapsible: true },
    { type: 'h3', id: 'llms-same-setting', text: 'On the same benchmark' },
    {
      type: 'table',
      id: 'llms-edin-split',
      caption: 'Language models and encoders on MIMIC-IV ICD-10 full-code (Edin et al. splits), percent',
      columns: ['System', 'Type', 'Micro-F1', 'Macro-F1', 'Source'],
      rows: [
        ['Prompted Qwen2.5-1.5B and Qwen3-4B', 'Generative, no task training', '0.1 to 3.0', '0.0 to 0.2', 'Wang et al. 2026 [^wang2026phi]'],
        ['PHI (Qwen3-4B)', 'Generative, post-trained', '58.7', '21.2', 'Wang et al. 2026'],
        ['PLANT (Mistral-7B)', 'LLM as classifier', '59.2', '23.0', 'Saha Roy et al. 2025 [^sahaRoy2025]'],
        ['PLM-ICD, Wang et al. retrain', 'Encoder classifier', '59.6', '23.7', 'Wang et al. 2026'],
        ['ShifaMind', 'Concept-mediated encoder', '60.6', '26.8', 'Roshan AI 2026 [^shifamind2026]'],
      ],
      numeric: [2, 3],
      highlight: [4],
      note: `Wang et al. retrain their baselines on their own preprocessing, so their PLM-ICD row differs from Edin et al.'s 58.5.`,
    },
    {
      type: 'p',
      text: `Prompting alone fails at this scale, post-training closes most of the gap, and a 7B classifier backbone leads on AUROC and precision at k but not F1. No frontier LLM has a result on this split yet.`,
    },
    {
      type: 'figure',
      figure: 'params-vs-micro-f1',
      caption: `Parameter count (log scale) against micro-F1, for models with a known size; ShifaMind's ~190M is counted from its architecture, not printed in its paper. F1 rises with size among the small models, but past about 150M parameters size does not buy F1: the 4B and 7B models sit below ShifaMind, and the 37M-parameter DualLAAT is within 1.2 points of the 7B PLANT.`,
    },
    { type: 'h3', id: 'llms-other-settings', text: 'Other settings' },
    {
      type: 'table',
      id: 'llms-other-settings-table',
      caption: 'LLM coding results in other settings (not comparable to the leaderboard)',
      columns: ['Study', 'Setting', 'Result', 'Comparator'],
      rows: [
        ['ICDAgent (ACL 2026) [^yin2026]', '1,000-note sample, Nguyen et al. MIMIC-IV ICD-10 split [^nguyen2023]', 'Micro-F1: GPT-5-Chat 39.55, ICDAgent 46.73', 'CoRelation 49.97'],
        ['Vals AI MedCode (Oct 2026) [^vals2026]', '2,755 hospitalization records, ICD-10-CM diagnoses', 'Pass rate: Claude Opus 5 63.57%', 'General LLMs only'],
        ['Code Like Humans (EMNLP Findings 2025) [^motzfeldt2025]', 'MDACE test set, about 1,000 codes', 'Micro / macro F1: 43 / 28', 'PLM-ICD 48 / 25'],
        ['Yock et al. (2026 preprint) [^yock2026]', '150 MIMIC-IV notes by code rarity', 'Rare-code micro-F1: CodeSeeker 56.0', 'PLM-ICD 22.7'],
      ],
    },
    { type: 'h3', id: 'rare-codes', text: 'Rare codes' },
    {
      type: 'p',
      text: `In these studies, LLM agents that look codes up in the ICD index beat classifiers on rare codes and trail them on common ones. ICDAgent trails CoRelation by 3.2 micro-F1 but leads it by 9.1 macro-F1 [^yin2026]; PLM-ICD leads CodeSeeker on common codes, 65.6 to 60.7 [^yock2026]. Since rare codes are the weak flank of classifiers, ShifaMind included, this points toward hybrids: a classifier for frequent codes, an agent for the long tail.`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/code-like-humans-agents.webp',
      width: 683,
      height: 570,
      alt: 'A four-panel workflow diagram. An evidence extractor pulls conditions from a clinical note, an index navigator looks them up in the ICD-10 alphabetical index, a tabular validator assigns candidate codes, and a code reconciler produces the final code list.',
      caption: `An agentic coder works the way a human coder does: find the evidence, search the ICD-10 index, check the code hierarchy, then reconcile the final list.`,
      credit: `Figure 1 from Motzfeldt et al. (2025) [^motzfeldt2025], Findings of EMNLP 2025. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`,
      maxWidth: 480,
    },

    { type: 'h2', id: 'explainable', text: 'What “explainable” means', collapsible: true },
    {
      type: 'p',
      text: 'Nearly every product and paper here calls itself explainable, but the word covers five things, and only some describe how the code was produced.',
    },
    {
      type: 'table',
      id: 'explainability-taxonomy',
      caption: 'Five meanings of explainable in medical coding',
      columns: ['Approach', 'What a coder sees', 'Examples', 'Is the explanation the computation?'],
      rows: [
        ['Audit trail', 'Note excerpt, guideline, reviewer log', 'Many commercial products', 'Not shown: it records the decision, not the computation'],
        ['Evidence spans', 'Highlighted text per code', `Symphony [^edin2026symphony]; PLM-CA [^douglas2025]`, 'Not necessarily: spans can be found after the prediction'],
        ['Attention or attribution', 'Token weights per code', 'CAML, LAAT, PLM-ICD, TraceCoder, PLANT; AttInGrad [^edin2024]', 'Partly: where a model looked may not be what it used [^jain2019][^wiegreffe2019]'],
        ['Generated rationales', 'Free-text reasoning per code', 'ICDAgent [^yin2026]; Code Like Humans [^motzfeldt2025]', 'Not guaranteed: the text need not reflect the computation'],
        ['Concept-mediated', 'Named concepts whose signed contributions sum to the score', 'ShifaMind [^shifamind2026]', 'Yes for the arithmetic, checked every forward pass; gates are checked only against silver labels'],
      ],
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/edin2024-plm-ca-architecture.webp',
      width: 692,
      height: 752,
      alt: 'Architecture diagram. Input tokens go into a RoBERTa encoder that produces N token representations. C label representations attend to these tokens through a cross-attention layer, and a linear layer then gives one output score per label.',
      caption: `The standard attention design: one query per code attends over the encoder’s token states. Attribution methods such as AttInGrad turn these weights into highlighted text after the prediction is made.`,
      credit: `Figure 5 from Edin et al. (2024) [^edin2024], EMNLP 2024. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`,
      maxWidth: 400,
    },
    {
      type: 'p',
      text: `MDACE, the field's evidence benchmark [^cheng2023], scores how plausible an explanation looks, not whether it caused the prediction, which is what faithfulness asks.`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/mdace-evidence-taggers.webp',
      width: 1386,
      height: 421,
      alt: 'Two neural network diagrams side by side. Panel (a) combines contextual token embeddings and scaled attention weights through linear layers into a per-token evidence score. Panel (b) also adds code embeddings, then a 1D convolution and layer normalization before scoring.',
      caption: `MDACE’s evidence taggers learn which words support each predicted code, trained against spans annotated by professional coders.`,
      credit: `Figure 2 from Cheng et al. (2023) [^cheng2023], ACL 2023. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`,
    },
    {
      type: 'p',
      text: `Building the explanation into the computation is not unique to ShifaMind. Wang et al. (BioNLP 2026) classify from extracted sentences alone, so those sentences are faithful by design; they report MIMIC-III results [^wang2026faithful]. Concept bottleneck models pursue the same goal in other domains [^koh2020]. ShifaMind's claim is narrower: it is the only published ICD coding model whose every predicted code is an exact sum of contributions from named clinical concepts found in the note.`,
    },

    { type: 'h2', id: 'shows-its-math', text: 'How ShifaMind shows its math', collapsible: true },
    {
      type: 'p',
      text: `One design rule: a concept reaches a code only as its own vector multiplied by one scalar gate, and that gate is the number shown to the coder [^shifamind2026].`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/shifamind-forward-pass.webp',
      width: 1351,
      height: 538,
      alt: 'Five-panel pipeline diagram. A discharge summary is encoded by BioClinical ModernBERT, a dictionary matcher routes candidate concepts, cross-attention grounds each concept in the note, a per-concept gate multiplies a slot vector, and label attention turns the gated slots into ICD-10 code scores.',
      caption: `The forward pass: token states reach a code only through routed concepts. Each concept’s gate is both the score shown to the coder and the multiplier on its slot.`,
      credit: `Figure 1 from the ShifaMind paper [^shifamind2026].`,
    },
    { type: 'h3', id: 'concept-vocabulary', text: 'Concept vocabulary' },
    {
      type: 'p',
      text: `A language model wrote concept names from ICD-10 code titles, grounded by string match to UMLS [^bodenreider2004]. A dictionary matcher finds them in each note, and a ConText-style classifier [^harkema2009] labels each mention affirmed, negated, hypothetical, historical or family. Up to 384 concepts are routed per note, negated ones included, so the model learns that *no pneumonia* should close the pneumonia gate.`,
    },
    { type: 'h3', id: 'multiplicative-gate', text: 'The multiplicative gate' },
    {
      type: 'p',
      text: `For each routed concept k, attention over the note returns a readout Z_k that yields a scalar gate and a slot vector; their product is all that reaches the codes.`,
    },
    {
      type: 'formula',
      text: 'g_k = σ(⟨w_g, Z_k⟩ + b_g)        s_k = E_k + U·D·Z_k        u_k = g_k · s_k',
      caption: `g_k is both the displayed score and the multiplier. E_k is the concept's identity embedding; U·D is a rank-r adapter (full rank, r = 768, in the headline model) that lets the slot carry note-specific content.`,
    },
    {
      type: 'p',
      text: `A gate near zero sends the concept's contribution to every code to zero. On validation the mean gate is 0.998 on affirmed mentions and 0.013 on negated ones.`,
    },
    { type: 'h3', id: 'exact-decomposition', text: 'The exact sum' },
    {
      type: 'p',
      text: 'Each code attends over the gated slots and adds their contributions into its logit:',
    },
    {
      type: 'formula',
      text: 'z_ℓ = b_ℓ + Σ_k α_ℓk · ⟨w_ℓ, u_k⟩ = b_ℓ + Σ_k c_ℓk',
      caption: `c_ℓk is concept k's signed contribution to code ℓ. At every forward pass the model checks that bias plus contributions reproduces the logit.`,
    },
    {
      type: 'p',
      text: `Contributions are signed, so a concept can count against a code and the explanation shows it.`,
    },
    { type: 'h3', id: 'encoder-and-training', text: 'Encoder and training' },
    {
      type: 'p',
      text: `The encoder is BioClinical ModernBERT [^sounack2025], reading up to 6,144 tokens. Because concepts do not depend on the coding system, ICD-9-coded notes (143,780, after removing 10,749 tied to the ICD-10 validation or test splits) supervise them too, adding +0.9 micro-F1 and +1.1 macro-F1 over the ICD-10-only model.`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/shifamind-f1-by-frequency.webp',
      width: 1459,
      height: 816,
      alt: 'Two line charts, micro-F1 and macro-F1, across bins of training occurrences from 10 to 49 up to 1,000 or more. Both climb from roughly 20 to 30 percent for the rarest codes to about 60 to 70 percent for the most frequent, with the ICD-9-augmented model slightly above the ICD-10-only model.',
      caption: `Test F1 by how often a code appears in training. Rare codes stay hardest for every coder; adding ICD-9 notes helps most in the middle of the tail.`,
      credit: `Figure 2 from the ShifaMind paper [^shifamind2026].`,
      maxWidth: 640,
    },
    { type: 'h3', id: 'worked-example', text: 'A worked example' },
    {
      type: 'p',
      text: `The paper's worked example is one test note: 3,345 tokens, 11 gold codes, 10 of 12 predictions correct.`,
    },
    {
      type: 'figure',
      figure: 'concept-receipt',
      caption: `Each code's score is its bias plus the signed contributions of named concepts found in the note. K75.4 rests on one concept; N17.9 rests on a lab finding, a drug class and a generic entry. All gates were 1.00. Source: ShifaMind paper, Table 5.`,
    },
    {
      type: 'formula',
      text: 'K75.4:  z = −6.08 + 11.13 − 0.65 − 0.33 − 0.27 + (remaining concepts) = +3.47    p = σ(3.47) = 0.97',
      caption: 'The receipt for one code: bias, then each concept, then the probability.',
    },
    {
      type: 'p',
      text: `Attention weights, which are never negative, would hide K75.4's small objections from generic entries. N17.9 rests on concepts that do not name it. The one missed gold code, a urinary tract infection, scored 0.009 because no routed concept supported it.`,
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'ShifaMind access',
      text: `ShifaMind is available by request. [Request access](${REQUEST_ACCESS_URL}), or read the [product page](/products/shifamind) and the [full-code paper](/papers/shifamind.pdf), currently under review.`,
    },
    { type: 'h3', id: 'interpretability-numbers', text: 'Interpretability metrics' },
    {
      type: 'p',
      text: `The table comes from one headline run on 2,000 validation notes, following concept bottleneck [^koh2020] and ERASER [^deyoung2020] tests [^shifamind2026].`,
    },
    {
      type: 'table',
      id: 'interpretability-table',
      caption: 'ShifaMind interpretability measures (2,000-note validation subset)',
      columns: ['Measure', 'Result', 'What it measures', 'Read with care'],
      rows: [
        ['Concept accuracy', '0.999 gate AUROC', 'Gate vs silver assertion labels', 'Fit to training targets, not clinical validity'],
        ['Sufficiency', '0.98 vs 0.26 random', 'Probability kept with only top concepts', 'Targets near p = 1 flatter it'],
        ['Comprehensiveness', '0.64 vs 0.01 random', 'Probability lost when top concepts are deleted', 'A gate-times-attention ranking scores 0.63'],
        ['Explanation size', 'Median 3 concepts', `Concepts carrying 80% of positive support`, 'Auditable, not proof of correctness'],
        ['Plausibility', '37.3% vs 1.0% random', 'Top-3 concepts linked to the code', 'Links from generator and UMLS, not coders'],
      ],
    },
    {
      type: 'p',
      text: `Suppressing all 16,227 concepts returns the model to its label prior (micro-F1 on all validation notes falls from 60.7 to 8.0); suppressing the least-used 90% costs 5.5 and a random 90% costs 37.4.`,
    },
    { type: 'h3', id: 'slot-width-caveat', text: 'What the gate does not show' },
    {
      type: 'p',
      text: `The slot is 768 wide, so it also carries note-specific content: holding gates fixed and swapping in slot content from other notes removes 23.9 to 29.7 of 60.8 micro-F1 on 2,000 validation notes. The sum stays exact and suppressing a concept still removes its contribution, but the gate alone is not a full account. Read the signed contribution for how much a concept counts, and the gate for whether it counts.`,
    },

    { type: 'h2', id: 'commercial-landscape', text: 'Commercial landscape', collapsible: true },
    {
      type: 'p',
      text: 'No vendor below publishes results on the MIMIC-IV ICD-10 full-code benchmark (Corti reports other public datasets, where ShifaMind has no score), so we rank none of them. Figures are vendor-reported, quoted with source and date, and not verified by us. KLAS scores reflect customer interviews, not code accuracy, and ShifaMind has no production figures to compare.',
    },
    {
      type: 'table',
      id: 'vendor-landscape',
      caption: 'Vendor-reported figures and other evidence (alphabetical; no shared benchmark)',
      columns: ['Vendor', 'Vendor-reported figure', 'Source and date', 'Other evidence'],
      rows: [
        ['AKASA', 'Inpatient coding under 90 seconds after discharge; matches or exceeds expert coders on compliance metrics', 'HIT Consultant, Oct 2, 2026 [^akasa2026]', 'Cites blinded third-party evaluations; design undisclosed'],
        ['Arintra', '5%+ revenue uplift; 43%+ fewer denials', 'Business Wire via 01net.it, Apr 23, 2026 [^arintra2026]', 'KLAS Spotlight: 93, limited data'],
        ['CodaMetrix', 'Over 70% less manual coding; up to 60% fewer coding-related denials', 'Company release, Feb 4, 2026 [^codametrix2026]', '2026 Best in KLAS, Autonomous Coding: 90.7 [^klas2026]'],
        ['Corti', '74% F1 against 59% for the next system listed', 'Benchmarks page, accessed Nov 1, 2026 [^corti2026]', 'Self-run results on public MDACE and ACI-Bench [^edin2026symphony]'],
        ['Fathom', '98.3% coding accuracy, up from 96.3% human-led, and 95.5% encounter automation at Your Health', 'HIT Consultant, Mar 19, 2026 [^fathom2026]', 'KLAS Spotlight (2024): 100% high satisfaction, limited data [^fathomKlas2024]'],
        ['Maverick', '85%+ direct-to-bill; 95% coding accuracy (customer KPIs cited by investor Infinx)', 'Infinx via Newswire, Aug 13, 2025 [^maverick2025]', 'None found'],
        ['Nym', 'Over 95% accuracy with no human intervention', 'Company release, Aug 20, 2025 [^nym2025]', 'KLAS 2025 top performer: 89.6, 12 customers'],
        ['Solventum (360 Encompass)', '95% overall accuracy; realized automation up to 74% (ancillary) and 78% (same-day surgery)', 'Results page, data Jan to Mar 2026 [^solventum2026]', 'None cited here'],
      ],
    },

    { type: 'h2', id: 'products-versus-models', text: 'Products versus models', collapsible: true },
    {
      type: 'p',
      text: `A vendor figure such as Fathom's 98.3% coding accuracy at Your Health [^fathom2026], or Nym's "over 95 percent accuracy" [^nym2025], describes a deployed system on encounters the vendor or its customers chose, measured as each defines. A benchmark score describes a model on a fixed public test set, by a formula anyone can recompute.`,
    },
    {
      type: 'table',
      id: 'accuracy-vs-f1',
      caption: 'What a vendor accuracy figure and a benchmark score each measure',
      columns: ['', 'Vendor "accuracy"', 'Benchmark micro-F1'],
      rows: [
        ['Unit counted', 'A chart, encounter or code, as each vendor defines', 'Every (note, code) decision'],
        ['Cases scored', 'Chosen by vendor or customer; may cover only automated encounters', 'All 19,799 test notes'],
        ['Code space', `The customer's own specialties and settings`, 'About 7,940 inpatient ICD-10 codes'],
        ['Definition', 'No agreed industry definition [^codametrixCouncil2026]', 'Fixed formula, public patient-disjoint splits'],
        ['Comparable across systems', 'No', 'Yes, when split and metric match'],
      ],
    },
    {
      type: 'p',
      text: `A June 2026 CodaMetrix release says the industry "has yet to agree on a consistent definition or measurement methodology" for coding accuracy [^codametrixCouncil2026]. That does not make vendor figures wrong; it means they cannot be ranked against each other or a benchmark score.`,
    },
    {
      type: 'p',
      text: `Papers use F1 because accuracy rewards silence: about 0.2% of test (note, code) cells are positive [^shifamind2026], so predicting no codes is 99.8% accurate, with a micro-F1 of zero.`,
    },

    { type: 'h2', id: 'limitations', text: 'Limitations', collapsible: true },
    {
      type: 'list',
      items: [
        `**The long tail.** ShifaMind never correctly predicts 44.3% of the 7,933 codes in its test set [^shifamind2026]; PLM-ICD never correctly predicts 51.8% of diagnosis codes [^edin2023].`,
        `**The constraint has a cost.** At matched eight-epoch training, the same encoder with an extra pathway that is not concept-mediated scores 0.5 micro-F1 and 3.3 macro-F1 higher; part of the gain over PLM-ICD comes from the encoder.`,
        `**Preprocessing differs.** ShifaMind keeps digits in the text, which may favor it on number-defined codes, and reads up to 6,144 subword tokens, not the baselines' 4,000 words.`,
        `**Silver labels.** Gate targets come from a dictionary matcher and assertion classifier, not human annotation; there is no clinician study and no MDACE score.`,
        `**One dataset, mixed protocols.** All results come from one US academic medical center, and papers differ in seed counts (one to ten), thresholds and preprocessing. Gaps under about one point are suggestive, not decisive.`,
        `**Under review.** The ShifaMind paper has not completed peer review; its code and concept vocabulary are not yet public.`,
      ],
    },

    { type: 'h2', id: 'ensembles', text: 'Ensembles', collapsible: true },
    {
      type: 'ensembles',
      caption: 'Systems that combine several trained models, MIMIC-IV ICD-10 full-code, percent, as printed in the source.',
    },
    {
      type: 'p',
      text: `GoM-ICD (Wu et al., 2025) combines three models trained on different text-segmentation schemes through a model-level mixture of experts [^wu2025]. Its ablation table, with thresholds tuned on the test split from one seed, reports 60.6 micro-F1 for its best component model.`,
    },
    {
      type: 'image',
      src: '/blog/best-medical-coding-models-2026/gom-icd-architecture.webp',
      width: 1161,
      height: 725,
      alt: 'Architecture diagram of GoM-ICD. Chunks of note tokens go through a pretrained language model and an RNN, then a router block where four experts are combined by a weighted sum. A text-label matching module and a feed-forward layer then score each code.',
      caption: `GoM-ICD’s pipeline: segmented chunks pass through a pretrained encoder and an RNN, a top-k mixture of experts, then text-label matching for each code.`,
      credit: `Figure 2 from Wu et al. (2025) [^wu2025], Big Data Mining and Analytics. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`,
      maxWidth: 620,
    },
  ],
  faq: [
    {
      q: 'What is the best medical coding AI model in 2026?',
      a: `ShifaMind, by Roshan AI, ranks #1 by micro-F1 among the models ranked here on the MIMIC-IV ICD-10 full-code benchmark, and is the best explainable model on it: 60.6, ahead of TraceCoder (60.0) and JAMS + PLM-ICD (59.8). No model leads every metric: DualLAAT leads macro-F1, and PLANT and DualLAAT lead AUROC. Commercial products publish no results on this benchmark, so they are not ranked.`,
    },
    {
      q: 'How accurate is AI medical coding?',
      a: `It depends on what is measured. On the public MIMIC-IV ICD-10 full-code benchmark, the top micro-F1 among the models ranked here is ShifaMind's 60.6. Vendors report 95% to 98% accuracy on their own or customers' encounters, defined in their own ways, so the two cannot be compared.`,
    },
    {
      q: 'Can ChatGPT or other LLMs do medical coding?',
      a: 'Not well on their own, on current evidence. On the MIMIC-IV ICD-10 full-code benchmark, prompted small open LLMs score 0.1 to 3.0 micro-F1. Post-training helps: PHI, a 4B model, reaches 58.7, still below the best encoder models. Agents that look codes up in the ICD index do best on rare codes.',
    },
    {
      q: 'What is a good F1 score for ICD-10 coding?',
      a: `On the MIMIC-IV ICD-10 full-code benchmark, about 60 micro-F1 is the current top among the models ranked here: ShifaMind's manuscript under review reports 60.6, and the PLM-ICD baseline 58.5. Macro-F1, which weights rare codes equally, peaks at 29.9. Scores in the 70s usually come from the easier top-50 code task.`,
    },
    {
      q: 'Is ShifaMind better than Fathom or CodaMetrix?',
      a: `That cannot be answered on accuracy today. Fathom and CodaMetrix publish no results on a public benchmark ShifaMind has been scored on, and ShifaMind has no production figures, so there is no common test. The narrower claim: ShifaMind ranks #1 by micro-F1 among the models ranked here on MIMIC-IV ICD-10 full-code.`,
    },
    {
      q: 'What is explainable medical coding?',
      a: 'It means a coder can see why a code was assigned, but the term covers audit trails, highlighted text, attention weights, LLM-written rationales and concept-mediated models. In ShifaMind, the best explainable model on MIMIC-IV ICD-10 full-code, each code’s score is its bias plus an exact sum of signed contributions from named clinical concepts found in the note.',
    },
  ],
  references: [
    {
      id: 'akasa2026',
      text: 'Fred Pennic. 2026. AKASA Launches Autonomous AI Mid-Cycle Platform. *HIT Consultant*, October 2, 2026. Accessed November 1, 2026.',
      url: 'https://hitconsultant.net/2026/10/02/akasa-launches-autonomous-ai-mid-cycle-platform-inpatient-coding-cdi/',
    },
    {
      id: 'arintra2026',
      text: 'Arintra. 2026. Arintra Receives A+* Partnership Rating in KLAS Emerging Company Spotlight Report. *Business Wire* (via 01net.it), April 23, 2026. Accessed November 1, 2026.',
      url: 'https://www.01net.it/arintra-receives-a-partnership-rating-in-klas-emerging-company-spotlight-report/',
    },
    {
      id: 'bodenreider2004',
      text: 'Olivier Bodenreider. 2004. The Unified Medical Language System (UMLS): Integrating Biomedical Terminology. *Nucleic Acids Research*, 32(suppl 1):D267-D270.',
      url: 'https://doi.org/10.1093/nar/gkh061',
    },
    {
      id: 'cheng2023',
      text: 'Hua Cheng, Rana Jafari, April Russell, Russell Klopfer, Edmond Lu, Benjamin Striner, and Matthew Gormley. 2023. MDACE: MIMIC Documents Annotated with Code Evidence. In *Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)*, pages 7534-7550.',
      url: 'https://aclanthology.org/2023.acl-long.416/',
    },
    {
      id: 'cheng2026cola',
      text: 'Yihang Cheng, Veronica Liesaputra, and Andrew Trotman. 2026. CoLa-ICD: A Knowledge-Enhanced Framework for Long-Tail Automated Medical Coding. arXiv preprint arXiv:2608.30234.',
      url: 'https://arxiv.org/abs/2608.30234',
    },
    {
      id: 'codametrix2026',
      text: 'CodaMetrix. 2026. CodaMetrix Named No. 1 in Inaugural Best in KLAS Title for Autonomous Medical Coding. Press release, February 4, 2026. Accessed November 1, 2026.',
      url: 'https://www.codametrix.com/resources/codametrix-named-no-1-in-inaugural-best-in-klas-title-for-autonomous-medical-coding',
    },
    {
      id: 'codametrixCouncil2026',
      text: 'CodaMetrix. 2026. CodaMetrix Convenes National Council of Health System Leaders to Advance Industry Standards for Medical Coding Quality and Accuracy. *PR Newswire*, June 8, 2026. Accessed November 1, 2026.',
      url: 'https://www.prnewswire.com/news-releases/codametrix-convenes-national-council-of-health-system-leaders-to-advance-industry-standards-for-medical-coding-quality-and-accuracy-302793472.html',
    },
    {
      id: 'corti2026',
      text: 'Corti. 2026. AI Benchmarks. Web page. Accessed November 1, 2026.',
      url: 'https://corti.ai/benchmarks',
    },
    {
      id: 'deyoung2020',
      text: 'Jay DeYoung, Sarthak Jain, Nazneen Fatema Rajani, Eric Lehman, Caiming Xiong, Richard Socher, and Byron C. Wallace. 2020. ERASER: A Benchmark to Evaluate Rationalized NLP Models. In *Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics*, pages 4443-4458.',
      url: 'https://aclanthology.org/2020.acl-main.408/',
    },
    {
      id: 'douglas2025',
      text: 'James C. Douglas, Yidong Gan, Ben Hachey, and Jonathan K. Kummerfeld. 2025. Less is More: Explainable and Efficient ICD Code Prediction with Clinical Entities. In *Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)*, pages 30835-30847.',
      url: 'https://aclanthology.org/2025.acl-long.1489/',
    },
    {
      id: 'edin2023',
      text: 'Joakim Edin, Alexander Junge, Jakob D. Havtorn, Lasse Borgholt, Maria Maistro, Tuukka Ruotsalo, and Lars Maaløe. 2023. Automated Medical Coding on MIMIC-III and MIMIC-IV: A Critical Review and Replicability Study. In *Proceedings of the 46th International ACM SIGIR Conference on Research and Development in Information Retrieval*, pages 2572-2582.',
      url: 'https://arxiv.org/abs/2304.10909',
    },
    {
      id: 'edin2024',
      text: 'Joakim Edin, Maria Maistro, Lars Maaløe, Lasse Borgholt, Jakob Drachmann Havtorn, and Tuukka Ruotsalo. 2024. An Unsupervised Approach to Achieve Supervised-Level Explainability in Healthcare Records. In *Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing*, pages 4869-4890.',
      url: 'https://arxiv.org/abs/2406.08958',
    },
    {
      id: 'edin2026symphony',
      text: 'Joakim Edin, Andreas Motzfeldt, Simon Flachs, and Lars Maaløe. 2026. Symphony for Medical Coding: A Next-Generation Agentic System for Scalable and Explainable Medical Coding. arXiv preprint arXiv:2603.29709.',
      url: 'https://arxiv.org/abs/2603.29709',
    },
    {
      id: 'fathom2026',
      text: 'Jasmine Pennic. 2026. Your Health Deploys Fathom Across All Service Lines. *HIT Consultant*, March 19, 2026. Accessed November 1, 2026.',
      url: 'https://hitconsultant.net/2026/03/19/fathom-autonomous-medical-coding-your-health-35m-revenue-ai/',
    },
    {
      id: 'fathomKlas2024',
      text: 'Fathom. 2024. Fathom Earns 100% High Customer Satisfaction and Full Validation of 90%+ Coding Automation Rates in KLAS Spotlight Report. *Business Wire* (via silicon.co.uk), September 25, 2024. Accessed November 1, 2026.',
      url: 'https://www.silicon.co.uk/press-release/fathom-earns-100-high-customer-satisfaction-and-full-validation-of-90-coding-automation-rates-in-klas-spotlight-report',
    },
    {
      id: 'harkema2009',
      text: 'Henk Harkema, John N. Dowling, Tyler Thornblade, and Wendy W. Chapman. 2009. ConText: An Algorithm for Determining Negation, Experiencer, and Temporal Status from Clinical Reports. *Journal of Biomedical Informatics*, 42(5):839-851.',
      url: 'https://doi.org/10.1016/j.jbi.2009.05.002',
    },
    {
      id: 'huang2022',
      text: 'Chao-Wei Huang, Shang-Chi Tsai, and Yun-Nung Chen. 2022. PLM-ICD: Automatic ICD Coding with Pretrained Language Models. In *Proceedings of the 4th Clinical Natural Language Processing Workshop*, pages 10-20.',
      url: 'https://aclanthology.org/2022.clinicalnlp-1.2/',
    },
    {
      id: 'jain2019',
      text: 'Sarthak Jain and Byron C. Wallace. 2019. Attention is not Explanation. In *Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1*, pages 3543-3556.',
      url: 'https://aclanthology.org/N19-1357/',
    },
    {
      id: 'jeong2024',
      text: 'Geunyeong Jeong, Seokwon Jeong, Juoh Sun, and Harksoo Kim. 2024. Bridging the Code Gap: A Joint Learning Framework across Medical Coding Systems. In *Proceedings of the 2024 Joint International Conference on Computational Linguistics, Language Resources and Evaluation (LREC-COLING 2024)*, pages 2520-2525.',
      url: 'https://aclanthology.org/2024.lrec-main.227/',
    },
    {
      id: 'johnson2023',
      text: 'Alistair E. W. Johnson, Lucas Bulgarelli, Lu Shen, Alvin Gayles, Ayad Shammout, Steven Horng, Tom J. Pollard, et al. 2023. MIMIC-IV, a Freely Accessible Electronic Health Record Dataset. *Scientific Data*, 10:1.',
      url: 'https://doi.org/10.1038/s41597-022-01899-x',
    },
    {
      id: 'johnson2023note',
      text: 'Alistair Johnson, Tom Pollard, Steven Horng, Leo Anthony Celi, and Roger Mark. 2023. MIMIC-IV-Note: Deidentified Free-Text Clinical Notes (version 2.2). PhysioNet.',
      url: 'https://doi.org/10.13026/1n74-ne17',
    },
    {
      id: 'kailas2023',
      text: 'Prajwal Kailas, Max Homilius, Rahul C. Deo, and Calum A. MacRae. 2023. NoteContrast: Contrastive Language-Diagnostic Pretraining for Medical Text. In *Proceedings of the 3rd Machine Learning for Health Symposium*, PMLR 225:201-216.',
      url: 'https://arxiv.org/abs/2412.11477',
    },
    {
      id: 'klas2026',
      text: 'KLAS Research. 2026. 2026 Best in KLAS: Autonomous Coding. Web page. Accessed November 1, 2026.',
      url: 'https://klasresearch.com/best-in-klas-ranking/autonomous-coding/2026/495',
    },
    {
      id: 'koh2020',
      text: 'Pang Wei Koh, Thao Nguyen, Yew Siang Tang, Stephen Mussmann, Emma Pierson, Been Kim, and Percy Liang. 2020. Concept Bottleneck Models. In *Proceedings of the 37th International Conference on Machine Learning*, PMLR 119:5338-5348.',
      url: 'https://proceedings.mlr.press/v119/koh20a.html',
    },
    {
      id: 'le2025ace',
      text: 'Tuan-Dung Le, Shohreh Haddadan, and Thanh Q. Thieu. 2025. ACE-ICD: Acronym Expansion As Data Augmentation For Automated ICD Coding. In *Findings of IJCNLP-AACL 2025*.',
      url: 'https://arxiv.org/abs/2511.07311',
    },
    {
      id: 'li2020',
      text: 'Fei Li and Hong Yu. 2020. ICD Coding from Clinical Text Using Multi-Filter Residual Convolutional Neural Network. In *Proceedings of the AAAI Conference on Artificial Intelligence*, 34:8180-8187.',
      url: 'https://arxiv.org/abs/1912.00862',
    },
    {
      id: 'liu2026',
      text: 'Jinghui Liu and Anthony Nguyen. 2026. Bridging the Version Gap: Multi-version Training Improves ICD Code Prediction, Especially for Rare Codes. In *Proceedings of BioNLP 2026*, pages 372-381.',
      url: 'https://aclanthology.org/2026.bionlp-1.29/',
    },
    {
      id: 'luo2024corelation',
      text: 'Junyu Luo, Xiaochen Wang, Jiaqi Wang, Aofei Chang, Yaqing Wang, and Fenglong Ma. 2024. CoRelation: Boosting Automatic ICD Coding Through Contextualized Code Relation Learning. In *Proceedings of LREC-COLING 2024*.',
      url: 'https://arxiv.org/abs/2402.15700',
    },
    {
      id: 'mansoori2026',
      text: 'Mohammad Mansoori, Amira Soliman, and Farzaneh Etminani. 2026. LTR-ICD: A Ranking-Aware Framework for Automatic ICD Coding. In *Proceedings of the 17th ACM International Conference on Bioinformatics, Computational Biology and Health Informatics (ACM-BCB 2026)*.',
      url: 'https://arxiv.org/abs/2510.13922',
    },
    {
      id: 'maverick2025',
      text: 'Infinx. 2025. Infinx Invests in Maverick AI. *Newswire*, August 13, 2025. Accessed November 1, 2026.',
      url: 'https://www.newswire.com/news/infinx-invests-in-maverick-ai-to-bring-real-time-autonomous-medical-22623649',
    },
    {
      id: 'motzfeldt2025',
      text: 'Andreas Motzfeldt, Joakim Edin, Casper L. Christensen, Christian Hardmeier, Lars Maaløe, and Anna Rogers. 2025. Code Like Humans: A Multi-Agent Solution for Medical Coding. In *Findings of the Association for Computational Linguistics: EMNLP 2025*.',
      url: 'https://aclanthology.org/2025.findings-emnlp.1231/',
    },
    {
      id: 'mullenbach2018',
      text: 'James Mullenbach, Sarah Wiegreffe, Jon Duke, Jimeng Sun, and Jacob Eisenstein. 2018. Explainable Prediction of Medical Codes from Clinical Text. In *Proceedings of the 2018 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long Papers)*, pages 1101-1111.',
      url: 'https://aclanthology.org/N18-1100/',
    },
    {
      id: 'nguyen2023',
      text: 'Thanh-Tung Nguyen, Viktor Schlegel, Abhinav Kashyap, Stefan Winkler, Shao-Syuan Huang, Jie-Jyun Liu, and Chih-Jen Lin. 2023. Mimic-IV-ICD: A New Benchmark for eXtreme MultiLabel Classification. arXiv preprint arXiv:2304.13998.',
      url: 'https://arxiv.org/abs/2304.13998',
    },
    {
      id: 'nym2025',
      text: 'Nym. 2025. Nym Rated a Top Performer by KLAS in First Report Dedicated to Autonomous Medical Coding. Press release, August 20, 2025. Accessed November 1, 2026.',
      url: 'https://nym.health/press-release/nym-rated-a-top-performer-by-klas-in-first-report-dedicated-to-autonomous-medical-coding/',
    },
    {
      id: 'qiu2026',
      text: 'Qiu et al. 2026. Accurate and Explainable ICD-10-CM Coding via Multi-Stage Adaptation and Evidence-Guided Verification. *PeerJ Computer Science*, 12:e4079.',
      url: 'https://peerj.com/articles/cs-4079/',
    },
    {
      id: 'ren2025',
      text: 'Mucheng Ren, He Chen, Yucheng Yan, Danqing Hu, Jun Xu, and Xian Zeng. 2025. TraceCoder: Towards Traceable ICD Coding via Multi-Source Knowledge Integration. In *Proceedings of the IEEE International Conference on Bioinformatics and Biomedicine (BIBM 2025)*.',
      url: 'https://arxiv.org/abs/2510.15267',
    },
    {
      id: 'sahaRoy2025',
      text: 'Debjyoti Saha Roy, Byron C. Wallace, and Javed A. Aslam. 2025. Don’t Pay Attention, PLANT It: Pretraining Attention via Learning-to-Rank. arXiv preprint arXiv:2410.23066 (v4).',
      url: 'https://arxiv.org/abs/2410.23066',
    },
    {
      id: 'shifamind2026',
      text: 'Roshan AI. 2026. ShifaMind: Concept-Mediated Automated ICD Coding. Manuscript under review.',
      url: '/papers/shifamind.pdf',
    },
    {
      id: 'solventum2026',
      text: 'Solventum. 2026. Autonomous Medical Coding: Real Results. Web page, data January to March 2026. Accessed November 1, 2026.',
      url: 'https://www.solventum.com/en-us/home/health-information-technology/lp/autonomous-medical-coding-real-results/',
    },
    {
      id: 'sounack2025',
      text: 'Thomas Sounack, Joshua Davis, Brigitte Durieux, Antoine Chaffin, Tom J. Pollard, Eric Lehman, Alistair E. W. Johnson, Matthew McDermott, Tristan Naumann, and Charlotta Lindvall. 2025. BioClinical ModernBERT: A State-of-the-Art Long-Context Encoder for Biomedical and Clinical NLP. arXiv preprint arXiv:2506.10896.',
      url: 'https://arxiv.org/abs/2506.10896',
    },
    {
      id: 'vals2026',
      text: 'Vals AI. 2026. MedCode Leaderboard and Methodology. Web page, updated October 29, 2026. Accessed November 1, 2026.',
      url: 'https://vals.ai/benchmarks/medcode',
    },
    {
      id: 'vu2020',
      text: 'Thanh Vu, Dat Quoc Nguyen, and Anthony Nguyen. 2020. A Label Attention Model for ICD Coding from Clinical Text. In *Proceedings of the Twenty-Ninth International Joint Conference on Artificial Intelligence (IJCAI 2020)*, pages 3335-3341.',
      url: 'https://doi.org/10.24963/ijcai.2020/461',
    },
    {
      id: 'wang2026faithful',
      text: 'Yichen Wang, Lian Hong, Masato Mizogaki, Shunnosuke Umeda, Toshimune Kenmotsu, Akihiro Tamura, and Daniel Andrade. 2026. Interpretable ICD Code Classification with Faithful Sentence Extraction. In *Proceedings of BioNLP 2026*, pages 679-686.',
      url: 'https://aclanthology.org/2026.bionlp-1.54/',
    },
    {
      id: 'wang2026phi',
      text: 'Ziqing Wang, Weihao Li, Shijie Chen, Yuan Luo, and Kaize Ding. 2026. Can Post-Training Turn LLMs into Good Medical Coders? An Empirical Study of Generative ICD Coding. arXiv preprint arXiv:2606.13940.',
      url: 'https://arxiv.org/abs/2606.13940',
    },
    {
      id: 'wiegreffe2019',
      text: 'Sarah Wiegreffe and Yuval Pinter. 2019. Attention is not not Explanation. In *Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing and the 9th International Joint Conference on Natural Language Processing (EMNLP-IJCNLP)*, pages 11-20.',
      url: 'https://aclanthology.org/D19-1002/',
    },
    {
      id: 'wu2025',
      text: 'Yifan Wu, Weiyan Qiu, Min Zeng, Xi Chen, Min Li, and Hongtao Zhu. 2025. GoM-ICD: Automatic ICD Coding with Gap Schemes and Mixture of Experts. *Big Data Mining and Analytics*, 8(6):1211-1224.',
      url: 'https://www.sciopen.com/article/10.26599/BDMA.2025.9020019',
    },
    {
      id: 'yin2026',
      text: 'Ziyi Yin, Yuanpu Cao, Ting Wang, Jinghui Chen, and Fenglong Ma. 2026. ICDAgent: Empowering Agentic Large Language Models for Explainable Medical Coding. In *Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)*.',
      url: 'https://aclanthology.org/2026.acl-long.643/',
    },
    {
      id: 'yock2026',
      text: 'Eng Chong Yock, Yushi Cao, Yiming Chen, Kezhi Mao, and Hongchao Jiang. 2026. Understanding the Limits of Agentic ICD Coding. arXiv preprint arXiv:2609.13806.',
      url: 'https://arxiv.org/abs/2609.13806',
    },
    {
      id: 'zhang2025gki',
      text: 'Xu Zhang, Kun Zhang, Wenxin Ma, Rongsheng Wang, Chenxu Wu, Yingtai Li, and S. Kevin Zhou. 2025. A General Knowledge Injection Framework for ICD Coding. In *Findings of the Association for Computational Linguistics: ACL 2025*.',
      url: 'https://arxiv.org/abs/2505.18708',
    },
  ],
  disclosure: `Written by [Mohammed Sameer Syed](/company/team), founder of Roshan AI, the developer of ShifaMind; read this review with that interest in mind. Every number is compiled from published papers, preprints, the ShifaMind manuscript (under review) and vendor pages; no result was re-run for this review. The literature search closed on November 1, 2026. Inclusion: results on the Edin et al. MIMIC-IV ICD-10 full-code splits, copied from each source's own results table, with macro-F1 compared only under the per-code mean; the full criteria are under [What we included](#inclusion-criteria). Vendor figures are quoted as published and were not independently verified. To report an error or a missing result, email [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) or use the [contact page](/contact).`,
};
