import { Link } from 'react-router-dom';
import styles from './FounderPage.module.css';
import FounderStoryText from './FounderStoryText';

const timeline = [
    { year: '2001', label: 'Born in Ibanda District, Western Uganda' },
    { year: '2018', label: 'Witnessed systemic barriers blocking girls from education' },
    { year: '2021', label: 'Began grassroots mentorship in local communities' },
    { year: '2023', label: 'Enrolled in Law at Uganda Christian University' },
    { year: '2025', label: 'Officially registered African Girl Rise Initiative' },
];

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
                    <div className={styles.heroCtas}>
                        <a href="https://wa.me/256703727965" target="_blank" rel="noopener noreferrer" className="btn-premium">
                            💬 WhatsApp Grace
                        </a>
                        <Link to="/contact" className={styles.heroCtaOutline}>
                            Reach Out
                        </Link>
                    </div>
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
                    <span className={styles.bioLabel}>WhatsApp</span>
                    <a href="https://wa.me/256703727965" className={styles.bioLink}>+256 703 727 965</a>
                </div>
                <div className={styles.bioItem}>
                    <span className={styles.bioLabel}>Girls Reached</span>
                    <span className={styles.bioValue}>800+ through direct programmes</span>
                </div>
            </div>

            {/* ── Editorial content ── */}
            <section className={styles.editorialSection}>
                <div className={styles.editorialGrid}>

                    {/* Left — sticky photo + timeline */}
                    <div className={styles.leftColumn}>
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

                        {/* Timeline */}
                        <div className={styles.timeline}>
                            <h3 className={styles.timelineHeading}>Her Journey</h3>
                            {timeline.map((t) => (
                                <div className={styles.timelineItem} key={t.year}>
                                    <span className={styles.timelineYear}>{t.year}</span>
                                    <div className={styles.timelineDot} />
                                    <p className={styles.timelineLabel}>{t.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — story + stats */}
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
                        </div>

                        {/* Contact glass cards */}
                        <div className={styles.contactCards}>
                            <a href="https://wa.me/256703727965" className={styles.contactCard}>
                                <span className={styles.contactCardIcon}>💬</span>
                                <span className={styles.contactCardLabel}>WhatsApp</span>
                                <span className={styles.contactCardValue}>+256 703 727 965</span>
                            </a>
                            <a href="tel:+256763738733" className={styles.contactCard}>
                                <span className={styles.contactCardIcon}>📞</span>
                                <span className={styles.contactCardLabel}>Phone</span>
                                <span className={styles.contactCardValue}>+256 763 738 733</span>
                            </a>
                            <a href="mailto:africangirlriseltd@gmail.com" className={styles.contactCard}>
                                <span className={styles.contactCardIcon}>✉️</span>
                                <span className={styles.contactCardLabel}>Email</span>
                                <span className={styles.contactCardValue}>africangirlriseltd@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Statement band ── */}
            <section className={styles.statementBox}>
                <div className={styles.statementInner}>
                    <p>&ldquo;I am not special. I am simply a girl whose parents chose to break the cycle. They did not bequeath hardship; they passed on hope. Now I reach back to ignite that same transformation in others.&rdquo;</p>
                    <div className={styles.signature}>— Akatwijuka Grace, Founder &amp; Visionary Director</div>
                    <div className={styles.statementCtas}>
                        <Link to="/our-story" className="btn-premium">Our Story</Link>
                        <Link to="/contact" className="btn-glass">Partner With Us</Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
