import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/lib/roles";
import { getCreatorData, getCreatorMedia } from "@/lib/data";
import { getPayoutStatus } from "@/lib/payments";
import { listCreatorOffers } from "@/lib/marketplace";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { money, offerStatusLabel } from "@/lib/format";
import PayoutBanner from "@/components/PayoutBanner";
import MediaUploader from "@/components/MediaUploader";
import Notice from "@/components/Notice";
import { acceptOffer, declineOffer, markDelivered } from "../actions";

export const dynamic = "force-dynamic";

export default async function CreatorDashboard({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const role = await getRole();
  if (!role) redirect("/onboarding");
  if (role !== "creator") redirect(`/dashboard/${role}`);

  const { notice } = await searchParams;
  const [{ stats }, payout, offers, media] = await Promise.all([
    getCreatorData(userId),
    getPayoutStatus(userId),
    listCreatorOffers(userId),
    getCreatorMedia(userId),
  ]);

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-gold)]">
          Creator
        </p>
        <h1 className="mt-2 font-display text-4xl font-normal">Your reach, priced.</h1>
      </header>

      <Notice code={notice} />
      <PayoutBanner status={payout} />

      <section className="grid grid-cols-2 gap-px border border-[color:var(--hair-2)] bg-[color:var(--hair-2)] md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-[color:var(--color-bg)] p-6">
            <div className="font-display text-3xl text-[color:var(--color-gold-soft)]">
              {s.v}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.12em] text-[color:var(--color-ink-mute)]">
              {s.l}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-2xl">Incoming offers</h2>
        <div className="overflow-hidden rounded-lg border border-[color:var(--hair-2)]">
          {offers.length === 0 && (
            <p className="p-4 text-sm text-[color:var(--color-ink-mute)]">
              No offers yet.
            </p>
          )}
          {offers.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-1 items-center gap-3 border-b border-[color:var(--hair-2)] p-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto_auto]"
            >
              <span className="font-medium">{o.brandId}</span>
              <span className="text-sm text-[color:var(--color-ink-soft)]">
                {o.scope} · {money(o.priceCents)}
              </span>
              <span className="text-xs uppercase tracking-[0.1em] text-[color:var(--color-ink-mute)]">
                {offerStatusLabel[o.status]}
              </span>
              <div className="flex gap-2">
                {o.status === "awaiting_sign" && (
                  <>
                    <form action={acceptOffer.bind(null, o.id)}>
                      <button
                        data-hover
                        className="rounded-full bg-[color:var(--color-gold)] px-4 py-1.5 text-xs font-semibold text-[#0a0906] hover:bg-[color:var(--color-gold-soft)]"
                      >
                        Accept
                      </button>
                    </form>
                    <form action={declineOffer.bind(null, o.id)}>
                      <button
                        data-hover
                        className="rounded-full border border-[color:var(--hair-2)] px-4 py-1.5 text-xs text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                      >
                        Decline
                      </button>
                    </form>
                  </>
                )}
                {o.status === "in_escrow" && (
                  <form action={markDelivered.bind(null, o.id)}>
                    <button
                      data-hover
                      className="rounded-full bg-[color:var(--color-gold)] px-4 py-1.5 text-xs font-semibold text-[#0a0906] hover:bg-[color:var(--color-gold-soft)]"
                    >
                      Mark delivered
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <MediaUploader items={media} enabled={isCloudinaryConfigured()} />
    </main>
  );
}
