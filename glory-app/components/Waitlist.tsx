"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [note, setNote] = useState("No spam. Just the invite and the launch date.");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
    if (!ok) {
      setNote("Enter a valid email to claim your spot.");
      return;
    }
    // TODO: POST to /api/waitlist (Supabase / Resend) in a later pass.
    setDone(true);
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden py-[clamp(96px,13vw,200px)] text-center"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-[-40%] h-[80%] bg-[radial-gradient(50%_100%_at_50%_100%,rgba(200,162,74,.2),transparent_70%)]" />
      <div className="mx-auto max-w-[1400px] px-[clamp(20px,5vw,72px)]">
        <Reveal className="text-xs font-medium uppercase tracking-[0.28em] text-[color:var(--color-gold)]">
          Founding cohort · 2026
        </Reveal>
        <Reveal
          as="div"
          delay={0.05}
          className="mt-5 font-display text-[clamp(44px,9vw,150px)] font-normal leading-[0.9] text-[color:var(--color-gold-soft)]"
        >
          Claim
          <br />
          your glory.
        </Reveal>
        <Reveal
          delay={0.1}
          className="mx-auto mt-6 max-w-[46ch] text-[color:var(--color-ink-soft)]"
        >
          We&apos;re onboarding a first wave of creators and brands. Get an
          invite before the gates open.
        </Reveal>

        {done ? (
          <p className="mx-auto mt-11 font-display text-[22px] text-[color:var(--color-gold-soft)]">
            You&apos;re on the list. Glory awaits. ✦
          </p>
        ) : (
          <form
            onSubmit={submit}
            className="relative z-[2] mx-auto mt-11 flex max-w-[520px] flex-col gap-[10px] sm:flex-row"
            noValidate
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              aria-label="Email address"
              className="flex-1 rounded-[100px] border border-[color:var(--hair)] bg-transparent px-5 py-4 text-[15px] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-gold)] max-sm:rounded-xl"
            />
            <button
              type="submit"
              data-hover
              className="rounded-[100px] bg-[color:var(--color-gold)] px-[30px] py-4 text-[15px] font-semibold text-[#0a0906] transition-transform duration-300 hover:-translate-y-[2px] hover:bg-[color:var(--color-gold-soft)] max-sm:rounded-xl"
            >
              Request invite
            </button>
          </form>
        )}
        {!done && (
          <p className="mt-4 text-xs tracking-[0.08em] text-[color:var(--color-ink-mute)]">
            {note}
          </p>
        )}
      </div>
    </section>
  );
}
