import styles from './page.module.css';
import Link from 'next/link';

export default function OurStory() {
    return (
        <div className={styles.container}>
            {/* Hero Header */}
            <section className={styles.hero}>
                <div className={styles.heroGlowPink} />
                <div className={styles.heroGlowPurple} />
                <h1 className="heading-xl">Our <span className="text-gradient">Story</span></h1>
                <p className={styles.subtitle}>
                    We are not an initiative that comes in from outside and tells communities what to do.
                    We are of this community. We are for this community.
                </p>
            </section>

            {/* Main Content Sections */}
            <section className={styles.contentSection}>

                <div className={styles.card}>
                    <div className={styles.cardGlowBlue} />
                    <h2>What We Want Parents to Understand</h2>
                    <div className={styles.textBody}>
                        <p><strong>If you are a parent reading this, please hear me with your whole heart: Your children do not have to suffer the way you suffered.</strong></p>
                        <p>I know you love them. I know you want the best for them. But sometimes we carry a dangerous belief without even realizing it: &quot;I suffered, so my children must also suffer. That is how life is.&quot; No. That is not how life has to be.</p>
                        <p>My parents proved that suffering does not have to be inherited. Struggle does not have to be a family tradition. Poverty does not have to pass from generation to generation. The cycle can be broken. You have the power to break it.</p>
                        <p>When you keep your daughter in school—even when it&apos;s hard, even when the world tells you she&apos;s not worth it—you are not just educating a child. You are changing your family&apos;s future for generations.</p>
                        <p>This is how poverty ends. This is how communities transform. This is how nations rise.</p>
                    </div>
                </div>

                <div className={styles.cardSecondary}>
                    <h2>What Happens When Girls Rise</h2>
                    <div className={styles.textBody}>
                        <p>When a girl rises, she does not rise alone.</p>
                        <p>She rises, and her family rises with her. Her income lifts them from poverty. Her education ensures her children are educated. Her health protects her family&apos;s health. Her voice advocates for her community.</p>
                        <p>She rises, and her children rise higher. She rises, and her grandchildren rise higher still. By the third generation, poverty is a distant memory.</p>
                        <p>This is what African Girl Rise Initiative is building. Not quick fixes. Not temporary relief. Not charity that creates dependency. Generational transformation. Cycle-breaking. Communities that heal themselves from within.</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardGlowPink} />
                    <h2>The Vision</h2>
                    <div className={styles.textBody}>
                        <p><strong>My vision is simple and enormous:</strong></p>
                        <p>I want every girl in Ibanda District—every girl in Uganda—every girl in Africa—to have the chance I had. I want every girl to have parents who believe in her enough to break the cycle.</p>
                        <p>I want every girl to have a safe space to heal, a ladder to climb, and a community that celebrates her rising.</p>
                        <p>This is not charity. This is not pity. This is justice.</p>
                    </div>
                </div>

            </section>

            {/* Call to Action */}
            <section className={styles.ctaSection}>
                <h2>How You Can Join This Movement</h2>
                <p>You do not have to start an organization to change a girl&apos;s life. You simply have to do something.</p>
                <div className={styles.ctaGrid}>
                    <div className={styles.ctaBox}>
                        <h3>If you are a Donor:</h3>
                        <p>Sponsor a girl. Fund a Rise Room. Support a scholarship. Your money, invested wisely, does not just change one life—it transforms generations.</p>
                    </div>
                    <div className={styles.ctaBox}>
                        <h3>If you are a Teacher:</h3>
                        <p>Notice the quiet girls at the back of your classroom. Be the person who asks: &quot;Are you okay?&quot; and means it.</p>
                    </div>
                    <div className={styles.ctaBox}>
                        <h3>If you are a Leader:</h3>
                        <p>Advocate for girls&apos; education. Speak out against early marriage. Support policies that keep girls in school.</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link href="/events" className={styles.btnPrimary}>Support Our Work</Link>
                </div>
            </section>
        </div>
    );
}
