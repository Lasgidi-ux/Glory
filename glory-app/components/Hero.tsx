"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

const word = "Glory".split("");

export default function Hero() {
  const [webgl, setWebgl] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !bgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* background: WebGL canvas or image fallback */}
      <div
        ref={bgRef}
        className="absolute inset-[-6%_-3%] z-0"
        style={{ willChange: "transform" }}
      >
        {webgl ? (
          <HeroCanvas />
        ) : (
          <img
            src="/art/hero-glory.jpg"
            alt="A gilded figure raising a sword against a serpent above classical ruins."
            className="h-[112%] w-full object-cover"
            style={{ objectPosition: "70% 40%" }}
          />
        )}
      </div>

      {/* scrim */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg,rgba(10,9,6,.7) 0%,rgba(10,9,6,.12) 22%,rgba(10,9,6,.08) 52%,rgba(10,9,6,.78) 82%,rgba(10,9,6,.96) 100%)," +
            "radial-gradient(130% 90% at 18% 92%,rgba(10,9,6,.85),transparent 62%)",
        }}
      />

      {/* content */}
      <div className="relative z-[2] mx-auto w-full max-w-[1400px] px-[clamp(20px,5vw,72px)] pb-[clamp(40px,7vh,90px)]">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
          className="mb-2 max-w-[440px] text-[clamp(13px,1.3vw,15px)] uppercase leading-[1.7] tracking-[0.16em] text-[#e9e2d2]"
          style={{
            textShadow: "0 1px 24px rgba(10,9,6,.9),0 1px 3px rgba(10,9,6,.8)",
          }}
        >
          Behind the world&apos;s biggest
          <br /> brands and names. The last real
          <br /> arbitrage in distribution.
        </motion.p>

        <h1
          aria-label="Glory"
          className="m-0 font-display text-[clamp(88px,22vw,340px)] font-normal leading-[0.86] tracking-[-0.02em] text-[color:var(--color-gold-soft)]"
          style={{ textShadow: "0 2px 60px rgba(10,9,6,.5)" }}
        >
          {word.map((c, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.05,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2 + i * 0.06,
                }}
              >
                {c}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-[color:var(--hair)] pt-5">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 0.5 }}
            className="m-0 max-w-[420px] text-sm text-[color:var(--color-ink-soft)]"
          >
            A distribution engine where elite creators and the brands that need
            them meet, deal, and get paid — without the agency tax.
          </motion.p>
          <div className="flex items-center gap-[10px] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-ink-mute)]">
            <span>Scroll</span>
            <span className="scrollbar block h-[34px] w-px bg-[color:var(--color-gold)] opacity-60" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drop{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        .scrollbar{animation:drop 1.8s cubic-bezier(.22,.61,.36,1) infinite}
      `}</style>
    </section>
  );
}
