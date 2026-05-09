import { About } from './components/About';
import { Architecture } from './components/Architecture';
import { Background } from './components/Background';
import { CTA } from './components/CTA';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Founder } from './components/Founder';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Performance } from './components/Performance';
import { Projects } from './components/Projects';
import { SampleOutput } from './components/SampleOutput';
import { ShifaMindHero } from './components/ShifaMindHero';

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Background />
      <Cursor />
      <Nav />

      <main>
        <Hero />
        <About />
        <Divider />
        <ShifaMindHero />
        <Architecture />
        <Performance />
        <SampleOutput />
        <Divider />
        <Projects />
        <Divider />
        <Founder />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      className="mx-auto h-px max-w-6xl"
      style={{
        background:
          'linear-gradient(90deg, transparent, var(--border-subtle) 20%, var(--border-strong) 50%, var(--border-subtle) 80%, transparent)',
      }}
    />
  );
}
