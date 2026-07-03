/**
 * Whether Clerk auth is configured. Works on both server and client because
 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is inlined at build for the client.
 * When false, the app degrades gracefully: the public site renders, and
 * auth-only routes redirect home instead of throwing "Missing publishableKey".
 */
export const clerkEnabled = () =>
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
