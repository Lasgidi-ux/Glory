import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Everything under /dashboard and /onboarding requires an authenticated user.
const isProtected = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)"]);

// When Clerk isn't configured, clerkMiddleware throws "Missing publishableKey"
// on every request and 500s the whole site. Fall back to a pass-through so the
// public pages keep working until the keys are set.
export default process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? clerkMiddleware(async (auth, req) => {
      if (isProtected(req)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next internals and static files, run on everything else
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
