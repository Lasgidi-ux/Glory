# Deploying GLORY to Vercel

The Next.js app lives in **`glory-app/`**. It **builds and runs with zero keys**
(landing works immediately); each service switches on as you add its keys.

---

## Option A — Vercel CLI (fastest, no GitHub needed)

```bash
# from the extracted repo
cd glory-app
npx vercel            # first run: log in + link/create a project
# ... add env vars (see table below) in the dashboard or with `vercel env add`
npx vercel --prod     # production deploy
```

Because you run the CLI **inside `glory-app/`**, Vercel treats that as the root
automatically — no extra config needed.

## Option B — Vercel dashboard (Git import)

1. Push this repo to GitHub (e.g. `Lasgidi-ux/Glory` — see `push-to-glory.sh`).
2. Vercel → **Add New… → Project** → import the repo.
3. **IMPORTANT:** set **Root Directory = `glory-app`** (the repo has two folders).
4. Framework preset auto-detects **Next.js**. Leave build/output defaults.
5. Add the environment variables below → **Deploy**.

---

## Environment variables

Add these in **Vercel → Project → Settings → Environment Variables**
(Production + Preview). Nothing here is required to get a *successful build* —
add each block to activate that feature.

### 1) Clerk — auth & dashboards  (add first; without it, login/dashboards won't work)
| Key | Example / value | Where |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_…` / `pk_test_…` | dashboard.clerk.com → API keys |
| `CLERK_SECRET_KEY` | `sk_live_…` / `sk_test_…` | same page |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | fixed |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | fixed |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/dashboard` | fixed |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/onboarding` | fixed |

### 2) Supabase — data (profiles / listings / offers / deals / waitlist)
| Key | Example / value | Where |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ… (service_role)` | same page — **server-side secret** |

Then run `glory-app/supabase/schema.sql` in the Supabase SQL editor once.

### 3) Stripe — payments (Connect onboarding, escrow, payouts)
| Key | Example / value | Where |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_…` / `sk_test_…` | dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | created in step below |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | your deployed URL |

### 4) Resend — waitlist confirmation email
| Key | Example / value | Where |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | resend.com/api-keys |
| `WAITLIST_FROM_EMAIL` | `GLORY <hello@yourdomain.com>` | a verified sender/domain |

### 5) Cloudinary — creator media uploads (images + reels)
| Key | Example / value | Where |
|---|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `your-cloud` | console.cloudinary.com (Dashboard) |
| `CLOUDINARY_API_KEY` | `1234567890` | same page |
| `CLOUDINARY_API_SECRET` | `••••••••` | same page — **server-side secret** |

---

## Post-deploy steps

1. **Set `NEXT_PUBLIC_APP_URL`** to your real Vercel URL, then redeploy (needed
   for correct Stripe Connect return links).
2. **Stripe webhook:** dashboard.stripe.com → Developers → Webhooks → *Add
   endpoint* → `https://<your-domain>/api/stripe/webhook`. Subscribe to
   `account.updated`, `checkout.session.completed`,
   `payment_intent.succeeded`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET` and redeploy.
3. **Stripe Connect:** enable Connect in the Stripe dashboard (Express accounts).
4. **Clerk (production instance):** add your Vercel domain to the Clerk instance
   (dev keys work on any domain; production keys are domain-scoped).
5. **Supabase:** confirm `schema.sql` ran and the service-role key is set.

## What works at each stage
- **No keys:** landing page, animations, WebGL hero — all live.
- **+ Clerk:** sign-up/in, `/onboarding` role pick, protected dashboards.
- **+ Supabase:** dashboards show real rows; waitlist + profiles persist.
- **+ Stripe:** creator payout onboarding, escrow, release.
- **+ Resend:** waitlist confirmation emails.
- **+ Cloudinary:** creator portfolio image/reel uploads.
