import { Head } from 'vite-react-ssg';
import { LegalLayout, type LegalSection } from '../../components/legal/LegalLayout';
import { CONTACT_EMAIL } from '../../lib/config';

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    body: (
      <>
        <p>
          Roshan AI LLC ("Roshan AI," "we," "us") is a Delaware-registered
          limited liability company with operations in Arizona, USA. We build
          clinical-grade AI infrastructure, including the ShifaMind product.
        </p>
        <p>
          This Privacy Policy describes how we handle information collected
          through our public website (roshan-ai.com), the ShifaMind platform,
          and any related services. Protected Health Information (PHI) handled
          through customer deployments is governed by a separate Business
          Associate Agreement (BAA), not this policy.
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    heading: 'Information we collect',
    body: (
      <>
        <p>
          <strong>Information you give us.</strong> Name, email address,
          organization, role, and the contents of messages you send via the
          contact form or by email.
        </p>
        <p>
          <strong>Account information.</strong> If you create an account on the
          ShifaMind platform, we collect the account credentials and any profile
          details you provide.
        </p>
        <p>
          <strong>Customer-submitted content.</strong> If you submit clinical
          notes or other content to the platform for inference, we process that
          content to produce predictions and return results to you. Customer
          notes are not used to train our base models by default.
        </p>
        <p>
          <strong>Usage information.</strong> IP address, browser type, pages
          visited, referring URL, and similar technical signals collected
          automatically by our servers and analytics tools.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use-information',
    heading: 'How we use information',
    body: (
      <>
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Operate, maintain, and secure our services;</li>
          <li>Respond to inquiries and provide support;</li>
          <li>
            Improve our products, typically through aggregate or de-identified
            data, never by training on identifiable customer content without
            explicit written consent;
          </li>
          <li>Send transactional and account-related communications;</li>
          <li>Comply with legal obligations and enforce our Terms of Service.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'phi-and-hipaa',
    heading: 'PHI and HIPAA',
    body: (
      <>
        <p>
          When customers process Protected Health Information (PHI) through
          the ShifaMind platform under a signed BAA, that PHI is handled
          according to HIPAA, the BAA, and the customer's instructions, not
          this Privacy Policy.
        </p>
        <p>
          We do not use PHI to train our base models. We do not sell PHI. We do
          not share PHI with third parties except as permitted by the BAA and
          required to operate the service.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    heading: 'Sharing information',
    body: (
      <>
        <p>We share information with:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Service providers.</strong> Vendors who help us operate
            (hosting, analytics, email). They are contractually bound to use
            the information only on our behalf.
          </li>
          <li>
            <strong>Legal compliance.</strong> When required by law, court
            order, or to protect the rights, safety, or property of Roshan AI
            or others.
          </li>
          <li>
            <strong>Business transfers.</strong> In the event of a merger,
            acquisition, or sale of assets, with continued protection of your
            information.
          </li>
        </ul>
        <p>We do not sell personal information.</p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies and tracking',
    body: (
      <>
        <p>
          We use a minimal set of cookies to remember your theme preference and
          to measure aggregate site usage. We do not use cross-site tracking
          cookies or third-party advertising networks. You can disable cookies
          in your browser; the site will continue to work, though some
          preferences may not persist.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    heading: 'Data retention',
    body: (
      <>
        <p>
          We retain account information for as long as the account is active,
          plus a reasonable period afterward for legal, audit, and recovery
          purposes. Contact-form submissions are retained for up to two years.
          Customer-submitted content is retained according to the customer's
          configuration and the terms of any signed agreement.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: (
      <>
        <p>
          Depending on your jurisdiction, you may have the right to access,
          correct, delete, or restrict processing of your personal information.
          To exercise these rights, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>
          . We will respond within the timelines required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'international',
    heading: 'International transfers',
    body: (
      <>
        <p>
          Our servers and primary infrastructure are located in the United
          States. If you access our services from outside the United States,
          your information will be transferred to and processed in the U.S. We
          implement appropriate safeguards for international transfers as
          required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    heading: 'Security',
    body: (
      <>
        <p>
          We use commercially reasonable safeguards to protect information
          against unauthorized access, alteration, and destruction, including
          TLS in transit, encryption at rest, and strict access controls. No
          system is perfectly secure, and we cannot guarantee absolute
          security; if a breach materially affects your information, we will
          notify you in accordance with applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    heading: 'Children',
    body: (
      <>
        <p>
          Our services are not intended for, and we do not knowingly collect
          information from, individuals under 18.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time. We will revise
          the "Effective" date at the top and, for material changes, take
          reasonable steps to notify affected users (for example, by email or
          a prominent notice on the site).
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact us',
    body: (
      <>
        <p>
          Questions about this Privacy Policy? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Roshan AI</title>
        <meta
          name="description"
          content="How Roshan AI collects, uses, and protects information across our website and the ShifaMind platform."
        />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://roshan-ai.com/legal/privacy" />
      </Head>
      <LegalLayout
        eyebrow="Legal · Privacy"
        title="Privacy Policy"
        effectiveDate="2026-01-01"
        intro={
          <p>
            This Privacy Policy explains what information Roshan AI collects,
            how we use it, and what choices you have. We tried to keep it
            short, direct, and honest. If anything is unclear, email us.
          </p>
        }
        sections={sections}
      />
    </>
  );
}
