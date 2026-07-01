import { NOTICES } from "@/lib/format";

export default function Notice({ code }: { code?: string }) {
  if (!code || !NOTICES[code]) return null;
  return (
    <div className="mb-6 rounded-lg border border-[color:var(--hair)] bg-[color:var(--color-panel)] px-5 py-3 text-sm text-[color:var(--color-ink-soft)]">
      {NOTICES[code]}
    </div>
  );
}
