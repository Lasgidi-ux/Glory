import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { markPayoutsEnabled } from "@/lib/payments";
import { setOfferStatus, upsertDealForOffer, getOffer } from "@/lib/marketplace";
import { notifyOfferFunded, notifyOfferReleased } from "@/lib/notify";

// Stripe webhook. Configure the endpoint in the Stripe dashboard and set
// STRIPE_WEBHOOK_SECRET. Uses the raw request body for signature verification.
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig ?? "", secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "account.updated": {
      const acct = event.data.object as Stripe.Account;
      const enabled = Boolean(acct.charges_enabled && acct.payouts_enabled);
      await markPayoutsEnabled(acct.id, enabled);
      break;
    }

    case "checkout.session.completed": {
      // Brand paid → funds authorized and held. Move the offer to escrow.
      const session = event.data.object as Stripe.Checkout.Session;
      const offerId = session.metadata?.offerId;
      const pi =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;
      if (offerId && pi) {
        await setOfferStatus(offerId, "in_escrow");
        await upsertDealForOffer({
          offerId,
          paymentIntentId: pi,
          amountCents: session.amount_total ?? 0,
          status: "escrow",
        });
        const offer = await getOffer(offerId);
        if (offer) await notifyOfferFunded(offer);
      }
      break;
    }

    case "payment_intent.succeeded": {
      // Escrow captured → released to the creator.
      const pi = event.data.object as Stripe.PaymentIntent;
      const offerId = pi.metadata?.offerId;
      if (offerId) {
        await setOfferStatus(offerId, "released");
        await upsertDealForOffer({
          offerId,
          paymentIntentId: pi.id,
          amountCents: pi.amount,
          status: "released",
        });
        const offer = await getOffer(offerId);
        if (offer) await notifyOfferReleased(offer);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
