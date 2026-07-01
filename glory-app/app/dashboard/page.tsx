import { redirect } from "next/navigation";
import { getRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

// Route the user to their role's dashboard, or to onboarding if unset.
export default async function DashboardIndex() {
  const role = await getRole();
  if (!role) redirect("/onboarding");
  redirect(`/dashboard/${role}`);
}
