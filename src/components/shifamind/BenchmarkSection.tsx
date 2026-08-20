import { BenchmarkChart } from '../BenchmarkChart';

export function BenchmarkSection() {
  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <BenchmarkChart />
      </div>
    </section>
  );
}
