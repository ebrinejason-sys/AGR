"use client";

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

const PROGRAMS = [
    {
        id: 'rise-room',
        number: '01',
        title: 'The Rise Room Initiative',
        tagline: 'A sanctuary. A lifeline. A place where silence can finally break.',
        summary: 'A Rise Room is a dedicated safe space within a partner school where girls come to heal, speak freely, and find support. There are no desks, no chalkboards, no pressure to perform — instead cushions, soft lighting, and a circle of chairs where everyone sits as equals.',
        stats: [
            { value: '15', label: 'Rise Rooms established' },
            { value: '800+', label: 'Girls reached' },
            { value: '42', label: 'Peer counsellors trained' },
            { value: '92%', label: 'School retention rate' },
        ],
        detail: [
            'In Ibanda District, girls carry weights no child should carry: trauma from losing parents, grief from watching siblings go hungry, shame from abuse they did not cause, and the anxiety of wondering if they will be the next to drop out or be married off. They carry it all in silence.',
            'Rise Rooms exist to say: You are not alone. Your feelings matter. You deserve to heal.',
            'What happens inside a Rise Room:',
            '• Individual Counselling — one-on-one sessions with trained counsellors in trauma-informed care',
            '• Group Circles — girls discover they are not alone in their struggles',
            '• Peer Support — older girls trained to listen, validate, and guide younger peers',
            '• Art Therapy — drawing, writing, and creating to express what words cannot hold',
            '• Quiet Space — sometimes a girl simply needs to rest',
            'Before Rise Rooms, 85% of girls reported feeling completely alone in their struggles. After, 75% know they are not alone. School attendance rose from 62% to 92%.',
        ],
    },
    {
        id: 'academic-rescue',
        number: '02',
        title: 'Academic Rescue Program',
        tagline: 'No girl should leave school because the world made it too hard to stay.',
        summary: 'In Uganda, 4 in 10 girls drop out before completing secondary school — not because they lack intelligence or determination, but because the world puts obstacle after obstacle in their path. The Academic Rescue Program exists to remove those obstacles, one girl at a time.',
        stats: [
            { value: '92%', label: 'Stay in school (vs 60% nationally)' },
            { value: '4 in 10', label: 'Girls drop out nationally — we fight this' },
            { value: '100%', label: 'Exam fees covered' },
            { value: '0', label: 'Girls sent home for worn uniforms' },
        ],
        detail: [
            'Girls drop out because uniforms wear out, exercise books run out, sanitary pads are a luxury, exam fees come due with no money to pay, or they are needed at home to care for siblings. These are not failures of effort — they are failures of circumstance.',
            '1. Uniforms & Shoes — A girl in a torn uniform is sent home. We provide complete uniforms and shoes so every girl walks into school with dignity.',
            '2. Scholastic Materials — Exercise books, pens, pencils, geometry sets, and textbooks so girls can focus on learning, not on what they lack.',
            '3. Sanitary Pads — 1 in 10 girls misses school during her period. We provide reusable pad kits so no girl ever misses class again.',
            '4. Exam Fees — We cover national exam fees so no girl is barred from sitting for her future.',
            '5. Emergency Support — When a crisis hits — a parent dies, a harvest fails, a family is displaced — we provide immediate support to keep the girl in school.',
            '6. Tutoring & Remedial Classes — After-school tutoring and exam preparation for girls who have fallen behind due to absences or trauma.',
            '92% of girls in our programme stay in school — compared to 60% nationally.',
        ],
    },
    {
        id: 'leadership-life-skills',
        number: '03',
        title: 'Leadership & Life Skills Program',
        tagline: 'A girl who can provide for herself will never be trapped. A girl who can lead will change the world.',
        summary: 'We equip girls with practical skills they can use immediately — for themselves, for their families, and for income generation. Then we develop them into leaders who transform their communities through the Rise Enterprise Group model.',
        stats: [
            { value: '95%', label: 'Can make reusable pads' },
            { value: '85%', label: 'Can make liquid soap' },
            { value: '30%', label: 'Have started small businesses' },
            { value: '15K–50K', label: 'UGX earned monthly per girl' },
        ],
        detail: [
            'We do not give girls fish. We teach them to fish — and to make their own nets.',
            'Life skills taught include Reusable Pad Making (never miss school again), Liquid Soap Making (hygiene for the family and income from selling), Vaseline & Body Lotion production, Tailoring & Repairs (mend uniforms, make clothes, earn income), Notebook Making, Financial Literacy, and Entrepreneurship.',
            'The Enterprise Group Model: Girls form small groups of 5–10 members to buy materials in bulk, produce together, sell at markets and schools, save money collectively (village savings model), and support each other through challenges.',
            'Example: The "Rise Sisters" group makes soap, lotion, and pads together. Each girl earns 10,000–20,000 UGX per month — enough for school supplies and to help her family.',
            'Leadership Development: Girls move through five stages — Discovery, Planning, Action, Reflection, and Mentoring. Every girl who completes the programme designs a community project and pledges to mentor at least one girl each year.',
            'The Alumni Promise: "I will reach back. I will mentor at least one girl each year. I will prove that her beginning does not define her becoming."',
        ],
    },
    {
        id: 'health-wellness',
        number: '04',
        title: 'Health & Wellness Program',
        tagline: 'A healthy girl is a rising girl.',
        summary: 'A girl cannot learn, lead, or dream if her body is failing her. Health is not a luxury — it is the foundation upon which everything else is built. We address the whole girl: her physical health, menstrual health, nutrition, and access to healthcare.',
        stats: [
            { value: '1 in 10', label: 'Girls miss school due to periods — we end this' },
            { value: '6–12mo', label: 'Each reusable pad lasts' },
            { value: '100%', label: 'Girls receive SRHR education' },
            { value: '0', label: 'Girls left without a healthcare referral' },
        ],
        detail: [
            'Girls in Ibanda District face daily health challenges that keep them from school and from thriving. Mental distress affects physical health; physical illness worsens mental distress. We address both, always, together.',
            '1. Menstrual Health Management — Every girl learns to make her own reusable pads. One pad lasts 6–12 months. No more missing school, no more shame. We also provide education to break the silence around menstruation.',
            '2. Nutrition & Food Security — Emergency food support for girls whose families cannot feed them. Nutrition education on balanced meals on a budget. Support for small vegetable gardens at home.',
            '3. Sexual & Reproductive Health Education — Age-appropriate education on puberty, consent, healthy relationships, HIV/STI prevention, dangers of early pregnancy, contraception, and where to access services.',
            '4. Access to Healthcare — We connect girls to local health centres, HIV testing and counselling, family planning services, antenatal care for pregnant girls, and emergency medical support.',
            '5. Physical Wellness — Sports, recreation, basic exercise, understanding the connection between physical and mental health, and rest education.',
            '6. Mental Health Integration — Health & Wellness works hand-in-hand with our Rise Rooms pillar. Holistic healing. Whole girls. Complete wellness.',
        ],
    },
    {
        id: 'future-pathways',
        number: '05',
        title: 'Future Pathways Program',
        tagline: 'A girl with a vision for her future will never settle for less.',
        summary: 'Many girls in Ibanda District have never met a female doctor, lawyer, or engineer. You cannot become what you cannot imagine. Future Pathways bridges the gap between dreaming and doing — equipping every girl with a concrete plan and the support to reach it.',
        stats: [
            { value: '200+', label: 'Girls in career exposure events' },
            { value: '50+', label: 'Professional mentors connected' },
            { value: '15', label: 'Girls in university or vocational training' },
            { value: '40%', label: 'Alumni actively mentoring' },
        ],
        detail: [
            'You cannot become what you cannot imagine. Girls in Ibanda rarely see female doctors, lawyers, engineers, or business owners. The Future Pathways Programme bridges that gap.',
            '1. Career Exposure — Career Days where professionals visit girls to share their journeys. Exposure tours to universities and businesses. Job shadowing: selected girls spend a day with a professional, ask questions, and build networks.',
            '2. Mentorship — Professional women in careers girls dream of, near-peer mentors who recently completed the programme, and lifetime mentoring relationships.',
            '3. University & Vocational Preparation — Subject guidance, application support (personal statements and interviews), scholarship connections, and intensive exam preparation.',
            '4. Vocational Training Pathways — For girls who prefer hands-on careers: Tailoring & Fashion Design, Catering & Hotel Management, Hairdressing & Cosmetology, Agriculture, Construction & Carpentry, or Information Technology.',
            '5. The "My Rise Plan" — Every girl creates a personalised roadmap: Where do I want to be in 5 years? What education and skills do I need? What steps will I take, and when? Who can help me?',
            '6. Rise Alumni Network — Graduates join a lifelong community, mentor current girls, access job and training opportunities, and carry the motto: "Rise. Then reach back. Always."',
        ],
    },
];

const PILLARS = [
    { number: '01', title: 'Healing the Ground', subtitle: 'Mental Health & Trauma Recovery', quote: '"You cannot climb when you are bleeding."' },
    { number: '02', title: 'Building the Ladder', subtitle: 'Practical Skills for Self-Sufficiency', quote: '"You cannot rise without rungs to hold."' },
    { number: '03', title: 'Reaching New Altitudes', subtitle: 'Leadership & Legacy', quote: '"Rising is not the destination. Reaching back is."' },
    { number: '04', title: 'Knowing Your Rights', subtitle: 'Legal Advocacy & Protection', quote: '"Your Rights. Your Power. Your Protection."' },
];

export default function Programs() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className={styles.container}>
            {/* Editorial Hero */}
            <section className={styles.hero}>
                                <p className="subheading reveal">Our Programs</p>
                <h1 className="heading-display reveal">Core <span className="text-gradient">Programs</span></h1>
                <p className="subheading reveal" style={{ fontStyle: 'italic', letterSpacing: '0.1em', marginTop: '2rem' }}>
                                    Long-term support that helps girls stay safe, stay in school, and build for the future.
                </p>
            </section>

            {/* Ticker */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {['Rise Room', 'Academic Rescue', 'Life Skills', 'Health & Wellness', 'Future Pathways', 'Leadership', 'Mentorship', 'Community', 'Resilience', 'Empowerment', 'Rise Room', 'Academic Rescue', 'Life Skills', 'Health & Wellness', 'Future Pathways', 'Leadership', 'Mentorship', 'Community', 'Resilience', 'Empowerment'].map((item, i) => (
                        <span key={i} className={styles.tickerItem}>{item}</span>
                    ))}
                </div>
            </div>

            {/* Programs List */}
            <section className={styles.programsSection}>
                <div className={styles.programsWrapper}>
                    <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                        <p className="subheading">Five Pathways</p>
                        <h2 className="heading-section">Programs That <span className="text-gradient">Transform</span></h2>
                        <p style={{ maxWidth: '700px', margin: '2rem auto 0', color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.8' }}>
                            Each programme responds to a barrier that places girls at risk. Together, they create connected support across recovery, education, health, leadership, and long-term opportunity.
                        </p>
                    </div>

                    {PROGRAMS.map(program => (
                        <div key={program.id} className={styles.programCard}>
                            <div className={styles.programCardInner}>
                                <span className={styles.programNumber}>{program.number}</span>
                                <div className={styles.programBody}>
                                    <h3 className={styles.programTitle}>{program.title}</h3>
                                    <p className={styles.programTagline}>{program.tagline}</p>
                                    <p className={styles.programSummary}>{program.summary}</p>

                                    <div className={styles.programStatRow}>
                                        {program.stats.map((stat, i) => (
                                            <div key={i} className={styles.programStatItem}>
                                                <span className={styles.programStatValue}>{stat.value}</span>
                                                <span className={styles.programStatLabel}>{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {expandedId === program.id && (
                                        <div className={styles.programDetail}>
                                            {program.detail.map((line, i) => (
                                                <p key={i} className={styles.programDetailLine}>{line}</p>
                                            ))}
                                        </div>
                                    )}

                                    <button className={styles.programReadMore} onClick={() => toggle(program.id)}>
                                        {expandedId === program.id ? 'Show Less ↑' : 'Read More ↓'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Four Pillars */}
            <section className={styles.pillarsSection}>
                <div className={styles.pillarsWrapper}>
                    <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                        <p className="subheading" style={{ color: 'rgba(255,255,255,0.5)' }}>Our Framework</p>
                        <h2 className="heading-section" style={{ color: 'white' }}>Four <span className="text-gradient">Pillars</span> of Rise</h2>
                        <p style={{ maxWidth: '700px', margin: '2rem auto 0', color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            The framework behind how we support girls, families, and schools.
                        </p>
                    </div>
                    <div className={styles.pillarsGrid}>
                        {PILLARS.map(p => (
                            <div key={p.number} className={styles.pillarItem}>
                                <span className={styles.pillarItemNumber}>{p.number}</span>
                                <h3 className={styles.pillarItemTitle}>{p.title}</h3>
                                <p className={styles.pillarItemSubtitle}>{p.subtitle}</p>
                                <p className={styles.pillarItemQuote}>{p.quote}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '6rem' }}>
                        <Link href="/legal-advocacy" style={{ color: 'var(--color-pink)', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700' }}>
                            Explore Legal Advocacy (Pillar 4) →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Impact Banner */}
            <section className={styles.realityBanner}>
                <h2 className="heading-section" style={{ color: 'white' }}>The <span className="text-gradient">Impact</span> in Numbers</h2>
                <div className={styles.bannerStats}>
                    <div className={styles.bannerStatItem}><h3>800+</h3><p>Girls Directly Reached</p></div>
                    <div className={styles.bannerStatItem}><h3>92%</h3><p>School Retention Rate</p></div>
                    <div className={styles.bannerStatItem}><h3>42</h3><p>Peer Counsellors Trained</p></div>
                    <div className={styles.bannerStatItem}><h3>15</h3><p>Rise Rooms Established</p></div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaEditorial}>
                <h2 className="heading-section">Invest in a <span style={{ color: 'var(--color-lightblue)' }}>Girl&apos;s Future</span></h2>
                <p style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '4rem', opacity: 0.85 }}>
                    Your support helps fund practical care, school retention, and pathways for girls to lead with confidence.
                </p>
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/donate" className="btn-premium" style={{ background: 'white', color: 'black' }}>
                        <span>Donate</span>
                    </Link>
                    <Link href="/contact" className="btn-premium" style={{ borderColor: 'white' }}>
                        <span>Partner with us</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
