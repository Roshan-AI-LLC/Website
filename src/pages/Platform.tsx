import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../components/PagePlaceholder';

export default function Platform() {
  return (
    <>
      <Head>
        <title>Platform — Roshan AI</title>
        <meta
          name="description"
          content="The Roshan AI platform: shared clinical AI infrastructure powering ShifaMind and future products."
        />
        <link rel="canonical" href="https://roshan-ai.com/platform" />
      </Head>
      <PagePlaceholder
        eyebrow="Platform"
        title="Shared clinical AI infrastructure."
        description="The stack that powers ShifaMind — and every Roshan AI product that follows."
      />
    </>
  );
}
