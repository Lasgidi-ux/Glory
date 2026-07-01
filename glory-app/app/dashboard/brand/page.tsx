import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/lib/roles";
import { getBrandData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BrandDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const role = await getRole();
  if (!role) redirect("/onboarding");
  if (role !== "brand") redirect(`/dashboard/${role}`);

  const { stats, roster } = await getBrandData(userId);

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-gold)]">
          Brand
        </p>
        <h1 className="mt-2 font-display text-4xl font-normal">
          Distribution, bought.
        </h1>
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
        <h2 className="mb-4 font-display text-2xl">Vetted roster</h2>
        <div className="overflow-hidden rounded-lg border border-[color:var(--hair-2)]">
          {roster.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-2 items-center gap-4 border-b border-[color:var(--hair-2)] p-4 last:border-b-0 md:grid-cols-4"
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-sm text-[color:var(--color-ink-soft)]">{r.niche}</span>
              <span className="text-sm text-[color:var(--color-ink-soft)]">{r.reach} reach</span>
              <span className="font-display text-[color:var(--color-gold-soft)]">{r.rate}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
