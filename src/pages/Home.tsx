import { Head } from 'vite-react-ssg';
import { About } from '../components/About';
import { Architecture } from '../components/Architecture';
import { CTA } from '../components/CTA';
import { Founder } from '../components/Founder';
import { Hero } from '../components/Hero';
import { Performance } from '../components/Performance';
import { Projects } from '../components/Projects';
import { ShifaMindHero } from '../components/ShifaMindHero';

export default function Home() {
  return (
    <>
      <Head>
        <title>Roshan AI — AI infrastructure for clinical reasoning</title>
        <meta
          name="description"
          content="Roshan AI builds clinical-grade AI infrastructure. ShifaMind, our flagship product, delivers concept-grounded ICD-10 coding for clinicians and coders."
        />
        <meta
          property="og:title"
          content="Roshan AI — AI infrastructure for clinical reasoning"
        />
        <meta
          property="og:description"
          content="Clinical-grade AI infrastructure. Featuring ShifaMind, concept-grounded ICD-10 coding for clinicians and coders."
        />
        <link rel="canonical" href="https://roshan-ai.com/" />
      </Head>

      <Hero />
      <ShifaMindHero />
      <Performance />
      <Architecture />
      <Divider />
      <About />
      <Divider />
      <Projects />
      <Divider />
      <Founder />
      <CTA />
    </>
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
