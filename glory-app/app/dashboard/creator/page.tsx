import { redirect } from "next/navigation";
import { getRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

const stats = [
  { l: "Active listings", v: "3" },
  { l: "Open offers", v: "7" },
  { l: "Pending payout", v: "$12.4k" },
  { l: "Rights retained", v: "100%" },
];

const offers = [
  { brand: "Aurea Labs", scope: "1× Reel + Story", price: "$4,200", status: "Awaiting sign" },
  { brand: "Nord Atelier", scope: "3× posts", price: "$9,800", status: "In escrow" },
  { brand: "Vesper", scope: "UGC pack", price: "$2,500", status: "Delivered" },
];

export default async function CreatorDashboard() {
  const role = await getRole();
  if (!role) redirect("/onboarding");
  if (role !== "creator") redirect(`/dashboard/${role}`);

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-gold)]">
          Creator
        </p>
        <h1 className="mt-2 font-display text-4xl font-normal">Your reach, priced.</h1>
      </header>

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
          {offers.map((o, i) => (
            <div
              key={i}
              className="grid grid-cols-2 items-center gap-4 border-b border-[color:var(--hair-2)] p-4 last:border-b-0 md:grid-cols-4"
            >
              <span className="font-medium">{o.brand}</span>
              <span className="text-sm text-[color:var(--color-ink-soft)]">{o.scope}</span>
              <span className="font-display text-[color:var(--color-gold-soft)]">{o.price}</span>
              <span className="text-sm text-[color:var(--color-ink-mute)]">{o.status}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
