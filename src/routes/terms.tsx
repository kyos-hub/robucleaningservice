import { createFileRoute } from '@tanstack/react-router'
const NAVY = "#1B3A4B";
const TEAL = "#2E6E62";
const PAPER = "#FAF8F4";
const INK = "#2A2A28";
const RULE = "#D8D2C4";

type Section = { heading: string; body: React.ReactNode };

const terms: Section[] = [
  {
    heading: "1. Introduction",
    body: (
      <>
        These Terms and Conditions ("Terms") govern your use of the website
        of Robu Cleaning Services Limited ("Robu," "we," "us," or "our"), a
        limited company registered in Kenya (Certificate No. C168246), with
        offices at Elgeyo Road, Eldoret, and Verdic House, 3rd Floor,
        Nairobi. By accessing or using this website, you agree to be bound
        by these Terms. If you do not agree, please do not use this
        website.
      </>
    ),
  },
  {
    heading: "2. About Us",
    body: (
      <>
        Robu Cleaning Services Limited provides cleaning, pest control and
        fumigation, ground maintenance, messenger and tea-making, and
        sanitary services to banks, commercial buildings, learning
        institutions, hospitals, religious institutions, and private homes
        across the North Rift, South Rift, Central Rift, Western, Nairobi,
        Mombasa, and Nyanza regions.
        <br />
        <br />
        P.O. Box 7843–30100, Eldoret, Kenya
        <br />
        Telephone: 053 2060334 / 0722 762 198
        <br />
        Email: robu.cleaning@gmail.com / robu.cleaning@yahoo.com
      </>
    ),
  },
  {
    heading: "3. Use of This Website",
    body: (
      <>
        You agree to use this website only for lawful purposes and in a
        manner that does not infringe the rights of, or restrict or inhibit
        the use and enjoyment of, this site by any third party. You must
        not:
        <ul>
          <li>
            Attempt to gain unauthorized access to any part of the website,
            servers, or networks connected to it
          </li>
          <li>Introduce viruses, malware, or other harmful material</li>
          <li>Use the website to transmit unsolicited advertising or spam</li>
          <li>
            Copy, reproduce, or redistribute website content without our
            written permission
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "4. Intellectual Property",
    body: (
      <>
        All content on this website, including text, graphics, logos, the
        Robu name and brand, and images, is the property of Robu Cleaning
        Services Limited or its licensors and is protected by applicable
        intellectual property laws. You may not reproduce, distribute, or
        create derivative works from this content without our prior written
        consent.
      </>
    ),
  },
  {
    heading: "5. Service Inquiries and Quotations",
    body: (
      <>
        Any inquiry, quotation request, or booking submitted through this
        website does not constitute a binding contract until confirmed in
        writing by Robu Cleaning Services Limited. Prices, discounts, and
        service terms quoted on the website are indicative and subject to
        confirmation following a site survey, as our pricing depends on
        local conditions and client-specific needs.
      </>
    ),
  },
  {
    heading: "6. Service Delivery",
    body: (
      <ul>
        <li>
          Services are scheduled and customized per site to meet client
          needs, as agreed in a separate service contract or work order
        </li>
        <li>
          Standards and procedures for specific tasks are discussed and
          agreed between Robu and the client
        </li>
        <li>
          We reserve the right to decline or terminate service engagements
          that pose safety, legal, or reputational risk
        </li>
      </ul>
    ),
  },
  {
    heading: "7. Client Responsibilities",
    body: (
      <>
        Clients are expected to provide a safe working environment for our
        staff, timely access to premises, and accurate information
        necessary for us to perform the agreed services.
      </>
    ),
  },
  {
    heading: "8. Confidentiality",
    body: (
      <>
        We treat all client information obtained in the course of providing
        services as confidential, in line with our internal confidentiality
        policy, and will not disclose it to third parties except as
        required by law or with client consent.
      </>
    ),
  },
  {
    heading: "9. Limitation of Liability",
    body: (
      <>
        To the fullest extent permitted by Kenyan law, Robu Cleaning
        Services Limited shall not be liable for any indirect, incidental,
        or consequential loss arising from the use of this website. Nothing
        in these Terms excludes or limits liability that cannot lawfully be
        excluded, including liability for death or personal injury caused
        by negligence.
      </>
    ),
  },
  {
    heading: "10. Third-Party Links",
    body: (
      <>
        This website may contain links to third-party websites. We are not
        responsible for the content, accuracy, or practices of any linked
        external sites.
      </>
    ),
  },
  {
    heading: "11. Changes to These Terms",
    body: (
      <>
        We may update these Terms from time to time. Continued use of the
        website after changes are posted constitutes acceptance of the
        revised Terms.
      </>
    ),
  },
  {
    heading: "12. Governing Law",
    body: (
      <>
        These Terms are governed by the laws of the Republic of Kenya. Any
        disputes arising from the use of this website shall be subject to
        the exclusive jurisdiction of the courts of Kenya.
      </>
    ),
  },
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Robu Cleaning Services" },
      {
        name: "description",
        content:
          "Terms and conditions for Robu Cleaning Services Ltd covering website use, client responsibilities, service delivery and legal obligations.",
      },
      { property: "og:title", content: "Terms & Conditions — Robu Cleaning Services" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

export default function TermsPage() {
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
            Terms and Conditions
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
            Please read these terms carefully before using our website or
            engaging our cleaning, pest control, and facilities services.
          </p>
          <div style={{ marginTop: 20, fontSize: 13, color: "#8FA8AE" }}>
            Last updated: 7 September 2026
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="robu-body">
          {terms.map((s) => (
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