"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getRole } from "@/lib/roles";
import {
  createOffer,
  getOffer,
  setOfferStatus,
  getDealPaymentIntent,
  marketplaceLive,
} from "@/lib/marketplace";
import { getPayoutStatus, createEscrowCheckout, releaseEscrow } from "@/lib/payments";
import {
  notifyOfferSent,
  notifyOfferAccepted,
  notifyOfferDelivered,
} from "@/lib/notify";

async function requireRole(role: "creator" | "brand") {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const r = await getRole();
  if (r !== role) redirect("/dashboard");
  return userId;
}

// ---------- brand: send an offer ----------
export async function sendOffer(formData: FormData) {
  const brandId = await requireRole("brand");
  const creatorId = String(formData.get("creatorId") || "").trim();
  const scope = String(formData.get("scope") || "").trim();
  const dollars = Number(formData.get("price") || 0);

  if (!creatorId || !scope || !(dollars > 0)) {
    redirect("/dashboard/brand?notice=invalid");
  }
  if (!marketplaceLive()) {
    redirect("/dashboard/brand?notice=demo");
  }

  const priceCents = Math.round(dollars * 100);
  const res = await createOffer({ brandId, creatorId, scope, priceCents });
  if (res.ok) {
    await notifyOfferSent({ creatorId, scope, priceCents });
  }
  revalidatePath("/dashboard/brand");
  redirect(`/dashboard/brand?notice=${res.ok ? "offer_sent" : "error"}`);
}

// ---------- creator: accept / decline ----------
export async function acceptOffer(offerId: string) {
  const creatorId = await requireRole("creator");
  if (!marketplaceLive()) redirect("/dashboard/creator?notice=demo");
  await setOfferStatus(offerId, "accepted", { column: "creator_id", value: creatorId });
  const accepted = await getOffer(offerId);
  if (accepted) await notifyOfferAccepted(accepted);
  revalidatePath("/dashboard/creator");
  redirect("/dashboard/creator?notice=accepted");
}

export async function declineOffer(offerId: string) {
  const creatorId = await requireRole("creator");
  if (!marketplaceLive()) redirect("/dashboard/creator?notice=demo");
  await setOfferStatus(offerId, "cancelled", { column: "creator_id", value: creatorId });
  revalidatePath("/dashboard/creator");
  redirect("/dashboard/creator?notice=declined");
}

// ---------- creator: mark delivered ----------
export async function markDelivered(offerId: string) {
  const creatorId = await requireRole("creator");
  if (!marketplaceLive()) redirect("/dashboard/creator?notice=demo");
  await setOfferStatus(offerId, "delivered", { column: "creator_id", value: creatorId });
  const delivered = await getOffer(offerId);
  if (delivered) await notifyOfferDelivered(delivered);
  revalidatePath("/dashboard/creator");
  redirect("/dashboard/creator?notice=delivered");
}

// ---------- brand: fund escrow (Stripe Checkout) ----------
export async function fundOffer(offerId: string) {
  await requireRole("brand");
  if (!marketplaceLive()) redirect("/dashboard/brand?notice=demo");

  const offer = await getOffer(offerId);
  if (!offer) redirect("/dashboard/brand?notice=not_found");

  const payout = await getPayoutStatus(offer.creatorId);
  if (!payout.configured) redirect("/dashboard/brand?notice=stripe_off");
  if (!payout.accountId) redirect("/dashboard/brand?notice=creator_no_payouts");

  const { url, error } = await createEscrowCheckout({
    offerId: offer.id,
    amountCents: offer.priceCents,
    creatorAccountId: payout.accountId,
  });
  if (error || !url) redirect("/dashboard/brand?notice=error");
  redirect(url); // → Stripe Checkout; webhook flips status to in_escrow
}

// ---------- brand: release payout on delivery ----------
export async function releaseOffer(offerId: string) {
  await requireRole("brand");
  if (!marketplaceLive()) redirect("/dashboard/brand?notice=demo");

  const pi = await getDealPaymentIntent(offerId);
  if (!pi) redirect("/dashboard/brand?notice=no_deal");

  const res = await releaseEscrow(pi);
  if (!res.ok) redirect("/dashboard/brand?notice=error");
  await setOfferStatus(offerId, "released");
  revalidatePath("/dashboard/brand");
  redirect("/dashboard/brand?notice=released");
}
