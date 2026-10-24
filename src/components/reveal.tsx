"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  <Reveal> — fade-up on scroll.                                      */
/*  Adds the `is-visible` class directly via the IntersectionObserver  */
/*  (no React state → zero re-renders). Falls back to instantly        */
/*  visible when the user prefers reduced motion.                      */
/* ------------------------------------------------------------------ */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms — used to cascade grids/lists. */
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect(); // reveal once — no re-trigger flicker
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
