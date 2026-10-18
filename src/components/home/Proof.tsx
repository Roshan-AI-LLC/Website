import { BENCHMARK } from '../../data/homeCopy';
import { BenchmarkChart } from '../BenchmarkChart';

/**
 * Home benchmark: the shared ShifaMind benchmark card with the home header.
 */
export function Proof() {
  return (
    <section
      id="benchmark"
      aria-labelledby="benchmark-title"
      className="mobile-native-section relative scroll-mt-24 py-16 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <BenchmarkChart
          productLink
          eyebrow={BENCHMARK.eyebrow}
          titleId="benchmark-title"
          title={BENCHMARK.h2}
          line={BENCHMARK.line}
        />
      </div>
    </section>
  );
}
