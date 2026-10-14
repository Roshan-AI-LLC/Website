import { BenchmarkChart } from '../BenchmarkChart';

export function Proof() {
  return (
    <section id="benchmark" className="mobile-native-section relative scroll-mt-24 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <BenchmarkChart productLink />
      </div>
    </section>
  );
}
