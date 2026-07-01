"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Showcase() {
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !bg.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: "#showcase",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showcase"
      className="relative flex h-[88vh] items-center justify-center overflow-hidden text-center"
    >
      <div ref={bg} className="absolute inset-[-12%_0]" style={{ willChange: "transform" }}>
        <img
          src="/art/scene-divine.jpg"
          alt="A gilded, draped figure lit by divine gold light."
          className="h-[124%] w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_50%,rgba(10,9,6,.15),rgba(10,9,6,.82))]" />
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-[2] m-0 max-w-[22ch] font-display text-[clamp(34px,6vw,96px)] font-light italic leading-none text-[color:var(--color-paper)]"
      >
        Reach is the
        <br /> new real estate.
      </motion.h2>
    </section>
  );
}
