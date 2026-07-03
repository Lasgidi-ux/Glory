import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/lib/roles";
import { clerkEnabled } from "@/lib/clerk";
import { getBrandData } from "@/lib/data";
import { listBrandOffers, listCreators } from "@/lib/marketplace";
import { money, offerStatusLabel } from "@/lib/format";
import Notice from "@/components/Notice";
import { sendOffer, fundOffer, releaseOffer } from "../actions";

export const dynamic = "force-dynamic";

export default async function BrandDashboard({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  if (!clerkEnabled()) redirect("/");
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const role = await getRole();
  if (!role) redirect("/onboarding");
  if (role !== "brand") redirect(`/dashboard/${role}`);

  const { notice } = await searchParams;
  const [{ stats }, offers, creators] = await Promise.all([
    getBrandData(userId),
    listBrandOffers(userId),
    listCreators(),
  ]);

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-gold)]">
          Brand
        </p>
        <h1 className="mt-2 font-display text-4xl font-normal">Distribution, bought.</h1>
      </header>

      <Notice code={notice} />

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

      {/* send an offer */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-2xl">Send an offer</h2>
        <form
          action={sendOffer}
          className="grid grid-cols-1 gap-3 rounded-lg border border-[color:var(--hair-2)] bg-[color:var(--color-panel)] p-5 sm:grid-cols-[1fr_1fr_140px_auto]"
        >
          <select
            name="creatorId"
            required
            defaultValue=""
            className="rounded-md border border-[color:var(--hair-2)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-gold)]"
          >
            <option value="" disabled>
              Choose a creator…
            </option>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="scope"
            placeholder="Scope (e.g. 1× Reel + Story)"
            required
            className="rounded-md border border-[color:var(--hair-2)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-gold)]"
          />
          <input
            name="price"
            type="number"
            min="1"
            step="1"
            placeholder="USD"
            required
            className="rounded-md border border-[color:var(--hair-2)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-gold)]"
          />
          <button
            data-hover
            className="rounded-md bg-[color:var(--color-gold)] px-5 py-2 text-sm font-semibold text-[#0a0906] hover:bg-[color:var(--color-gold-soft)]"
          >
            Send offer
          </button>
        </form>
      </section>

      {/* your offers */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-2xl">Your offers</h2>
        <div className="overflow-hidden rounded-lg border border-[color:var(--hair-2)]">
          {offers.length === 0 && (
            <p className="p-4 text-sm text-[color:var(--color-ink-mute)]">
              No offers yet — send one above.
            </p>
          )}
          {offers.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-1 items-center gap-3 border-b border-[color:var(--hair-2)] p-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto_auto]"
            >
              <span className="font-medium">{o.creatorId}</span>
              <span className="text-sm text-[color:var(--color-ink-soft)]">
                {o.scope} · {money(o.priceCents)}
              </span>
              <span className="text-xs uppercase tracking-[0.1em] text-[color:var(--color-ink-mute)]">
                {offerStatusLabel[o.status]}
              </span>
              <div className="flex gap-2">
                {o.status === "accepted" && (
                  <form action={fundOffer.bind(null, o.id)}>
                    <button
                      data-hover
                      className="rounded-full bg-[color:var(--color-gold)] px-4 py-1.5 text-xs font-semibold text-[#0a0906] hover:bg-[color:var(--color-gold-soft)]"
                    >
                      Fund escrow
                    </button>
                  </form>
                )}
                {o.status === "delivered" && (
                  <form action={releaseOffer.bind(null, o.id)}>
                    <button
                      data-hover
                      className="rounded-full bg-[color:var(--color-gold)] px-4 py-1.5 text-xs font-semibold text-[#0a0906] hover:bg-[color:var(--color-gold-soft)]"
                    >
                      Release payout
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
