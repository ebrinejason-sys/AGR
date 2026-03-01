"use client";

import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to send message');

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="heading-xl">Meet the <span className="text-gradient">Founder</span></h1>
                <p className={styles.subtitle}>
                    &quot;I am simply a girl whose parents chose to break the cycle. That is the gift I want every girl to receive.&quot;
                </p>
            </div>

            <div className={styles.contentGrid}>
                {/* Founder Info */}
                <div className={styles.founderCard}>
                    <div className={styles.founderImageContainer}>
                        <Image
                            src="/founder.jpg"
                            alt="Grace Akatwijuka"
                            width={200}
                            height={250}
                            className={styles.founderImage}
                        />
                    </div>
                    <h2>Akatwijuka Grace</h2>
                    <p className={styles.role}>Founder & Visionary Director</p>

                    <div className={styles.bio}>
                        <p>
                            While studying law at Uganda Christian University, Grace founded the African Girl Rise Initiative.
                            Her vision is simple and enormous: to ensure every girl in Ibanda District, Uganda, and across Africa
                            has the chance she had.
                        </p>
                        <p>
                            &quot;My mother studied hungry so I could study fed. My father struggled through school so my fees could be paid...
                            And when that girl becomes a mother, she will give the same gift to her daughter.
                            Rise. Then reach back. Always reach back.&quot;
                        </p>
                    </div>

                    <div className={styles.contactDetails}>
                        <h3>Direct Contact</h3>
                        <p><strong>Email:</strong> grace@africangirlriseltd.org</p>
                        <p><strong>Phone:</strong> 0763738733</p>
                        <p><strong>WhatsApp:</strong> +256703727965</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className={styles.formCard}>
                    <h2>Get in Touch</h2>
                    <p className={styles.formDesc}>Whether you want to support a girl, learn about our Rise Rooms, or just say hello.</p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Jane Doe"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Your Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="jane@example.com"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                placeholder="How can we help you?"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && (
                            <p className={styles.successMsg}>Thank you! Your message has been sent successfully.</p>
                        )}
                        {status === 'error' && (
                            <p className={styles.errorMsg}>Oops! Something went wrong. Please try again.</p>
                        )}
                    </form>
                </div>
            </div>

            <div className={styles.fullStoryContainer}>
                <h2 className={styles.storyHeading}>My Personal Journey</h2>

                <section className={styles.storySection}>
                    <h3>Welcome</h3>
                    <p>Hello. I am Grace.</p>
                    <p>If you are reading this, you are someone who believes as I do that every girl deserves a chance to become who she was meant to be. You are someone who understands that a girl&apos;s beginning does not have to define her becoming.</p>
                    <p>This is my story. More importantly, this is the story of how we together can transform not just individual girls, but entire communities, one generation at a time.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Girl With Parents Who Refused to Pass On Their Suffering</h3>
                    <p>I grew up in Ibanda District, in the rolling hills of Western Uganda. It is a place of breathtaking beauty green terraces, banana plantations, and skies that stretch forever. But beauty does not fill stomachs. Beauty does not pay school fees. Beauty does not protect a girl from the hard realities of poverty.</p>
                    <p>My family was not wealthy. We were, in fact, poor. But poverty was not the whole story.</p>
                    <p>The whole story is this: my parents refused to let their suffering become my inheritance.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>My Mother: The Girl Who Studied Through Everything</h3>
                    <p>My mother&apos;s life was hard from the very beginning. She grew up in poverty so deep that she often walked to school hungry. She lacked proper uniforms, decent shoes, enough books. While other children had parents who could help with homework, she had no one her own parents were uneducated and struggling simply to survive.</p>
                    <p>But she stayed in school. She studied by kerosene lamp when there was kerosene. She walked kilometers on empty stomachs, determined that education would be her ladder out of poverty. She faced challenges I cannot fully imagine and she kept going.</p>
                    <p>That achievement—a girl from a poor village, with no resources, no connections, no safety net—is the foundation of everything I am. She proved that circumstances do not define destiny.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>My Father: The Boy Who Trusted God and Stayed in School</h3>
                    <p>My father&apos;s story is similar. He grew up with nothing. There was never enough money for school fees. There were days when studying felt impossible, when hunger gnawed at his belly while he tried to concentrate on his books.</p>
                    <p>But he had two things: discipline and faith. He trusted God and kept going. He stayed in school when leaving would have been easier. He worked when there was work and prayed when there was none.</p>
                    <p>He completed his education through sheer stubborn faith. He did not have an easy path. He did not have advantages. He had grit, prayer, and an unshakeable belief that tomorrow could be better than today.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Gift They Gave Me</h3>
                    <p>My parents did not give me an easy life because they had easy lives. They gave me an easy life because they had hard lives and refused to pass that hardness on to me.</p>
                    <p>They broke the cycle.</p>
                    <p>My mother, who studied hungry, made sure I never knew hunger. My father, who struggled for every term of school, made sure my fees were paid.</p>
                    <p>They created a good life for me so that I could focus on becoming who I was meant to be. That is the greatest gift a parent can give a child. Not wealth. Not connections. Not privilege. The gift of not having to fight the same battles they fought.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Girls Who Walked Beside Me</h3>
                    <p>I did not walk this path alone. I grew up with five girls who were my sisters in every way but blood—Annet, Grace, Mary, Robinah, and Sylvia.</p>
                    <p>We sat together on broken desks, sharing textbooks with missing pages. We walked the same dusty roads to school, our bare feet slapping against the red earth. We dreamed under the mango tree of the women we would become while studying at Kiburara Primary school and Good Hope primary school.</p>
                    <p>Annet wanted to be a nurse. Grace wanted to be a writer in the newspapers. Mary wanted to be a teacher. Robinah wanted to be an artist. Sylvia wanted to travel the world.</p>
                    <p>But life had different plans. One by one, they fell away.</p>
                    <p>Annet was married at fifteen. Grace dropped out when her father died. Mary was told to stay home for her brother&apos;s secondary school. Robinah became pregnant and was expelled while the teacher faced no consequences. Sylvia was married at seventeen as a third wife.</p>
                    <p>And I—I kept walking. I kept studying. I kept rising. Why me? The answer is simple: my parents chose differently. They chose to break the cycle. That is the lesson I am determined to teach.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Path to Law</h3>
                    <p>My parents supported every dream I ever had. When I discovered my calling in law, they said: &quot;Go. Become. We are with you.&quot;</p>
                    <p>I am currently in my fourth year of law school at Uganda Christian University, pursuing a degree that I believe is essential to the work of breaking cycles and transforming communities. I chose law because I understand that lasting change requires more than safe spaces and scholarships—it requires changing the systems that fail girls in the first place.</p>
                    <p>I want to be the lawyer who stands between a girl and those who would abuse her. Who fights for policies that allow pregnant girls to return to school. Who challenges discriminatory practices. Who uses the law as a tool for healing, not just punishment.</p>
                    <p>My law degree will serve my initiative. My initiative will serve my community. And my community—one girl at a time—will transform this nation.</p>
                </section>
            </div>
        </div>
    );
}
