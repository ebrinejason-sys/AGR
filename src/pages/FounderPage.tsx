import styles from './FounderPage.module.css';
import FounderStoryText from './FounderStoryText';

export default function FounderPage() {
    return (
        <div className={styles.container}>

            {/* ── Cinematic full-bleed hero ── */}
            <section className={styles.hero}>
                <div className={styles.heroImage}>
                    <img
                        src="/images/founder.jpg"
                        alt="Akatwijuka Grace — Founder of African Girl Rise"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className={styles.heroImageOverlay} />
                </div>

                <div className={styles.heroContent}>
                    <span className={styles.heroPill}>The Visionary</span>
                    <h1 className={styles.heroName}>
                        Akatwijuka<br />
                        <span>Grace</span>
                    </h1>
                    <p className={styles.heroRole}>Founder &amp; Visionary Director · African Girl Rise</p>
                    <p className={styles.heroTagline}>
                        &ldquo;My parents broke the cycle so I could rise. Now I spend my life proving that your beginning does not define your becoming.&rdquo;
                    </p>
                </div>
            </section>

            {/* ── Bio strip ── */}
            <div className={styles.bioStrip}>
                <div className={styles.bioItem}>
                    <span className={styles.bioLabel}>Education</span>
                    <span className={styles.bioValue}>4th Year Law Student, Uganda Christian University</span>
                </div>
                <div className={styles.bioItem}>
                    <span className={styles.bioLabel}>Location</span>
                    <span className={styles.bioValue}>Ibanda District, Western Uganda</span>
                </div>
                <div className={styles.bioItem}>
                    <span className={styles.bioLabel}>Contact</span>
                    <a href="https://wa.me/256703727965" className={styles.bioLink}>+256 703 727 965</a>
                </div>
            </div>

            {/* ── Editorial content ── */}
            <section className={styles.editorialSection}>
                <div className={styles.editorialGrid}>

                    {/* Sticky image */}
                    <div className={styles.founderImageFrame}>
                        <img
                            src="/images/founder.jpg"
                            alt="Akatwijuka Grace"
                            className={styles.founderImage}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className={styles.imageOverlay}>
                            <span className={styles.imageCaption}>Akatwijuka Grace · Founder &amp; Visionary Director</span>
                        </div>
                    </div>

                    {/* Story */}
                    <div className={styles.editorialContent}>
                        <h2>A Girl Whose Parents <span>Broke the Cycle</span></h2>
                        <FounderStoryText />

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Initiative</span>
                                <p className={styles.statValue}>African Girl Rise Initiative (Registered 2025)</p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Girls Reached</span>
                                <p className={styles.statValue}>800+ through direct programmes</p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Core Belief</span>
                                <p className={styles.statValue}>&ldquo;Your beginning does not define your becoming.&rdquo;</p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Life Motto</span>
                                <p className={styles.statValue}>&ldquo;Rise. Then reach back.&rdquo;</p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>WhatsApp Only</span>
                                <p className={styles.statValue}>
                                    <a href="https://wa.me/256703727965" className={styles.contactLink}>+256 703 727 965</a>
                                </p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Calls Only</span>
                                <p className={styles.statValue}>
                                    <a href="tel:+256763738733" className={styles.contactLink}>+256 763 738 733</a>
                                </p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Email</span>
                                <p className={styles.statValue}>
                                    <a href="mailto:africangirlriseltd@gmail.com" className={styles.contactLink}>africangirlriseltd@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Statement band ── */}
            <section className={styles.statementBox}>
                <div className={styles.statementInner}>
                    <p>&ldquo;I am not special. I am simply a girl whose parents chose to break the cycle. They did not bequeath hardship; they passed on hope. Now I reach back to ignite that same transformation in others.&rdquo;</p>
                    <div className={styles.signature}>— Akatwijuka Grace, Founder &amp; Visionary Director</div>
                </div>
            </section>

        </div>
    );
}
