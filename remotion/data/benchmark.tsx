/**
 * Benchmark data, ported from src/components/BenchmarkChart.tsx.
 * Macro-F1 on MIMIC-IV top-50, ordered low → high for visual ascent,
 * ShifaMind last and highlighted.
 */
import { BarChart3, IceCream2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { AnthropicMark, GoogleMark, OpenAIMark } from './brand-marks';

export type Competitor = {
  label: string;
  value: number;
  mark: ReactNode;
  ours?: boolean;
};

export const COMPETITORS: Competitor[] = [
  { label: 'Vanilla CBM', value: 0.164, mark: <IceCream2 size={28} strokeWidth={1.7} color="rgba(255,255,255,0.66)" /> },
  { label: 'Claude 4.6', value: 0.343, mark: <AnthropicMark size={28} /> },
  { label: 'GPT-5.4', value: 0.417, mark: <OpenAIMark size={28} /> },
  { label: 'Gemini 2.5 Pro', value: 0.435, mark: <GoogleMark size={28} /> },
  { label: 'GKI-ICD', value: 0.649, mark: <BarChart3 size={28} strokeWidth={1.8} color="rgba(255,255,255,0.66)" /> },
  { label: 'ShifaMind', value: 0.712, mark: null, ours: true },
];

export const Y_MAX = 0.8;
export const Y_TICKS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
