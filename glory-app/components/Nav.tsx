"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function useISTClock() {
  const [t, setT] = useState("IST 07:23 PM");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ist = new Date(
        now.getTime() + now.getTimezoneOffset() * 60000 + 5.5 * 3600000
      );
      let h = ist.getHours();
      const m = ist.getMinutes();
      const ap = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setT(
        `IST ${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m} ${ap}`
      );
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const clock = useISTClock();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between px-[clamp(20px,5vw,72px)] py-[22px] transition-[background,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b border-[color:var(--hair)] bg-[rgba(10,9,6,.6)] backdrop-blur-[14px]"
          : ""
      }`}
    >
      <a
        href="#top"
        data-hover
        className="flex items-center gap-3 font-display text-[20px] font-semibold tracking-[0.02em]"
      >
        <svg viewBox="0 0 60 30" fill="none" className="h-4 w-[30px]">
          <path
            d="M15 5a10 10 0 100 20 10 10 0 000-20zm30 0a10 10 0 100 20 10 10 0 000-20z"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        GLORY
      </a>

      <nav className="hidden items-center gap-9 text-[13px] tracking-[0.06em] text-[color:var(--color-ink-soft)] md:flex">
        <span className="tabular-nums">{clock}</span>
        <a href="#waitlist" className="link">
          EMAIL
        </a>
      </nav>

      <nav className="flex items-center gap-8 text-[13px] uppercase tracking-[0.14em]">
        <a href="#creators" data-hover className="link">
          Creator
        </a>
        <a href="#brands" data-hover className="link">
          Career
        </a>
        <a href="/sign-in" data-hover className="link text-[color:var(--color-gold-soft)]">
          Sign in
        </a>
      </nav>

      <style>{`
        .link{position:relative}
        .link::after{content:"";position:absolute;left:0;bottom:-4px;height:1px;width:0;background:var(--color-gold);transition:width .35s cubic-bezier(.22,.61,.36,1)}
        .link:hover::after{width:100%}
      `}</style>
    </motion.header>
  );
}
