import { redirect } from "next/navigation";
import { getRole } from "@/lib/roles";
import { clerkEnabled } from "@/lib/clerk";

export const dynamic = "force-dynamic";

// Route the user to their role's dashboard, or to onboarding if unset.
export default async function DashboardIndex() {
  if (!clerkEnabled()) redirect("/");
  const role = await getRole();
  if (!role) redirect("/onboarding");
  redirect(`/dashboard/${role}`);
}
