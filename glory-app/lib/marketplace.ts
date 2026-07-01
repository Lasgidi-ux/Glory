import "server-only";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase/server";

export type OfferStatus =
  | "awaiting_sign"
  | "accepted"
  | "in_escrow"
  | "delivered"
  | "released"
  | "cancelled";

export type OfferRecord = {
  id: string;
  brandId: string;
  creatorId: string;
  scope: string;
  priceCents: number;
  status: OfferStatus;
};

export type CreatorOption = { id: string; name: string };

/** Marketplace writes need Supabase. When false, the UI runs in demo mode. */
export const marketplaceLive = () => isSupabaseConfigured();

// ---------- demo data (no Supabase) ----------
const DEMO_CREATOR_OFFERS: OfferRecord[] = [
  { id: "demo-o1", brandId: "Aurea Labs", creatorId: "me", scope: "1× Reel + Story", priceCents: 420000, status: "awaiting_sign" },
  { id: "demo-o2", brandId: "Nord Atelier", creatorId: "me", scope: "3× posts", priceCents: 980000, status: "in_escrow" },
  { id: "demo-o3", brandId: "Vesper", creatorId: "me", scope: "UGC pack", priceCents: 250000, status: "delivered" },
];
const DEMO_BRAND_OFFERS: OfferRecord[] = [
  { id: "demo-b1", brandId: "me", creatorId: "@lumen", scope: "1× Reel", priceCents: 350000, status: "accepted" },
  { id: "demo-b2", brandId: "me", creatorId: "@atlas.fm", scope: "Launch campaign", priceCents: 600000, status: "delivered" },
];
const DEMO_CREATORS: CreatorOption[] = [
  { id: "demo-lumen", name: "@lumen — Design · 1.2M" },
  { id: "demo-harlow", name: "@harlow — Fashion · 840k" },
  { id: "demo-atlas", name: "@atlas.fm — Tech · 2.6M" },
];

function mapOffer(r: {
  id: string;
  brand_id: string;
  creator_id: string;
  scope: string;
  price_cents: number;
  status: string;
}): OfferRecord {
  return {
    id: r.id,
    brandId: r.brand_id,
    creatorId: r.creator_id,
    scope: r.scope,
    priceCents: r.price_cents,
    status: r.status as OfferStatus,
  };
}

export async function listCreatorOffers(creatorId: string): Promise<OfferRecord[]> {
  const db = getSupabaseAdmin();
  if (!db) return DEMO_CREATOR_OFFERS;
  try {
    const { data } = await db
      .from("offers")
      .select("id, brand_id, creator_id, scope, price_cents, status")
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data ?? []).map(mapOffer);
  } catch {
    return DEMO_CREATOR_OFFERS;
  }
}

export async function listBrandOffers(brandId: string): Promise<OfferRecord[]> {
  const db = getSupabaseAdmin();
  if (!db) return DEMO_BRAND_OFFERS;
  try {
    const { data } = await db
      .from("offers")
      .select("id, brand_id, creator_id, scope, price_cents, status")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data ?? []).map(mapOffer);
  } catch {
    return DEMO_BRAND_OFFERS;
  }
}

export async function listCreators(): Promise<CreatorOption[]> {
  const db = getSupabaseAdmin();
  if (!db) return DEMO_CREATORS;
  try {
    const { data } = await db
      .from("profiles")
      .select("clerk_user_id, handle, display_name")
      .eq("role", "creator")
      .limit(100);
    return (data ?? []).map((p) => ({
      id: p.clerk_user_id,
      name: p.display_name || p.handle || p.clerk_user_id,
    }));
  } catch {
    return DEMO_CREATORS;
  }
}

export async function createOffer(input: {
  brandId: string;
  creatorId: string;
  scope: string;
  priceCents: number;
}): Promise<{ ok: boolean; error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { ok: false, error: "demo" };
  try {
    const { error } = await db.from("offers").insert({
      brand_id: input.brandId,
      creator_id: input.creatorId,
      scope: input.scope,
      price_cents: input.priceCents,
      status: "awaiting_sign",
    });
    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not create offer" };
  }
}

export async function getOffer(id: string): Promise<OfferRecord | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  try {
    const { data } = await db
      .from("offers")
      .select("id, brand_id, creator_id, scope, price_cents, status")
      .eq("id", id)
      .single();
    return data ? mapOffer(data) : null;
  } catch {
    return null;
  }
}

export async function setOfferStatus(
  id: string,
  status: OfferStatus,
  guard?: { column: "brand_id" | "creator_id"; value: string }
): Promise<{ ok: boolean; error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { ok: false, error: "demo" };
  try {
    let q = db.from("offers").update({ status }).eq("id", id);
    if (guard) q = q.eq(guard.column, guard.value);
    const { error } = await q;
    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update offer" };
  }
}

export async function upsertDealForOffer(input: {
  offerId: string;
  paymentIntentId: string;
  amountCents: number;
  status: "escrow" | "released" | "refunded";
}) {
  const db = getSupabaseAdmin();
  if (!db) return;
  try {
    await db.from("deals").upsert(
      {
        offer_id: input.offerId,
        stripe_payment_id: input.paymentIntentId,
        amount_cents: input.amountCents,
        status: input.status,
      },
      { onConflict: "stripe_payment_id" }
    );
  } catch {
    /* non-fatal in scaffold */
  }
}

export async function getDealPaymentIntent(offerId: string): Promise<string | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  try {
    const { data } = await db
      .from("deals")
      .select("stripe_payment_id")
      .eq("offer_id", offerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    return data?.stripe_payment_id ?? null;
  } catch {
    return null;
  }
}
