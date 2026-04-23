import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Mail, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import PageHero from '../components/PageHero';
import styles from './FounderPage.module.css';

const timeline = [
    { year: '2001', label: 'Born in Ibanda District, Western Uganda' },
    { year: '2018', label: 'Witnessed systemic barriers blocking girls from education' },
    { year: '2021', label: 'Began grassroots mentorship in local communities' },
    { year: '2023', label: 'Enrolled in Law at Uganda Christian University' },
    { year: '2025', label: 'Officially registered African Girl Rise Initiative' },
];

export default function FounderPage() {
    const [isStoryExpanded, setIsStoryExpanded] = useState(false);

    return (
        <div className={styles.container}>

            {/* ─── Hero Section (PageHero) ─── */}
            <PageHero
                eyebrow={<span className={styles.heroPill}>The Visionary</span>}
                title={<><span>Akatwijuka</span><br /><span>Grace</span></>}
                subtitle="Founder & Visionary Director"
                description="“My parents broke the cycle so I could rise. Now I spend my life proving that your beginning does not define your becoming.”"
                actions={
                    <div className={styles.heroCtas}>
                        <a href="https://wa.me/256703727965" className="btn-premium">
                            <MessageSquare size={18} style={{ marginRight: 8 }} /> WhatsApp Grace
                        </a>
                        <Link to="/contact" className="btn-glass" style={{ color: 'var(--text-primary)' }}>
                            Get in Touch
                        </Link>
                    </div>
                }
                backgroundImage="/images/founder.jpg"
            />

            {/* ─── Bio Strip ─── */}
            <div className={styles.bioStrip}>
                <div className={styles.bioItem}>
                    <span className={styles.bioLabel}>Education</span>
                    <span className={styles.bioValue}>4th Year Law Student, UCU</span>
                </div>
                <div className={styles.bioItem}>
                    <span className={styles.bioLabel}>Location</span>
                    <span className={styles.bioValue}>Ibanda District, Uganda</span>
                </div>
                <div className={styles.bioItem}>
                    <span className={styles.bioLabel}>Girls Reached</span>
                    <span className={styles.bioValue}>800+ Direct Impact</span>
                </div>
                <div className={styles.bioItem}>
                    <span className={styles.bioLabel}>Focus Area</span>
                    <span className={styles.bioValue}>Legal Advocacy & Safety</span>
                </div>
            </div>

            {/* ─── Story Section ─── */}
            <section className={styles.editorialSection}>
                <div className={styles.editorialGrid}>
                    
                    {/* Left: Sticky Image & Timeline */}
                    <div className={styles.leftColumn}>
                        <div className={styles.founderImageFrame}>
                            <img src="/images/founder.jpg" alt="Akatwijuka Grace" />
                        </div>

                        <div className={styles.timeline}>
                            <h3 className={styles.timelineHeading}>Her Journey</h3>
                            {timeline.map((t) => (
                                <div className={styles.timelineItem} key={t.year}>
                                    <span className={styles.timelineYear}>{t.year}</span>
                                    <p className={styles.timelineLabel}>{t.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Story Content */}
                    <div className={styles.editorialContent}>
                        <h2>A Girl Whose Parents <span>Broke the Cycle</span></h2>
                        <div className={styles.storyText}>
                            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                                AKATWIJUKA GRACE: FOUNDER & VISIONARY<br />African Girl Rise Initiative
                            </p>
                            <p>My parents broke the cycle so I could rise. Now I help other girls do the same and raise daughters who will rise even higher.</p>
                            <p>Hello. I am Grace. If you are reading this, you are someone who believes as I do that every girl deserves a chance to become who she was meant to be. I was born in Ibanda District, Western Uganda, in 2001. My parents were not wealthy, but they refused to let their suffering become my inheritance. I grew up alongside five girls — Annet, Grace, Mary, Robinah, Sylvia — who dreamed with me under the mango tree. Every single one of them left school before finishing. Married off, pushed aside, silenced. I kept walking. Why me? Because my parents chose differently.</p>
                            <p>In 2018, I witnessed the systemic barriers that block girls from education: poverty, violence, early marriage, and a lack of safe spaces. I began grassroots mentorship in my community in 2021, determined to be the difference I wished I had seen. In 2023, I enrolled in Law at Uganda Christian University, because lasting change requires changing the systems that fail girls in the first place. I want to be the lawyer who stands as a shield between the powerless and a cruel system.</p>
                            <p>In 2025, I officially registered African Girl Rise Initiative. My vision is simple and enormous: I want every girl in Ibanda District — every girl in Uganda — to know that her beginning does not define her becoming. I am not special. I am simply a girl whose parents chose to break the cycle. Now I reach back to ignite that same transformation in others.</p>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Girls Reached</span>
                                <p className={styles.statValue}>800+ through direct mentorship and safety programs.</p>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Vision</span>
                                <p className={styles.statValue}>Breaking systemic cycles of poverty through legal advocacy.</p>
                            </div>
                        </div>

                        {/* Contact Cards */}
                        <div className={styles.contactCards}>
                            <a href="tel:+256763738733" className={styles.contactCard}>
                                <Phone size={24} className={styles.contactCardIcon} style={{ color: 'var(--accent-pink)' }} />
                                <span className={styles.contactCardLabel}>Phone</span>
                                <span className={styles.contactCardValue}>+256 763 738 733</span>
                            </a>
                            <a href="mailto:africangirlriseltd@gmail.com" className={styles.contactCard}>
                                <Mail size={24} className={styles.contactCardIcon} style={{ color: 'var(--accent-pink)' }} />
                                <span className={styles.contactCardLabel}>Email</span>
                                <span className={styles.contactCardValue}>africangirl@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Statement Box ─── */}
            <section className={styles.statementBox}>
                <div className={styles.statementInner}>
                    <p>&ldquo;I am not special. I am simply a girl whose parents chose to break the cycle. Now I reach back to ignite that same transformation in others.&rdquo;</p>
                    <div className={styles.signature}>— Akatwijuka Grace, Founder</div>
                    <div className={styles.statementCtas}>
                        <Link to="/our-story" className="btn-premium">Our Narrative</Link>
                        <Link to="/contact" className="btn-glass" style={{ color: 'var(--text-primary)' }}>Partner With Us</Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
