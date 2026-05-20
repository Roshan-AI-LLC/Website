import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../../components/PagePlaceholder';

export default function CompanyAbout() {
  return (
    <>
      <Head>
        <title>About — Roshan AI</title>
        <meta
          name="description"
          content="Roshan AI LLC builds clinical-grade AI infrastructure. Our mission, story, and what we're building toward."
        />
        <link rel="canonical" href="https://roshan-ai.com/company/about" />
      </Head>
      <PagePlaceholder
        eyebrow="Company"
        title="Roshan AI LLC. Clinical-grade AI, built to be defended."
        description="Mission, story, and what we're building toward."
      />
    </>
  );
}
