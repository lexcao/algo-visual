# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Inferred from the brief and the existing app: people studying binary search, often in Chinese and English, who open a single page to watch the algorithm halve a range. They pick a target, step forward, and read which line of code just ran. Success is understanding low, mid, and high on one concrete array, including the duplicate and rotated variants.

## Product Purpose

Algo-Visual shows binary search, and only binary search, as a step-through of a fixed array. The visitor chooses a variant, chooses a target, and advances one decision at a time while the matching source line is marked. Success is a correct, readable trace, not a catalog of algorithms.

## Positioning

The mechanism is a shared clock: each press moves the pointers and highlights the exact source line that caused that move. Four variants (plain, duplicates, rotated, rotated with duplicates) share that clock. A generic algorithm encyclopedia could not claim this page without that coupling.

## Operating Context

Public site at https://algo.lexcao.io/, Vite build deployed on Vercel, reached through Cloudflare. Visitors land on `/binary-search` or one of four variant URLs. Analytics already present: GTM-KJ277ZJ and GA4 G-YYYZVVWCBV. No accounts, no saved progress, no editor.

## Capabilities and Constraints

Confirmed:

- Routes that exist today: `/` (redirects to `/binary-search`), `/binary-search`, `/binary-search/sorted-array`, `/binary-search/sorted-array-with-duplicate`, `/binary-search/rotated-sorted-array`, `/binary-search/rotated-sorted-array-with-duplicate`.
- Arrays and step functions live in `src/binary-search/data/`. There is no content generator and no dataset. Do not add batch landing pages.
- Stack stays Vite 2, React 17, react-router-dom 5, Tailwind 2 unless a build cannot proceed.
- Name stays `Algo-Visual` until a later decision. Name, tagline, and icon paths live in one branding config. Favicon is a generated neutral placeholder. The OG image is generated from that config.
- SEO required on the existing routes only: real `robots.txt` and `sitemap.xml`, description, canonical, a correct `lang`, per-route static HTML from a committed post-build script, a crawlable no-JS intro in Chinese and English, WebApplication JSON-LD, real 404s for unknown paths, no stray `console.log`.
- A post-build HTML meta check is the test gate. The repo has no test runner.
- Preview is the Vercel preview for the pull request. Do not change Cloudflare, DNS, or zone settings. Do not merge.
- `prefers-reduced-motion` must be respected.
- Do not delete the leftover `CNAME` in this change; that file is out of scope.

Undecided, recorded rather than invented: final product name, logo, and tagline beyond a working placeholder. Voice is bilingual, Chinese first, because the diagnosis asks for a Chinese-priority intro and the public site is Lex's.

## Brand Commitments

The visible name is `Algo-Visual`. No logo is approved. Icon paths are configuration, not a brand mark. Award-tier craft is required for typography, whitespace, hierarchy, color, motion, micro-interactions, responsive layout, and originality. The visualization (step animation, pointer highlights, controls) is the core and must stay clear.

## Evidence on Hand

- Source variants and their arrays in `src/binary-search/data/`.
- Production HTML audit in the 2026-11-05 diagnosis (missing description, canonical, robots, sitemap, JSON-LD; soft 404s; empty body without JS).
- No Search Console data, no traffic numbers, no testimonials. Do not invent them.

## Product Principles

- Teach one step at a time. The next control is the primary action.
- The array, the pointers, and the highlighted line are one event.
- Static HTML must tell the truth of the route even when JavaScript does not run.
- Branding is data. A later name change should not require a redesign.
- Clarity of the search range outranks decoration.

## Accessibility & Inclusion

Keyboard access to start, step, and reset. Visible focus. Text contrast at least 4.5:1 for body copy. Reduced motion removes non-essential animation and keeps state changes instant and readable. The page is bilingual (Chinese and English) on every route.
