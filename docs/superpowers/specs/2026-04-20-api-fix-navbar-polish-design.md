# AGR: API Fix + Navbar Polish — Design Spec
Date: 2026-04-20

## Problem
API calls (Flutterwave, MarzPay, Resend) are failing in production. Root cause: naming mismatches between what `env.ts` reads and what is set on Vercel. Navbar works but needs visual premium polish.

## Section 1: Environment Variable Fixes

### Root Cause
`env.ts` reads server-side env var names that differ from what was pushed to Vercel:

| Code reads | Vercel has | Status |
|---|---|---|
| `MARZPAY_SECRET_KEY` | `MARZPAY_API_SECRET` | BROKEN — MarzPay returns "not configured" |
| `SUPABASE_URL` | `VITE_SUPABASE_URL` | BROKEN — isConfigured.supabase = false |
| `SUPABASE_ANON_KEY` | `VITE_SUPABASE_PUBLISHABLE_KEY` | BROKEN — same |

### Fix

**Vercel (add aliases to Production + Preview):**
- `MARZPAY_SECRET_KEY` = value from `MARZPAY_API_SECRET`
- `SUPABASE_URL` = value from `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` = value from `VITE_SUPABASE_PUBLISHABLE_KEY`

**`src/lib/env.ts` (add fallback chains):**
```ts
export const SUPABASE_URL = getServerEnv('SUPABASE_URL') || getServerEnv('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getServerEnv('SUPABASE_ANON_KEY') || getServerEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || getServerEnv('SUPABASE_PUBLISHABLE_KEY');
export const MARZPAY_SECRET_KEY = getServerEnv('MARZPAY_SECRET_KEY') || getServerEnv('MARZPAY_API_SECRET');
```

No other code changes required. Existing `supabase.server.ts` already has these fallbacks and works correctly.

## Section 2: Navbar Polish (Option A — Premium refinement)

Same structure, same routes. Visual upgrades only.

### Changes
- **Active route** — current page link gets pink underline accent + stronger color
- **Hover underline animation** — scale-x sliding underline on desktop links
- **Dropdown panel** — left border accent, larger padding, soft fade-in entrance
- **Donate button** — pink gradient fill, white text, hover lift shadow
- **Mobile drawer** — wider padding, section labels as category headers (uppercase + pink bar), larger link text, full-width gradient donate button
- **Scroll shadow** — header shadow intensifies after 20px scroll

### Constraints
- No structural changes to JSX
- No new dependencies
- CSS Module changes only (Navbar.module.css) + minor Navbar.tsx for scroll state

## Out of Scope
- Admin page redesign
- Supabase schema changes
- Payment flow UI changes
