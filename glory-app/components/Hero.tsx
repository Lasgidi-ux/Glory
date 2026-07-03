"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

/**
 * Decide whether to run the (expensive) WebGL hero. We only do it on capable
 * desktops — never on touch devices, small viewports, low-power hardware, or
 * when reduced motion is requested. Everywhere else we serve an optimized
 * image, which is what keeps mobile fast.
 */
function useHeroMode() {
  const [mode, setMode] = useState<"image" | "webgl">("image");
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const wide = window.innerWidth >= 1024;
    const cores = navigator.hardwareConcurrency ?? 4;
    // @ts-expect-error deviceMemory is non-standard but useful when present
    const mem: number | undefined = navigator.deviceMemory;
    const lowPower = cores <= 4 || (typeof mem === "number" && mem <= 4);

    let webglOk = false;
    try {
      const c = document.createElement("canvas");
      webglOk = !!(
        window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"))
      );
    } catch {
      webglOk = false;
    }

    setMotionOk(!reduce && !coarse);
    if (webglOk && wide && !coarse && !reduce && !lowPower) setMode("webgl");
  }, []);

  return { mode, motionOk };
}

const word = "Glory".split("");

export default function Hero() {
  const { mode, motionOk } = useHeroMode();
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionOk || !bgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 12,
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
  }, [motionOk]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* background: WebGL on capable desktops, optimized image everywhere else */}
      <div
        ref={bgRef}
        className="absolute inset-[-6%_-3%] z-0"
        style={{ willChange: motionOk ? "transform" : "auto" }}
      >
        {mode === "webgl" ? (
          <HeroCanvas />
        ) : (
          <Image
            src="/art/hero-glory.jpg"
            alt="A gilded figure raising a sword against a serpent above classical ruins."
            fill
            priority
            sizes="100vw"
            className="object-cover [object-position:78%_42%] sm:[object-position:74%_42%] lg:[object-position:70%_40%]"
          />
        )}
      </div>

      {/* scrim — stronger at the bottom-left where the copy sits */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg,rgba(10,9,6,.72) 0%,rgba(10,9,6,.14) 22%,rgba(10,9,6,.1) 50%,rgba(10,9,6,.82) 80%,rgba(10,9,6,.97) 100%)," +
            "radial-gradient(140% 95% at 15% 95%,rgba(10,9,6,.9),transparent 60%)",
        }}
      />

      {/* content */}
      <div className="relative z-[2] mx-auto w-full max-w-[1400px] px-[clamp(20px,5vw,72px)] pb-[clamp(36px,7vh,90px)] pt-24">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
          className="mb-2 max-w-[440px] text-[clamp(12px,3.4vw,15px)] uppercase leading-[1.7] tracking-[0.16em] text-[#e9e2d2]"
          style={{
            textShadow: "0 1px 24px rgba(10,9,6,.9),0 1px 3px rgba(10,9,6,.8)",
          }}
        >
          Behind the world&apos;s biggest brands and names. The last real
          arbitrage in distribution.
        </motion.p>

        <h1
          aria-label="Glory"
          className="m-0 font-display text-[clamp(72px,20vw,340px)] font-normal leading-[0.84] tracking-[-0.02em] text-[color:var(--color-gold-soft)]"
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

        <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-t border-[color:var(--hair)] pt-5">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 0.5 }}
            className="m-0 max-w-[420px] text-[13px] text-[color:var(--color-ink-soft)] sm:text-sm"
          >
            A distribution engine where elite creators and the brands that need
            them meet, deal, and get paid — without the agency tax.
          </motion.p>
          <div className="hidden items-center gap-[10px] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-ink-mute)] sm:flex">
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
