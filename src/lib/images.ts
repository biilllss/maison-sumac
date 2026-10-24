/* ------------------------------------------------------------------ */
/*  Image registry — every photo used on the site lives here.          */
/*  Swap any URL (e.g. for self-hosted photos) without touching UI.    */
/*  All sources: Unsplash (configured in next.config.ts).              */
/* ------------------------------------------------------------------ */

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const IMAGES = {
  hero: {
    main: u("photo-1521017432531-fbd92d768814", 1600), // warm café interior (day)
    night: u("photo-1466978913421-dad2ebd01d17", 1600), // lantern-lit table (evening)
    secondary: u("photo-1511920170033-f8396924c348", 900), // flat white latte art
  },
  story: u("photo-1442512595331-e89e73853f31", 1400), // barista pouring espresso
  gallery: [
    u("photo-1482049016688-2d3e1b311543", 1000), // labneh/avocado-style toast
    u("photo-1528605248644-14dd04022da1", 1000), // terrace table with friends
    u("photo-1511920170033-f8396924c348", 1000), // flat white
    u("photo-1504754524776-8f4f37790ca0", 1000), // fresh baked breakfast spread
    u("photo-1546069901-ba9599a7e63c", 1000), // colorful mezze-style bowls
    u("photo-1565958011703-44f9829ba187", 1000), // dessert slice with berries
  ] as string[],
  /* Dish photos for the detail dialog — keyed by menu item id.
     Every URL verified 200 + visually checked against the dish. */
  menu: {
    "labneh-toast": u("photo-1482049016688-2d3e1b311543", 900),
    "akkawi-manakish": u("photo-1619535860434-ba1d8fa12536", 900), // herb flatbread board
    shakshuka: u("photo-1590301157890-4810ed352733", 900), // egg & tomato skillets
    pancakes: u("photo-1567620905732-2d1ec7ab7445", 900), // pancake stack + berries
    granola: u("photo-1488477181946-6428a0291777", 900), // yogurt & fruit jars
    turkish: u("photo-1517578239113-b03992dcdd25", 900), // turkish coffee cup
    "flat-white": u("photo-1509042239860-f550ce710b93", 900), // two flat whites
    "cardamom-latte": u("photo-1592663527359-cf6642f54cff", 900), // milk-coffee pour
    "sumac-lemonade": u("photo-1556881286-fc6915169721", 900), // mint limeade
    jallab: u("photo-1461023058943-07fcbe16d735", 900), // dark iced drink
    shawarma: u("photo-1626700051175-6818013e1d4f", 900), // wrap, cut open
    halloumi: u("photo-1550507992-eb63ffee0847", 900), // toasted sandwich
    falafel: u("photo-1601050690597-df0568f70950", 900), // golden fried + dip
    "sumac-chicken": u("photo-1532550907401-a500c9a57435", 900), // grilled chicken plate
    "freekeh-bowl": u("photo-1512621776951-a57141f2eefd", 900), // veggie grain bowl
    knefe: u("photo-1551024506-0bccd828d307", 900), // syrupy dessert
    baklava: u("photo-1571877227200-a0d98ea607e9", 900), // layered pastry slice
    "date-cookie": u("photo-1499636136210-6f4ee915583e", 900), // soft cookies
    sahlab: u("photo-1541658016709-82535e94bc69", 900), // cream-topped cup
    basbousa: u("photo-1606313564200-e75d5e30476c", 900), // dense cake square
  } as Record<string, string>,
  ogFallback: u("photo-1521017432531-fbd92d768814", 1200),
} as const;
