import Image from "next/image";

const columns = [
  {
    h: "Platform",
    a: [
      { label: "For creators", href: "#creators" },
      { label: "For brands", href: "#brands" },
      { label: "How it works", href: "#steps" },
    ],
  },
  {
    h: "Company",
    a: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#waitlist" },
    ],
  },
  {
    h: "Legal",
    a: [
      { label: "Privacy", href: "/legal#privacy" },
      { label: "Terms", href: "/legal#terms" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const foot =
  "text-[color:var(--color-ink-soft)] transition-colors hover:text-[color:var(--color-gold)]";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-[color:var(--hair-2)] bg-[color:var(--color-bg)]"
    >
      {/* ambient gold glow rising from the base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] bg-[radial-gradient(60%_120%_at_50%_125%,rgba(200,162,74,.2),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1400px] px-[clamp(20px,5vw,72px)]">
        {/* ── CTA band ── */}
        <div className="flex flex-col gap-8 border-b border-[color:var(--hair-2)] py-[clamp(48px,8vw,110px)] md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-gold)]">
              Founding cohort · 2026
            </p>
            <a
              href="#waitlist"
              data-hover
              className="group mt-4 inline-flex items-baseline gap-4 font-display text-[clamp(40px,7vw,100px)] font-light leading-[0.95] tracking-[-0.01em] text-[color:var(--color-ink)] transition-colors hover:text-[color:var(--color-gold-soft)]"
            >
              Claim your glory
              <span className="text-[color:var(--color-gold-soft)] transition-transform duration-500 group-hover:translate-x-4">
                →
              </span>
            </a>
          </div>
          <p className="max-w-[34ch] text-[color:var(--color-ink-soft)]">
            A distribution engine for the creators who move culture — and the
            brands that need them.
          </p>
        </div>

        {/* ── brand + links ── */}
        <div className="grid grid-cols-1 gap-12 py-[clamp(40px,6vw,72px)] md:grid-cols-[1.3fr_2fr]">
          <div>
            <Image
              src="/art/logo.png"
              alt="Cravagiq"
              width={1438}
              height={526}
              className="h-[22px] w-auto"
            />
            <p className="mt-5 max-w-[30ch] text-sm text-[color:var(--color-ink-soft)]">
              The last real arbitrage in distribution.
            </p>
            <div className="mt-7 flex flex-wrap gap-6 text-sm">
              {socials.map((s) => (
                <a key={s.label} href={s.href} data-hover className={foot}>
                  {s.label}{" "}
                  <span className="text-[color:var(--color-ink-mute)]">↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-[clamp(30px,6vw,90px)]">
            {columns.map((col) => (
              <div key={col.h}>
                <h5 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                  {col.h}
                </h5>
                {col.a.map((a) => (
                  <a
                    key={a.label}
                    href={a.href}
                    data-hover
                    className={`block py-[5px] text-sm ${foot}`}
                  >
                    {a.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── giant wordmark that melts into the page ── */}
      <div
        aria-hidden
        className="relative select-none px-[clamp(20px,5vw,72px)]"
      >
        <div
          className="mx-auto max-w-[1400px] bg-gradient-to-b from-[#efd79b] via-[#c8a24a] to-[#5f4a1e] bg-clip-text text-center font-display text-[clamp(96px,27vw,440px)] font-normal leading-[0.72] tracking-[-0.03em] text-transparent"
          style={{
            WebkitMaskImage:
              "linear-gradient(180deg,#000 58%,transparent 96%)",
            maskImage: "linear-gradient(180deg,#000 58%,transparent 96%)",
          }}
        >
          Cravagiq
        </div>
      </div>

      {/* ── baseline ── */}
      <div className="relative mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-[clamp(20px,5vw,72px)] py-7 text-xs tracking-[0.06em] text-[color:var(--color-ink-mute)]">
        <span>© 2026 Cravagiq — behind the world&apos;s biggest names.</span>
        <a href="#top" data-hover className={foot}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
