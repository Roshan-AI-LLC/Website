import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../../components/PagePlaceholder';

export default function ProductsIndex() {
  return (
    <>
      <Head>
        <title>Products — Roshan AI</title>
        <meta
          name="description"
          content="Clinical AI products built on the Roshan AI platform. ShifaMind is our flagship: concept-grounded ICD-10 coding for clinicians and coders."
        />
        <link rel="canonical" href="https://roshan-ai.com/products" />
      </Head>
      <PagePlaceholder
        eyebrow="Products"
        title="One platform. A growing family of clinical products."
        description="ShifaMind is the first. More are in development on the same Roshan AI platform stack."
      />
    </>
  );
}
