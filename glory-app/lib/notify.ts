import "server-only";
import { Resend } from "resend";
import { clerkClient } from "@clerk/nextjs/server";
import type { OfferRecord } from "./marketplace";
import { money } from "./format";

/**
 * Transactional email on deal-state changes. Fully env-guarded: with no
 * RESEND_API_KEY / WAITLIST_FROM_EMAIL, every call is a silent no-op, so the
 * marketplace works with or without email configured.
 */
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}
const from = () => process.env.WAITLIST_FROM_EMAIL;

/** Resolve a Clerk user's primary email. Returns null in demo mode / on error. */
async function emailFor(userId: string): Promise<string | null> {
  try {
    const user = await (await clerkClient()).users.getUser(userId);
    const primary =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId) ??
      user.emailAddresses[0];
    return primary?.emailAddress ?? null;
  } catch {
    return null;
  }
}

async function send(to: string | null, subject: string, text: string) {
  const resend = getResend();
  const sender = from();
  if (!resend || !sender || !to) return;
  try {
    await resend.emails.send({ from: sender, to, subject, text, replyTo: sender });
  } catch {
    /* non-fatal: never block a deal transition on email delivery */
  }
}

const dash = (path: string) =>
  `${(process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")}/dashboard/${path}`;

// ---------- one function per transition ----------
export async function notifyOfferSent(o: Pick<OfferRecord, "creatorId" | "scope" | "priceCents">) {
  await send(
    await emailFor(o.creatorId),
    "You have a new offer on Cravagiq ✦",
    `A brand wants to work with you: ${o.scope} — ${money(o.priceCents)}.\n\n` +
      `Review and accept it here: ${dash("creator")}`
  );
}

export async function notifyOfferAccepted(o: OfferRecord) {
  await send(
    await emailFor(o.brandId),
    "Your Cravagiq offer was accepted",
    `The creator accepted your offer: ${o.scope} — ${money(o.priceCents)}.\n\n` +
      `Fund escrow to get started: ${dash("brand")}`
  );
}

export async function notifyOfferFunded(o: OfferRecord) {
  await send(
    await emailFor(o.creatorId),
    "Escrow funded — you're clear to start ✦",
    `The brand funded escrow for: ${o.scope} — ${money(o.priceCents)}.\n\n` +
      `Ship the work, then mark it delivered: ${dash("creator")}`
  );
}

export async function notifyOfferDelivered(o: OfferRecord) {
  await send(
    await emailFor(o.brandId),
    "Work delivered — release your payout",
    `The creator marked delivered: ${o.scope} — ${money(o.priceCents)}.\n\n` +
      `Review and release the payout: ${dash("brand")}`
  );
}

export async function notifyOfferReleased(o: OfferRecord) {
  await send(
    await emailFor(o.creatorId),
    "Payout released — glory is yours ✦",
    `Your payout for ${o.scope} (${money(o.priceCents)}) has been released and is on its way.\n\n` +
      `View it here: ${dash("creator")}`
  );
}
