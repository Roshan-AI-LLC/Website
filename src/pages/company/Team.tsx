import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../../components/PagePlaceholder';

export default function CompanyTeam() {
  return (
    <>
      <Head>
        <title>Team — Roshan AI</title>
        <meta
          name="description"
          content="Founders and team behind Roshan AI."
        />
        <link rel="canonical" href="https://roshan-ai.com/company/team" />
      </Head>
      <PagePlaceholder
        eyebrow="Team"
        title="The people building Roshan AI."
        description="Founders, engineers, and clinical advisors. Page coming soon."
      />
    </>
  );
}
