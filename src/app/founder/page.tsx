import Image from 'next/image';
import styles from '../contact/page.module.css';

export default function FounderPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="heading-xl">Meet the <span className="text-gradient">Founder</span></h1>
                <p className={styles.subtitle}>
                    &quot;I am simply a girl whose parents chose to break the cycle. That is the gift I want every girl to receive.&quot;
                </p>
            </div>

            <div className={styles.contentGrid}>
                <div className={`${styles.founderCard} ${styles.fullWidth}`}>
                    <div className={styles.founderImageContainer}>
                        <Image
                            src="/founder.jpg"
                            alt="Grace Akatwijuka"
                            width={200}
                            height={250}
                            sizes="200px"
                            priority
                            className={styles.founderImage}
                        />
                    </div>
                    <h2>Akatwijuka Grace</h2>
                    <p className={styles.role}>Founder &amp; Visionary Director</p>
                    <p className={styles.role}>African Girl Rise Initiative</p>

                    <div className={styles.bio}>
                        <p>
                            Grace is a fourth-year law student at Uganda Christian University and the founder of African Girl Rise Initiative.
                            Her mission is simple: help girls stay in school, heal from hardship, and build the confidence to lead.
                        </p>
                        <p>
                            <strong>Core Belief:</strong> &quot;Your beginning does not define your becoming.&quot;
                        </p>
                        <p>
                            <strong>Life Motto:</strong> &quot;Rise. Then reach back.&quot;
                        </p>
                    </div>

                    <div className={styles.contactDetails}>
                        <h3>Direct Contact</h3>
                        <p><strong>Email:</strong> grace@africangirlrise.org</p>
                        <p><strong>Phone:</strong> 0763738733</p>
                        <p><strong>WhatsApp:</strong> +256703727965</p>
                        <p><strong>Website:</strong> africangirlriseltd.org</p>
                    </div>
                </div>
            </div>

            <div className={styles.fullStoryContainer}>
                <h2 className={styles.storyHeading}>Grace&apos;s Story, In Brief</h2>

                <section className={styles.storySection}>
                    <h3>Why This Work Matters</h3>
                    <p>
                        Grace grew up in Ibanda District and saw bright girls leave school because of poverty, trauma, and early marriage.
                        She founded African Girl Rise to make sure girls are not defined by those barriers.
                    </p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Turning Point</h3>
                    <p>
                        Her parents chose to break the cycle of hardship through education, sacrifice, and faith.
                        That choice gave Grace stability and inspired her to create the same chance for other girls.
                    </p>
                </section>

                <section className={styles.storySection}>
                    <h3>What She Is Building</h3>
                    <p>
                        Through African Girl Rise, Grace leads programs that combine mental health support, school retention,
                        mentorship, leadership growth, and legal advocacy for girls and their families.
                    </p>
                </section>

                <section className={styles.storySection}>
                    <h3>Her Legal Mission</h3>
                    <p>
                        As a law student, Grace is preparing to fight for policies and protections that keep girls safe,
                        in school, and treated with dignity.
                    </p>
                    <ul>
                        <li>Protect girls from abuse and exploitation</li>
                        <li>Support safe return-to-school pathways</li>
                        <li>Advance community-centered legal literacy</li>
                    </ul>
                </section>

                <section className={styles.storySection}>
                    <h3>At a Glance</h3>
                    <p><strong>Name:</strong> Akatwijuka Grace</p>
                    <p><strong>Role:</strong> Founder &amp; Visionary Director</p>
                    <p><strong>Location:</strong> Ibanda District, Western Uganda</p>
                    <p><strong>Education:</strong> Fourth-Year Law Student, Uganda Christian University</p>
                    <p><strong>Core Belief:</strong> &quot;Your beginning does not define your becoming.&quot;</p>
                    <p><strong>Life Motto:</strong> &quot;Rise. Then reach back.&quot;</p>
                </section>

                <section className={styles.storySection}>
                    <h3>Connect With Grace</h3>
                    <p><strong>Email:</strong> grace@africangirlrise.org</p>
                    <p><strong>Phone:</strong> 0763738733</p>
                    <p><strong>WhatsApp:</strong> +256703727965</p>
                </section>
            </div>
        </div>
    );
}