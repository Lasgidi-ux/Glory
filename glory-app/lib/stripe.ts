import Stripe from "stripe";

/**
 * Server-only Stripe client. Returns null when STRIPE_SECRET_KEY is unset,
 * so the app builds and runs without payment credentials.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { typescript: true });
}

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

/** Platform take rate on each deal (basis points). 1000 = 10%. */
export const PLATFORM_FEE_BPS = 1000;

export const appUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
