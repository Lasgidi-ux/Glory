import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import Stats from "@/components/Stats";
import Waitlist from "@/components/Waitlist";
import Reveal from "@/components/Reveal";

const marquee = [
  "Creators",
  "Brands",
  "Distribution",
  "Deals",
  "Payouts",
  "Reach",
];

const steps = [
  {
    k: "01",
    h: "List or discover",
    p: "Creators publish their reach and rates. Brands browse a vetted roster filtered by audience, platform, and price.",
  },
  {
    k: "02",
    h: "Deal in the open",
    p: "Scope, timeline, and price agreed in one thread. Funds move into escrow the moment both sides sign.",
  },
  {
    k: "03",
    h: "Ship & get paid",
    p: "Work goes live, the brand confirms, and Stripe releases payout — often the same day. No invoices, no chasing.",
  },
];

export default function Home() {
  return (
    <main id="top">
      <Nav />
      <Hero />

      {/* marquee */}
      <div
        aria-hidden
        className="overflow-hidden border-y border-[color:var(--hair-2)] bg-[color:var(--color-bg2)] py-[26px]"
      >
        <div className="marquee-row flex w-max gap-16 whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span
              key={i}
              className="flex items-center gap-16 font-display text-[clamp(22px,3vw,40px)] italic text-[color:var(--color-ink-mute)] after:text-sm after:not-italic after:text-[color:var(--color-gold)] after:content-['✦']"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* thesis */}
      <section className="mx-auto max-w-[1400px] px-[clamp(20px,5vw,72px)] py-[clamp(96px,13vw,200px)]">
        <Reveal className="text-xs font-medium uppercase tracking-[0.28em] text-[color:var(--color-gold)]">
          The thesis
        </Reveal>
        <Reveal
          as="div"
          delay={0.05}
          className="mt-[22px] max-w-[20ch] font-display text-[clamp(30px,4.6vw,72px)] font-light leading-[1.1] tracking-[-0.01em]"
        >
          Attention is the only currency left.{" "}
          <em className="italic text-[color:var(--color-gold-soft)]">
            Distribution
          </em>{" "}
          is the only way to spend it.
        </Reveal>
        <Reveal
          delay={0.1}
          className="mt-8 max-w-[56ch] text-[clamp(15px,1.5vw,19px)] text-[color:var(--color-ink-soft)]"
        >
          Every brand is fighting for the same feeds. The creators who own those
          feeds are stuck negotiating in DMs, chasing invoices, and leaving
          money on the table. GLORY closes the gap — a single marketplace where
          reach is priced, deals are signed, and payouts clear the moment the
          work ships.
        </Reveal>
      </section>

      {/* split: creator / brand */}
      <section className="grid grid-cols-1 gap-px bg-[color:var(--hair-2)] md:grid-cols-2">
        {[
          {
            id: "creators",
            num: "01 / Creators",
            h: (
              <>
                Sell your reach
                <br />
                like the asset it is.
              </>
            ),
            p: "Your audience is inventory. Price it, list it, and let the brands come to you.",
            li: [
              "Set your rates, keep your rights",
              "Instant payouts via Stripe — no 60-day waits",
              "One profile, every platform's numbers",
            ],
          },
          {
            id: "brands",
            num: "02 / Brands",
            h: (
              <>
                Buy distribution,
                <br />
                not promises.
              </>
            ),
            p: "Skip the agency markup. Find vetted creators, run the deal, measure the lift.",
            li: [
              "Vetted roster with real audience data",
              "Escrowed deals — pay on delivery",
              "Campaign analytics in one dashboard",
            ],
          },
        ].map((c) => (
          <div
            key={c.id}
            id={c.id}
            className="relative flex min-h-[60vh] flex-col justify-between overflow-hidden bg-[color:var(--color-bg)] px-[clamp(20px,5vw,72px)] py-[clamp(40px,6vw,88px)]"
          >
            <Reveal as="div">
              <span className="font-display text-[15px] text-[color:var(--color-gold)]">
                {c.num}
              </span>
              <h3 className="mt-[18px] font-display text-[clamp(32px,4vw,58px)] font-normal leading-[1.02]">
                {c.h}
              </h3>
              <p className="mt-4 max-w-[40ch] text-[color:var(--color-ink-soft)]">
                {c.p}
              </p>
            </Reveal>
            <ul className="mt-9 flex list-none flex-col gap-[14px] p-0">
              {c.li.map((li, i) => (
                <Reveal
                  as="li"
                  key={i}
                  delay={0.05 * i}
                  className="flex items-baseline gap-[14px] text-[15px] before:font-display before:text-[color:var(--color-gold)] before:content-['→']"
                >
                  {li}
                </Reveal>
              ))}
            </ul>
            <div className="pointer-events-none absolute inset-x-[-20%] bottom-[-30%] h-[60%] bg-[radial-gradient(60%_100%_at_50%_100%,rgba(200,162,74,.14),transparent_70%)]" />
          </div>
        ))}
      </section>

      <Showcase />
      <Stats />

      {/* steps */}
      <section
        id="steps"
        className="mx-auto max-w-[1400px] px-[clamp(20px,5vw,72px)] py-[clamp(96px,13vw,200px)]"
      >
        <Reveal
          as="div"
          className="mb-[60px] font-display text-[clamp(28px,4vw,60px)] font-light"
        >
          How the deal moves.
        </Reveal>
        {steps.map((s, i) => (
          <Reveal
            as="div"
            key={s.k}
            delay={0.04 * i}
            className={`grid grid-cols-1 items-baseline gap-[clamp(8px,5vw,80px)] border-t border-[color:var(--hair-2)] py-[38px] sm:grid-cols-[100px_1fr] ${
              i === steps.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="font-display text-[clamp(22px,3vw,34px)] text-[color:var(--color-gold)]">
              {s.k}
            </div>
            <div>
              <h4 className="m-0 font-display text-[clamp(22px,2.6vw,34px)] font-normal">
                {s.h}
              </h4>
              <p className="mt-3 max-w-[52ch] text-[color:var(--color-ink-soft)]">
                {s.p}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      <Waitlist />

      {/* footer */}
      <footer className="border-t border-[color:var(--hair-2)] pb-10 pt-[60px]">
        <div className="mx-auto max-w-[1400px] px-[clamp(20px,5vw,72px)]">
          <div className="flex flex-wrap items-start justify-between gap-10">
            <div className="font-display text-[clamp(40px,10vw,130px)] font-normal leading-[0.9]">
              GLORY
            </div>
            <div className="flex flex-wrap gap-[clamp(30px,6vw,90px)]">
              {[
                {
                  h: "Platform",
                  a: ["For creators", "For brands", "How it works"],
                },
                { h: "Company", a: ["About", "Careers", "Contact"] },
                { h: "Legal", a: ["Privacy", "Terms"] },
              ].map((col) => (
                <div key={col.h}>
                  <h5 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                    {col.h}
                  </h5>
                  {col.a.map((a) => (
                    <a
                      key={a}
                      href="#"
                      data-hover
                      className="block py-[5px] text-sm text-[color:var(--color-ink-soft)] transition-colors hover:text-[color:var(--color-gold)]"
                    >
                      {a}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-[60px] flex flex-wrap justify-between gap-3 border-t border-[color:var(--hair-2)] pt-6 text-xs tracking-[0.06em] text-[color:var(--color-ink-mute)]">
            <span>© 2026 GLORY. The last real arbitrage in distribution.</span>
            <span>Built for the founding cohort.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scrollx{to{transform:translateX(-50%)}}
        .marquee-row{animation:scrollx 34s linear infinite}
        @media (prefers-reduced-motion: reduce){ .marquee-row{animation:none} }
      `}</style>
    </main>
  );
}
