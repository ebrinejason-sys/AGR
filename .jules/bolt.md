# Bolt's Journal - Critical Learnings

## 2026-04-11 - [Lazy Loading Modals]
**Learning:** Large, interactive components like modals that are not part of the initial viewport should be lazily loaded to reduce main bundle size. Statically importing them in a global component like a Navbar is an anti-pattern as it penalizes every page load.
**Action:** Use `next/dynamic` with `ssr: false` (if client-side only) or default to lazy load heavy interactive components.
