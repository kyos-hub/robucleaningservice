import { createFileRoute } from "@tanstack/react-router";

const NAVY = "#1B3A4B";
const TEAL = "#2E6E62";
const PAPER = "#FAF8F4";
const INK = "#2A2A28";
const RULE = "#D8D2C4";

type Section = { heading: string; body: React.ReactNode };

const privacy: Section[] = [
  {
    heading: "1. Introduction",
    body: (
      <>
        Robu Cleaning Services Limited ("Robu," "we," "us," or "our")
        respects your privacy and is committed to protecting your personal
        data in accordance with the Kenya Data Protection Act, 2019, and
        applicable regulations. This Privacy Policy explains how we
        collect, use, store, and protect information when you visit our
        website or engage our services.
      </>
    ),
  },
  {
    heading: "2. Information We Collect",
    body: (
      <ul>
        <li>
          <strong>Contact details:</strong> name, email address, phone
          number, physical/mailing address
        </li>
        <li>
          <strong>Business information:</strong> company name, position,
          and details relevant to a service inquiry or quotation
        </li>
        <li>
          <strong>Website usage data:</strong> IP address, browser type,
          pages visited, and time spent on the site, collected
          automatically via cookies or similar technologies
        </li>
        <li>
          <strong>Communications:</strong> records of correspondence,
          inquiries, and feedback you send us
        </li>
      </ul>
    ),
  },
  {
    heading: "3. How We Collect Information",
    body: (
      <ul>
        <li>
          Directly from you, when you fill out a contact or quotation form,
          email us, or call our offices
        </li>
        <li>
          Automatically, through cookies and website analytics tools when
          you browse our site
        </li>
        <li>
          From third parties, such as referrals from existing clients,
          where relevant to setting up a service
        </li>
      </ul>
    ),
  },
  {
    heading: "4. How We Use Your Information",
    body: (
      <ul>
        <li>Respond to inquiries and provide quotations</li>
        <li>
          Deliver and manage cleaning, pest control, ground maintenance, and
          related services
        </li>
        <li>
          Communicate with clients about service schedules, feedback, and
          complaints
        </li>
        <li>Improve our website and services</li>
        <li>Comply with legal and regulatory obligations</li>
        <li>
          Maintain client confidentiality records as part of our internal
          quality and confidentiality policies
        </li>
      </ul>
    ),
  },
  {
    heading: "5. Legal Basis for Processing",
    body: (
      <>
        We process personal data on the basis of: your consent, the
        necessity of processing to perform a service contract with you, and
        our legitimate business interests (such as improving service
        delivery), always balanced against your rights as a data subject.
      </>
    ),
  },
  {
    heading: "6. Sharing of Information",
    body: (
      <>
        We do not sell your personal data. We may share information with:
        <ul>
          <li>
            Employees and supervisors directly involved in delivering your
            service, on a need-to-know basis
          </li>
          <li>Regulatory or governmental authorities, where required by law</li>
          <li>
            Service providers who support our operations (e.g., IT
            support), under confidentiality obligations
          </li>
        </ul>
        We do not share client information with third parties for marketing
        purposes.
      </>
    ),
  },
  {
    heading: "7. Data Security",
    body: (
      <>
        We maintain internal confidentiality practices, restricted access
        to client records, and staff vetting procedures (including
        requiring certificates of good conduct) to protect data integrity.
        However, no method of electronic transmission or storage is
        completely secure, and we cannot guarantee absolute security.
      </>
    ),
  },
  {
    heading: "8. Data Retention",
    body: (
      <>
        We retain personal data only for as long as necessary to fulfill
        the purposes described in this policy, or as required by law or
        contractual obligations, after which it is securely deleted or
        anonymized.
      </>
    ),
  },
  {
    heading: "9. Your Rights",
    body: (
      <>
        Under the Kenya Data Protection Act, 2019, you have the right to:
        <ul>
          <li>Be informed of how your data is used</li>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>
            Request deletion of your data, subject to legal or contractual
            limitations
          </li>
          <li>Object to or restrict certain processing</li>
          <li>
            Lodge a complaint with the Office of the Data Protection
            Commissioner (ODPC), Kenya
          </li>
        </ul>
        To exercise these rights, contact us using the details below.
      </>
    ),
  },
  {
    heading: "10. Cookies",
    body: (
      <>
        Our website may use cookies to improve functionality and understand
        visitor behavior. You can control or disable cookies through your
        browser settings; disabling cookies may affect some website
        features.
      </>
    ),
  },
  {
    heading: "11. Children's Privacy",
    body: (
      <>
        Our website and services are intended for businesses and adults. We
        do not knowingly collect personal data from children.
      </>
    ),
  },
  {
    heading: "12. Changes to This Policy",
    body: (
      <>
        We may update this Privacy Policy periodically. The "Last updated"
        date at the top reflects the most recent revision. We encourage you
        to review this page regularly.
      </>
    ),
  },
];

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Robu Cleaning Services" },
      {
        name: "description",
        content:
          "Privacy policy for Robu Cleaning Services Ltd covering data collection, service delivery, client communication and your rights under Kenya data protection law.",
      },
      { property: "og:title", content: "Privacy Policy — Robu Cleaning Services" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

export default function PrivacyPage() {
  return (
    <div
      style={{
        fontFamily: "'Source Serif 4', 'Georgia', serif",
        background: PAPER,
        color: INK,
        minHeight: "100%",
      }}
    >
      <style>{`
        .robu-body ul { margin: 0.6em 0 0 0; padding-left: 1.3em; }
        .robu-body li { margin-bottom: 0.45em; line-height: 1.65; }
      `}</style>

      <header style={{ background: NAVY, color: PAPER, padding: "40px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'Zilla Slab', Georgia, serif",
              fontSize: 13,
              letterSpacing: "0.04em",
              color: "#9FB8BF",
              marginBottom: 8,
            }}
          >
            Robu Cleaning Services Ltd
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.15,
              margin: 0,
              fontWeight: 600,
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              marginTop: 12,
              color: "#C9D6D6",
              fontSize: 15,
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            We explain here, in plain terms, what information we collect and
            how we look after it.
          </p>
          <div style={{ marginTop: 20, fontSize: 13, color: "#8FA8AE" }}>
            Last updated: 7 September 2026
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="robu-body">
          {privacy.map((s) => (
            <section key={s.heading} style={{ marginBottom: 30 }}>
              <h2
                style={{
                  fontFamily: "'Zilla Slab', Georgia, serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: NAVY,
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: `1px solid ${RULE}`,
                }}
              >
                {s.heading}
              </h2>
              <div style={{ fontSize: 15.5, lineHeight: 1.75, color: INK }}>
                {s.body}
              </div>
            </section>
          ))}

          <section>
            <h2
              style={{
                fontFamily: "'Zilla Slab', Georgia, serif",
                fontSize: 17,
                fontWeight: 600,
                color: NAVY,
                marginBottom: 10,
                paddingBottom: 8,
                borderBottom: `1px solid ${RULE}`,
              }}
            >
              13. Contact Us
            </h2>
            <div
              style={{
                fontSize: 15.5,
                lineHeight: 1.85,
                background: "#F0EDE3",
                border: `1px solid ${RULE}`,
                borderRadius: 4,
                padding: "18px 20px",
              }}
            >
              Robu Cleaning Services Limited
              <br />
              P.O. Box 7843–30100, Eldoret, Kenya
              <br />
              Email: robu.cleaning@gmail.com
              <br />
              Telephone: 053 2060334 / 0722 762 198
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}