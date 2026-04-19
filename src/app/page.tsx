"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const DonationModal = dynamic(() => import("@/components/DonationModal"), { ssr: false });

const heroSummaryItems = [
  "Safe housing & resettlement",
  "Legal representation",
  "Medical & counseling services",
  "Education drives",
];

const impactCards = [
  {
    value: "2,500+",
    label: "Girls Supported",
    caption: "Direct support including education and safe housing.",
  },
  {
    value: "150+",
    label: "Communities Reached",
    caption: "Spreading awareness and building allyship networks.",
  },
];

const programCards = [
  {
    number: "01",
    title: "School Retention Support",
    description: "Covering school fees, supplies, and mentorship to keep girls in classrooms.",
    tags: ["Education", "Mentorship"],
    href: "/programs",
    hrefLabel: "Learn more",
  },
  {
    number: "02",
    title: "Safe Sanctuaries",
    description: "Emergency housing and psychological support for girls in immediate crisis.",
    tags: ["Protection", "Counseling"],
    href: "/programs",
    hrefLabel: "Learn more",
  },
  {
    number: "03",
    title: "Rise Brothers",
    description: "Engaging boys and men to become allies in protecting girls' rights.",
    tags: ["Allyship", "Change"],
    href: "/programs",
    hrefLabel: "Learn more",
  },
  {
    number: "04",
    title: "Legal Advocacy",
    description: "Providing legal representation and ensuring justice for victims of abuse.",
    tags: ["Justice", "Advocacy"],
    href: "/programs",
    hrefLabel: "Learn more",
  },
];

const supportFlow = [
  {
    step: "Step 1",
    title: "Stabilisation",
    text: "Crisis response, emergency care, and safe relocation if needed.",
  },
  {
    step: "Step 2",
    title: "Integration",
    text: "Back-to-school support, legal follow-up, and family mediation.",
  },
  {
    step: "Step 3",
    title: "Sustainability",
    text: "Vocational training, economic empowerment, and community allyship.",
  },
];

const galleryMoments = [
  { src: "/images/agr-photo-1.jpg", label: "Community Outreach" },
  { src: "/images/agr-photo-2.jpg", label: "Mentorship Session" },
  { src: "/images/agr-photo-3.jpg", label: "Skills Training" },
  { src: "/images/agr-photo-4.jpg", label: "Safe Sanctuary" },
];

export default function HomePage() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSplit}>
        <div className={styles.heroPanel}>
          <span className={styles.eyebrow}>African Girl Rise · Uganda</span>
          <h1 className={styles.heroHeading}>Help girls stay safe, stay in school, and build a stronger future.</h1>
          <p className={styles.heroSubtext}>
            African Girl Rise combines counselling, school retention support, allyship programming, and legal advocacy so
            donors and partners can fund a response that is practical, local, and measurable.
          </p>

          <div className={styles.heroPoints}>
            <span className={styles.heroPoint}>School retention support</span>
            <span className={styles.heroPoint}>Safe sanctuaries and counseling</span>
            <span className={styles.heroPoint}>Legal advocacy and protection</span>
          </div>

          <div className={styles.heroCtas}>
            <button onClick={() => setIsDonationModalOpen(true)} className={styles.btnPink}>
              Support Her Rise
            </button>
            <Link href="/programs" className={styles.btnGhost}>
              Explore Programs
            </Link>
          </div>
        </div>

        <div className={styles.heroVisualPanel}>
          <div className={styles.heroImagePanel}>
            <Image
              src="/images/hero-bg.jpg"
              alt="Adolescent girls in Uganda"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>

          <aside className={styles.heroSummaryCard}>
            <span className={styles.summaryEyebrow}>Welcome</span>
            <h2 className={styles.summaryTitle}>What your support makes possible.</h2>
            <p className={styles.summaryText}>
              Every contribution helps us stabilise girls early, keep them learning, and change the environment around
              them through protection, allyship, and community follow-up.
            </p>
            <ul className={styles.summaryList}>
              {heroSummaryItems.map((item) => (
                <li key={item} className={styles.summaryItem}>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.overviewSection}>
        <div className={styles.overviewGrid}>
          <article className={styles.leadCard}>
            <span className={styles.leadLabel}>Built from lived experience</span>
            <h2 className={styles.secTitle}>The response is built around what moves a girl from crisis to momentum.</h2>
            <p className={styles.leadText}>
              Girls first need stability and safety. Then they need support to remain in school. Then the environment
              around them has to change so the gains hold.
            </p>
            <p className={styles.leadText}>
              That is why African Girl Rise combines direct support, legal protection, and allyship programmes instead of
              isolated activities that donors cannot easily trace to outcomes.
            </p>
            <Link href="/our-story" className={styles.textLink}>
              Read our story →
            </Link>
          </article>

          <div className={styles.contextGrid}>
            {impactCards.map((item) => (
              <article key={item.label} className={styles.contextCard}>
                <span className={styles.contextValue}>{item.value}</span>
                <h3 className={styles.contextLabel}>{item.label}</h3>
                <p className={styles.contextCaption}>{item.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.programsSection}>
        <div className={styles.secHeader}>
          <span className={styles.eyebrow}>Core Program Pathways</span>
          <h2 className={styles.secTitle}>Four clear pathways organise the work girls and communities actually receive.</h2>
          <p className={styles.secDesc}>
            Rise Brothers sits inside the main programme structure because lasting change requires both direct support for
            girls and change around them.
          </p>
        </div>

        <div className={styles.programGrid}>
          {programCards.map((item) => (
            <article key={item.title} className={styles.programCard}>
              <div className={styles.programHeader}>
                <span className={styles.programNumber}>{item.number}</span>
                <span className={styles.programEyebrow}>Pathway</span>
              </div>
              <h3 className={styles.programTitle}>{item.title}</h3>
              <p className={styles.programBody}>{item.description}</p>
              <div className={styles.programTags}>
                {item.tags.map((tag) => (
                  <span key={tag} className={styles.programTag}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={item.href} className={styles.programLink}>
                {item.hrefLabel} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.flowSection}>
        <div className={styles.flowGrid}>
          <div className={styles.flowIntro}>
            <span className={styles.eyebrow}>What Support Looks Like</span>
            <h2 className={styles.secTitle}>Support moves from urgent response to long-term change.</h2>
            <p className={styles.secDesc}>
              Every girl may enter at a different point, but the model is designed to move from immediate support to
              durable change.
            </p>
            <Link href="/programs" className={styles.textLink}>
              See all programmes →
            </Link>
          </div>

          <div className={styles.flowSteps}>
            {supportFlow.map((item) => (
              <article key={item.step} className={styles.flowCard}>
                <span className={styles.flowStep}>{item.step}</span>
                <h3 className={styles.flowTitle}>{item.title}</h3>
                <p className={styles.flowText}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.marqueeSection}>
        <div className={styles.secHeader}>
          <span className={styles.eyebrow}>Moments From The Work</span>
          <h2 className={styles.secTitle}>A calmer gallery that shows the work without visual clutter.</h2>
          <p className={styles.secDesc}>
            The marquee is now simpler, slower, and more consistent so it reads as documentation instead of noise.
          </p>
        </div>

        <div className={styles.marqueeFrame}>
          <div className={styles.marqueeRow}>
            <div className={styles.marqueeTrack}>
              {[...galleryMoments, ...galleryMoments].map((item, index) => {
                const isRepeatedItem = index >= galleryMoments.length;

                if (isRepeatedItem) {
                  return (
                    <figure key={`${item.src}-${index}`} className={styles.marqueeCard} aria-hidden="true">
                      <div className={styles.marqueeMedia}>
                        <Image
                          src={item.src}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 32vw, 22vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </figure>
                  );
                }

                return (
                  <figure key={`${item.src}-${index}`} className={styles.marqueeCard}>
                    <div className={styles.marqueeMedia}>
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 32vw, 22vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <figcaption className={styles.marqueeCaption}>{item.label}</figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.quoteWrap}>
        <div className={styles.quoteBox}>
          <span className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </span>
          <p className={styles.quoteBody}>
            My parents broke the cycle so I could rise. Now I spend my life proving that your beginning does not define your becoming.
          </p>
          <span className={styles.quoteBy}>— Akatwijuka Grace, Founder</span>
          <Link href="/founder" className={styles.textLink}>
            Read her story →
          </Link>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={styles.ctaBody}>
          <span className={styles.eyebrow}>Make A Difference</span>
          <h2 className={styles.ctaHeading}>Help fund direct support for girls across Uganda.</h2>
          <p className={styles.ctaText}>
            Your donation helps cover school support, emergency response, mentorship, and legal advocacy.
          </p>
          <div className={styles.ctaRow}>
            <button onClick={() => setIsDonationModalOpen(true)} className={styles.ctaBtnWhite}>
              Donate Now
            </button>
            <Link href="/contact" className={styles.ctaBtnOutline}>
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      {isDonationModalOpen ? (
        <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
      ) : null}
    </div>
  );
}
