import Image from 'next/image';
import {
    GraduationCap,
    Heart,
    Scale,
    Users,
    Globe,
    Mail,
    Phone,
    MessageCircle,
    Quote,
    BookOpen,
    MapPin,
    Target,
    Zap,
    CheckCircle
} from 'lucide-react';
import styles from './founder.module.css';

export default function FounderPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="heading-xl">Meet the <span className="text-gradient">Founder</span></h1>
                <p className={styles.subtitle}>
                    &quot;I am simply a girl whose parents chose to break the cycle. That is the gift I want every girl to receive.&quot;
                </p>
            </div>

            <section className={styles.founderHero}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/founder.jpg"
                        alt="Grace Akatwijuka"
                        width={400}
                        height={500}
                        className={styles.founderImage}
                        priority
                    />
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.role}>Founder & Visionary Director</div>
                    <h2>Akatwijuka Grace</h2>
                    <p className={styles.role}>African Girl Rise Initiative</p>
                    <div className={styles.bioIntro}>
                        <p>Fourth-Year Law Student at Uganda Christian University. Grace founded the African Girl Rise Initiative to ensure that every girl&apos;s beginning does not define her becoming.</p>
                    </div>
                    <div className={styles.heroStats}>
                        <div className={styles.heroStat}>
                            <MapPin size={18} />
                            <span>Ibanda District, Uganda</span>
                        </div>
                        <div className={styles.heroStat}>
                            <GraduationCap size={18} />
                            <span>4th Year Law Student</span>
                        </div>
                        <div className={styles.heroStat}>
                            <Users size={18} />
                            <span>800+ Girls Reached</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.storyContent}>
                <div className={styles.pullQuote}>
                    <p>&quot;My parents broke the cycle so I could rise. Now I help other girls do the same and raise daughters who will rise even higher.&quot;</p>
                </div>

                <section className={styles.storySection}>
                    <div className={styles.sectionIcon}><Zap size={32} /></div>
                    <h3>The Girl With Parents Who Refused to Pass On Their Suffering</h3>
                    <p>I grew up in Ibanda District, in the rolling hills of Western Uganda. It is a place of breathtaking beauty—green terraces, banana plantations, and skies that stretch forever. But beauty does not fill stomachs. Beauty does not pay school fees. Beauty does not protect a girl from the hard realities of poverty.</p>
                    <p>My family was not wealthy. We were, in fact, poor. But poverty was not the whole story.</p>
                    <p className={styles.emphasis}>The whole story is this: my parents refused to let their suffering become my inheritance.</p>
                </section>

                <div className={styles.storyGrid}>
                    <div className={styles.gridItem}>
                        <h4><Heart size={20} /> My Mother</h4>
                        <p>She studied hungry. She walked kilometers on empty stomachs, determined that education would be her ladder. She proved that determination, discipline, and faith can carry you through impossible odds.</p>
                    </div>
                    <div className={styles.gridItem}>
                        <h4><Zap size={20} /> My Father</h4>
                        <p>He had two things: discipline and faith. He stayed in school when leaving would have been easier. He learned that education was the only inheritance he could ever give his children.</p>
                    </div>
                </div>

                <section className={styles.storySection}>
                    <h3>The Girls Who Walked Beside Me</h3>
                    <p>I did not walk this path alone. I grew up with five girls who were my sisters in every way but blood—Annet, Grace, Mary, Robinah, and Sylvia.</p>
                    <p>Annet wanted to be a nurse. Grace wanted to be a writer. Mary wanted to be a teacher. Robinah wanted to be an artist. Sylvia wanted to travel the world. We promised each other that we would all make it. We promised that we would rise together.</p>
                    <p>But life had different plans. One by one, they fell away. Annet married at fifteen. Robinah became pregnant and was expelled. Sylvia married at seventeen to a man old enough to be her grandfather.</p>
                    <p className={styles.emphasis}>Why me? Why was I the one who made it while my friends were left behind?</p>
                    <p>The answer is simple: my parents chose differently. They chose to believe that their daughter was worth investing in, even when the world told them otherwise.</p>
                </section>

                <section className={styles.storySection}>
                    <div className={styles.sectionIcon}><Scale size={32} /></div>
                    <h3>The Path to Law</h3>
                    <p>I chose law because I understand that lasting change requires more than safe spaces and scholarships—it requires changing the systems that fail girls in the first place.</p>
                    <ul className={styles.pointsList}>
                        <li><CheckCircle size={20} /> Standing as a shield between girls and abuse</li>
                        <li><CheckCircle size={20} /> Fighting for policies for pregnant girls&apos; education</li>
                        <li><CheckCircle size={20} /> Challenging discriminatory practices</li>
                        <li><CheckCircle size={20} /> Using the law as a tool for healing</li>
                    </ul>
                </section>

                <div className={styles.pullQuote}>
                    <p>&quot;Your beginning does not define your becoming. Rise. Then reach back.&quot;</p>
                </div>

                <section className={styles.atAGlance}>
                    <h3>At a Glance</h3>
                    <div className={styles.glanceGrid}>
                        <div className={styles.glanceItem}>
                            <strong>Initiative</strong>
                            <span>African Girl Rise Initiative</span>
                        </div>
                        <div className={styles.glanceItem}>
                            <strong>Location</strong>
                            <span>Ibanda District, Western Uganda</span>
                        </div>
                        <div className={styles.glanceItem}>
                            <strong>Education</strong>
                            <span>4th Year Law, Uganda Christian University</span>
                        </div>
                        <div className={styles.glanceItem}>
                            <strong>Impact</strong>
                            <span>800+ Girls Reached Directly</span>
                        </div>
                    </div>
                </section>

                <section className={styles.connectSection}>
                    <h3>Connect With Grace</h3>
                    <p>Join the movement to break cycles and transform generations.</p>
                    <div className={styles.connectGrid}>
                        <a href="mailto:grace@africangirlrise.org" className={styles.connectItem}>
                            <div className={styles.iconCircle}><Mail size={24} /></div>
                            <span>Email</span>
                        </a>
                        <a href="tel:0763738733" className={styles.connectItem}>
                            <div className={styles.iconCircle}><Phone size={24} /></div>
                            <span>Phone</span>
                        </a>
                        <a href="https://wa.me/256703727965" className={styles.connectItem}>
                            <div className={styles.iconCircle}><MessageCircle size={24} /></div>
                            <span>WhatsApp</span>
                        </a>
                        <a href="https://africangirlriseltd.org" className={styles.connectItem}>
                            <div className={styles.iconCircle}><Globe size={24} /></div>
                            <span>Website</span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
