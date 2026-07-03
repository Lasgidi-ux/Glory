import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getRole } from "@/lib/roles";
import { clerkEnabled } from "@/lib/clerk";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!clerkEnabled()) redirect("/");
  const role = await getRole();

  const navItem = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 transition-colors ${
        active
          ? "bg-[color:var(--color-panel)] text-[color:var(--color-ink)]"
          : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-panel)] hover:text-[color:var(--color-ink)]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)]">
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] flex-col justify-between border-r border-[color:var(--hair-2)] p-7 lg:flex">
        <div>
          <Link href="/" className="font-display text-2xl font-semibold">
            GLORY
          </Link>
          <nav className="mt-10 flex flex-col gap-1 text-sm">
            {navItem("/dashboard/creator", "Creator", role === "creator")}
            {navItem("/dashboard/brand", "Brand", role === "brand")}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{ elements: { avatarBox: "h-9 w-9" } }}
          />
          <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--color-ink-mute)]">
            {role ?? "no role"}
          </span>
        </div>
      </aside>

      {/* mobile top bar */}
      <header className="flex items-center justify-between border-b border-[color:var(--hair-2)] px-6 py-4 lg:hidden">
        <Link href="/" className="font-display text-xl font-semibold">
          GLORY
        </Link>
        <UserButton />
      </header>

      <div className="lg:pl-[240px]">{children}</div>
    </div>
  );
}
