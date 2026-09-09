import { BenchmarkChart } from '../BenchmarkChart';
import { FullCodeBenchmark, FULL_CODE_PUBLIC } from './FullCodeBenchmark';

/**
 * The published top-50 chart is shared with the home page. The full-code
 * chart is ShifaMind-only and stays gated until the preprint posts, so
 * nothing here changes what the home page renders.
 */
export function BenchmarkSection() {
  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {FULL_CODE_PUBLIC ? <FullCodeBenchmark /> : <BenchmarkChart />}
      </div>
    </section>
  );
}
