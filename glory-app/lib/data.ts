import { getSupabaseAdmin } from "./supabase/server";
import type { Role } from "./roles";

// ---------- display shapes (kept simple for the dashboard UI) ----------
export type Stat = { l: string; v: string };
export type CreatorOffer = {
  brand: string;
  scope: string;
  price: string;
  status: string;
};
export type RosterCreator = {
  name: string;
  niche: string;
  reach: string;
  rate: string;
};

// ---------- formatting ----------
const money = (cents: number) =>
  cents >= 100000
    ? `$${(cents / 100000).toFixed(1)}k`
    : `$${(cents / 100).toLocaleString()}`;

const reach = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${Math.round(n / 1_000)}k`
      : `${n}`;

const prettyStatus = (s: string) =>
  ({
    awaiting_sign: "Awaiting sign",
    in_escrow: "In escrow",
    delivered: "Delivered",
    released: "Released",
    cancelled: "Cancelled",
  })[s] ?? s;

// ---------- mock fallback (used until Supabase is configured) ----------
const MOCK_CREATOR = {
  stats: [
    { l: "Active listings", v: "3" },
    { l: "Open offers", v: "7" },
    { l: "Pending payout", v: "$12.4k" },
    { l: "Rights retained", v: "100%" },
  ] as Stat[],
  offers: [
    { brand: "Aurea Labs", scope: "1× Reel + Story", price: "$4,200", status: "Awaiting sign" },
    { brand: "Nord Atelier", scope: "3× posts", price: "$9,800", status: "In escrow" },
    { brand: "Vesper", scope: "UGC pack", price: "$2,500", status: "Delivered" },
  ] as CreatorOffer[],
};

const MOCK_BRAND = {
  stats: [
    { l: "Live campaigns", v: "2" },
    { l: "Creators engaged", v: "18" },
    { l: "In escrow", v: "$41k" },
    { l: "Avg. deal→live", v: "72h" },
  ] as Stat[],
  roster: [
    { name: "@lumen", niche: "Design", reach: "1.2M", rate: "$3,500" },
    { name: "@harlow", niche: "Fashion", reach: "840k", rate: "$2,900" },
    { name: "@atlas.fm", niche: "Tech", reach: "2.6M", rate: "$6,000" },
  ] as RosterCreator[],
};

// ---------- profile upsert (called from onboarding) ----------
export async function upsertProfile(clerkUserId: string, role: Role) {
  const db = getSupabaseAdmin();
  if (!db) return; // no-op until Supabase is configured
  try {
    await db
      .from("profiles")
      .upsert({ clerk_user_id: clerkUserId, role }, { onConflict: "clerk_user_id" });
  } catch {
    // scaffold: don't block onboarding if the DB isn't reachable yet
  }
}

// ---------- creator dashboard data ----------
export async function getCreatorData(userId: string) {
  const db = getSupabaseAdmin();
  if (!db) return MOCK_CREATOR;
  try {
    const [{ count: listingCount }, { data: offers }] = await Promise.all([
      db
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", userId)
        .eq("status", "active"),
      db
        .from("offers")
        .select("scope, price_cents, status, brand_id")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const rows = offers ?? [];
    const pending = rows
      .filter((o) => o.status === "in_escrow" || o.status === "awaiting_sign")
      .reduce((sum, o) => sum + (o.price_cents ?? 0), 0);

    return {
      stats: [
        { l: "Active listings", v: String(listingCount ?? 0) },
        { l: "Open offers", v: String(rows.length) },
        { l: "Pending payout", v: money(pending) },
        { l: "Rights retained", v: "100%" },
      ] as Stat[],
      offers: rows.map((o) => ({
        brand: o.brand_id ?? "—",
        scope: o.scope ?? "",
        price: money(o.price_cents ?? 0),
        status: prettyStatus(o.status ?? ""),
      })) as CreatorOffer[],
    };
  } catch {
    return MOCK_CREATOR;
  }
}

// ---------- brand dashboard data ----------
export async function getBrandData(userId: string) {
  const db = getSupabaseAdmin();
  if (!db) return MOCK_BRAND;
  try {
    const [{ data: offers }, { data: creators }] = await Promise.all([
      db.from("offers").select("status, price_cents").eq("brand_id", userId),
      db
        .from("listings")
        .select("title, platform, reach, price_cents")
        .eq("status", "active")
        .order("reach", { ascending: false })
        .limit(10),
    ]);

    const offerRows = offers ?? [];
    const inEscrow = offerRows
      .filter((o) => o.status === "in_escrow")
      .reduce((sum, o) => sum + (o.price_cents ?? 0), 0);

    return {
      stats: [
        { l: "Live campaigns", v: String(offerRows.length) },
        { l: "Creators engaged", v: String((creators ?? []).length) },
        { l: "In escrow", v: money(inEscrow) },
        { l: "Avg. deal→live", v: "72h" },
      ] as Stat[],
      roster: (creators ?? []).map((c) => ({
        name: c.title ?? "—",
        niche: c.platform ?? "—",
        reach: reach(c.reach ?? 0),
        rate: money(c.price_cents ?? 0),
      })) as RosterCreator[],
    };
  } catch {
    return MOCK_BRAND;
  }
}
