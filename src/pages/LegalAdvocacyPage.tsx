import { Link } from 'react-router-dom';
import styles from './LegalAdvocacyPage.module.css';

const INITIATIVES = [
    {
        number: '01',
        title: 'Legal Literacy Workshops',
        description: 'We teach girls and women about their basic legal rights in simple, accessible language — using local languages, real-life scenarios, and interactive question-and-answer sessions in schools and communities.',
        items: [
            'Defilement law — understanding protections and what happens when it occurs',
            'Age of consent and child marriage — why it is illegal and what to do',
            'Domestic violence — physical, emotional, and economic (what it looks like; what to do)',
            'Property rights — for widows, for daughters',
            'Education rights — no one can legally force you out of school',
            'Reporting mechanisms — where to go, who to tell, what to expect',
        ],
    },
    {
        number: '02',
        title: 'Legal Referral Network',
        description: 'We do not just teach rights. We connect girls and women to the people who can enforce those rights. We maintain active relationships with:',
        items: [
            'Probation and Social Welfare Officers — for child protection cases',
            'Police Child and Family Protection Units — for reporting abuse',
            'Local Council Courts — for community-level disputes',
            'Legal Aid Organisations — for free legal representation',
            'Uganda Law Society pro bono services — for serious cases',
        ],
    },
    {
        number: '03',
        title: 'Domestic Violence Support',
        description: 'For women experiencing domestic violence, we provide comprehensive, compassionate support — walking with them through every step:',
        items: [
            'Safe spaces to share — confidential conversations with trained counsellors',
            'Safety planning — what to do in an emergency situation',
            'Referral to shelters — temporary safe accommodation when needed',
            'Legal guidance — how to obtain protection orders and report abuse',
            'Court accompaniment — support and presence during legal proceedings',
            'Economic support — for women leaving violent situations (through existing programmes)',
        ],
    },
    {
        number: '04',
        title: 'School-Based Legal Awareness',
        description: 'In every partner school, we establish a foundation of legal knowledge that protects girls from within:',
        items: [
            'Regular legal literacy sessions in school settings',
            'Posters with key rights information and emergency contacts displayed prominently',
            'Teacher training to recognise and properly report abuse',
            'Confidential reporting mechanisms established within schools',
            'Clear guidance: "If a teacher touches you inappropriately, here is exactly what to do."',
        ],
    },
];

export default function LegalAdvocacyPage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <p className="subheading reveal">Protection &amp; Justice</p>
                <h1 className="heading-display reveal">Knowing Your <span className="text-gradient">Rights</span></h1>
                <p className={`${styles.heroLead} subheading reveal`}>
                    Your Rights. Your Power. Your Protection.
                </p>
                <p className={`${styles.heroSupportText} subheading reveal`}>
                    No girl should suffer in silence. No woman should be abused without recourse.
                </p>
            </section>

            <section className={styles.editorialIntro}>
                <div className={styles.introContainer}>
                    <div className={styles.introLeadWrap}>
                        <p className="subheading">The Reality</p>
                        <h2 className="heading-section">A Silence <span className="text-gradient">Broken</span></h2>
                        <p className={styles.introLead}>
                            In Uganda, countless girls and women suffer abuse — physical, emotional, sexual — without knowing they have rights. Without knowing where to turn. Without knowing that the law exists to protect them.
                        </p>
                    </div>

                    <div className={styles.premiumGrid}>
                        <div className={styles.truthCard}>
                            <span className={styles.truthIcon}>⚖️</span>
                            <p><strong>Many girls do not know</strong> that defilement is a crime punishable by law.</p>
                        </div>
                        <div className={styles.truthCard}>
                            <span className={styles.truthIcon}>🏠</span>
                            <p><strong>Many women do not know</strong> they can report domestic violence and that the law protects them.</p>
                        </div>
                        <div className={styles.truthCard}>
                            <span className={styles.truthIcon}>💍</span>
                            <p><strong>Many families do not know</strong> that forcing a girl into marriage is illegal in Uganda.</p>
                        </div>
                        <div className={styles.truthCard}>
                            <span className={styles.truthIcon}>🏫</span>
                            <p><strong>Many teachers who abuse</strong> students face no consequences because girls do not know how to report them.</p>
                        </div>
                        <div className={styles.truthCard}>
                            <span className={styles.truthIcon}>🛡️</span>
                            <p><strong>Many mothers stay</strong> in violent homes because they do not know their rights to protection orders.</p>
                        </div>
                        <div className={styles.truthCard}>
                            <span className={styles.truthIcon}>📚</span>
                            <p><strong>Knowledge of the law is power.</strong> A girl who knows her rights is harder to exploit.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.editorialBody}>
                <div className={styles.sectionIntro}>
                    <p className="subheading">Strategy</p>
                    <h2 className="heading-section">Legal Literacy. Legal Protection. <span className="text-gradient">Legal Empowerment.</span></h2>
                </div>

                {INITIATIVES.map(init => (
                    <div key={init.number} className={styles.advocacyBox}>
                        <p className="subheading">Initiative {init.number}</p>
                        <h3 className="serif">{init.title}</h3>
                        <p>{init.description}</p>
                        <ul className={styles.initiativeList}>
                            {init.items.map((item, i) => (
                                <li key={i} className={styles.initiativeListItem}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className={styles.benefitGrid}>
                    <div className={styles.benefitCard}>
                        <span>OUTCOME 01</span>
                        <p>Adolescent girls who can identify, name, and reject abuse as a normalised reality — and know exactly where to go for help.</p>
                    </div>
                    <div className={styles.benefitCard}>
                        <span>OUTCOME 02</span>
                        <p>Women who gain the confidence and structural knowledge to pursue legal justice and live free from violence.</p>
                    </div>
                    <div className={styles.benefitCard}>
                        <span>OUTCOME 03</span>
                        <p>Community-wide accountability rooted in legal literacy — where norms shift and silence is no longer the default.</p>
                    </div>
                </div>
            </section>

            <section className={styles.founderVoice}>
                <div className={styles.founderVoiceInner}>
                    <p className="subheading">The Founder&rsquo;s Voice</p>
                    <blockquote>
                        &ldquo;I watched my friends fall &mdash; one married off too young, another pulled out of school for her brothers to study. The system did not protect them. So I decided to become someone who would. A lawyer stands as a shield between the powerless and a cruel system. I chose law because justice is not given &mdash; it is fought for. And I will fight for every girl who was told her voice doesn&rsquo;t matter.&rdquo;
                    </blockquote>
                    <p className={styles.attribution}>&mdash; Akatwijuka Grace, Founder &amp; Visionary Director</p>
                    <Link to="/founder" className="btn-premium">
                        <span>Read Full Story &rarr;</span>
                    </Link>
                </div>
            </section>

            <section className={styles.ctaBox}>
                <h2 className={`${styles.ctaHeading} heading-section`}>Advocate for <span className="text-gradient">Justice</span></h2>
                <p className={styles.ctaLead}>
                    Your contribution ensures that no girl in our community has to suffer in silence.
                </p>
                <div className={styles.ctaActions}>
                    <Link to="/donate" className={`btn-premium ${styles.ctaPrimary}`}>
                        <span>Support Legal Rights</span>
                    </Link>
                    <Link to="/contact" className={`btn-premium ${styles.ctaSecondary}`}>
                        <span>Contact Our Team</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
