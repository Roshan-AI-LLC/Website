import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../components/PagePlaceholder';

export default function Developers() {
  return (
    <>
      <Head>
        <title>Developers — Roshan AI</title>
        <meta
          name="description"
          content="Roshan AI APIs power clinical reasoning inside your product. Request access to the platform."
        />
        <link rel="canonical" href="https://roshan-ai.com/developers" />
      </Head>
      <PagePlaceholder
        eyebrow="Developers"
        title="Roshan AI APIs power clinical reasoning in your product."
        description="A developer overview lands at launch. Full docs at docs.roshan-ai.com later."
      />
    </>
  );
}
