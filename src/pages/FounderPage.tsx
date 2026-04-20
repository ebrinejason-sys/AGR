import styles from './FounderPage.module.css';
import FounderStoryText from './FounderStoryText';

export default function FounderPage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <p className="subheading reveal">The Visionary</p>
                <h1 className="heading-display reveal">Akatwijuka <span className="text-gradient">Grace</span></h1>
                <p className={styles.heroTagline}>&ldquo;My parents broke the cycle so I could rise. Now I spend my life proving that your beginning does not define your becoming.&rdquo;</p>
            </section>

            <section className={styles.editorialSection}>
                <div className={styles.editorialGrid}>
                    <div className={styles.founderImageFrame} style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                            src="/images/founder.jpg"
                            alt="Akatwijuka Grace — Founder of African Girl Rise"
                            className={styles.founderImage}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className={styles.imageOverlay}>
                            <span className={styles.imageCaption}>Akatwijuka Grace · Founder &amp; Visionary Director</span>
                        </div>
                    </div>

                    <div className={styles.editorialContent}>
                        <h2 className="heading-section">A Girl Whose Parents <span className="text-gradient">Broke the Cycle</span></h2>
                        <FounderStoryText />

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Role</span>
                                <p className={styles.statValue}>Founder &amp; Visionary Director</p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Education</span>
                                <p className={styles.statValue}>4th Year Law Student, Uganda Christian University</p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Initiative</span>
                                <p className={styles.statValue}>African Girl Rise Initiative (Registered 2025)</p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Location</span>
                                <p className={styles.statValue}>Ibanda District, Western Uganda</p>
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
                                    <a href="mailto:grace@africangirlrise.org" className={styles.contactLink}>grace@africangirlrise.org</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.statementBox}>
                <div className={styles.statementInner}>
                    <p>&ldquo;I am not special. I am simply a girl whose parents chose to break the cycle. They did not bequeath hardship; they passed on hope. Now I reach back to ignite that same transformation in others.&rdquo;</p>
                    <div className={styles.signature}>— Akatwijuka Grace, Founder &amp; Visionary Director</div>
                </div>
            </section>
        </div>
    );
}
