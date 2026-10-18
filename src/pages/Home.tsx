import { Head } from 'vite-react-ssg';
import { CTA } from '../components/CTA';
import { Hero } from '../components/Hero';
import { EvidenceDemo } from '../components/home/EvidenceDemo';
import { HeroBand } from '../components/home/HeroBand';
import { HomeFAQ } from '../components/home/HomeFAQ';
import { HowItWorks } from '../components/home/HowItWorks';
import { Problem } from '../components/home/Problem';
import { Proof } from '../components/home/Proof';
import { META } from '../data/homeCopy';

/**
 * Home: hero (announcements, network, programs band), problem, the fix
 * (scroll-driven steps), demo, benchmark, FAQ, closing call to action.
 * All copy lives in src/data/homeCopy.ts.
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>{META.title}</title>
        <meta name="description" content={META.description} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <link rel="canonical" href="https://roshan-ai.com/" />
      </Head>

      <Hero>
        <HeroBand />
      </Hero>
      <Problem />
      <HowItWorks />
      <EvidenceDemo />
      <Proof />
      <HomeFAQ />
      <CTA />
    </>
  );
}
