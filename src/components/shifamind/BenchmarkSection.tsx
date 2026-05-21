import { BenchmarkChart } from '../BenchmarkChart';

export function BenchmarkSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <BenchmarkChart />
      </div>
    </section>
  );
}
