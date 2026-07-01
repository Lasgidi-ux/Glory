import { redirect } from "next/navigation";
import { getRole } from "@/lib/roles";
import { setRole } from "./actions";

export const dynamic = "force-dynamic";

const cards: {
  role: "creator" | "brand";
  title: string;
  blurb: string;
  points: string[];
}[] = [
  {
    role: "creator",
    title: "I'm a Creator",
    blurb: "Sell your reach like the asset it is.",
    points: ["List your rates", "Get instant payouts", "Keep your rights"],
  },
  {
    role: "brand",
    title: "I'm a Brand",
    blurb: "Buy distribution, not promises.",
    points: ["Vetted roster", "Escrowed deals", "Campaign analytics"],
  },
];

export default async function Onboarding() {
  // Already onboarded? Skip straight to the dashboard.
  const existing = await getRole();
  if (existing) redirect(`/dashboard/${existing}`);

  return (
    <main className="mx-auto flex min-h-screen max-w-[900px] flex-col justify-center px-6 py-24">
      <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-gold)]">
        One last step
      </p>
      <h1 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-light leading-[1.05]">
        How will you use GLORY?
      </h1>
      <p className="mt-3 max-w-[52ch] text-[color:var(--color-ink-soft)]">
        Pick a role to set up your workspace. You can talk to us later to switch.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <form key={c.role} action={setRole.bind(null, c.role)}>
            <button
              type="submit"
              data-hover
              className="group h-full w-full rounded-2xl border border-[color:var(--hair-2)] bg-[color:var(--color-panel)] p-7 text-left transition-colors hover:border-[color:var(--color-gold)]"
            >
              <h2 className="font-display text-2xl">{c.title}</h2>
              <p className="mt-2 text-[color:var(--color-ink-soft)]">{c.blurb}</p>
              <ul className="mt-5 flex flex-col gap-2">
                {c.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-baseline gap-2 text-sm text-[color:var(--color-ink)] before:text-[color:var(--color-gold)] before:content-['→']"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-block text-sm font-medium text-[color:var(--color-gold-soft)] opacity-0 transition-opacity group-hover:opacity-100">
                Continue →
              </span>
            </button>
          </form>
        ))}
      </div>
    </main>
  );
}
