"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

function Counter({
  to,
  suffix,
  prefix = "",
}: {
  to: number;
  suffix: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <div
      ref={ref}
      className="font-display text-[clamp(48px,7vw,104px)] font-light leading-none text-[color:var(--color-gold-soft)]"
    >
      {prefix}
      {val}
      {suffix}
    </div>
  );
}

const items = [
  { to: 0, suffix: "", prefix: "$", label: "Agency tax paid" },
  { to: 72, suffix: "h", label: "Avg. deal to payout" },
  { to: 100, suffix: "%", label: "Rights kept by creators" },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="mx-auto max-w-[1400px] px-[clamp(20px,5vw,72px)] py-[clamp(96px,13vw,200px)]"
    >
      <Reveal className="text-xs font-medium uppercase tracking-[0.28em] text-[color:var(--color-gold)]">
        By the numbers
      </Reveal>
      <div className="mt-9 grid grid-cols-1 gap-px border border-[color:var(--hair-2)] bg-[color:var(--hair-2)] sm:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="bg-[color:var(--color-bg)] p-[clamp(30px,4vw,54px)]">
            <Counter to={it.to} suffix={it.suffix} prefix={it.prefix} />
            <div className="mt-3 text-[13px] uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)]">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
