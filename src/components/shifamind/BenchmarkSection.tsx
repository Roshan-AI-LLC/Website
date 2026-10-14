import { BenchmarkChart } from '../BenchmarkChart';

/** Same benchmark card as the home page. */
export function BenchmarkSection() {
  return (
    <section id="benchmark" className="mobile-native-section relative scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <BenchmarkChart />
      </div>
    </section>
  );
}
