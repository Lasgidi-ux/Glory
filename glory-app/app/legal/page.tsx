import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Cravagiq — Legal · Privacy & Terms",
  description: "The fine print, made clear. Cravagiq's Privacy Policy and Terms of Service.",
};

type Clause = { n: number; h: string; p?: string; li?: string[] };

const privacy: Clause[] = [
  { n: 1, h: "Who we are", p: "Cravagiq connects creators with brands to price, sign, and settle distribution deals. This policy explains how we handle personal information when you use our website and app." },
  { n: 2, h: "What we collect", li: [
    "Account & identity — name, email, and login (via Clerk), plus your role (creator or brand).",
    "Profile & listings — handles, audience figures, rates, portfolio media, and the offers, deals, and messages you create.",
    "Payments — processed by Stripe. We never store full card numbers; we keep deal amounts, payout status, and Stripe identifiers.",
    "Media — files you upload are stored with Cloudinary; we keep references and metadata.",
    "Usage — device, pages, and basic analytics/log data to keep the service secure and working.",
  ]},
  { n: 3, h: "How we use it", li: [
    "To run the marketplace — matching, offers, escrow, delivery, and payouts.",
    "To send transactional email (deal updates, receipts, waitlist) via Resend.",
    "To keep accounts secure, prevent fraud, and meet legal obligations.",
    "To improve the product. We do not sell your personal information.",
  ]},
  { n: 4, h: "Subprocessors we rely on", li: [
    "Clerk — authentication & accounts",
    "Supabase — database & storage",
    "Stripe — payments & payouts (Connect)",
    "Cloudinary — media hosting",
    "Resend — transactional email",
    "Vercel — application hosting",
  ]},
  { n: 5, h: "Retention", p: "We keep your information while your account is active and as needed to provide the service, resolve disputes, and comply with law (e.g. financial records tied to payouts). Delete your account and we remove or anonymise personal data we no longer need." },
  { n: 6, h: "Your rights", p: "Depending on where you live, you may access, correct, export, or delete your personal data, and object to certain processing. Contact us and we'll act within the timeframe the law requires." },
  { n: 7, h: "Security & transfers", p: "We use reputable providers with encryption in transit and at rest, and least-privilege access on the server. Your data may be processed in other countries; we rely on our providers' safeguards for those transfers." },
  { n: 8, h: "Children", p: "Cravagiq is not intended for anyone under 18 (or the age of majority where you live). We don't knowingly collect data from children." },
  { n: 9, h: "Changes & contact", p: "We'll post updates here and change the “last updated” date. Questions or requests: contact us." },
];

const terms: Clause[] = [
  { n: 1, h: "Acceptance", p: "By creating an account or using Cravagiq you agree to these Terms. If you're using Cravagiq for a company, you confirm you're authorised to bind it." },
  { n: 2, h: "Accounts & roles", p: "You pick a role — creator or brand — and are responsible for your account, your credentials, and the accuracy of what you publish (rates, audience figures, deliverables)." },
  { n: 3, h: "The marketplace", li: [
    "A brand sends an offer; a creator accepts or declines.",
    "On acceptance, the brand funds escrow through Stripe — funds are authorised and held, not yet paid out.",
    "The creator delivers; the brand releases; the payout is captured to the creator, minus the platform fee.",
    "Cravagiq is the venue — the agreement for the work is between the creator and the brand.",
  ]},
  { n: 4, h: "Fees & payments", p: "Cravagiq charges a platform fee on each completed deal, shown before funding. Payments and payouts are handled by Stripe and subject to Stripe's terms. You're responsible for your own taxes." },
  { n: 5, h: "Content & intellectual property", p: "Creators keep ownership of the work they produce. You grant Cravagiq a limited licence to display your profile and portfolio to operate and promote the marketplace. Licences to the brand for delivered work are set by your deal." },
  { n: 6, h: "Acceptable use", li: [
    "No fraud, fake metrics, spam, harassment, or infringing content.",
    "No attempts to circumvent escrow, fees, or platform security.",
    "Follow the platform rules of any channel where the work is distributed.",
  ]},
  { n: 7, h: "Disputes, refunds & chargebacks", p: "If a deal goes wrong, work with the other party first. Where escrow hasn't been released, we may help mediate; refunds and chargebacks follow Stripe's processes and these Terms." },
  { n: 8, h: "Disclaimers & liability", p: "The service is provided “as is.” To the fullest extent permitted by law, Cravagiq isn't liable for indirect or consequential losses, and our total liability is limited to the fees you paid us in the 3 months before the claim." },
  { n: 9, h: "Termination", p: "You can close your account anytime. We may suspend or end access for breach of these Terms. Obligations that should survive — payment, IP, liability — do." },
  { n: 10, h: "Governing law & changes", p: "These Terms are governed by the laws of [your jurisdiction]. We may update them; material changes will be posted here with a new date. Continued use means you accept the update." },
];

function Clauses({ items }: { items: Clause[] }) {
  return (
    <>
      {items.map((c) => (
        <div key={c.n} className="mt-9">
          <h3 className="flex items-baseline gap-3 font-display text-xl font-medium text-[color:var(--color-gold-soft)]">
            <span className="font-mono text-[13px] text-[color:var(--color-gold)]">{c.n}</span>
            {c.h}
          </h3>
          {c.p && <p className="mt-2 text-[color:var(--color-ink-soft)]">{c.p}</p>}
          {c.li && (
            <ul className="mt-2 flex flex-col gap-2">
              {c.li.map((l, i) => (
                <li key={i} className="flex gap-3 text-[color:var(--color-ink-soft)] before:flex-none before:text-[color:var(--color-gold)] before:content-['—']">
                  {l}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

export default function LegalPage() {
  return (
    <main id="top" className="bg-[color:var(--color-bg)]">
      <Nav />

      {/* hero */}
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/art/legal-justice.jpg"
            alt="A gilded figure of Justice holding balanced scales, lit by a single shaft of light."
            className="h-full w-full object-cover [object-position:80%_center]"
          />
        </div>
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(90deg,rgba(10,9,6,.96) 0%,rgba(10,9,6,.7) 38%,rgba(10,9,6,.15) 70%,rgba(10,9,6,.35) 100%)," +
              "linear-gradient(180deg,rgba(10,9,6,.7),rgba(10,9,6,0) 30%,rgba(10,9,6,.85) 100%)",
          }}
        />
        <div className="relative z-[2] mx-auto w-full max-w-[1160px] px-[clamp(20px,5vw,64px)] pb-[clamp(40px,7vh,80px)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-gold)]">Legal</p>
          <h1 className="mt-3.5 font-display text-[clamp(46px,8vw,104px)] font-light leading-[0.95] tracking-[-0.02em] text-[color:var(--color-gold-soft)]">
            Justice,<br /><em className="italic">by design.</em>
          </h1>
          <p className="mt-5 max-w-[52ch] text-[clamp(15px,1.5vw,18px)] text-[color:var(--color-ink-soft)]">
            The fine print, made plain. How Cravagiq handles your data, and the terms that govern working inside the platform — written to be read, not skipped.
          </p>
          <p className="mt-3.5 text-xs uppercase tracking-[0.12em] text-[color:var(--color-ink-mute)]">Last updated · 3 July 2026</p>
          <nav className="mt-7 flex flex-wrap gap-2.5">
            <a href="#privacy" className="rounded-full border border-[color:var(--hair)] px-5 py-2.5 text-[13px] tracking-[0.08em] transition-colors hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold-soft)]">Privacy Policy</a>
            <a href="#terms" className="rounded-full border border-[color:var(--hair)] px-5 py-2.5 text-[13px] tracking-[0.08em] transition-colors hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold-soft)]">Terms of Service</a>
          </nav>
        </div>
      </section>

      {/* template notice */}
      <div className="mx-auto mt-[clamp(48px,8vw,88px)] max-w-[820px] px-[clamp(20px,5vw,64px)]">
        <div className="rounded-[10px] border border-[color:var(--hair)] border-l-[3px] border-l-[color:var(--color-gold)] bg-[color:var(--color-panel)] px-[22px] py-[18px] text-sm text-[color:var(--color-ink-soft)]">
          <b className="font-semibold text-[color:var(--color-gold-soft)]">Template notice.</b> This document is a thorough starting point tailored to Cravagiq, but it is not legal advice. Have a qualified lawyer review and adapt it — especially the governing-law, liability, and payments clauses — before you launch.
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-[820px] px-[clamp(20px,5vw,64px)] pb-[clamp(80px,12vw,160px)] pt-[clamp(48px,8vw,96px)]">
        <section id="privacy" className="scroll-mt-24">
          <h2 className="font-display text-[clamp(30px,4.6vw,52px)] font-normal leading-[1.05]">Privacy Policy</h2>
          <p className="mt-3.5 text-[17px] text-[color:var(--color-ink-soft)]">What we collect, why, who we share it with, and the control you keep over it.</p>
          <Clauses items={privacy} />
          <a href="#top" className="mt-5 inline-block text-xs uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-gold)]">↑ Back to top</a>
        </section>

        <section id="terms" className="mt-[clamp(64px,10vw,120px)] scroll-mt-24 border-t border-[color:var(--hair-2)] pt-[clamp(48px,7vw,80px)]">
          <h2 className="font-display text-[clamp(30px,4.6vw,52px)] font-normal leading-[1.05]">Terms of Service</h2>
          <p className="mt-3.5 text-[17px] text-[color:var(--color-ink-soft)]">The rules of the arena — what you agree to by using Cravagiq.</p>
          <Clauses items={terms} />
          <a href="#top" className="mt-5 inline-block text-xs uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-gold)]">↑ Back to top</a>
        </section>
      </div>

      <footer className="border-t border-[color:var(--hair-2)] py-12">
        <div className="mx-auto flex max-w-[1160px] flex-wrap justify-between gap-6 px-[clamp(20px,5vw,64px)] text-[13px] text-[color:var(--color-ink-mute)]">
          <span>© 2026 Cravagiq. The last real arbitrage in distribution.</span>
          <span className="flex gap-3">
            <a href="#privacy" className="hover:text-[color:var(--color-gold)]">Privacy</a>·
            <a href="#terms" className="hover:text-[color:var(--color-gold)]">Terms</a>·
            <Link href="/" className="hover:text-[color:var(--color-gold)]">Home</Link>
          </span>
        </div>
      </footer>
    </main>
  );
}
