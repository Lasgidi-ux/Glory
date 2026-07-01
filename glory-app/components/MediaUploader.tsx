"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaItem } from "@/lib/data";

export default function MediaUploader({
  items,
  enabled,
}: {
  items: MediaItem[];
  enabled: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      // 1) get a signature from our server
      const signRes = await fetch("/api/media/sign", { method: "POST" });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error ?? "Could not sign upload.");

      // 2) upload straight to Cloudinary
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sign.apiKey);
      form.append("timestamp", String(sign.timestamp));
      form.append("signature", sign.signature);
      form.append("folder", sign.folder);

      const up = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`,
        { method: "POST", body: form }
      );
      const uploaded = await up.json();
      if (!up.ok) throw new Error(uploaded.error?.message ?? "Upload failed.");

      // 3) persist metadata
      const save = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: uploaded.public_id,
          url: uploaded.secure_url,
          resourceType: uploaded.resource_type === "video" ? "video" : "image",
        }),
      });
      if (!save.ok) {
        const s = await save.json().catch(() => ({}));
        throw new Error(s.error ?? "Could not save media.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl">Portfolio</h2>
        <div className="flex items-center gap-3">
          {error && (
            <span className="text-sm text-[color:var(--color-gold-soft)]">{error}</span>
          )}
          <button
            type="button"
            data-hover
            disabled={!enabled || busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-[color:var(--color-gold)] px-5 py-2 text-sm font-medium text-[color:var(--color-gold-soft)] transition-colors hover:bg-[color:var(--color-gold)] hover:text-[#0a0906] disabled:cursor-not-allowed disabled:opacity-40"
            title={enabled ? "" : "Add CLOUDINARY_* env vars to enable uploads"}
          >
            {busy ? "Uploading…" : "Upload media"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={onPick}
          />
        </div>
      </div>

      {!enabled && (
        <p className="mb-4 text-sm text-[color:var(--color-ink-mute)]">
          Uploads are in demo mode — add your Cloudinary keys to enable them.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((m) => (
          <div
            key={m.publicId}
            className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[color:var(--hair-2)] bg-[color:var(--color-panel)]"
          >
            {m.resourceType === "video" ? (
              <video src={m.url} className="h-full w-full object-cover" muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
