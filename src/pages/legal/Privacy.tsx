import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../../components/PagePlaceholder';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Roshan AI</title>
        <meta name="description" content="Roshan AI privacy policy." />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://roshan-ai.com/legal/privacy" />
      </Head>
      <PagePlaceholder
        eyebrow="Legal"
        title="Privacy Policy"
        description="Full policy text is being drafted."
      />
    </>
  );
}
