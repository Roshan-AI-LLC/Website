import { Head } from 'vite-react-ssg';
import { CTA } from '../components/CTA';
import { Hero } from '../components/Hero';
import { PlatformDiagram } from '../components/home/PlatformDiagram';
import { ProductStrip } from '../components/home/ProductStrip';
import { Proof } from '../components/home/Proof';
import { WhyRoshanAI } from '../components/home/WhyRoshanAI';

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
      <ProductStrip />
      <Divider />
      <Proof />
      <Divider />
      <WhyRoshanAI />
      <Divider />
      <PlatformDiagram />
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
