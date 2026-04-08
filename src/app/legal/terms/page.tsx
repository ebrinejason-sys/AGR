import Link from "next/link";
import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Service | African Girl Rise",
  description:
    "Terms and conditions governing use of the African Girl Rise website and services.",
};

export default function TermsOfService() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span>Terms of Service</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.meta}>Last updated: April 8, 2026</p>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p>
            Welcome to African Girl Rise (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or
            using our website at{" "}
            <a href="https://africangirlrise.org" target="_blank" rel="noopener noreferrer">
              https://africangirlrise.org
            </a>{" "}
            (the &quot;Site&quot;) and any related services, you agree to be bound by these Terms of
            Service. Please read them carefully.
          </p>

          <h2>1. About Us</h2>
          <p>
            African Girl Rise is a registered Ugandan non-profit organisation headquartered in
            Kiburara, Ibanda District, Uganda. Our mission is to empower marginalized adolescent
            girls to transcend systemic barriers, reclaim their futures, and lead with unyielding
            strength across education, health, legal advocacy, and mentorship domains.
          </p>

          <h2>2. Acceptance of Terms</h2>
          <p>
            By using this Site you confirm that you are at least 18 years old (or have the
            consent of a parent or guardian) and that you accept these Terms in full. If you do
            not agree with any part of these Terms, you must discontinue use of the Site
            immediately.
          </p>

          <h2>3. Use of the Site</h2>
          <p>You agree to use the Site only for lawful purposes and in a way that does not:</p>
          <ul>
            <li>Infringe upon the rights of others;</li>
            <li>
              Restrict or inhibit anyone else&apos;s use or enjoyment of the Site;
            </li>
            <li>
              Upload or transmit any unlawful, harmful, threatening, abusive, obscene, or
              defamatory material;
            </li>
            <li>
              Attempt to gain unauthorised access to any part of the Site or its related systems;
            </li>
            <li>
              Use automated tools (bots, scrapers, crawlers) to collect data without prior written
              consent.
            </li>
          </ul>

          <h2>4. Donations</h2>
          <p>
            All monetary donations made through the Site are processed securely via our
            third-party payment processors (Paddle and Stripe). By completing a donation you
            confirm:
          </p>
          <ul>
            <li>You are authorised to use the payment method provided;</li>
            <li>The donation is voluntary and made in good faith;</li>
            <li>
              You have read and understood our{" "}
              <Link href="/legal/refund">Refund Policy</Link>.
            </li>
          </ul>
          <p>
            African Girl Rise is a non-profit organisation. Donations are used exclusively to fund
            our empowerment programmes in Uganda. We do not sell goods or services for commercial
            profit.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All content on the Site — including text, photographs, graphics, logos, video, and
            programme materials — is the property of African Girl Rise or its licensors and is
            protected by applicable copyright and intellectual property laws. You may not
            reproduce, distribute, or create derivative works from any content without our express
            written permission.
          </p>

          <h2>6. Third-Party Links</h2>
          <p>
            The Site may contain links to external websites. African Girl Rise has no control over
            the content or practices of those sites and accepts no responsibility for them. A link
            does not constitute an endorsement.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The Site and its content are provided &quot;as is&quot; without warranty of any kind, either
            express or implied, including but not limited to warranties of merchantability, fitness
            for a particular purpose, or non-infringement. We do not warrant that the Site will be
            uninterrupted, error-free, or free of viruses.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, African Girl Rise shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of (or inability to use) the Site, even if we have been advised
            of the possibility of such damages.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the Republic
            of Uganda. Any disputes arising under these Terms shall be subject to the exclusive
            jurisdiction of the courts of Uganda.
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. The &quot;Last updated&quot; date at the top of
            this page reflects when the most recent changes were made. Continued use of the Site
            after any changes constitutes your acceptance of the revised Terms.
          </p>

          <div className={styles.divider} />

          <div className={styles.contactBlock}>
            <h3>Questions about these Terms?</h3>
            <p>African Girl Rise Ltd — Kiburara, Ibanda District, Uganda</p>
            <p>
              Email:{" "}
              <a href="mailto:africangirlriseltd@gmail.com">
                africangirlriseltd@gmail.com
              </a>
            </p>
            <p>WhatsApp / Phone: +256 703 727 965</p>
          </div>
        </div>
      </div>
    </div>
  );
}
