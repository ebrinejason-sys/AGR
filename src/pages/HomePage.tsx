import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Heart, Home, Scale, Users } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './HomePage.module.css';
import AnimatedCounter from '@/components/AnimatedCounter';
import EmpowerSlogan from '@/components/EmpowerSlogan';
import { fetchPublicCms, type PublicStory } from '@/lib/public-cms';
import type { PublicMediaItem } from '@/lib/public-media';

const DonationModal = lazy(() => import('@/components/DonationModal'));

const impactStats = [
    { label: 'Girls reached', value: 56000, suffix: '+', detail: 'Through school and community support.' },
    { label: 'Safe spaces active', value: 12, suffix: '+', detail: 'School-linked sanctuaries and support points.' },
    { label: 'Girls leave school early', value: 4, suffix: ' in 10', detail: 'A pattern the organization works to interrupt.' },
] as const;

const programCards = [
    {
        title: 'Rise Sanctuaries',
        description: 'School-linked safe spaces with trusted adults, emotional support, and practical follow-up.',
        href: '/programs/rise-rooms',
        image: '/images/agr-photo-3.jpg',
        imageAlt: 'Students taking part in an African Girl Rise community session',
        Icon: Home,
    },
    {
        title: 'Education Support',
        description: 'Retention support, materials, and interventions that keep girls learning with dignity.',
        href: '/programs/academic-rescue',
        image: '/images/hero-bg.jpg',
        imageAlt: 'Students together in a classroom',
        Icon: BookOpen,
    },
    {
        title: 'Legal Advocacy',
        description: 'Rights awareness, case response, and advocacy when safety and access are under threat.',
        href: '/legal-advocacy',
        image: '/images/agr-photo-1.jpg',
        imageAlt: 'Young people sharing messages about education and support',
        Icon: Scale,
    },
    {
        title: 'Rise Brothers',
        description: 'Boys and young men learning empathy, accountability, and practical allyship.',
        href: '/programs/rise-brothers',
        image: '/images/programs/rise-brothers/rise-brothers-1.jpg',
        imageAlt: 'Young people taking part in a Rise Brothers community activity',
        Icon: Users,
    },
] as const;

const focusAreas = ['Mental health support', 'Girls’ education', 'Legal advocacy', 'Practical skills'];

function getStoryExcerpt(content: string): string {
    const text = content
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, '\'')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ')
        .trim();

    return text.length > 190 ? `${text.slice(0, 187).trimEnd()}…` : text;
}

export default function HomePage() {
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [media, setMedia] = useState<PublicMediaItem[]>([]);
    const [stories, setStories] = useState<PublicStory[]>([]);
    const reduceMotion = useReducedMotion();
    const entrance = reduceMotion ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } };

    useEffect(() => {
        let mounted = true;

        fetchPublicCms()
            .then((data) => {
                if (!mounted) return;
                setMedia(data.media.slice(0, 4));
                setStories(data.stories.slice(0, 3));
            })
            .catch(() => {
                if (mounted) {
                    setMedia([]);
                    setStories([]);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className={styles.page}>
            <section className={styles.heroSection}>
                <div className={styles.heroGrid}>
                    <div className={styles.heroCopy}>
                        <span className={styles.heroEyebrow}>African Girl Rise · Uganda</span>
                        <EmpowerSlogan variant="hero" />
                        <p className={styles.heroText}>
                            We empower girls with mental health support, practical entrepreneurship, and skills development while keeping vulnerable girls in school to break cycles of poverty and transform communities.
                        </p>
                        <div className={styles.heroActions}>
                            <button type="button" className="btn-premium" onClick={() => setIsDonationModalOpen(true)}>
                                Support Her Rise <Heart size={17} />
                            </button>
                            <Link to="/programs" className={styles.secondaryAction}>
                                Explore our programs <ArrowRight size={17} />
                            </Link>
                        </div>
                        <div className={styles.heroLocation}>
                            <span className={styles.locationRule} />
                            Rooted in Ibanda District, Western Uganda
                        </div>
                    </div>

                    <figure className={styles.heroVisual}>
                        <img
                            src="/images/hero-bg.jpg"
                            alt="Students gathered in a classroom for a community session"
                            className={styles.heroImage}
                            fetchPriority="high"
                        />
                        <figcaption className={styles.heroCaption}>
                            <span>Her future belongs to her</span>
                            <span>African Girl Rise · Community work</span>
                        </figcaption>
                    </figure>
                </div>
            </section>

            <section className={styles.focusStrip} aria-label="Our focus">
                <span className={styles.focusLabel}>Our focus</span>
                {focusAreas.map((area) => <span className={styles.focusItem} key={area}>{area}</span>)}
            </section>

            <motion.section className={styles.impactSection} {...entrance} transition={{ duration: 0.55 }} viewport={{ once: true, amount: 0.2 }}>
                <div className={styles.sectionHeading}>
                    <div>
                        <span className="subheading">The work, in context</span>
                        <h2 className="heading-section">Progress made visible.</h2>
                    </div>
                    <p className={styles.sectionIntroText}>
                        These figures reflect the reach and challenges described in African Girl Rise’s existing organizational materials.
                    </p>
                </div>
                <div className={styles.impactGrid}>
                    {impactStats.map((stat, index) => (
                        <article className={styles.impactItem} key={stat.label}>
                            <span className={`${styles.impactValue} ${index === 1 ? styles.impactValueCyan : ''}`}>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </span>
                            <h3>{stat.label}</h3>
                            <p>{stat.detail}</p>
                        </article>
                    ))}
                </div>
            </motion.section>

            <motion.section className={styles.missionSection} {...entrance} transition={{ duration: 0.55 }} viewport={{ once: true, amount: 0.2 }}>
                <div className={styles.missionImageWrap}>
                    <img src="/images/agr-photo-1.jpg" alt="Students holding messages about education and believing in their futures" loading="lazy" />
                    <span className={styles.imageNote}>A future she can shape</span>
                </div>
                <div className={styles.missionCopy}>
                    <span className="subheading">Who we are</span>
                    <h2 className="heading-section">Local support. More room to rise.</h2>
                    <p>
                        African Girl Rise works with communities in Uganda to help adolescent girls stay safe, supported, and in school. The organization brings together safe spaces, mentorship, mental health support, education, and legal advocacy.
                    </p>
                    <p>
                        Its work begins with listening to girls and responding with practical support that respects their dignity and potential.
                    </p>
                    <Link to="/our-story" className={styles.textLink}>
                        Learn about our story <ArrowRight size={17} />
                    </Link>
                </div>
            </motion.section>

            <section className={styles.programsSection}>
                <div className={styles.sectionHeading}>
                    <div>
                        <span className="subheading">Our programs</span>
                        <h2 className="heading-section">Support for every step forward.</h2>
                    </div>
                    <Link to="/programs" className={styles.textLink}>
                        All programs <ArrowRight size={17} />
                    </Link>
                </div>
                <div className={styles.programGrid}>
                    {programCards.map(({ title, description, href, image, imageAlt, Icon }, index) => (
                        <motion.article
                            className={styles.programCard}
                            key={title}
                            {...(reduceMotion ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 } })}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            viewport={{ once: true, amount: 0.18 }}
                        >
                            <Link to={href} className={styles.programImageLink} aria-label={`Explore ${title}`}>
                                <img src={image} alt={imageAlt} loading="lazy" />
                                <span className={styles.programIcon}><Icon size={20} /></span>
                            </Link>
                            <div className={styles.programCardBody}>
                                <h3><Link to={href}>{title}</Link></h3>
                                <p>{description}</p>
                                <Link to={href} className={styles.programLink}>Explore program <ArrowRight size={15} /></Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            <section className={styles.storiesSection}>
                <div className={styles.sectionHeading}>
                    <div>
                        <span className="subheading">From the community</span>
                        <h2 className="heading-section">Stories are where impact becomes personal.</h2>
                    </div>
                    <Link to="/stories" className={styles.textLink}>
                        Read all stories <ArrowRight size={17} />
                    </Link>
                </div>
                {stories.length > 0 ? (
                    <div className={styles.storyGrid}>
                        {stories.map((story, index) => (
                            <article className={styles.storyCard} key={story.id}>
                                <Link to="/stories" className={styles.storyImageLink} aria-label={`Read ${story.title}`}>
                                    <img
                                        src={story.image_url || ['/images/agr-photo-2.jpg', '/images/agr-photo-3.jpg', '/images/agr-photo-4.jpg'][index]}
                                        alt={story.image_url ? story.title : 'African Girl Rise community activity'}
                                        loading="lazy"
                                    />
                                </Link>
                                <div className={styles.storyCardBody}>
                                    <span className={styles.storyAuthor}>{story.author || 'African Girl Rise'}</span>
                                    <h3><Link to="/stories">{story.title}</Link></h3>
                                    <p>{getStoryExcerpt(story.content)}</p>
                                    <Link to="/stories" className={styles.programLink}>Read the story <ArrowRight size={15} /></Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className={styles.storyFallback}>
                        <img src="/images/agr-photo-2.jpg" alt="Students participating in a community activity" loading="lazy" />
                        <div>
                            <span className={styles.storyAuthor}>Our story</span>
                            <h3>Your beginning does not define your becoming.</h3>
                            <p>Learn why African Girl Rise exists and how its community-rooted work supports girls’ safety, education, and opportunity.</p>
                            <Link to="/our-story" className={styles.programLink}>Discover our story <ArrowRight size={15} /></Link>
                        </div>
                    </div>
                )}
            </section>

            {media.length > 0 && (
                <section className={styles.gallerySection}>
                    <div className={styles.sectionHeading}>
                        <div>
                            <span className="subheading">Field notes</span>
                            <h2 className="heading-section">A closer look at the work.</h2>
                        </div>
                        <Link to="/gallery" className={styles.textLink}>
                            Visit the gallery <ArrowRight size={17} />
                        </Link>
                    </div>
                    <div className={styles.galleryGrid}>
                        {media.map((item) => (
                            <figure className={styles.galleryItem} key={item.id}>
                                {item.type === 'video' ? (
                                    <video src={item.url} controls playsInline className={styles.galleryMedia} preload="metadata" />
                                ) : (
                                    <img src={item.url} alt={item.description || 'African Girl Rise community moment'} className={styles.galleryMedia} loading="lazy" />
                                )}
                                {item.description && <figcaption>{item.description}</figcaption>}
                            </figure>
                        ))}
                    </div>
                </section>
            )}

            <section className={styles.getInvolvedSection}>
                <div className={styles.getInvolvedImage}>
                    <img src="/images/agr-photo-4.jpg" alt="Young people gathered at an African Girl Rise activity" loading="lazy" />
                </div>
                <div className={styles.getInvolvedCopy}>
                    <span className="subheading">Be part of the change</span>
                    <h2 className="heading-section">A girl’s next step can start with yours.</h2>
                    <p>Help strengthen the local support that makes it possible for girls to learn, feel heard, and shape their own futures.</p>
                    <div className={styles.getInvolvedActions}>
                        <button type="button" className="btn-premium" onClick={() => setIsDonationModalOpen(true)}>
                            Donate to support girls <Heart size={17} />
                        </button>
                        <Link to="/contact/mentor" className={styles.secondaryAction}>Volunteer as a mentor <ArrowRight size={17} /></Link>
                        <Link to="/contact/partner" className={styles.secondaryAction}>Become a partner <ArrowRight size={17} /></Link>
                    </div>
                </div>
            </section>

            {isDonationModalOpen && (
                <Suspense fallback={null}>
                    <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
                </Suspense>
            )}
        </div>
    );
}
