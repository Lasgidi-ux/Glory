"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { clerkEnabled } from "@/lib/clerk";
import { NavAuthButtons, SignedOutButtons } from "./NavAuth";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const signupsOpen = process.env.NEXT_PUBLIC_SIGNUPS_OPEN === "true";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between px-[clamp(16px,5vw,72px)] py-[16px] transition-[background,backdrop-filter] duration-500 sm:py-[22px] ${
        scrolled
          ? "border-b border-[color:var(--hair)] bg-[rgba(10,9,6,.62)] backdrop-blur-[14px]"
          : ""
      }`}
    >
      {/* logo: interlocking loops mark + wordmark */}
      <a
        href="#top"
        data-hover
        aria-label="GLORY — home"
        className="flex items-center gap-2.5 font-display text-[18px] font-semibold tracking-[0.02em] sm:gap-3 sm:text-[20px]"
      >
        <svg
          viewBox="0 0 150 48"
          fill="none"
          className="h-[17px] w-[52px] text-[color:var(--color-gold-soft)]"
          aria-hidden
        >
          <path
            d="M50 24 C40 2 8 10 12 24 C15 38 45 42 50 24 C58 8 92 8 100 24 C110 2 142 10 138 24 C135 38 105 42 100 24 C92 40 58 40 50 24 Z"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        GLORY
      </a>

      {/* nav links */}
      <nav className="flex items-center gap-5 text-[13px] uppercase tracking-[0.14em] sm:gap-8">
        <a href="#creators" data-hover className="link hidden md:inline">
          Creator
        </a>
        <a href="#brands" data-hover className="link hidden md:inline">
          Brands
        </a>
        {clerkEnabled() ? (
          <NavAuthButtons signupsOpen={signupsOpen} />
        ) : (
          // Clerk not configured yet — render signed-out buttons without hooks.
          <SignedOutButtons signupsOpen={signupsOpen} />
        )}
      </nav>

      <style>{`
        .link{position:relative}
        .link::after{content:"";position:absolute;left:0;bottom:-4px;height:1px;width:0;background:var(--color-gold);transition:width .35s cubic-bezier(.22,.61,.36,1)}
        .link:hover::after{width:100%}
      `}</style>
    </motion.header>
  );
}
