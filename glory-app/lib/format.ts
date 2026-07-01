import type { OfferStatus } from "./marketplace";

export const money = (cents: number) =>
  `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export const offerStatusLabel: Record<OfferStatus, string> = {
  awaiting_sign: "Awaiting you",
  accepted: "Accepted — awaiting funding",
  in_escrow: "Funded · in escrow",
  delivered: "Delivered — awaiting release",
  released: "Released ✓",
  cancelled: "Cancelled",
};

// User-facing banner text keyed by the ?notice= query param.
export const NOTICES: Record<string, string> = {
  demo: "Demo mode — connect Supabase + Stripe to make this live.",
  invalid: "Please fill in all fields with a valid amount.",
  offer_sent: "Offer sent ✦",
  accepted: "Offer accepted — the brand can now fund escrow.",
  declined: "Offer declined.",
  delivered: "Marked delivered — awaiting the brand's release.",
  released: "Payout released to the creator ✓",
  funded: "Escrow funded — work can begin.",
  cancelled: "Checkout cancelled.",
  stripe_off: "Payments aren't configured yet (add STRIPE_SECRET_KEY).",
  creator_no_payouts: "That creator hasn't set up payouts yet.",
  no_deal: "No funded escrow found for this offer.",
  not_found: "Offer not found.",
  error: "Something went wrong. Try again.",
};
