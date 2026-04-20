# AGR Site Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp the AGR homepage to a dark immersive theme, add scroll-reveal programs section, fix all broken image references, remove text tickers from non-home pages, confirm all APIs work, and polish admin mobile responsiveness.

**Architecture:** Vite + React SPA with CSS Modules. API endpoints live in `/api/*.ts` as Vercel serverless functions. All state is component-local; Supabase used for DB operations server-side only. No test framework — verification is manual browser checks.

**Tech Stack:** React 19, React Router v7, CSS Modules, Supabase JS client, Resend SDK, Vercel Node runtime for API routes.

---

## Task 1: Fix Broken Image References in Marquee

**Files:**
- Modify: `src/pages/HomePage.tsx` (lines 32–39)

The `galleryMoments` array references 3 deleted images. Replace them with existing images.

**Available images (confirmed in `/public/images/`):**
- `hero-bg.jpg`, `about-us.jpg`, `agr-photo-1.jpg`, `agr-photo-2.jpg`, `agr-photo-3.jpg`, `agr-photo-4.jpg`, `founder.jpg`, `program-3.jpg`, `worthy-dream.jpg`
- `programs/rise-brothers/rise-brothers-1.jpg` through `rise-brothers-4.jpg`

- [ ] **Step 1: Replace galleryMoments array in `src/pages/HomePage.tsx`**

Replace lines 32–39 with:

```tsx
const galleryMoments = [
  { label: 'School support in action', src: '/images/hero-bg.jpg' },
  { label: 'Girls building confidence together', src: '/images/about-us.jpg' },
  { label: 'Rise Brothers allyship sessions', src: '/images/programs/rise-brothers/rise-brothers-1.jpg' },
  { label: 'Community-led care', src: '/images/agr-photo-2.jpg' },
  { label: 'Mentoring and advocacy work', src: '/images/agr-photo-3.jpg' },
  { label: 'Practical learning and support', src: '/images/program-3.jpg' },
  { label: 'Worthy dream, real impact', src: '/images/worthy-dream.jpg' },
  { label: 'Rise Brothers programme', src: '/images/programs/rise-brothers/rise-brothers-2.jpg' },
  { label: 'Community outreach', src: '/images/agr-photo-4.jpg' },
  { label: 'Founder Akatwijuka Grace', src: '/images/founder.jpg' },
  { label: 'Girls in community programme', src: '/images/agr-photo-1.jpg' },
  { label: 'Rise Brothers in session', src: '/images/programs/rise-brothers/rise-brothers-3.jpg' },
] as const;
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`. Open http://localhost:5173. Scroll to the marquee section. All 12 images should load without 404s. Check DevTools Network tab — no image 404s.

- [ ] **Step 3: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "fix: replace deleted image refs in gallery marquee with existing images"
```

---

## Task 2: Remove Text Ticker from All Non-Home Pages

**Files:**
- Modify: `src/components/layout/LayoutShell.tsx`
- Modify: `src/pages/ContactPage.tsx` (lines 70–76)

The `SuggestionTicker` currently shows on every non-home page. User wants it removed entirely. `ContactPage.tsx` also has its own hardcoded inline ticker.

- [ ] **Step 1: Remove SuggestionTicker from `src/components/layout/LayoutShell.tsx`**

Replace the current content with:

```tsx
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from '@/components/Preloader';
import styles from './layout.module.css';

export default function LayoutShell({
    children,
    isIOSDevice,
    isAdmin,
}: {
    children: React.ReactNode;
    isIOSDevice: boolean;
    isAdmin?: boolean;
}) {
    const location = useLocation();

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <div className={styles.layoutContainer}>
            <Preloader skip={isIOSDevice} />
            <Navbar />
            <main className={styles.mainContent}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
```

- [ ] **Step 2: Remove inline ticker from `src/pages/ContactPage.tsx`**

Delete lines 70–76 (the `<div className={styles.ticker}>` block):

```tsx
// DELETE this entire block:
<div className={styles.ticker} aria-hidden="true">
    <div className={styles.tickerTrack}>
        {['Get In Touch', ...].map((item, i) => (
            <span key={i} className={styles.tickerItem}>{item}</span>
        ))}
    </div>
</div>
```

- [ ] **Step 3: Remove unused ticker CSS from `src/pages/ContactPage.module.css`**

Search for `.ticker`, `.tickerTrack`, `.tickerItem` in `src/pages/ContactPage.module.css` and delete those rule blocks.

- [ ] **Step 4: Verify in browser**

Navigate to /programs, /contact, /our-story, /events. No scrolling text ticker should appear at the top of any page.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/LayoutShell.tsx src/pages/ContactPage.tsx src/pages/ContactPage.module.css
git commit -m "feat: remove text ticker from all non-home pages"
```

---

## Task 3: Homepage — Dark Immersive Hero

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/HomePage.module.css`

Transform the hero from light to dark immersive. Keep the same JSX structure — only change CSS classes and background styling.

- [ ] **Step 1: Update hero section background in `src/pages/HomePage.module.css`**

Replace the `.heroSplit` rule:

```css
.heroSplit {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  min-height: clamp(680px, 84vh, 920px);
  background: linear-gradient(180deg, #08111f 0%, #13213a 100%);
}
```

Replace `.heroPanel`:

```css
.heroPanel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 10% 4rem 12%;
  background: linear-gradient(180deg, #08111f 0%, #13213a 100%);
}
```

Replace `.welcomePill`:

```css
.welcomePill {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  width: fit-content;
  margin-bottom: 1.4rem;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 94, 138, 0.2);
  border-radius: 20px;
  background: rgba(13, 23, 40, 0.88);
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.3);
}
```

Replace `.welcomeLabel`:

```css
.welcomeLabel {
  display: block;
  color: #f8fafc;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

Replace `.welcomeMeta`:

```css
.welcomeMeta {
  margin: 0.2rem 0 0;
  color: rgba(194, 202, 218, 0.8);
  font-size: 0.84rem;
  line-height: 1.45;
}
```

Replace `.heroHeading`:

```css
.heroHeading {
  margin: 0;
  color: #f8fafc;
  font-family: var(--font-serif);
  font-size: clamp(3rem, 5vw, 4.85rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.04em;
}
```

Replace `.heroSubtext`:

```css
.heroSubtext {
  max-width: 37rem;
  margin: 1.5rem 0 0;
  color: rgba(194, 202, 218, 0.85);
  font-size: 1.08rem;
  line-height: 1.78;
}
```

Replace `.heroPoint`:

```css
.heroPoint {
  display: inline-flex;
  align-items: center;
  padding: 0.72rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 94, 138, 0.22);
  background: rgba(255, 94, 138, 0.08);
  color: #f8fafc;
  font-size: 0.82rem;
  font-weight: 700;
}
```

Replace `.heroSummaryCard`:

```css
.heroSummaryCard {
  margin: -4rem 2rem 2rem;
  padding: 1.5rem 1.6rem;
  border: 1px solid rgba(255, 94, 138, 0.18);
  border-radius: 28px;
  background: rgba(13, 23, 40, 0.92);
  box-shadow: 0 24px 54px rgba(2, 6, 23, 0.4);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

Replace `.summaryTitle`:

```css
.summaryTitle {
  margin: 0.85rem 0 0;
  color: #f8fafc;
  font-family: var(--font-serif);
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  font-weight: 800;
  line-height: 1.18;
}
```

Replace `.summaryText`:

```css
.summaryText {
  margin: 0.9rem 0 0;
  color: rgba(194, 202, 218, 0.8);
  font-size: 0.96rem;
  line-height: 1.7;
}
```

Replace `.summaryItem`:

```css
.summaryItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f8fafc;
  font-size: 0.9rem;
  font-weight: 700;
}
```

- [ ] **Step 2: Update hero heading to have pink-accented last phrase in `src/pages/HomePage.tsx`**

Replace the h1 (line 54):

```tsx
<h1 className={styles.heroHeading}>
  Help girls stay safe, stay in school, and{' '}
  <span style={{ color: 'var(--color-pink)' }}>build a stronger future.</span>
</h1>
```

- [ ] **Step 3: Update heroVisualPanel dark overlay in `src/pages/HomePage.module.css`**

Replace `.heroImagePanel::after`:

```css
.heroImagePanel::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    rgba(8, 17, 31, 0.96) 0%,
    rgba(8, 17, 31, 0.4) 30%,
    rgba(8, 17, 31, 0) 60%
  );
  pointer-events: none;
}
```

- [ ] **Step 4: Update dark-mode overrides for light sections**

Replace the existing dark-theme hero override in `.module.css`:

```css
:global([data-theme="dark"]) .heroSplit {
  background: linear-gradient(180deg, #04080f 0%, #0a1320 100%);
}
```

- [ ] **Step 5: Verify hero in browser**

Open http://localhost:5173. The hero should show dark navy background, white/pink text, the hero image on the right with a dark fade to the left, and the summary card as a dark glass panel.

- [ ] **Step 6: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/HomePage.module.css
git commit -m "feat: dark immersive hero design for homepage"
```

---

## Task 4: Homepage — Impact Stats Band

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/HomePage.module.css`

Add a full-width dark stats band directly below the hero, replacing the current overview section's stats placement.

- [ ] **Step 1: Add `statsBand` section to `src/pages/HomePage.tsx`**

Insert after the closing `</section>` of `heroSplit` (after line 76) and before `overviewSection`:

```tsx
<section className={styles.statsBand}>
  <div className={styles.statsBandInner}>
    {impactCards.map((item, i) => {
      const colors = ['#e91e63', '#9c27b0', '#00bcd4'] as const;
      return (
        <div key={item.label} className={styles.statsBandCard} style={{ borderTopColor: colors[i] }}>
          <span className={styles.statsBandValue} style={{ color: colors[i] }}>{item.value}</span>
          <span className={styles.statsBandLabel}>{item.label}</span>
          <p className={styles.statsBandCaption}>{item.caption}</p>
        </div>
      );
    })}
  </div>
</section>
```

- [ ] **Step 2: Add CSS for stats band in `src/pages/HomePage.module.css`**

Add after the `.heroSplit` block:

```css
.statsBand {
  background: linear-gradient(180deg, #13213a 0%, #0d1628 100%);
  border-bottom: 1px solid rgba(255, 94, 138, 0.12);
}

.statsBandInner {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 100%;
}

.statsBandCard {
  padding: 2.5rem 3rem;
  border-top: 3px solid transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.statsBandCard:last-child {
  border-right: none;
}

.statsBandValue {
  display: block;
  font-family: var(--font-serif);
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  font-weight: 800;
  line-height: 1;
}

.statsBandLabel {
  display: block;
  margin-top: 0.6rem;
  color: #f8fafc;
  font-size: 1rem;
  font-weight: 800;
}

.statsBandCaption {
  margin: 0.6rem 0 0;
  color: rgba(194, 202, 218, 0.65);
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .statsBandInner {
    grid-template-columns: 1fr;
  }
  .statsBandCard {
    padding: 1.5rem 8%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
}
```

- [ ] **Step 3: Verify in browser**

Scroll past the hero — a dark stats band with 3 color-topped cards (pink, purple, teal) should appear.

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/HomePage.module.css
git commit -m "feat: add dark stats band below hero on homepage"
```

---

## Task 5: Homepage — Scroll-Reveal Programs Section

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/HomePage.module.css`

Replace the static 2-column program grid with cards that reveal one by one as the user scrolls (IntersectionObserver).

- [ ] **Step 1: Add scroll-reveal hook and updated programs section to `src/pages/HomePage.tsx`**

Add this import at top of file:
```tsx
import { useEffect, useRef } from 'react';
```

Replace the entire `programsSection` JSX (lines 99–121) with:

```tsx
<section className={styles.programsSection}>
  <div className={styles.secHeader}>
    <span className={styles.eyebrow}>Core Program Pathways</span>
    <h2 className={styles.secTitle}>Four clear pathways organise the work girls and communities actually receive.</h2>
    <p className={styles.secDesc}>Rise Brothers sits inside the main programme structure because lasting change requires both direct support for girls and change around them.</p>
  </div>
  <div className={styles.programRevealList}>
    {programCards.map((item, i) => (
      <ProgramRevealCard key={item.title} item={item} index={i} />
    ))}
  </div>
</section>
```

Add the `ProgramRevealCard` component just above the `HomePage` function:

```tsx
function ProgramRevealCard({
  item,
  index,
}: {
  item: (typeof programCards)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-visible', '1');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={styles.programRevealCard}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className={styles.programRevealLeft}>
        <span className={styles.programRevealNumber}>{item.number}</span>
      </div>
      <div className={styles.programRevealBody}>
        <h3 className={styles.programRevealTitle}>{item.title}</h3>
        <p className={styles.programRevealText}>{item.description}</p>
        <div className={styles.programTags}>
          {item.tags.map(tag => (
            <span key={tag} className={styles.programTag}>{tag}</span>
          ))}
        </div>
        <Link to={item.href} className={styles.programLink}>{item.hrefLabel} →</Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Add scroll-reveal program CSS to `src/pages/HomePage.module.css`**

Add after the existing `.programCard` block:

```css
.programRevealList {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 2rem;
}

.programRevealCard {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0;
  border: 1px solid rgba(255, 94, 138, 0.12);
  border-left: 4px solid rgba(255, 94, 138, 0.4);
  border-radius: 20px;
  background: linear-gradient(90deg, rgba(19, 33, 58, 0.6) 0%, rgba(13, 22, 40, 0.3) 100%);
  overflow: hidden;
  transform: translateX(-36px);
  opacity: 0;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
}

.programRevealCard[data-visible="1"] {
  transform: translateX(0);
  opacity: 1;
}

.programRevealLeft {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 94, 138, 0.06);
  border-right: 1px solid rgba(255, 94, 138, 0.1);
}

.programRevealNumber {
  color: rgba(255, 94, 138, 0.35);
  font-family: var(--font-serif);
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1;
}

.programRevealBody {
  padding: 1.75rem 2rem;
}

.programRevealTitle {
  margin: 0 0 0.75rem;
  color: #f8fafc;
  font-size: 1.18rem;
  font-weight: 800;
}

.programRevealText {
  margin: 0;
  color: rgba(194, 202, 218, 0.8);
  font-size: 0.97rem;
  line-height: 1.75;
}

@media (max-width: 600px) {
  .programRevealCard {
    grid-template-columns: 56px 1fr;
  }
  .programRevealBody {
    padding: 1.25rem 1rem;
  }
  .programRevealNumber {
    font-size: 1.8rem;
  }
}
```

- [ ] **Step 3: Update `programsSection` background in `src/pages/HomePage.module.css`**

Replace the existing `.programsSection` rule:

```css
.programsSection {
  background: linear-gradient(180deg, #0d1628 0%, #0a1422 100%);
}
```

- [ ] **Step 4: Verify in browser**

Scroll to the programs section. Each card should start invisible and slide in from the left as it enters the viewport. Stagger delay means card 1 appears first, then 2, 3, 4.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/HomePage.module.css
git commit -m "feat: scroll-reveal program cards on homepage"
```

---

## Task 6: Homepage — Dark Marquee Section

**Files:**
- Modify: `src/pages/HomePage.module.css`

Give the marquee section a dark background to match the immersive theme.

- [ ] **Step 1: Update marquee section styles**

Replace `.marqueeSection` in `src/pages/HomePage.module.css`:

```css
.marqueeSection {
  background: linear-gradient(180deg, #0a1422 0%, #08111f 100%);
  padding-top: 0;
}
```

Replace `.marqueeFrame::before` dark gradient:

```css
.marqueeFrame::before {
  left: 0;
  background: linear-gradient(90deg, #0a1422 0%, rgba(10, 20, 34, 0) 100%);
}
```

Replace `.marqueeFrame::after` dark gradient:

```css
.marqueeFrame::after {
  right: 0;
  background: linear-gradient(-90deg, #0a1422 0%, rgba(10, 20, 34, 0) 100%);
}
```

Replace the `.marqueeSection` dark theme override:

```css
:global([data-theme="dark"]) .marqueeSection {
  background: linear-gradient(180deg, #06101e 0%, #04080f 100%);
}

:global([data-theme="dark"]) .marqueeFrame::before {
  background: linear-gradient(90deg, #06101e 0%, rgba(4, 8, 15, 0) 100%);
}

:global([data-theme="dark"]) .marqueeFrame::after {
  background: linear-gradient(-90deg, #06101e 0%, rgba(4, 8, 15, 0) 100%);
}
```

Also update `.marqueeCaption`:

```css
.marqueeCaption {
  color: rgba(194, 202, 218, 0.75);
  font-size: 0.87rem;
  font-weight: 700;
  line-height: 1.45;
}
```

And the section header eyebrow/title when inside dark marquee:

Add `.marqueeSection .secTitle`:

```css
.marqueeSection .secTitle {
  color: #f8fafc;
}

.marqueeSection .secDesc {
  color: rgba(194, 202, 218, 0.75);
}

.marqueeSection .eyebrow {
  color: var(--color-pink);
}
```

- [ ] **Step 2: Update flowSection to dark**

Replace `.flowSection`:

```css
.flowSection {
  background: linear-gradient(180deg, #0d1628 0%, #13213a 100%);
}
```

Update flow card styles:

```css
.flowCard {
  padding: 1.4rem 1.25rem;
  border: 1px solid rgba(255, 94, 138, 0.1);
  border-radius: 22px;
  background: rgba(13, 23, 40, 0.7);
}

.flowTitle {
  color: #f8fafc;
  font-size: 1.02rem;
  font-weight: 800;
}

.flowText {
  margin: 0.75rem 0 0;
  color: rgba(194, 202, 218, 0.75);
  font-size: 0.92rem;
  line-height: 1.7;
}
```

- [ ] **Step 3: Verify in browser**

The entire homepage below the stats band should feel consistently dark and immersive. The marquee images should be visible against the dark background.

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.module.css
git commit -m "feat: dark immersive theme for marquee and flow sections"
```

---

## Task 7: Overview Section — Keep Light for Contrast

**Files:**
- Modify: `src/pages/HomePage.module.css`

The overview section ("Built from lived experience") can stay light as a deliberate contrast break.

- [ ] **Step 1: No changes needed to overviewSection**

The `.overviewSection` with `background: #ffffff` and the light cards provide a good visual rhythm break between the dark hero and dark lower sections. Leave as-is.

- [ ] **Step 2: Verify contrast rhythm in browser**

Scroll down the full homepage: dark hero → dark stats → light overview → dark programs → dark flow → dark marquee → light quote → pink CTA band. This rhythm is intentional and correct.

---

## Task 8: Admin Mobile — Verify & Fix Remaining Issues

**Files:**
- Modify: `src/pages/admin/ContactsPage.module.css`
- Modify: `src/pages/admin/EventsPage.module.css`
- Modify: `src/pages/admin/StoriesPage.module.css`
- Modify: `src/pages/admin/SubscriptionsPage.module.css`
- Modify: `src/pages/admin/MediaPage.module.css`
- Modify: `src/pages/admin/LoginPage.module.css`

The sidebar is already mobile-responsive (`layout.module.css` has hamburger + drawer). Dashboard and Projects pages already have `@media (max-width: 768px)` rules. Check remaining admin page CSS files and add missing mobile breakpoints.

- [ ] **Step 1: Add missing mobile breakpoint to `src/pages/admin/LoginPage.module.css`**

`ContactsPage`, `EventsPage`, `StoriesPage`, `SubscriptionsPage`, `MediaPage` already have `@media (max-width: 768px)` rules. Only `LoginPage.module.css` is missing a mobile rule for `.btnGroup`. Append to the end of that file:

```css
@media (max-width: 480px) {
  .btnGroup {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Verify admin on mobile viewport**

In DevTools, switch to mobile viewport (375px). Navigate to /admin, /admin/projects, /admin/events, /admin/contacts, /admin/subscriptions, /admin/media, /admin/stories. The hamburger menu should work, sidebar should slide in/out, and page content should not overflow horizontally.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/*.module.css
git commit -m "fix: admin page mobile responsiveness for all pages"
```

---

## Task 9: API Audit — Verify All Endpoints

**No code changes expected unless issues found.**

- [ ] **Step 1: Confirm all env vars are set**

Check `/c/Users/ebrin/AGR/.env.local`. Confirm:
- `RESEND_API_KEY` is set ✓
- `FLUTTERWAVE_CLIENT_ID` and `FLUTTERWAVE_CLIENT_SECRET` are set ✓ (v4 flow)
- `MARZPAY_BASIC_AUTH_TOKEN` is set ✓
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set ✓
- `SUPABASE_SERVICE_ROLE_KEY` is set ✓

- [ ] **Step 2: Test contact form via browser**

Run `npm run dev`. Go to /contact. Submit general form with name, email, message. Should succeed with "Message sent successfully" green text. Check the Resend dashboard for a sent email to `africangirlriseltd@gmail.com`.

- [ ] **Step 3: Test footer subscribe form**

Scroll to footer. Enter a test email. Should succeed with "Welcome to the African Girl Rise family! 🌍".

- [ ] **Step 4: Test donate modal flow**

Click "Donate Now" on the homepage. Enter amount, email. For mobile money: enter Ugandan phone number and select MTN or Airtel. Submit. Should redirect to Flutterwave payment page or show a processing state.

- [ ] **Step 5: Fix the SENDER_EMAIL env resolution in `src/lib/resend.ts` (if needed)**

Currently `SENDER_EMAIL` is set to `"onboarding@resend.dev"` in `.env.local` but `RESEND_FROM_EMAIL` is set to `"African Girl Rise <noreply@africangirlriseltd.org>"`. The code checks `RESEND_FROM_EMAIL` first, so the correct sender will be used. No code change needed.

- [ ] **Step 6: Verify marzpay callback route exists**

Confirm `api/marzpay/callback.ts` exists and handles POST from MarzPay webhook. Open the file and verify it updates the donation status in Supabase.

- [ ] **Step 7: Commit if any fixes made**

```bash
git add api/ src/lib/
git commit -m "fix: api endpoint audit and corrections"
```

---

## Task 10: Final Polish — Remaining Visual Fixes

**Files:**
- Modify: `src/pages/HomePage.module.css`

Tidy up any remaining light-theme elements in the dark sections.

- [ ] **Step 1: Update overviewSection card in dark theme**

The `leadCard` uses `background: linear-gradient(180deg, var(--surface-rose) 0%, #ffffff 100%)` — this will look wrong against the dark theme. Add a dark-mode override:

In `src/pages/HomePage.module.css`, the dark mode override for `leadCard` and `contextCard` already exists — verify it covers the new dark sections by reading the file bottom section.

- [ ] **Step 2: Update `secTitle` color for dark sections**

The `.secTitle` uses `color: var(--text-color)` which is `#1a1a2e` in light mode. For dark sections (programsSection, flowSection, marqueeSection), the text needs to be light. Add targeted overrides:

```css
.programsSection .secTitle,
.programsSection .secDesc,
.programsSection .eyebrow {
  color: #f8fafc;
}

.programsSection .secDesc {
  color: rgba(194, 202, 218, 0.8);
}

.flowSection .secTitle,
.flowIntro .secDesc,
.flowIntro .eyebrow,
.flowIntro .textLink {
  color: #f8fafc;
}

.flowIntro .secDesc {
  color: rgba(194, 202, 218, 0.8);
}

.flowIntro .textLink {
  color: var(--color-pink);
}
```

- [ ] **Step 3: Build and check for TypeScript errors**

```bash
npm run build
```

Expected: no TypeScript errors. If there are import errors from the removed `useLocation` in LayoutShell.tsx, that's correct since it was unused after the ticker removal — remove the import.

- [ ] **Step 4: Final visual pass in browser**

Check the full page on desktop (1280px), tablet (768px), and mobile (375px). Confirm:
- Hero: dark navy with pink-accented heading and photo on right ✓
- Stats band: 3 color-topped cards ✓
- Overview: light section (contrast break) ✓
- Programs: dark, cards slide in on scroll ✓
- Flow: dark ✓
- Marquee: dark, all 12 images load ✓
- Quote: light ✓
- CTA band: pink ✓

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/HomePage.module.css src/components/layout/LayoutShell.tsx
git commit -m "feat: homepage dark immersive revamp complete"
```
