# GLORY — Phase 2 (Next.js app)

The creator ↔ brand distribution platform. This is the full-stack app build
(Phase 2). The instant, static landing page lives at `../glory/` and deploys
to GitHub Pages; this app is the real product and deploys to Vercel.

## The magic stack (all five layers)

| Layer | Library | Used for |
|---|---|---|
| Framework | **Next.js 16** (App Router) + **React 19** + **TypeScript** | SSR landing + app routes |
| Styling | **Tailwind CSS v4** | Dark-luxe theme tokens in `app/globals.css` |
| Smooth scroll | **Lenis** | Inertia scroll (`components/SmoothScroll.tsx`), synced to GSAP |
| Scroll animation | **GSAP + ScrollTrigger** | Hero + showcase parallax (`lib/gsap.ts`) |
| Component motion | **Framer Motion** | Nav/hero text reveals, `Reveal`, count-up stats |
| WebGL hero | **React Three Fiber + @react-three/postprocessing** | Statue hero with pointer displacement, bloom, grain, vignette, chromatic aberration (`components/HeroCanvas.tsx`) |
| Type | **Fraunces** (variable serif) + **Inter Tight** (grotesk) | via `next/font` |

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-checked)
npm run start    # serve the production build
```

## Structure

```
app/
  layout.tsx              fonts, metadata, Lenis + cursor providers
  page.tsx               marketing landing (hero, thesis, split, showcase, stats, steps, waitlist)
  dashboard/
    layout.tsx           sidebar shell
    creator/page.tsx     creator dashboard (mock data)
    brand/page.tsx       brand dashboard (mock data)
components/               Nav, Hero, HeroCanvas, Showcase, Stats, Waitlist, Reveal, Cursor, SmoothScroll
lib/gsap.ts              GSAP + ScrollTrigger registration
public/art/              cropped, text-free hero artwork
```

## Phase 3 — wire the product (next)

- **Auth:** Clerk (creator vs. brand roles) → protect `/dashboard/*`
- **Data:** Supabase (Postgres) — profiles, listings, offers, deals
- **Payments:** Stripe Connect — escrow + creator payouts
- **Waitlist:** `POST /api/waitlist` → Supabase + Resend confirmation
- **Media:** Mux/Cloudinary for creator reels

## Notes

- The hero art is cropped from the design comps. Verify usage rights (or swap
  in licensed art in `public/art/`) before commercial use.
- Respects `prefers-reduced-motion`; falls back to a static hero image when
  WebGL is unavailable.
