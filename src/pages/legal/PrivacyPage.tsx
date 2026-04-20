import { Link } from 'react-router-dom';
import styles from './legal.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <span>Legal</span>
                    <span>/</span>
                    <span>Privacy Policy</span>
                </div>

                <div className={styles.header}>
                    <span className={styles.eyebrow}>Legal</span>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.meta}>Last updated: April 8, 2026</p>
                </div>

                <div className={styles.body}>
                    <p>
                        African Girl Rise (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your personal
                        information. This Privacy Policy explains what data we collect, how we use it, and your
                        rights with respect to it when you use our website at{' '}
                        <a href="https://africangirlrise.org" target="_blank" rel="noopener noreferrer">
                            https://africangirlrise.org
                        </a>
                        .
                    </p>

                    <div className={styles.highlight}>
                        <p>
                            <strong>Summary:</strong> We only collect information you voluntarily provide (such as
                            your email address or donation details). We never sell your data. We use it solely to
                            communicate with you and process donations.
                        </p>
                    </div>

                    <h2>1. Information We Collect</h2>
                    <h3>a) Information you provide directly</h3>
                    <ul>
                        <li><strong>Email address</strong> — when you subscribe to our newsletter or submit a contact form.</li>
                        <li><strong>Name and message</strong> — when you use our contact or partnership enquiry forms.</li>
                        <li><strong>Payment information</strong> — when you make a donation. Payment details (card numbers, billing address) are handled entirely by our payment processors (currently Flutterwave for mobile money and MarzPay for card payments) and are never stored on our servers.</li>
                    </ul>

                    <h3>b) Information collected automatically</h3>
                    <ul>
                        <li><strong>Usage data</strong> — pages visited, browser type, device type, and approximate geographic region, collected via server logs and analytics.</li>
                        <li><strong>Cookies</strong> — we use only essential cookies required for the Site to function (e.g., session management). We do not use advertising or tracking cookies.</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Send newsletters and programme updates you have subscribed to;</li>
                        <li>Respond to enquiries and partnership requests;</li>
                        <li>Process and acknowledge donations;</li>
                        <li>Improve our website and understand how it is being used;</li>
                        <li>Comply with legal and regulatory obligations.</li>
                    </ul>

                    <h2>3. Third-Party Service Providers</h2>
                    <p>We share limited data with the following trusted third parties to operate our services:</p>
                    <ul>
                        <li><strong>Supabase</strong> — database hosting for subscriber and contact data (hosted in data centres with industry-standard security).</li>
                        <li><strong>Resend</strong> — transactional email delivery for contact confirmations and newsletters.</li>
                        <li><strong>Flutterwave</strong> — hosted mobile money checkout and payment processing.</li>
                        <li><strong>MarzPay</strong> — hosted card checkout and payment processing.</li>
                    </ul>
                    <p>Each provider is bound by its own privacy policy and applicable data protection law. We do not permit any provider to use your data for their own marketing purposes.</p>

                    <h2>4. Data Retention</h2>
                    <p>We retain your personal data only for as long as necessary to fulfil the purposes described in this policy:</p>
                    <ul>
                        <li><strong>Newsletter subscribers</strong> — until you unsubscribe or request deletion.</li>
                        <li><strong>Contact enquiries</strong> — up to 2 years after the enquiry is resolved.</li>
                        <li><strong>Donation records</strong> — up to 7 years to comply with financial record-keeping obligations.</li>
                    </ul>

                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li><strong>Access</strong> the personal data we hold about you;</li>
                        <li><strong>Correct</strong> inaccurate or incomplete data;</li>
                        <li><strong>Delete</strong> your data (subject to legal retention requirements);</li>
                        <li><strong>Withdraw consent</strong> for email communications at any time by clicking the unsubscribe link in any email or contacting us directly;</li>
                        <li><strong>Object</strong> to or restrict certain uses of your data.</li>
                    </ul>
                    <p>To exercise any of these rights, please contact us using the details below. We will respond within 30 days.</p>

                    <h2>6. Data Security</h2>
                    <p>We implement appropriate technical and organisational measures to protect your data against unauthorised access, disclosure, alteration, or destruction. All data transmitted to and from the Site is encrypted via HTTPS/TLS.</p>

                    <h2>7. Children&apos;s Privacy</h2>
                    <p>Our Site is not directed at children under the age of 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.</p>

                    <h2>8. International Data Transfers</h2>
                    <p>Our service providers may process data outside Uganda. Where this occurs, we ensure appropriate safeguards are in place consistent with applicable data protection law.</p>

                    <h2>9. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy periodically. The &quot;Last updated&quot; date at the top indicates the most recent revision. Continued use of the Site after changes constitutes acceptance of the revised policy.</p>

                    <div className={styles.divider} />

                    <div className={styles.contactBlock}>
                        <h3>Data enquiries &amp; rights requests</h3>
                        <p>African Girl Rise Ltd — Kiburara, Ibanda District, Uganda</p>
                        <p>Email: <a href="mailto:africangirlriseltd@gmail.com">africangirlriseltd@gmail.com</a></p>
                        <p>WhatsApp / Phone: +256 703 727 965</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
