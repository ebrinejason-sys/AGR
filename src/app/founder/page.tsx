"use client";

import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

export default function Founder() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={styles.container}>
            {/* Editorial Hero */}
            <section className={styles.hero}>
              <p className="subheading reveal">The Visionary</p>
              <h1 className="heading-display reveal">Akatwijuka <span className="text-gradient">Grace</span></h1>
              <p className={styles.heroTagline}>&ldquo;My parents broke the cycle so I could rise. Now I spend my life proving that your beginning does not define your becoming.&rdquo;</p>
            </section>

            {/* Ticker */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {['Vision', 'Leadership', 'Empowerment', 'Rise', 'Breaking Cycles', 'African Girl Rise', 'One Girl at a Time', 'Uganda', 'Youth Advocacy', 'Safe Spaces', 'Mental Health', 'Education', 'Vision', 'Leadership', 'Empowerment', 'Rise', 'Breaking Cycles', 'African Girl Rise', 'One Girl at a Time', 'Uganda', 'Youth Advocacy', 'Safe Spaces', 'Mental Health', 'Education'].map((item, i) => (
                        <span key={i} className={styles.tickerItem}>{item}</span>
                    ))}
                </div>
            </div>

            {/* Profile Section */}
            <section className={styles.editorialSection}>
              <div className={styles.editorialGrid}>
                <div className={styles.founderImageFrame}>
                  <Image
                    src="/images/founder.jpg"
                    alt="Akatwijuka Grace — Founder of African Girl Rise"
                    fill
                    className={styles.founderImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
                    priority
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className={styles.imageOverlay}>
                    <span className={styles.imageCaption}>Akatwijuka Grace · Founder &amp; Visionary Director</span>
                  </div>
                </div>

                <div className={styles.editorialContent}>
                  <h2 className="heading-section">A Girl Whose Parents <span className="text-gradient">Broke the Cycle</span></h2>
                  <div className={styles.editorialText}>

                    {/* Compelling teaser — always visible */}
                    <p>I grew up in Ibanda District, in the rolling hills of Western Uganda — a place of breathtaking beauty. But beauty does not fill stomachs. Beauty does not pay school fees.</p>

                    <p>My family was not wealthy. But poverty was not the whole story. The whole story is this: <strong>my parents refused to let their suffering become my inheritance.</strong></p>

                    {/* Highlighted moments — always visible */}
                    <div className={styles.highlightBlock}>
                      <div className={styles.highlightItem}>
                        <span className={styles.highlightNumber}>Five</span>
                        <p>I grew up alongside five girls — Annet, Grace, Mary, Robinah, Sylvia — who dreamed with me under the mango tree. Every single one of them left school before finishing. Married off, pushed aside, silenced. <strong>I kept walking. Why me? Because my parents chose differently.</strong></p>
                      </div>
                      <div className={styles.highlightItem}>
                        <span className={styles.highlightNumber}>Law</span>
                        <p>I watched my friends fall — one married off too young, another pulled out of school for her brothers to study. <em>The system did not protect them. So I decided to become someone who would.</em> A lawyer stands as a shield between the powerless and a cruel system. I chose law because justice is not given — it is fought for. And I will fight for every girl who was told her voice doesn&rsquo;t matter.</p>
                      </div>
                      <div className={styles.highlightItem}>
                        <span className={styles.highlightNumber}>Vision</span>
                        <p>I put African Girl Rise Initiative in place to break the cycle that stole my friends. To give every girl a safe place to heal, skills to stand on her own, knowledge to protect herself, and leadership to lift others. <strong>Because when one girl rises, she reaches back — and generations change.</strong></p>
                      </div>
                    </div>

                    {!expanded && (
                      <button className={styles.readMoreBtn} onClick={() => setExpanded(true)}>
                        Read Full Story ↓
                      </button>
                    )}

                    {expanded && (
                      <>
                        <h3 className={styles.subhead}>Growing Up in Ibanda</h3>
                        <p>My mother studied by kerosene lamp when there was kerosene. She walked kilometres on empty stomachs, determined that education would be her ladder out of poverty. She completed her education and made sure my path would be easier than hers. My father had grit, prayer, and an unshakeable belief that tomorrow could be better than today — and he completed his education through sheer stubborn faith.</p>

                        <h3 className={styles.subhead}>The Girls Who Walked Beside Me</h3>
                        <p>We sat together on broken desks, sharing textbooks with missing pages. We walked the same dusty roads, our bare feet slapping against the red earth. We promised each other we would all make it. But life had different plans.</p>

                        <p>Annet was married at fifteen. Grace dropped out when her father died and relatives did not believe in girl education. Mary stayed home so her brother could continue secondary school. Robinah became pregnant — the teacher who promised to marry her disappeared; the school expelled her. Sylvia was married at seventeen to a man old enough to be her grandfather.</p>

                        <p><strong>And I kept walking.</strong> Why me? Because my parents chose differently. They chose to break the cycle.</p>

                        <h3 className={styles.subhead}>The Path to Law</h3>
                        <p>I am currently in my fourth year of law studies at Uganda Christian University, pursuing a degree I believe is essential to the work of breaking cycles and transforming communities. I chose law because lasting change requires changing the systems that fail girls in the first place.</p>

                        <p>I want to be the lawyer who stands between a girl and the teacher who would abuse her; who fights for policies allowing pregnant girls to return to school; who challenges discriminatory practices that favour boys over girls. My law degree will serve this initiative. This initiative will serve the community. And the community — one girl at a time — will transform this nation.</p>

                        <h3 className={styles.subhead}>The Vision</h3>
                        <p>My vision is simple and enormous: I want every girl in Ibanda District — every girl in Uganda — every girl in Africa — to have the chance I had. I want every Annet, every Grace, every Mary, every Robinah, every Sylvia to know that her beginning does not define her becoming.</p>

                        <button className={styles.readMoreBtn} onClick={() => setExpanded(false)}>
                          Show Less ↑
                        </button>
                      </>
                    )}
                  </div>

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

            {/* Premium Quote */}
            <section className={styles.statementBox}>
              <div className={styles.statementInner}>
                <p>&ldquo;I am not special. I am simply a girl whose parents chose to break the cycle. They did not bequeath hardship; they passed on hope. Now I reach back to ignite that same transformation in others.&rdquo;</p>
                <div className={styles.signature}>— Akatwijuka Grace, Founder &amp; Visionary Director</div>
              </div>
            </section>
        </div>
    );
}
