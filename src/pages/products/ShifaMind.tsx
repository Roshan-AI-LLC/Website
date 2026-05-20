import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../../components/PagePlaceholder';

export default function ShifaMindProduct() {
  return (
    <>
      <Head>
        <title>ShifaMind — Concept-grounded ICD-10 coding | Roshan AI</title>
        <meta
          name="description"
          content="ShifaMind reads a clinical note and returns ranked ICD-10 codes with the concept evidence behind each one. For clinicians and coders."
        />
        <link
          rel="canonical"
          href="https://roshan-ai.com/products/shifamind"
        />
      </Head>
      <PagePlaceholder
        eyebrow="ShifaMind"
        title="Concept-grounded ICD-10 coding for clinicians and coders."
        description="Full product page with live demo coming in Phase 2."
      />
    </>
  );
}
