import Link from "next/link";
import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Refund Policy | African Girl Rise",
  description:
    "African Girl Rise refund and cancellation policy for donations and payments.",
};

export default function RefundPolicy() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span>Refund Policy</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.title}>Refund &amp; Cancellation Policy</h1>
          <p className={styles.meta}>Last updated: April 8, 2026</p>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p>
            African Girl Rise sincerely thanks every supporter who contributes to our mission of
            empowering marginalized adolescent girls in Uganda. This policy explains our approach
            to refunds and cancellations for donations and payments made through our website.
          </p>

          <div className={styles.highlight}>
            <p>
              <strong>Our commitment:</strong> While donations are generally non-refundable, we
              will always handle genuine errors or disputes promptly and fairly. Please contact us
              within 30 days if there is an issue with your payment.
            </p>
          </div>

          <h2>1. General Policy on Donations</h2>
          <p>
            Donations made to African Girl Rise — whether one-time or recurring — are voluntary
            contributions to a non-profit cause. As with most charitable organisations, donations
            are generally <strong>non-refundable</strong> once processed, as funds are typically
            allocated to active programmes immediately.
          </p>
          <p>
            However, we recognise that genuine errors occur. We assess refund requests on a
            case-by-case basis in the exceptional circumstances described below.
          </p>

          <h2>2. Eligible Circumstances for a Refund</h2>
          <p>
            We will issue a refund in the following situations, provided the request is made
            within <strong>30 days</strong> of the original transaction:
          </p>
          <ul>
            <li>
              <strong>Duplicate charges:</strong> You were charged more than once for the same
              intended donation.
            </li>
            <li>
              <strong>Unauthorised transaction:</strong> A payment was made using your payment
              method without your knowledge or consent. Please also contact your bank or card
              provider immediately in this case.
            </li>
            <li>
              <strong>Technical error:</strong> A technical fault caused an incorrect amount to
              be charged.
            </li>
            <li>
              <strong>Verified error on our part:</strong> African Girl Rise made an administrative
              error in processing your payment.
            </li>
          </ul>

          <h2>3. Recurring Donation Cancellations</h2>
          <p>
            You may cancel a recurring monthly donation at any time by:
          </p>
          <ul>
            <li>
              Contacting us directly at{" "}
              <a href="mailto:africangirlriseltd@gmail.com">
                africangirlriseltd@gmail.com
              </a>
              ; or
            </li>
            <li>
              Managing your subscription through the link in your donation confirmation email
              or by contacting our team directly for payment support.
            </li>
          </ul>
          <p>
            Cancellations take effect at the end of the current billing period. Amounts already
            charged before cancellation are generally non-refundable unless they fall within an
            eligible circumstance listed above.
          </p>

          <h2>4. How to Request a Refund</h2>
          <p>
            To request a refund, please contact us within 30 days of the transaction with the
            following information:
          </p>
          <ol>
            <li>Your full name and email address used for the donation;</li>
            <li>The date and approximate amount of the transaction;</li>
            <li>
              A brief description of the issue (e.g., duplicate charge, unauthorised payment);
            </li>
            <li>Any supporting documentation (e.g., bank statement, email receipt).</li>
          </ol>
          <p>
            We will acknowledge your request within <strong>3 business days</strong> and aim to
            resolve it within <strong>10 business days</strong>. Approved refunds are processed
            via the original payment method and may take 5–10 business days to appear in your
            account depending on your bank.
          </p>

          <h2>5. Payment Processors</h2>
          <p>
            Payments on this site are processed through <strong>Flutterwave</strong> for mobile
            money donations and <strong>MarzPay</strong> for card donations. Refunds initiated by
            African Girl Rise are issued back through the original payment route, and each
            processor&apos;s own terms and conditions also apply to your transaction.
          </p>

          <h2>6. Non-Monetary Contributions</h2>
          <p>
            This policy applies solely to monetary donations. In-kind contributions (goods,
            services, or volunteered time) are not subject to refund.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. The &quot;Last updated&quot; date at the top of
            this page reflects the most recent revision.
          </p>

          <div className={styles.divider} />

          <div className={styles.contactBlock}>
            <h3>Refund requests &amp; payment enquiries</h3>
            <p>African Girl Rise Ltd — Kiburara, Ibanda District, Uganda</p>
            <p>
              Email:{" "}
              <a href="mailto:africangirlriseltd@gmail.com">
                africangirlriseltd@gmail.com
              </a>
            </p>
            <p>WhatsApp / Phone: +256 703 727 965</p>
            <p className={styles.relatedLinks}>
              Also see our{" "}
              <Link href="/legal/terms">Terms of Service</Link> and{" "}
              <Link href="/legal/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
