import "server-only";
import { clerkClient } from "@clerk/nextjs/server";
import { getStripe, PLATFORM_FEE_BPS, appUrl } from "./stripe";

type Priv = { stripeAccountId?: string; payoutsEnabled?: boolean };

export type PayoutStatus = {
  configured: boolean; // is Stripe set up on the server at all
  accountId: string | null;
  payoutsEnabled: boolean;
};

/** Read the creator's Connect status from Clerk privateMetadata. */
export async function getPayoutStatus(userId: string): Promise<PayoutStatus> {
  const stripe = getStripe();
  if (!stripe) return { configured: false, accountId: null, payoutsEnabled: false };
  const user = await (await clerkClient()).users.getUser(userId);
  const priv = (user.privateMetadata ?? {}) as Priv;
  return {
    configured: true,
    accountId: priv.stripeAccountId ?? null,
    payoutsEnabled: Boolean(priv.payoutsEnabled),
  };
}

/**
 * Create (or reuse) a Stripe Express account for the creator and return an
 * onboarding link. Account id is stored in Clerk privateMetadata so this works
 * even before Supabase is provisioned.
 */
export async function startCreatorOnboarding(
  userId: string
): Promise<{ url?: string; error?: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not configured on the server." };

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const priv = (user.privateMetadata ?? {}) as Priv;

  let accountId = priv.stripeAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      metadata: { clerkUserId: userId },
    });
    accountId = account.id;
    await client.users.updateUser(userId, {
      privateMetadata: { ...priv, stripeAccountId: accountId },
    });
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl()}/dashboard/creator?connect=refresh`,
    return_url: `${appUrl()}/dashboard/creator?connect=done`,
    type: "account_onboarding",
  });
  return { url: link.url };
}

/** Webhook helper: flip payouts flag when Stripe reports the account is ready. */
export async function markPayoutsEnabled(accountId: string, enabled: boolean) {
  const client = await clerkClient();
  const list = await client.users.getUserList({ limit: 100 });
  const match = list.data.find(
    (u) => (u.privateMetadata as Priv)?.stripeAccountId === accountId
  );
  if (!match) return;
  await client.users.updateUser(match.id, {
    privateMetadata: {
      ...(match.privateMetadata as Priv),
      payoutsEnabled: enabled,
    },
  });
}

/**
 * Escrow: a manual-capture destination charge. Funds are authorized from the
 * brand now and only transferred to the creator (minus platform fee) when the
 * work is delivered and we capture. Returns the PaymentIntent client secret for
 * the brand to confirm on the client.
 */
export async function createEscrowPaymentIntent(params: {
  amountCents: number;
  creatorAccountId: string;
  offerId?: string;
}): Promise<{ paymentIntentId?: string; clientSecret?: string; error?: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not configured on the server." };

  const fee = Math.round((params.amountCents * PLATFORM_FEE_BPS) / 10000);
  const pi = await stripe.paymentIntents.create({
    amount: params.amountCents,
    currency: "usd",
    capture_method: "manual",
    application_fee_amount: fee,
    transfer_data: { destination: params.creatorAccountId },
    metadata: { offerId: params.offerId ?? "" },
  });
  return { paymentIntentId: pi.id, clientSecret: pi.client_secret ?? undefined };
}

/** Release escrow on delivery: capture the authorized PaymentIntent. */
export async function releaseEscrow(
  paymentIntentId: string
): Promise<{ ok: boolean; error?: string }> {
  const stripe = getStripe();
  if (!stripe) return { ok: false, error: "Stripe is not configured on the server." };
  await stripe.paymentIntents.capture(paymentIntentId);
  return { ok: true };
}
