"use client";

import { useState } from "react";
import type { PayoutStatus } from "@/lib/payments";

export default function PayoutBanner({ status }: { status: PayoutStatus }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status.payoutsEnabled) {
    return (
      <div className="mb-8 flex items-center gap-3 rounded-lg border border-[color:var(--hair-2)] bg-[color:var(--color-panel)] px-5 py-4">
        <span className="text-[color:var(--color-gold-soft)]">✓</span>
        <span className="text-sm text-[color:var(--color-ink-soft)]">
          Payouts enabled — deals settle straight to your account.
        </span>
      </div>
    );
  }

  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start onboarding.");
        setLoading(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-lg border border-[color:var(--hair-2)] bg-[color:var(--color-panel)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">Set up instant payouts</p>
        <p className="text-sm text-[color:var(--color-ink-soft)]">
          {status.configured
            ? "Connect your Stripe account to get paid the moment a deal is delivered."
            : "Payments are in demo mode. Add STRIPE_SECRET_KEY to enable Stripe Connect."}
        </p>
        {error && (
          <p className="mt-1 text-sm text-[color:var(--color-gold-soft)]">{error}</p>
        )}
      </div>
      <button
        onClick={connect}
        disabled={!status.configured || loading}
        data-hover
        className="shrink-0 rounded-full bg-[color:var(--color-gold)] px-6 py-3 text-sm font-semibold text-[#0a0906] transition-transform hover:-translate-y-[1px] hover:bg-[color:var(--color-gold-soft)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Redirecting…" : "Set up payouts"}
      </button>
    </div>
  );
}
