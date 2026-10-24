"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SumacLoader } from "./icons";

/* ------------------------------------------------------------------ */
/*  FadeImage — a next/image with the maison's loading moment: the     */
/*  sumac-berry loader draws itself while the photo streams in, then   */
/*  the photo fades over it. Optional bottom vignette. Shared by the   */
/*  dish dialog and the gallery lightbox so every photo wait feels     */
/*  branded, never like a gray box.                                    */
/*  `complete` check guards a cache hit that fires before the onLoad   */
/*  listener exists; onError clears the loader (a failed image shows   */
/*  its alt text, never an infinite spinner).                          */
/* ------------------------------------------------------------------ */

export function FadeImage({
  src,
  alt,
  sizes,
  className = "",
  vignette = false,
  loaderClassName = "h-12 w-12",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  vignette?: boolean;
  loaderClassName?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (imgRef.current?.complete) setLoaded(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {!loaded ? (
        <span className="absolute inset-0 grid place-items-center bg-cream-deep text-olive/60">
          <SumacLoader className={loaderClassName} />
        </span>
      ) : null}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
      {vignette ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-olive/30 to-transparent"
        />
      ) : null}
    </>
  );
}
