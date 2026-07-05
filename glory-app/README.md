# Cravagiq — Phase 2 (Next.js app)

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

## Phase 3 — status

- ✅ **Auth:** Clerk (creator vs. brand roles) → `proxy.ts` protects `/dashboard/*`
- ✅ **Data:** Supabase (Postgres) — `supabase/schema.sql` + `lib/data.ts` (mock fallback until configured)
- ✅ **Payments:** Stripe Connect — see below
- ✅ **Waitlist:** `POST /api/waitlist` → Supabase + Resend confirmation
- ✅ **Media:** Cloudinary signed uploads (images + reels) → creator portfolio

### Payments (Stripe Connect)

- **Onboarding:** creator dashboard → "Set up payouts" → `POST /api/stripe/connect`
  creates/reuses a Stripe **Express** account (id stored in Clerk `privateMetadata`,
  so it works even before Supabase) and returns an onboarding link.
- **Escrow:** `createEscrowPaymentIntent` (`lib/payments.ts`) — a manual-capture
  destination charge that holds the brand's funds and routes to the creator
  minus a `PLATFORM_FEE_BPS` platform fee.
- **Release:** `releaseEscrow` captures the PaymentIntent on delivery.
- **Webhook:** `POST /api/stripe/webhook` (signature-verified) flips
  `payoutsEnabled` on `account.updated` and syncs `deals` on payment events.
- Everything is **env-guarded** — no `STRIPE_SECRET_KEY` → payments stay in demo mode.

Local webhook testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Notes

- The hero art is cropped from the design comps. Verify usage rights (or swap
  in licensed art in `public/art/`) before commercial use.
- Respects `prefers-reduced-motion`; falls back to a static hero image when
  WebGL is unavailable.
