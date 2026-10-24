"use client";

import { Leaf, Sprout, WheatOff } from "lucide-react";
import type { DietaryTag } from "@/lib/menu-data";
import { useLanguage } from "./language-provider";

/* ------------------------------------------------------------------ */
/*  Dietary tag icons + chips — shared between menu rows and the       */
/*  dish detail dialog so the two always look identical.               */
/* ------------------------------------------------------------------ */

export const TAG_ICONS: Record<DietaryTag, typeof Leaf> = {
  vegetarian: Leaf,
  vegan: Sprout,
  glutenFree: WheatOff,
};

export function TagChips({ tags }: { tags: DietaryTag[] }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const TagIcon = TAG_ICONS[tag];
        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-olive/15 bg-cream-deep/50 px-2 py-0.5 text-[10px] font-semibold text-olive-mist"
          >
            <TagIcon className="h-2.5 w-2.5" aria-hidden="true" />
            {t.menu.filters[tag]}
          </span>
        );
      })}
    </div>
  );
}
