import { Head } from 'vite-react-ssg';
import { PagePlaceholder } from '../components/PagePlaceholder';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found — Roshan AI</title>
        <meta name="robots" content="noindex" />
      </Head>
      <PagePlaceholder
        eyebrow="404"
        title="Page not found."
        description="The page you were looking for doesn't exist or has moved."
        status="Not found"
      />
    </>
  );
}
