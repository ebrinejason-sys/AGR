import styles from './page.module.css';
import Link from 'next/link';

export default function OurStory() {
    return (
        <div className={styles.container}>
            {/* Hero Header */}
            <section className={styles.hero}>
                <div className={styles.heroGlowPink} />
                <div className={styles.heroGlowPurple} />
                <h1 className="heading-xl">The <span className="text-gradient">Narrative</span></h1>
                <p className={styles.subtitle}>
                    &quot;Your beginning does not define your becoming.&quot;
                </p>
            </section>

            {/* Main Content Sections */}
            <section className={styles.contentSection}>

                {/* The Narrative */}
                <div className={styles.card}>
                    <div className={styles.cardGlowBlue} />
                    <h2>A Promise to Keep</h2>
                    <div className={styles.textBody}>
                        <p>I grew up seeing it—the brilliant, sparkling potential in the eyes of young girls slowly dimmed by circumstance. A girl with a mind for numbers stops coming to school, her uniform exchanged for responsibilities too heavy for her shoulders. A young artist with a voice that could move mountains falls silent, told her dreams are too big for her world.</p>
                        <p>I saw poverty try to write a script for lives not yet lived, and I saw society nodding, as if it were inevitable.</p>
                        <p>But then, I also saw the exceptions. The ones who, against all odds, rose. They didn&apos;t rise because their path was easier; they rose because somewhere, somehow, they were given a single thread of hope to cling to—a teacher who believed, a book that inspired, a small act of kindness that whispered, <em>&quot;You are more.&quot;</em></p>
                        <p><strong>That whisper is not a privilege. It should be a promise.</strong><br />That is the promise we are here to keep.</p>
                    </div>
                </div>

                {/* Our Why */}
                <div className={styles.cardSecondary}>
                    <h2>Our &quot;Why&quot;: The Heart of the Matter</h2>
                    <div className={styles.textBody}>
                        <p>We exist because the world often mistakes a difficult beginning for a predetermined ending. In communities like Kiburara and across Africa, adolescent girls face a convergence of storms:</p>
                        <ul className={styles.featureList}>
                            <li><strong>A Mental Health Crisis:</strong> Untreated trauma, anxiety, and depression become walls around their potential.</li>
                            <li><strong>An Educational Emergency:</strong> School dropouts and academic failure cut the rope before they can climb.</li>
                            <li><strong>A Cycle of Disempowerment:</strong> Early pregnancies and societal limitations tell them their stories are already written.</li>
                        </ul>
                        <p>We reject this narrative. We have seen that with the right support, a girl&apos;s toughest ground can become the foundation for her greatest strength. <strong>Her past is not a prophecy; it is preparation.</strong></p>
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className={styles.card}>
                    <div className={styles.cardGlowPink} />
                    <h2>Vision & Mission</h2>
                    <div className={styles.textBody}>
                        <p><strong>Our Vision: The World We Are Building</strong><br />
                            We dream of a continent—and a world—where you can look at any girl and see not where she comes from, but where she is going. We envision a future where communities are led by women who have turned their pain into purpose, their barriers into blueprints, and their survival into service.</p>
                        <p>Our vision is an Africa transformed by the leadership of women who were once told they couldn&apos;t, but who, through our support, discovered that they could.</p>

                        <div className={styles.divider} />

                        <p><strong>Our Mission: The Work of Rising</strong><br />
                            Our mission is to be the consistent, empowering space between a girl&apos;s challenging reality and her radiant possibility.</p>
                        <p>We execute this mission through <em>A Girl Defined By Rise Initiative</em>, a holistic, school-based intervention that provides:</p>
                        <ul className={styles.featureList}>
                            <li><strong>A Safe Haven:</strong> &quot;Rise Rooms&quot; where girls can heal, speak freely, and be heard without judgment.</li>
                            <li><strong>A Toolkit for Life:</strong> From mental health counselling and academic tutoring to sexual health education and financial literacy.</li>
                            <li><strong>A Sisterhood of Belief:</strong> Mentorship from women who have walked similar paths and a peer network that uplifts instead of competes.</li>
                            <li><strong>A Bridge to the Future:</strong> Career exposure, leadership training, and tangible resources (school supplies to sanitary pads) that remove practical barriers.</li>
                        </ul>
                    </div>
                </div>

                {/* Core Belief */}
                <div className={styles.cardSecondary}>
                    <h2>Our Core Belief</h2>
                    <div className={styles.textBody}>
                        <p className={styles.highlightQuote}>&quot;Your beginning does not define your becoming.&quot;</p>
                        <p>At the center of everything we do is this unwavering belief. We do not see poor backgrounds. We see unyielding resilience waiting to be focused.</p>
                        <p>We do not see broken girls. We see heroes in the middle of their origin story.</p>
                        <p>We believe in strength, not salvage. In investment, not charity. In partnership, not rescue.</p>
                        <p><strong>We are not giving girls a voice. They have one. We are amplifying it until the whole world has to listen.</strong></p>
                    </div>
                </div>

            </section>

            {/* Call to Action */}
            <section className={styles.ctaSection}>
                <h2>Join Us: Write a New Story</h2>
                <p>This is more than a program. It is a movement. It starts with one girl choosing to stay in school, to believe in her worth, to define her own future. It multiplies as she reaches back to lift the next.</p>

                <div className={styles.ctaGrid}>
                    <div className={styles.ctaBox}>
                        <h3>Donate</h3>
                        <p>Fund a &quot;Rise Room,&quot; or support a girl&apos;s journey for a year.</p>
                        <Link href="/donate" className={styles.btnPrimary}>Donate Now</Link>
                    </div>
                    <div className={styles.ctaBox}>
                        <h3>Partner</h3>
                        <p>Bring your organization&apos;s resources to scale our impact.</p>
                    </div>
                    <div className={styles.ctaBox}>
                        <h3>Mentor</h3>
                        <p>Share your time and wisdom to guide a rising leader.</p>
                    </div>
                    <div className={styles.ctaBox}>
                        <h3>Advocate</h3>
                        <p>Spread our message that every girl deserves the chance to rise.</p>
                    </div>
                </div>

                <div className={styles.finalCall}>
                    <p>Together, we will build a generation defined not by their struggles, but by their strength. Defined not by their fall, but by their rise.</p>
                    <Link href="/events" className={styles.btnPrimary}>Become a Catalyst</Link>
                </div>
            </section>
        </div>
    );
}
