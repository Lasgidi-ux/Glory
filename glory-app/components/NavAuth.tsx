"use client";

import { useUser } from "@clerk/nextjs";

const pill =
  "rounded-full bg-[color:var(--color-gold)] px-4 py-2 text-[12px] font-semibold normal-case tracking-normal text-[#0a0906] transition-transform hover:-translate-y-[1px] hover:bg-[color:var(--color-gold-soft)]";
const link = "link text-[color:var(--color-ink-soft)]";

/** Buttons for a signed-out visitor. No Clerk hooks — safe without a provider. */
export function SignedOutButtons({ signupsOpen }: { signupsOpen: boolean }) {
  if (!signupsOpen) {
    return (
      <a href="/sign-in" data-hover className={link}>
        Sign in
      </a>
    );
  }
  return (
    <>
      <a href="/sign-in" data-hover className={link}>
        Sign in
      </a>
      <a href="/sign-up" data-hover className={pill}>
        Get started
      </a>
    </>
  );
}

/** Auth-aware buttons. Only mount this when Clerk is configured. */
export function NavAuthButtons({ signupsOpen }: { signupsOpen: boolean }) {
  const { isSignedIn } = useUser();
  if (isSignedIn) {
    return (
      <a href="/dashboard" data-hover className={pill}>
        Dashboard
      </a>
    );
  }
  return <SignedOutButtons signupsOpen={signupsOpen} />;
}
