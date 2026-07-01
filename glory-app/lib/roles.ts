import { currentUser } from "@clerk/nextjs/server";

export type Role = "creator" | "brand";

export function isRole(v: unknown): v is Role {
  return v === "creator" || v === "brand";
}

/** Read the signed-in user's role from Clerk publicMetadata, or null. */
export async function getRole(): Promise<Role | null> {
  const user = await currentUser();
  const r = user?.publicMetadata?.role;
  return isRole(r) ? r : null;
}
