import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../../components/PagePlaceholder';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — Roshan AI</title>
        <meta name="description" content="Roshan AI terms of service." />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://roshan-ai.com/legal/terms" />
      </Head>
      <PagePlaceholder
        eyebrow="Legal"
        title="Terms of Service"
        description="Full terms text is being drafted."
      />
    </>
  );
}
