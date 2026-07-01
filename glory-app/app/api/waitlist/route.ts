import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: { email?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const role = body.role === "creator" || body.role === "brand" ? body.role : null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 422 });
  }

  // 1) Persist to Supabase if configured (dedupe on unique email).
  const db = getSupabaseAdmin();
  if (db) {
    try {
      const { error } = await db
        .from("waitlist")
        .upsert(
          { email, role, source: "landing" },
          { onConflict: "email", ignoreDuplicates: true }
        );
      if (error) throw error;
    } catch {
      // scaffold: don't fail the signup if the table isn't reachable yet
    }
  }

  // 2) Send a confirmation email if Resend is configured.
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.WAITLIST_FROM_EMAIL;
  if (resendKey && from) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from,
        to: email,
        subject: "You're on the GLORY list ✦",
        text:
          "Glory awaits.\n\nYou're on the list for the founding cohort. " +
          "We'll email you the moment the gates open.\n\n— GLORY",
      });
    } catch {
      // non-fatal: signup still succeeds even if email delivery hiccups
    }
  }

  return NextResponse.json({ ok: true });
}
