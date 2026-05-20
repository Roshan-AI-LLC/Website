import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../components/PagePlaceholder';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact — Roshan AI</title>
        <meta
          name="description"
          content="Talk to Roshan AI about pilots, partnerships, and demos."
        />
        <link rel="canonical" href="https://roshan-ai.com/contact" />
      </Head>
      <PagePlaceholder
        eyebrow="Contact"
        title="Talk to us."
        description="Pilots, partnerships, and demos. Form coming soon."
      />
    </>
  );
}
