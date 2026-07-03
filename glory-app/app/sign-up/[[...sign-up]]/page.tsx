import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";

export default function SignUpPage() {
  if (!clerkEnabled()) redirect("/");
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg)] px-6 py-24">
      <div className="w-full max-w-[420px]">
        <a
          href="/"
          className="mb-8 block text-center font-display text-3xl font-semibold text-[color:var(--color-gold-soft)]"
        >
          GLORY
        </a>
        <SignUp />
      </div>
    </main>
  );
}
