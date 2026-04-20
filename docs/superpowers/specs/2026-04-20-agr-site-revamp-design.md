# AGR Site Revamp — Design Spec
**Date:** 2026-04-20  
**Status:** Approved

## Overview

Full-site revamp of the African Girl Rise (AGR) React/Vite SPA. The goal is to make the site visually compelling, fix all broken functionality, ensure mobile/admin usability, and validate all API integrations.

---

## 1. Homepage Redesign — Dark Immersive

### Hero Section
- Background: deep navy gradient (`#08111f → #13213a`)
- Left panel: keep current structure (welcome pill, eyebrow, h1, subtext, CTA buttons) — pill gets a dark glass style, heading gets pink-accented final phrase
- Right panel: `hero-bg.jpg` with a dark left-fade overlay blending into text
- Summary card: dark glass treatment (`rgba(13,23,40,0.9)`, border `rgba(255,94,138,0.15)`)
- CTA buttons: pink filled "Donate Now" + dark ghost "Our Programs"

### Impact Stats Band
- Full-width section directly below hero
- 3 cards side-by-side: pink (56K+ Girls), purple (12+ Sanctuaries), teal (4 in 10 Dropout)
- Dark surface background

### Programs Section — Vertical Stacked Reveal
- Each of 4 program cards slides in from the left as the user scrolls (IntersectionObserver)
- Card style: dark glass, left pink border accent, large number, title, description, tags, explore link
- Animation: `translateX(-40px) opacity(0)` → `translateX(0) opacity(1)`, 0.5s ease, staggered 150ms delay per card
- `data-visible` attribute toggled by observer; CSS handles the transition

### Photo Marquee — Fixed & Expanded
- Remove broken image refs: `legal-advocacy.jpg`, `program-1.jpg`, `program-2.jpg`, `program-4.jpg` (all deleted from repo)
- Use all 12 available images: `hero-bg.jpg`, `about-us.jpg`, `agr-photo-1/2/3/4.jpg`, `founder.jpg`, `program-3.jpg`, `worthy-dream.jpg`, `rise-brothers-1/2/3/4.jpg`
- Section background: dark (`#08111f`) to match immersive theme
- Keep existing CSS `marqueeLeft` animation (already working)

### Flow / Support Steps
- Dark gradient background to stay cohesive with new theme

### Quote & CTA Band
- Unchanged — already elegant

---

## 2. Text Ticker — Removed from All Non-Home Pages

- `LayoutShell.tsx`: `showSuggestionTicker` is already gated to non-home pages — change condition to `false` (remove entirely)
- `ContactPage.tsx`: remove the inline ticker div (lines 70–76)
- Check all other pages for any inline ticker markup and remove

---

## 3. Admin Dashboard — Mobile Responsive

- Add hamburger toggle to `AdminSidebar` for screens < 768px
- Sidebar collapses to off-canvas drawer on mobile; overlay backdrop closes it
- Stats grid: 2-col on tablet, 1-col on phone
- Panels grid: 1-col on phone
- Tables: horizontal scroll wrapper on mobile
- All admin page CSS files get `@media (max-width: 768px)` and `@media (max-width: 480px)` breakpoints

---

## 4. API & Form Audit

### Flutterwave
- `FLUTTERWAVE_CLIENT_ID` + `FLUTTERWAVE_CLIENT_SECRET` present → v4 flow used
- No `FLUTTERWAVE_SECRET_KEY` needed (v4 takes precedence)
- `api/donate.ts` correctly routes `mobile_money` → Flutterwave, `card` → MarzPay

### MarzPay
- `MARZPAY_BASIC_AUTH_TOKEN` present → auth header built correctly
- `api/marzpay/callback/route.ts` handles webhook callback

### Resend
- `RESEND_API_KEY` present → `isResendConfigured = true`
- `SENDER_EMAIL` env var maps to `African Girl Rise <noreply@africangirlriseltd.org>`
- `api/contact.ts` sends admin notification + user confirmation
- `api/subscribe.ts` — needs audit (not yet read)

### Contact Forms
- `ContactPage.tsx` posts `{ ...formData, type: activeTab }` to `/api/contact` ✓
- Footer `Footer.tsx` posts `{ email }` to `/api/subscribe` ✓
- Error states displayed correctly in both

### Broken Lines / Issues to Fix
- `galleryMoments` in `HomePage.tsx` references 3 deleted images → fix
- `ContactPage.tsx` has inline ticker → remove
- `SuggestionTicker` shown on all non-home pages → remove

---

## 5. Files Changed

| File | Change |
|------|--------|
| `src/pages/HomePage.tsx` | Dark hero, stats band, scroll-reveal programs, fixed marquee images |
| `src/pages/HomePage.module.css` | Dark theme styles, scroll-reveal animation, stats band |
| `src/components/layout/LayoutShell.tsx` | Remove SuggestionTicker entirely |
| `src/pages/ContactPage.tsx` | Remove inline ticker |
| `src/components/admin/AdminSidebar.tsx` | Mobile hamburger + drawer |
| `src/components/admin/layout.module.css` | Mobile breakpoints |
| `src/pages/admin/*.module.css` | Mobile breakpoints for grids/tables |
| `api/subscribe.ts` | Audit and fix if broken |
