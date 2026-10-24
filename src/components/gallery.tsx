"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Expand, UtensilsCrossed } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "./language-provider";
import { useDishDialog } from "./dish-dialog";
import { FadeImage } from "./fade-image";
import { IMAGES } from "@/lib/images";
import { MENU, type MenuItem } from "@/lib/menu-data";
import { GALLERY_DISHES } from "@/lib/gallery-dishes";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ------------------------------------------------------------------ */
/*  Gallery — 6-image editorial grid.                                  */
/*  On desktop, tiles 1 & 4 span two rows for a magazine rhythm.       */
/*  Tiles that picture an actual dish (toast, flat white, manakish,    */
/*  knefe) open the shared dish detail dialog; the rest open the       */
/*  classic lightbox with the large photo + caption.                   */
/* ------------------------------------------------------------------ */

const ITEM_BY_ID = new Map<string, MenuItem>(
  MENU.flatMap((cat) => cat.items.map((item) => [item.id, item]))
);

export function Gallery() {
  const { t } = useLanguage();
  const { openDish } = useDishDialog();
  // When the dish dialog's "See it in the gallery" jump lands here, the
  // target tile pulses a terracotta ring so the eye finds it instantly.
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const flashTimer = useRef<number | null>(null);

  useEffect(() => {
    const onFlash = (e: Event) => {
      const index = (e as CustomEvent<{ index?: number }>).detail?.index;
      if (typeof index !== "number") return;
      setFlashIndex(index);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      // two pulse cycles + settle, then clean the class off
      flashTimer.current = window.setTimeout(() => setFlashIndex(null), 2400);
    };
    window.addEventListener("ms-gallery-flash", onFlash);
    return () => {
      window.removeEventListener("ms-gallery-flash", onFlash);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    };
  }, []);

  return (
    <section
      id="gallery"
      className="scroll-mt-24 bg-cream-deep/60 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading overline={t.gallery.overline} title={t.gallery.title} />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {IMAGES.gallery.map((src, i) => {
            const isTall = i === 0 || i === 3;
            const dish = GALLERY_DISHES[i]
              ? ITEM_BY_ID.get(GALLERY_DISHES[i]!) ?? null
              : null;
            return (
              <Reveal
                key={src}
                delay={(i % 3) * 90}
                className={isTall ? "md:row-span-2" : undefined}
              >
                <figure
                  className={`img-zoom group relative h-full w-full overflow-hidden rounded-2xl shadow-[0_14px_30px_-20px_rgba(59,74,50,0.4),inset_0_0_0_1px_rgba(59,74,50,0.1)] ${
                    flashIndex === i ? "gallery-flash" : ""
                  }`}
                >
                  {dish ? (
                    /* ------- dish tile: opens the shared dish dialog ------- */
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`${t.gallery.captions[i]} — ${t.gallery.viewDish}`}
                      onClick={() =>
                        openDish(dish, {
                          siblings: MENU.find((c) =>
                            c.items.some((it) => it.id === dish.id)
                          )?.items,
                        })
                      }
                      className="block h-full w-full cursor-pointer text-start focus-visible:outline-none"
                    >
                      <TileImage
                        src={src}
                        i={i}
                        isTall={isTall}
                        t={t}
                        hoverIcon={
                          <span className="absolute top-3 end-3 inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3 py-2 text-xs font-semibold text-cream opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            <UtensilsCrossed
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            {t.gallery.viewDish.split(" — ")[0]}
                          </span>
                        }
                      />
                    </button>
                  ) : (
                    /* ------- plain tile: classic lightbox ------------------ */
                    <Dialog>
                      <DialogTrigger asChild>
                        {/* whole tile is the trigger — keyboard + touch friendly */}
                        <button
                          type="button"
                          aria-label={`${t.gallery.captions[i]} — ${t.footer.lightboxClose}`}
                          className="block h-full w-full cursor-pointer text-start focus-visible:outline-none"
                        >
                          <TileImage
                            src={src}
                            i={i}
                            isTall={isTall}
                            t={t}
                            hoverIcon={
                              <span className="absolute top-3 end-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-olive opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                <Expand
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </span>
                            }
                          />
                        </button>
                      </DialogTrigger>

                      {/* lightbox */}
                      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[min(92vw,52rem)] max-w-[52rem] gap-0 overflow-y-auto overflow-x-hidden rounded-2xl border-border bg-card p-3 sm:p-3">
                        <DialogTitle className="sr-only">
                          {t.gallery.captions[i]}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          {t.gallery.alts[i]}
                        </DialogDescription>
                        <div className="img-zoom relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                          <FadeImage
                            src={src}
                            alt={t.gallery.alts[i]}
                            sizes="(max-width: 768px) 92vw, 52rem"
                          />
                        </div>
                        {/* visible caption bar */}
                        <figcaption className="flex items-center justify-center gap-2.5 px-2 pb-1 pt-3 text-center">
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 rounded-full bg-terracotta"
                          />
                          <span className="font-display text-base text-olive sm:text-lg">
                            {t.gallery.captions[i]}
                          </span>
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 rounded-full bg-terracotta"
                          />
                        </figcaption>
                      </DialogContent>
                    </Dialog>
                  )}
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared tile visuals — image, hover affordance, caption chip +      */
/*  scrim. The hover chip differs: terracotta "View dish" pill for     */
/*  dish tiles, round expand icon for lightbox tiles.                  */
/* ------------------------------------------------------------------ */

function TileImage({
  src,
  i,
  isTall,
  t,
  hoverIcon,
}: {
  src: string;
  i: number;
  isTall: boolean;
  t: ReturnType<typeof useLanguage>["t"];
  hoverIcon: React.ReactNode;
}) {
  return (
    <div
      className={`relative w-full ${
        isTall
          ? "aspect-[3/4] md:h-full md:aspect-auto md:min-h-[420px]"
          : "aspect-square"
      }`}
    >
      <Image
        src={src}
        alt={t.gallery.alts[i]}
        fill
        sizes="(max-width: 768px) 48vw, 30vw"
        className="object-cover"
      />
      {hoverIcon}
      {/* floating caption chip — keeps the row-spanning tiles feeling
          curated on desktop (mobile keeps the scrim) */}
      {isTall ? (
        <span className="absolute top-3 start-3 hidden rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-olive shadow-sm md:block">
          {t.gallery.captions[i]}
        </span>
      ) : null}
      {/* caption scrim — replaced by the chip on desktop for tall tiles */}
      <figcaption
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-olive/80 via-olive/30 to-transparent p-3 pt-8 text-sm font-medium text-cream transition-opacity duration-300 ${
          isTall
            ? "md:hidden"
            : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
        }`}
      >
        {t.gallery.captions[i]}
      </figcaption>
    </div>
  );
}
