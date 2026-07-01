import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { markPayoutsEnabled } from "@/lib/payments";
import { getSupabaseAdmin } from "@/lib/supabase/server";

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
    case "payment_intent.amount_capturable_updated": {
      // Funds authorized and held in escrow.
      await updateDeal(event.data.object as Stripe.PaymentIntent, "escrow");
      break;
    }
    case "payment_intent.succeeded": {
      // Captured → released to the creator.
      await updateDeal(event.data.object as Stripe.PaymentIntent, "released");
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function updateDeal(pi: Stripe.PaymentIntent, status: string) {
  const db = getSupabaseAdmin();
  if (!db) return;
  try {
    await db
      .from("deals")
      .upsert(
        {
          stripe_payment_id: pi.id,
          amount_cents: pi.amount,
          status,
        },
        { onConflict: "stripe_payment_id" }
      );
  } catch {
    // scaffold: swallow if deals table isn't reachable yet
  }
}
