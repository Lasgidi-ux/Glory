# GLORY

**Behind the world's biggest brands and names. The last real arbitrage in distribution.**

A creator ↔ brand distribution platform. This repo has two parts:

| Folder | What | Deploy |
|---|---|---|
| [`glory/`](./glory) | Static cinematic landing page (single HTML file + art). Lenis + GSAP. | GitHub Pages / any static host |
| [`glory-app/`](./glory-app) | The full product — Next.js 16 + React 19 + TS + Tailwind v4, the full awwwards motion stack, and Clerk auth. | Vercel |

## The magic stack (glory-app)

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4**
- **Lenis** smooth scroll + **GSAP ScrollTrigger** parallax
- **Framer Motion** reveals + count-up stats
- **React Three Fiber + postprocessing** WebGL statue hero (bloom, grain, vignette, chromatic aberration)
- **Fraunces** + **Inter Tight** via `next/font`
- **Clerk** auth with creator/brand roles gating `/dashboard/*`

## Quick start (the app)

```bash
cd glory-app
cp .env.example .env        # add your Clerk keys from dashboard.clerk.com
npm install
npm run dev                 # http://localhost:3000
```

See [`glory-app/README.md`](./glory-app/README.md) for the full layout and the
Phase 3+ roadmap (Supabase data, Stripe Connect payouts, waitlist API).

## The static landing

Open `glory/index.html` directly, or serve the folder. It's fully self-contained.

## Auth & roles (Clerk)

- Sign up → `/onboarding` (choose **Creator** or **Brand**) → role saved to Clerk `publicMetadata`.
- `/dashboard/*` is protected by `proxy.ts` (Clerk middleware); each dashboard enforces its role.

## Notes

- Hero art is cropped from design comps — verify usage rights (or swap files in
  `glory-app/public/art/` and `glory/assets/`) before commercial use.
