"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Role } from "@/lib/roles";
import { upsertProfile } from "@/lib/data";

export async function setRole(role: Role) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role },
  });

  // Mirror the role into Supabase (no-op until Supabase is configured).
  await upsertProfile(userId, role);

  redirect(`/dashboard/${role}`);
}
