import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { startCreatorOnboarding } from "@/lib/payments";

// Starts (or resumes) Stripe Express onboarding for the signed-in creator.
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = await startCreatorOnboarding(userId);
  if (res.error || !res.url) {
    return NextResponse.json(
      { error: res.error ?? "Could not create onboarding link" },
      { status: 503 }
    );
  }
  return NextResponse.json({ url: res.url });
}
